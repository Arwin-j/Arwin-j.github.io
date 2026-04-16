import test from 'node:test';
import assert from 'node:assert/strict';
import { detectSubscriptions, detectDuplicateExpenses } from '../src/services/detectionService.js';

test('detects recurring subscriptions and price increase', () => {
  const txs = [
    { id: '1', merchant: 'Netflix', amount: 10, date: '2026-01-01' },
    { id: '2', merchant: 'Netflix', amount: 10, date: '2026-02-01' },
    { id: '3', merchant: 'Netflix', amount: 12, date: '2026-03-01' }
  ];

  const result = detectSubscriptions(txs);
  assert.equal(result.length, 1);
  assert.equal(result[0].priceIncreaseFlag, true);
});

test('detects duplicate expenses', () => {
  const txs = [
    { id: '1', merchant: 'Uber', amount: 22.5, date: '2026-04-02T10:00:00.000Z' },
    { id: '2', merchant: 'Uber', amount: 22.5, date: '2026-04-02T12:00:00.000Z' },
    { id: '3', merchant: 'Uber', amount: 15, date: '2026-04-02T13:00:00.000Z' }
  ];

  const duplicates = detectDuplicateExpenses(txs);
  assert.equal(duplicates.length, 1);
  assert.equal(duplicates[0].id, '2');
});
