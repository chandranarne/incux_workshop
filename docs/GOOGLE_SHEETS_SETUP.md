# IncuxAI Workshop Platform: Google Sheets Live Sync & Payment Tracking Setup

This platform supports **real-time automatic sync** directly to your **Google Sheet** as well as **one-click Excel (.xlsx / .csv) downloads** inside the Admin Portal.

---

## 🚀 Key Capabilities Added

1. **Two Dedicated Tabs in your Google Sheet**:
   - 📋 **`Candidate_Registrations`**: Complete roster with Candidate Name, Email, Phone, College/Institution, Workshop Title, Dates, Delivery Mode, Registration Status, Payment Status, and Amount.
   - 💳 **`Payment_Completed`**: Clean financial log tracking Payment ID, Timestamp, Candidate, Amount Paid (₹), Payment Status (Completed), Payment Method, and Transaction / UTR reference.
2. **Real-Time Automated Background Sync**:
   - Whenever any student registers on the website, the row is automatically appended to your live Google Sheet in real time.
3. **Admin Portal Controls**:
   - **⚡ "Sync to Google Sheet" Button**: 1-click push of your entire database (all past and new registrations/payments) to your Google Sheet.
   - **📊 "Open Google Sheet" Button**: 1-click direct link to open the live sheet in Google Drive.
   - **📥 Download Excel / CSV Buttons**: Immediate download of both `Candidate Registrations` and `Completed Payments` for offline reporting.
   - **Toggle Payment Status**: Quickly toggle candidate payment between `Paid` and `Pending`.

---

## 🛠️ Step-by-Step Setup Guide (Takes Under 2 Minutes)

### Step 1: Create a New Google Sheet
1. In your browser, open [https://sheets.new](https://sheets.new).
2. Rename the spreadsheet at top left (e.g., `IncuxAI Workshop Cohort Data 2026`).

---

### Step 2: Add the Google Apps Script
1. In the Google Sheets top menu, click **Extensions** → **Apps Script**.
2. Delete any default code inside the code editor (`Code.gs`).
3. Open the file `scripts/google-apps-script.js` from this project repository and copy its entire content.
4. Paste it into the Apps Script editor.
5. Click the floppy disk **Save** icon (or press `Ctrl+S`).

---

### Step 3: Deploy as a Web App
1. In the top right corner of the Apps Script window, click the blue **Deploy** button and select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Configure the following fields:
   * **Description**: `IncuxAI Sync`
   * **Execute as**: `Me (your email)`
   * **Who has access**: `Anyone` *(⚠️ CRITICAL: Must be "Anyone" so the backend can securely push rows)*
4. Click **Deploy**.
5. If Google asks to authorize access, click **Authorize Access**, choose your Google account, click **Advanced**, and then click **Go to IncuxAI Sync (unsafe)** → **Allow**.
6. Google will display your **Web app URL** (ending in `/exec`).
   * *Example: `https://script.google.com/macros/s/AKfycb.../exec`*
7. Click **Copy** to copy this URL.

---

### Step 4: Paste into the IncuxAI Admin Console
1. Open your IncuxAI Admin Console at `/admin`.
2. Enter your admin passphrase and unlock the console.
3. Click on the **Candidate Registrations** tab.
4. Click the ⚙️ (Settings) icon next to the "Sync to Google Sheet" button.
5. In the modal:
   * Paste your **Google Apps Script Web App URL**.
   * (Optional) Paste the **Google Sheet URL** from your browser bar.
6. Click **Save & Test Connection**.
7. Click **⚡ Sync to Google Sheet** to instantly push all current candidate and payment data into your new spreadsheet!

---

## 🔒 Security & Privacy
* The Webhook operates entirely over HTTPS.
* No Google credentials or passwords are stored in the database.
* The Apps Script only interacts with the specific spreadsheet it was created in.
