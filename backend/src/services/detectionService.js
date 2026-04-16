const dayDiff = (a, b) => Math.round((new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24));

export function detectSubscriptions(transactions) {
  const byMerchant = transactions.reduce((acc, tx) => {
    if (!acc[tx.merchant]) acc[tx.merchant] = [];
    acc[tx.merchant].push(tx);
    return acc;
  }, {});

  return Object.entries(byMerchant)
    .map(([merchant, rows]) => {
      if (rows.length < 2) return null;
      const sorted = rows.sort((a, b) => new Date(a.date) - new Date(b.date));
      const intervals = sorted.slice(1).map((tx, i) => dayDiff(tx.date, sorted[i].date));
      const avgInterval = intervals.reduce((sum, d) => sum + d, 0) / intervals.length;
      const avgAmount = sorted.reduce((sum, tx) => sum + Number(tx.amount), 0) / sorted.length;
      const latest = sorted[sorted.length - 1];
      const prev = sorted[sorted.length - 2];
      const priceIncreaseFlag = Number(latest.amount) > Number(prev.amount) * 1.15;

      if (avgInterval < 20 || avgInterval > 40) return null;

      return {
        merchant,
        averageAmount: Number(avgAmount.toFixed(2)),
        billingCycleDays: Math.round(avgInterval),
        lastChargedAt: latest.date,
        potentialMonthly: Number(avgAmount.toFixed(2)),
        priceIncreaseFlag,
        unused: dayDiff(new Date(), latest.date) > 30
      };
    })
    .filter(Boolean);
}

export function detectDuplicateExpenses(transactions) {
  const map = new Map();
  const duplicates = [];

  for (const tx of transactions) {
    const key = `${tx.merchant}-${tx.amount}-${new Date(tx.date).toISOString().slice(0, 10)}`;
    if (map.has(key)) duplicates.push(tx);
    else map.set(key, tx.id);
  }

  return duplicates;
}

export function generateInsights({ transactions, subscriptions }) {
  const monthlySpend = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const savingsCandidates = subscriptions.filter((s) => s.status !== 'KEEP');
  const monthlySavings = savingsCandidates.reduce((sum, s) => sum + Number(s.potentialMonthly), 0);

  const insights = [
    {
      type: 'SAVINGS',
      title: `You can save $${monthlySavings.toFixed(2)}/month`,
      detail: `${savingsCandidates.length} subscriptions can be optimized.`,
      impact: monthlySavings
    }
  ];

  subscriptions.forEach((sub) => {
    if (sub.priceIncreaseFlag) {
      insights.push({
        type: 'ALERT',
        title: `${sub.merchant} has increased price`,
        detail: 'Consider switching to a cheaper alternative.',
        impact: Number(sub.potentialMonthly)
      });
    }

    if (sub.status === 'UNUSED') {
      insights.push({
        type: 'ACTION',
        title: `Cancel unused ${sub.merchant}`,
        detail: 'No recent activity in the last 30+ days.',
        impact: Number(sub.potentialMonthly)
      });
    }
  });

  if (monthlySpend > 2000) {
    insights.push({
      type: 'ALERT',
      title: 'High monthly spending detected',
      detail: 'Review discretionary categories for reduction opportunities.',
      impact: Math.round(monthlySpend * 0.05)
    });
  }

  return insights;
}
