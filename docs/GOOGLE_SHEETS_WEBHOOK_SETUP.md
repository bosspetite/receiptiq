# Google Sheets Webhook Setup

This webhook lets ReceiptIQ automatically keep a Google Sheet in sync when an expense is:

- created
- deleted
- tested from the dashboard

## 1. Create the Sheet

1. Open Google Sheets.
2. Create a new spreadsheet.
3. Name it something like `ReceiptIQ Expenses`.

## 2. Add the Apps Script

1. In the sheet, click `Extensions` -> `Apps Script`.
2. Replace the default script with the contents of:
   [google-sheets-webhook.gs](/C:/Users/LENOVO/receiptiq/docs/google-sheets-webhook.gs)
3. Save the project.

## 3. Deploy the Web App

1. Click `Deploy` -> `New deployment`.
2. Choose type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Click `Deploy`.
6. Copy the web app URL.

That URL is your `GOOGLE_SHEETS_WEBHOOK_URL`.

## 4. Add Netlify Environment Variables

In your Netlify backend site, set:

- `GOOGLE_SHEET_URL`
  - the normal Google Sheet browser URL
- `GOOGLE_SHEETS_WEBHOOK_URL`
  - the Apps Script web app URL from step 3

## 5. Redeploy Netlify

After setting the variables:

1. Open Netlify.
2. Go to `Deploys`.
3. Click `Trigger deploy`.
4. Choose `Clear cache and deploy site`.

## 6. What ReceiptIQ Sends

ReceiptIQ POSTs JSON like this:

```json
{
  "source": "ReceiptIQ",
  "event": "expense.created",
  "payload": {
    "userId": "user-id",
    "expense": {
      "id": "expense-id",
      "vendor": "Vendor name",
      "date": "2026-04-20",
      "category": "Transport",
      "tax_category": "Travel",
      "amount": 3000,
      "currency": "NGN",
      "receipt_url": "",
      "items": [],
      "created_at": "2026-04-20T10:00:00.000Z"
    }
  }
}
```

For deletes, the event is `expense.deleted`.
For dashboard tests, the event is `expense.ping`.

## 7. What the Script Does

- creates an `Expenses` sheet if missing
- writes the header row
- inserts or updates rows by `Expense ID`
- removes rows on delete
- keeps a `TOTAL` row at the bottom

## 8. How to Test

1. Save a new expense in ReceiptIQ.
2. Wait a few seconds.
3. Refresh the sheet.

You should see:

- a new row for the expense
- a `TOTAL` row at the bottom

Then delete an expense in ReceiptIQ and confirm the row disappears and the total updates.

You can also:

1. Open the ReceiptIQ dashboard.
2. Click `Test sheet sync`.
3. Look for a success toast.
