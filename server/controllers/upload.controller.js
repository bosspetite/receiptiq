const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.5-flash';

const RECEIPT_SCHEMA = {
  type: 'object',
  properties: {
    vendor: {
      type: 'string',
      description: 'Store or merchant name.',
    },
    date: {
      type: 'string',
      description:
        'Receipt date in ISO 8601 format (YYYY-MM-DD) when visible, otherwise an empty string.',
    },
    amount: {
      type: 'number',
      description: 'Total amount paid as a number only.',
    },
    category: {
      type: 'string',
      description:
        'Best-fit category such as Groceries, Dining, Transport, Office, Utilities, Health, Shopping, or General.',
    },
    currency: {
      type: 'string',
      description:
        'Three-letter currency code like USD, NGN, GBP, or EUR. Default to USD only if unknown.',
    },
    items: {
      type: 'array',
      description: 'Visible line-item descriptions from the receipt.',
      items: {
        type: 'string',
      },
    },
    receipt_url: {
      type: 'string',
      description:
        'Leave blank because the server does not upload the image during extraction.',
    },
  },
  required: ['vendor', 'date', 'amount', 'category', 'currency', 'items'],
};

const EXTRACTION_PROMPT = `Extract the receipt into structured data.

Rules:
- Read the uploaded receipt image carefully.
- Return exactly one JSON object that matches the provided schema.
- Use the final amount paid for "amount".
- Use YYYY-MM-DD for the date when you can confidently infer it, otherwise return an empty string.
- Use a short category label.
- Return item names only in the items array, not prices.
- If a field is unclear, make the safest reasonable guess except for date which should be empty if uncertain.
- Do not wrap the JSON in markdown.`;

function parseAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

async function extractWithGemini({ base64, mimeType }) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error('Gemini is not configured on the server');
    err.statusCode = 503;
    throw err;
  }

  const model = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RECEIPT_SCHEMA,
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      'Gemini request failed while extracting the receipt';
    const err = new Error(message);
    err.statusCode = response.status || 502;
    throw err;
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || '')
    .join('')
    .trim();

  if (!text) {
    const refusal = payload?.promptFeedback?.blockReason;
    const err = new Error(
      refusal
        ? `Gemini did not return extraction data (${refusal})`
        : 'Gemini returned an empty extraction response',
    );
    err.statusCode = 502;
    throw err;
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const err = new Error('Gemini returned invalid JSON');
    err.statusCode = 502;
    throw err;
  }

  return {
    vendor: parsed.vendor ?? '',
    date: parsed.date ?? '',
    amount: parseAmount(parsed.amount),
    category: parsed.category ?? 'General',
    currency: parsed.currency ?? 'USD',
    items: Array.isArray(parsed.items) ? parsed.items.filter(Boolean) : [],
    receipt_url: parsed.receipt_url ?? '',
  };
}

export async function extractReceipt(req, res) {
  const file = req.file;
  if (!file || !file.buffer) {
    const err = new Error('Missing receipt file (field name: receipt)');
    err.statusCode = 400;
    throw err;
  }

  if (!file.mimetype.startsWith('image/')) {
    const err = new Error('Only image uploads are supported for vision extraction (e.g. PNG, JPEG).');
    err.statusCode = 415;
    throw err;
  }

  const base64 = file.buffer.toString('base64');
  const extracted = await extractWithGemini({
    base64,
    mimeType: file.mimetype,
  });

  res.json(extracted);
}
