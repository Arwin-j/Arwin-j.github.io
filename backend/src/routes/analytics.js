import express from 'express';
import { startOfMonth } from '../utils/time.js';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { detectSubscriptions, detectDuplicateExpenses, generateInsights } from '../services/detectionService.js';

const router = express.Router();
router.use(requireAuth);

router.post('/run-detection', async (req, res) => {
  const transactions = await prisma.transaction.findMany({ where: { userId: req.user.id } });
  const subscriptions = detectSubscriptions(transactions);

  for (const sub of subscriptions) {
    await prisma.subscription.upsert({
      where: { userId_merchant: { userId: req.user.id, merchant: sub.merchant } },
      create: {
        userId: req.user.id,
        merchant: sub.merchant,
        averageAmount: sub.averageAmount,
        billingCycleDays: sub.billingCycleDays,
        lastChargedAt: new Date(sub.lastChargedAt),
        potentialMonthly: sub.potentialMonthly,
        status: sub.unused ? 'UNUSED' : 'ACTIVE',
        priceIncreaseFlag: sub.priceIncreaseFlag
      },
      update: {
        averageAmount: sub.averageAmount,
        billingCycleDays: sub.billingCycleDays,
        lastChargedAt: new Date(sub.lastChargedAt),
        potentialMonthly: sub.potentialMonthly,
        status: sub.unused ? 'UNUSED' : 'ACTIVE',
        priceIncreaseFlag: sub.priceIncreaseFlag
      }
    });
  }

  const duplicateExpenses = detectDuplicateExpenses(transactions);
  res.json({ subscriptionsDetected: subscriptions.length, duplicatesFound: duplicateExpenses.length });
});

router.get('/dashboard', async (req, res) => {
  const from = startOfMonth(new Date());

  const [transactions, subscriptions] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: req.user.id, date: { gte: from } } }),
    prisma.subscription.findMany({ where: { userId: req.user.id } })
  ]);

  const categorized = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(tx.amount);
    return acc;
  }, {});

  const totalSpending = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const potentialSavings = subscriptions
    .filter((s) => s.status !== 'KEEP')
    .reduce((sum, s) => sum + Number(s.potentialMonthly), 0);

  res.json({
    totalSpending,
    categorized,
    potentialSavings,
    subscriptions
  });
});

router.get('/subscriptions', async (req, res) => {
  const subs = await prisma.subscription.findMany({ where: { userId: req.user.id }, orderBy: { updatedAt: 'desc' } });
  res.json(subs);
});

router.patch('/subscriptions/:id', async (req, res) => {
  const { status } = req.body;
  const existing = await prisma.subscription.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!existing) return res.status(404).json({ error: 'Subscription not found' });

  const updated = await prisma.subscription.update({ where: { id: req.params.id }, data: { status } });
  res.json(updated);
});

router.post('/insights/generate', async (req, res) => {
  const [transactions, subscriptions] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: req.user.id } }),
    prisma.subscription.findMany({ where: { userId: req.user.id } })
  ]);

  const generated = generateInsights({ transactions, subscriptions });
  const now = new Date();

  await prisma.insight.deleteMany({ where: { userId: req.user.id } });
  await prisma.insight.createMany({
    data: generated.map((i) => ({
      userId: req.user.id,
      type: i.type,
      title: i.title,
      detail: i.detail,
      impact: i.impact,
      weekOf: now
    }))
  });

  res.json({ count: generated.length, insights: generated });
});

router.get('/insights', async (req, res) => {
  const insights = await prisma.insight.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
  res.json(insights);
});

router.get('/weekly-report', async (req, res) => {
  const insights = await prisma.insight.findMany({ where: { userId: req.user.id }, orderBy: { impact: 'desc' }, take: 5 });
  const totalImpact = insights.reduce((sum, i) => sum + Number(i.impact), 0);

  res.json({
    period: 'weekly',
    totalPotentialSavings: totalImpact,
    highlights: insights.map((i) => i.title)
  });
});

export default router;
