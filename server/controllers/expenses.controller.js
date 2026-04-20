import { supabaseForRequest } from '../middleware/auth.js';

const EXPENSE_COLUMNS = [
  'id',
  'vendor',
  'date',
  'amount',
  'category',
  'tax_category',
  'items',
  'receipt_url',
  'currency',
  'created_at',
];

const OPTIONAL_COLUMNS = ['items', 'receipt_url', 'currency', 'tax_category'];

function inferTaxCategory(category = '') {
  const normalized = String(category).trim().toLowerCase();
  if (!normalized) return 'General';

  if (
    normalized.includes('transport') ||
    normalized.includes('travel') ||
    normalized.includes('fuel') ||
    normalized.includes('taxi')
  ) {
    return 'Travel';
  }
  if (
    normalized.includes('meal') ||
    normalized.includes('dining') ||
    normalized.includes('restaurant') ||
    normalized.includes('food')
  ) {
    return 'Meals';
  }
  if (
    normalized.includes('office') ||
    normalized.includes('stationery') ||
    normalized.includes('supply')
  ) {
    return 'Office Supplies';
  }
  if (
    normalized.includes('software') ||
    normalized.includes('utility') ||
    normalized.includes('subscription') ||
    normalized.includes('internet')
  ) {
    return 'Software & Utilities';
  }
  if (
    normalized.includes('health') ||
    normalized.includes('medical')
  ) {
    return 'Health';
  }
  return 'General';
}

function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function toAmountNumber(value) {
  return typeof value === 'number' ? value : Number.parseFloat(value, 10);
}

function duplicateSignature(row) {
  const vendor = String(row?.vendor || '').trim().toLowerCase();
  const date = normalizeDate(row?.date) || '';
  const amount = Number(row?.amount || 0).toFixed(2);
  if (!vendor || !date || !amount) return null;
  return `${vendor}::${date}::${amount}`;
}

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
    date: normalizeDate(row?.date),
    amount: Number(row?.amount) || 0,
    category: row?.category || 'General',
    tax_category: row?.tax_category || inferTaxCategory(row?.category),
    items: Array.isArray(row?.items) ? row.items : [],
    receipt_url: row?.receipt_url || null,
    currency: row?.currency || 'USD',
  };
}

function buildSummaryPayload(expenses) {
  const totalSpend = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const byCategoryMap = new Map();
  const byTaxCategoryMap = new Map();
  const monthlyTrendMap = new Map();

  for (const e of expenses) {
    const cat = e.category || 'Uncategorized';
    const taxCategory = e.tax_category || inferTaxCategory(cat);
    const monthKey = normalizeDate(e.date)?.slice(0, 7);
    byCategoryMap.set(cat, (byCategoryMap.get(cat) || 0) + (Number(e.amount) || 0));
    byTaxCategoryMap.set(
      taxCategory,
      (byTaxCategoryMap.get(taxCategory) || 0) + (Number(e.amount) || 0),
    );
    if (monthKey) {
      monthlyTrendMap.set(
        monthKey,
        (monthlyTrendMap.get(monthKey) || 0) + (Number(e.amount) || 0),
      );
    }
  }

  return {
    totalSpend: Math.round(totalSpend * 100) / 100,
    expenseCount: expenses.length,
    byCategory: Array.from(byCategoryMap.entries()).map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    })),
    byTaxCategory: Array.from(byTaxCategoryMap.entries()).map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    })),
    monthlyTrend: Array.from(monthlyTrendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, total]) => ({
        month,
        total: Math.round(total * 100) / 100,
      })),
  };
}

async function syncGoogleSheet(event, payload) {
  const webhookUrl = (process.env.GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
  if (!webhookUrl) {
    return { attempted: false, success: false };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        source: 'ReceiptIQ',
        event,
        payload,
      }),
    });

    return {
      attempted: true,
      success: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      attempted: true,
      success: false,
      error: error?.message || 'Google Sheets sync failed',
    };
  }
}

