import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'csv-parse/sync';

test('parses bank csv rows', () => {
  const csv = `date,merchant,amount,category\n2026-04-01,Spotify,11.99,Entertainment`;
  const rows = parse(csv, { columns: true, skip_empty_lines: true });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].merchant, 'Spotify');
  assert.equal(rows[0].amount, '11.99');
});
