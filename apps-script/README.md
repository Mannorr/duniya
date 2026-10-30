# Enquiry form → Google Sheet

The Order page form sends every enquiry to a Google Sheet owned by **houseofduniya@gmail.com**, and emails that inbox with one-tap **WhatsApp** and **Call** buttons. No paid service or extra database is needed.

## One-time setup (about 10 minutes)

Do all of this while signed in to **houseofduniya@gmail.com**.

1. **Create the sheet.** Go to sheets.new and name it `DÚNÍYÀ Enquiries`.
2. **Open Apps Script.** In the sheet: *Extensions → Apps Script*.
3. **Paste the code.** Delete everything in `Code.gs`, paste the full contents of [`Code.gs`](Code.gs) from this folder, and click **Save**.
4. **Build the sheet.** In the function menu at the top, choose `setup` and click **Run**.
   - Google asks for permission the first time. Choose the houseofduniya account → *Advanced* → *Go to project (unsafe)* → *Allow*. This warning appears for every private script; it only grants this script access to this sheet and to sending email as you.
   - An **Enquiries** tab appears with headers, a Status dropdown and colour coding.
5. **Deploy it.** Click **Deploy → New deployment** → gear icon → **Web app**.
   - Description: `Website form`
   - Execute as: **Me (houseofduniya@gmail.com)**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. **Connect the website.** In `assets/js/main.js`, paste the URL into:
   ```js
   const FORM_ENDPOINT = "https://script.google.com/macros/s/……/exec";
   ```
   Commit and push.
7. **Test it.** Submit the form on the live site. Within a few seconds you should see a new row in the sheet and an email at houseofduniya@gmail.com.

Optional: in Apps Script, run `testEnquiry` to add a test row and email without using the website.

## Day to day

- Each enquiry gets a reference (**DN-0001**, **DN-0002** …) and the Status **New**.
- In the email or the sheet, tap **WhatsApp** to open a chat with a ready greeting, or **Call** to dial.
- Move the Status along: New → Contacted → Measuring → In production → Delivered → Closed.
- Use **Staff notes** for anything the team needs to know.

## Settings

At the top of `Code.gs`:

| Setting | What it does |
|---|---|
| `NOTIFY_EMAIL` | Inbox that receives new enquiries. Add more with commas: `"a@x.com,b@x.com"` |
| `SEND_CUSTOMER_CONFIRMATION` | Emails the customer a short thank-you when they give an email |
| `DEFAULT_COUNTRY_CODE` | Turns local numbers like 0803… into +234803… for WhatsApp |
| `STATUSES` | The Status dropdown options (re-run `setup` after changing) |

## Changing the code later

After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL, so the website needs no change.

## Limits

A free Gmail account can send about 100 emails a day from scripts. Each enquiry uses one, or two when the customer gets a confirmation.

## What is protected

- A hidden field catches most spam bots.
- Submitting twice from the same number within 2 minutes returns the same reference instead of a duplicate row.
- Values that look like spreadsheet formulas are stored as plain text.