function annotatePotentialDuplicates(rows) {
  const counts = new Map();
  for (const row of rows) {
    const signature = duplicateSignature(row);
    if (!signature) continue;
    counts.set(signature, (counts.get(signature) || 0) + 1);
  }

  return rows.map((row) => {
    const signature = duplicateSignature(row);
    return {
      ...row,
      potentialDuplicate: signature ? (counts.get(signature) || 0) > 1 : false,
    };
  });
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
      return { data: annotatePotentialDuplicates((data || []).map(normalizeExpenseRow)) };
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
    if (!missing || !OPTIONAL_COLUMNS.includes(missing) || !(missing in payload)) break;
    delete payload[missing];
    removedOptionalColumns = [...removedOptionalColumns, missing];
  }

  throw lastError;
}

async function findPotentialDuplicate(supabase, userId, row) {
  if (!row.vendor || !row.date || Number.isNaN(row.amount)) return null;

  const { data, error } = await supabase
    .from('expenses')
    .select('id, vendor, date, amount, currency')
    .eq('user_id', userId)
    .eq('date', row.date)
    .eq('amount', row.amount);

  if (error) return null;

  const match = (data || []).find((expense) => {
    return String(expense.vendor || '').trim().toLowerCase() === row.vendor.toLowerCase();
  });

  return match ? normalizeExpenseRow(match) : null;
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
  const { vendor, date, amount, category, tax_category, items, receipt_url, currency } = req.body;
  if (!vendor || amount === undefined || amount === null) {
    const err = new Error('vendor and amount are required');
    err.statusCode = 400;
    throw err;
  }

  const supabase = supabaseForRequest(req);
  const row = {
    user_id: req.user.id,
    vendor: String(vendor).trim(),
    date: normalizeDate(date),
    amount: toAmountNumber(amount),
    category: category || 'General',
    tax_category: tax_category || inferTaxCategory(category),
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
    const duplicate = await findPotentialDuplicate(supabase, req.user.id, row);
    const { data, removedOptionalColumns } = await insertExpenseWithFallback(supabase, row);
    const warnings = [];
    if (removedOptionalColumns.length > 0) {
      warnings.push(
        `Saved without ${removedOptionalColumns.join(', ')} because your Supabase expenses table is missing those columns. Run supabase/schema.sql to enable the full experience.`,
      );
    }
    if (duplicate) {
      warnings.push('Potential duplicate detected: vendor, date, and amount match an existing record.');
    }
    const syncResult = await syncGoogleSheet('expense.created', {
      userId: req.user.id,
      expense: data,
    });
    if (syncResult.attempted && !syncResult.success) {
      warnings.push('Saved the expense, but automatic Google Sheet sync could not complete.');
    }

    res.status(201).json({
      expense: { ...data, potentialDuplicate: Boolean(duplicate) },
      warnings,
      duplicateOf: duplicate ? { id: duplicate.id, vendor: duplicate.vendor } : null,
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }
}

export async function getSummary(req, res) {
  const supabase = supabaseForRequest(req);
  const { data } = await selectExpensesWithFallback(supabase, [
    'amount',
    'category',
    'tax_category',
    'date',
  ]);

  const expenses = data || [];
  const summary = buildSummaryPayload(expenses);

  res.json({
    ...summary,
    googleSheetUrl: (process.env.GOOGLE_SHEET_URL || '').trim() || null,
    googleSheetSyncEnabled: Boolean((process.env.GOOGLE_SHEETS_WEBHOOK_URL || '').trim()),
  });
}

export async function deleteExpense(req, res) {
  const supabase = supabaseForRequest(req);
  const { id } = req.params;

  if (!id) {
    const err = new Error('Expense id is required');
    err.statusCode = 400;
    throw err;
  }

  const { data: existingExpense } = await supabase
    .from('expenses')
    .select(EXPENSE_COLUMNS.join(', '))
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }

  await syncGoogleSheet('expense.deleted', {
    userId: req.user.id,
    expenseId: id,
    expense: existingExpense ? normalizeExpenseRow(existingExpense) : null,
  });

  res.status(204).send();
}
