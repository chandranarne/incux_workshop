/**
 * ==============================================================================
 * INCUXAI WORKSHOP PLATFORM - GOOGLE APPS SCRIPT SYNC WEBHOOK
 * ==============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename your sheet (e.g. "IncuxAI Workshop Cohort Data 2026")
 * 3. In the top menu, click: Extensions -> Apps Script
 * 4. Delete any code in Code.gs and paste this ENTIRE file
 * 5. Click the blue "Deploy" button at top right -> Select "New deployment"
 * 6. Click the gear icon next to "Select type" -> Choose "Web app"
 * 7. Set the fields:
 *    - Description: IncuxAI Sync
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: Must be "Anyone" so the backend can push rows)
 * 8. Click "Deploy" -> Authorize access if prompted
 * 9. Copy the generated "Web app URL" (ends in /exec)
 * 10. Paste the Web app URL in your IncuxAI Admin Console under "Google Sheets Sync"!
 * ==============================================================================
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "IncuxAI Google Sheets Webhook is active and healthy!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing request body"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ping / Test connection
    if (payload.action === "test") {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Connected successfully to Google Sheet: " + ss.getName(),
        sheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Tab 1: Candidate_Registrations
    var regSheet = getOrCreateSheet(ss, "Candidate_Registrations", [
      "Registration ID",
      "Timestamp",
      "Candidate Name",
      "Email Address",
      "Phone / WhatsApp",
      "College / Institution",
      "Workshop Title",
      "Category",
      "Workshop Dates",
      "Location",
      "Delivery Mode",
      "Registration Status",
      "Payment Status",
      "Amount (₹)"
    ], "#0F172A", "#FACC15"); // Slate Dark background with Gold text

    // Tab 2: Payment_Completed
    var paySheet = getOrCreateSheet(ss, "Payment_Completed", [
      "Payment / Ref ID",
      "Timestamp",
      "Candidate Name",
      "Email Address",
      "Phone Number",
      "College / Institution",
      "Workshop Title",
      "Amount Paid (₹)",
      "Payment Status",
      "Payment Method",
      "Transaction / UTR No"
    ], "#064E3B", "#34D399"); // Emerald Dark background with Mint text

    // ACTION 1: FULL SYNC (Push entire database)
    if (payload.action === "sync_all") {
      clearSheetDataRows(regSheet);
      clearSheetDataRows(paySheet);

      var registrations = payload.registrations || [];
      var payments = payload.payments || [];

      // Bulk write registrations
      if (registrations.length > 0) {
        var regRows = registrations.map(function(r) {
          return [
            r.id || "",
            formatDate(r.registeredAt),
            r.candidateName || "",
            r.candidateEmail || "",
            r.candidatePhone || "",
            r.candidateInstitution || "",
            r.workshopTitle || "",
            r.workshopCategory || "",
            r.workshopDates || "",
            r.workshopLocation || "",
            r.workshopMode || "",
            r.status || "Confirmed",
            r.paymentStatus || (r.amount || r.price ? "Paid" : "Free"),
            r.amount || r.price || 0
          ];
        });
        regSheet.getRange(2, 1, regRows.length, regRows[0].length).setValues(regRows);
        styleDataRange(regSheet, 2, regRows.length, regRows[0].length);
      }

      // Bulk write payments
      if (payments.length > 0) {
        var payRows = payments.map(function(p) {
          return [
            p.paymentId || p.id || ("PAY-" + Date.now()),
            formatDate(p.timestamp || p.registeredAt),
            p.candidateName || "",
            p.candidateEmail || "",
            p.candidatePhone || "",
            p.candidateInstitution || "",
            p.workshopTitle || "",
            p.amount || p.price || 0,
            p.paymentStatus || "Completed",
            p.paymentMethod || "UPI / Direct",
            p.transactionId || "Confirmed"
          ];
        });
        paySheet.getRange(2, 1, payRows.length, payRows[0].length).setValues(payRows);
        styleDataRange(paySheet, 2, payRows.length, payRows[0].length);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Synced " + registrations.length + " candidates and " + payments.length + " payments!",
        syncedRegistrations: registrations.length,
        syncedPayments: payments.length,
        sheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION 2: SINGLE REGISTRATION PUSH
    if (payload.action === "sync_registration") {
      var r = payload.registration;
      var newRegRow = [
        r.id || "",
        formatDate(r.registeredAt),
        r.candidateName || "",
        r.candidateEmail || "",
        r.candidatePhone || "",
        r.candidateInstitution || "",
        r.workshopTitle || "",
        r.workshopCategory || "",
        r.workshopDates || "",
        r.workshopLocation || "",
        r.workshopMode || "",
        r.status || "Confirmed",
        r.paymentStatus || (r.amount || r.price ? "Paid" : "Free"),
        r.amount || r.price || 0
      ];
      regSheet.appendRow(newRegRow);
      var regLastRow = regSheet.getLastRow();
      styleDataRange(regSheet, regLastRow, 1, newRegRow.length);

      // If this registration has payment marked or positive amount, also record in Payment_Completed
      if (r.paymentStatus === "Paid" || (r.amount && r.amount > 0)) {
        var newPayRow = [
          "PAY-" + (r.id || Date.now()),
          formatDate(r.registeredAt),
          r.candidateName || "",
          r.candidateEmail || "",
          r.candidatePhone || "",
          r.candidateInstitution || "",
          r.workshopTitle || "",
          r.amount || r.price || 0,
          "Completed",
          r.paymentMethod || "UPI / Online",
          r.transactionId || "Confirmed"
        ];
        paySheet.appendRow(newPayRow);
        styleDataRange(paySheet, paySheet.getLastRow(), 1, newPayRow.length);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Registration added to Google Sheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION 3: RECORD PAYMENT
    if (payload.action === "sync_payment") {
      var p = payload.payment;
      var payRow = [
        p.paymentId || p.id || ("PAY-" + Date.now()),
        formatDate(p.timestamp || new Date().toISOString()),
        p.candidateName || "",
        p.candidateEmail || "",
        p.candidatePhone || "",
        p.candidateInstitution || "",
        p.workshopTitle || "",
        p.amount || 0,
        p.paymentStatus || "Completed",
        p.paymentMethod || "UPI / Online",
        p.transactionId || "Confirmed"
      ];
      paySheet.appendRow(payRow);
      styleDataRange(paySheet, paySheet.getLastRow(), 1, payRow.length);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Payment recorded in Google Sheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Unknown action specified"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Setup sheet tab with stylized headers
function getOrCreateSheet(ss, sheetName, headers, headerBg, headerText) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // If header row is not present
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerBg || "#0F172A");
    headerRange.setFontColor(headerText || "#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 40);
    sheet.setFrozenRows(1);

    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  return sheet;
}

// Helper: Clear rows 2..end (keeps header intact)
function clearSheetDataRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

// Helper: Format ISO date string into Indian Standard Time (IST)
function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  try {
    var d = new Date(dateStr);
    return Utilities.formatDate(d, "Asia/Kolkata", "dd-MMM-yyyy hh:mm a");
  } catch (e) {
    return dateStr;
  }
}

// Helper: Style data cells
function styleDataRange(sheet, startRow, numRows, numCols) {
  try {
    var range = sheet.getRange(startRow, 1, numRows, numCols);
    range.setFontFamily("Arial");
    range.setFontSize(9);
    range.setVerticalAlignment("middle");
  } catch (e) {}
}
