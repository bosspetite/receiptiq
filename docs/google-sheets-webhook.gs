function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var eventName = body.event || "";
    var payload = body.payload || {};
    var expense = payload.expense || {};
    var expenseId = payload.expenseId || expense.id || "";
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expenses") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Expenses");

    var headers = ["Expense ID", "Vendor", "Date", "Category", "Tax Category", "Amount", "Currency", "Receipt URL", "Items", "Created At"];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    if (eventName === "expense.created" && expenseId) {
      var row = [
        String(expense.id || ""),
        String(expense.vendor || ""),
        String(expense.date || ""),
        String(expense.category || ""),
        String(expense.tax_category || ""),
        Number(expense.amount || 0),
        String(expense.currency || "USD"),
        String(expense.receipt_url || ""),
        expense.items && expense.items.join ? expense.items.join(", ") : "",
        String(expense.created_at || "")
      ];

      var lastRow = sheet.getLastRow();
      var updated = false;
      if (lastRow > 1) {
        var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === expenseId) {
            sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
            updated = true;
            break;
          }
        }
      }
      if (!updated) sheet.appendRow(row);
    }

    if (eventName === "expense.deleted" && expenseId) {
      var lastRowToDelete = sheet.getLastRow();
      if (lastRowToDelete > 1) {
        var deleteIds = sheet.getRange(2, 1, lastRowToDelete - 1, 1).getValues();
        for (var j = 0; j < deleteIds.length; j++) {
          if (String(deleteIds[j][0]) === expenseId) {
            sheet.deleteRow(j + 2);
            break;
          }
        }
      }
    }

    if (eventName === "expense.ping") {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, event: eventName, expenseId: expenseId }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var finalLastRow = sheet.getLastRow();
    if (finalLastRow > 1) {
      var firstCol = sheet.getRange(2, 1, finalLastRow - 1, 1).getValues();
      for (var k = firstCol.length - 1; k >= 0; k--) {
        if (String(firstCol[k][0]).trim() === "TOTAL") {
          sheet.deleteRow(k + 2);
          break;
        }
      }
    }

    var refreshedLastRow = sheet.getLastRow();
    var total = 0;
    if (refreshedLastRow > 1) {
      var amounts = sheet.getRange(2, 6, refreshedLastRow - 1, 1).getValues();
      for (var m = 0; m < amounts.length; m++) total += Number(amounts[m][0]) || 0;
    }

    sheet.appendRow(["TOTAL", "", "", "", "", Number(total.toFixed(2)), "", "", "", ""]);
    var totalRow = sheet.getLastRow();
    sheet.getRange(totalRow, 1, 1, 10).setFontWeight("bold").setBackground("#ecfeff");

    return ContentService.createTextOutput(JSON.stringify({ ok: true, event: eventName, expenseId: expenseId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: error.message || "Webhook failed" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
