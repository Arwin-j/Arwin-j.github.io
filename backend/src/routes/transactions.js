import express from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { date, merchant, amount, category } = req.body;
  const tx = await prisma.transaction.create({
    data: {
      userId: req.user.id,
      date: new Date(date),
      merchant,
      amount,
      category,
      source: 'manual'
    }
  });

  res.status(201).json(tx);
});

router.post('/upload-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file required' });

  const rows = parse(req.file.buffer.toString('utf-8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const data = rows.map((row) => ({
    userId: req.user.id,
    date: new Date(row.date),
    merchant: row.merchant,
    amount: row.amount,
    category: row.category || 'Other',
    source: 'csv'
  }));

  await prisma.transaction.createMany({ data });
  res.json({ imported: data.length });
});

router.get('/', async (req, res) => {
  const txs = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' }
  });
  res.json(txs);
});

export default router;
