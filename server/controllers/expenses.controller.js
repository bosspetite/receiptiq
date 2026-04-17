import { supabaseForRequest } from '../middleware/auth.js';

const EXPENSE_COLUMNS = [
  'id',
  'vendor',
  'date',
  'amount',
  'category',
  'items',
  'receipt_url',
  'currency',
  'created_at',
];

function isMissingColumnError(error) {
  const message = error?.message || '';
  return /column .* does not exist/i.test(message) || /Could not find the '.*' column/i.test(message);
}

function getMissingColumnName(error) {
  const message = error?.message || '';
  const postgresMatch = message.match(/column .*\.([a-zA-Z0-9_]+) does not exist/i);
  if (postgresMatch?.[1]) return postgresMatch[1];
  const postgrestMatch = message.match(/Could not find the '([a-zA-Z0-9_]+)' column/i);
  return postgrestMatch?.[1] || null;
}

function normalizeExpenseRow(row) {
  return {
    ...row,
    items: Array.isArray(row?.items) ? row.items : [],
    receipt_url: row?.receipt_url || null,
    currency: row?.currency || 'USD',
  };
}

async function selectExpensesWithFallback(supabase, requestedColumns) {
  let columns = [...requestedColumns];
  let lastError = null;

  while (columns.length > 0) {
    const { data, error } = await supabase
      .from('expenses')
      .select(columns.join(', '))
      .order('date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (!error) {
      return { data: (data || []).map(normalizeExpenseRow) };
    }

    lastError = error;
    if (!isMissingColumnError(error)) break;

    const missing = getMissingColumnName(error);
    if (!missing || !columns.includes(missing)) break;
    columns = columns.filter((column) => column !== missing);
  }

  throw lastError;
}

async function insertExpenseWithFallback(supabase, row) {
  const optionalColumns = ['items', 'receipt_url', 'currency'];
  const payload = { ...row };
  let removedOptionalColumns = [];
  let lastError = null;

  while (true) {
    const { data, error } = await supabase.from('expenses').insert(payload).select().single();
    if (!error) {
      return {
        data: normalizeExpenseRow(data),
        removedOptionalColumns,
      };
    }

    lastError = error;
    if (!isMissingColumnError(error)) break;

    const missing = getMissingColumnName(error);
    if (!missing || !optionalColumns.includes(missing) || !(missing in payload)) break;
    delete payload[missing];
    removedOptionalColumns = [...removedOptionalColumns, missing];
  }

  throw lastError;
}

export async function listExpenses(req, res) {
  const supabase = supabaseForRequest(req);
  try {
    const { data } = await selectExpensesWithFallback(supabase, EXPENSE_COLUMNS);
    res.json({ expenses: data || [] });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }
}

export async function createExpense(req, res) {
  const { vendor, date, amount, category, items, receipt_url, currency } = req.body;
  if (!vendor || amount === undefined || amount === null) {
    const err = new Error('vendor and amount are required');
    err.statusCode = 400;
    throw err;
  }

  const supabase = supabaseForRequest(req);
  const row = {
    user_id: req.user.id,
    vendor: String(vendor).trim(),
    date: date || null,
    amount: typeof amount === 'number' ? amount : parseFloat(amount, 10),
    category: category || 'General',
    items: Array.isArray(items) ? items : [],
    receipt_url: receipt_url || null,
    currency: currency || 'USD',
  };

  if (Number.isNaN(row.amount)) {
    const err = new Error('amount must be a number');
    err.statusCode = 400;
    throw err;
  }

  try {
    const { data, removedOptionalColumns } = await insertExpenseWithFallback(supabase, row);
    res.status(201).json({
      expense: data,
      warnings:
        removedOptionalColumns.length > 0
          ? [
              `Saved without ${removedOptionalColumns.join(', ')} because your Supabase expenses table is missing those columns. Run supabase/schema.sql to enable the full experience.`,
            ]
          : [],
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }
}

export async function getSummary(req, res) {
  const supabase = supabaseForRequest(req);
  const { data, error } = await supabase
    .from('expenses')
    .select('amount, category');

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  const expenses = data || [];
  const totalSpend = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const byCategoryMap = new Map();
  for (const e of expenses) {
    const cat = e.category || 'Uncategorized';
    byCategoryMap.set(cat, (byCategoryMap.get(cat) || 0) + (Number(e.amount) || 0));
  }
  const byCategory = Array.from(byCategoryMap.entries()).map(([category, total]) => ({
    category,
    total: Math.round(total * 100) / 100,
  }));

  res.json({
    totalSpend: Math.round(totalSpend * 100) / 100,
    expenseCount: expenses.length,
    byCategory,
  });
}
