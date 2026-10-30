/**
 * DÚNÍYÀ — website enquiry back end
 * Google Apps Script bound to the "DÚNÍYÀ Enquiries" Google Sheet.
 *
 * What it does
 *  - Receives the Order page form (POST) and adds one row per enquiry.
 *  - Gives each enquiry a reference (DN-0001, DN-0002 …) and a Status you update.
 *  - Emails NOTIFY_EMAIL with one-tap WhatsApp and Call buttons.
 *  - Optionally emails the customer a short confirmation.
 *
 * Setup: see apps-script/README.md. Run `setup` once, then deploy as a Web app.
 */

const CONFIG = {
  NOTIFY_EMAIL: "houseofduniya@gmail.com",
  BUSINESS_WHATSAPP: "+234 815 901 9324",  // shown to customers in their confirmation email
  SHEET_NAME: "Enquiries",
  REF_PREFIX: "DN-",
  SEND_CUSTOMER_CONFIRMATION: true,   // only sent when the customer gives an email
  DEFAULT_COUNTRY_CODE: "234",        // used to turn 0803… into 234803… for WhatsApp
  DUPLICATE_WINDOW_SECONDS: 120,      // same phone within this window = same enquiry
  MIN_FILL_MS: 2500,                  // forms sent faster than this are treated as bots
  MAX_PER_10_MIN: 30,                 // site-wide cap, protects your inbox and email quota
  CONFIRM_ONCE_PER_EMAIL_HOURS: 6,    // a customer address gets at most one confirmation per 6 hours (Google cache maximum)
  RESERVE_EMAIL_QUOTA: 10,            // keep this many daily emails for your own notifications
  STATUSES: ["New", "Contacted", "Measuring", "In production", "Delivered", "Closed"]
};

const HEADERS = [
  "Reference", "Received", "Status", "Name", "Phone", "WhatsApp", "Call",
  "Email", "Contact by", "Looks", "City", "Fitting", "Needed by", "Message",
  "Page", "Staff notes"
];

/* ---------- one-time setup: run this from the editor ---------- */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) sh = ss.insertSheet(CONFIG.SHEET_NAME, 0);

  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight("bold").setFontColor("#F0E2D2").setBackground("#0E2D27")
    .setVerticalAlignment("middle");
  sh.setFrozenRows(1);
  sh.setRowHeight(1, 34);

  const widths = [90, 140, 120, 160, 140, 120, 90, 200, 100, 220, 120, 190, 100, 320, 110, 240];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.getRange("B:B").setNumberFormat("dd mmm yyyy, hh:mm");
  sh.getRange("M:M").setNumberFormat("dd mmm yyyy");
  sh.getRange("N:N").setWrap(true);

  // Status dropdown + colours
  const statusCol = HEADERS.indexOf("Status") + 1;
  const statusRange = sh.getRange(2, statusCol, sh.getMaxRows() - 1, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.STATUSES, true).setAllowInvalid(false).build()
  );
  const colours = { "New": "#F6D7B0", "Contacted": "#D9E7F5", "Measuring": "#E9DDF4",
                    "In production": "#FCEBC4", "Delivered": "#D3EBD9", "Closed": "#E4E4E4" };
  const rules = Object.keys(colours).map(s =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colours[s]).setRanges([statusRange]).build());
  sh.setConditionalFormatRules(rules);

  const def = ss.getSheetByName("Sheet1");
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);

  ss.toast("Enquiries sheet is ready.", "DÚNÍYÀ");
}

/* ---------- web app ---------- */
function doGet() {
  return json({ ok: true, service: "DÚNÍYÀ enquiries" });
}

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam traps: real people never fill the hidden "website" field, and take more than a moment.
  if (p.website) return json({ ok: true, ref: "" });
  if (p.t && Number(p.t) < CONFIG.MIN_FILL_MS) return json({ ok: true, ref: "" });

  const name = clean(p.name, 80);
  const phoneRaw = clean(p.phone, 30);
  const city = clean(p.city, 60);
  if (!name || !phoneRaw || !city) return json({ ok: false, error: "Please add your name, phone number and city." });

  const phone = intlPhone(phoneRaw);
  if (phone.length < 10) return json({ ok: false, error: "Please check your phone number." });

  const email = clean(p.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "Please check your email address." });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // Same phone again within the window (double tap, retry): return the earlier reference.
    const cache = CacheService.getScriptCache();
    const seen = cache.get("ph_" + phone);
    if (seen) return json({ ok: true, ref: seen, duplicate: true });

    // Site-wide flood protection.
    const bucket = "rate_" + Math.floor(Date.now() / 600000);
    const count = Number(cache.get(bucket) || 0) + 1;
    cache.put(bucket, String(count), 700);
    if (count > CONFIG.MAX_PER_10_MIN) {
      return json({ ok: false, error: "We're receiving a lot of enquiries right now. Please message us on WhatsApp instead." });
    }

    const sh = sheet();
    const ref = nextRef(sh);
    const data = {
      ref: ref,
      received: new Date(),
      name: name,
      phone: "+" + phone,
      email: email,
      contact: clean(p.contact, 20) || "WhatsApp",
      looks: clean(p.looks, 400) || "Not sure yet",
      city: city,
      fitting: clean(p.fitting, 80),
      needBy: parseDate(p.needby),
      message: clean(p.message, 2000),
      page: clean(p.page, 80)
    };
    const waText = `Hello ${firstName(name)}, this is DÚNÍYÀ. Thank you for your enquiry (${ref}) about ${data.looks}.`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

    sh.appendRow([
      data.ref, data.received, "New", data.name, "'" + data.phone,   // keep the + as text
      `=HYPERLINK("${waUrl}","WhatsApp")`, `=HYPERLINK("tel:+${phone}","Call")`,
      data.email, data.contact, data.looks, data.city, data.fitting, data.needBy || "",
      data.message, data.page, ""
    ]);

    cache.put("ph_" + phone, ref, CONFIG.DUPLICATE_WINDOW_SECONDS);

    try { notifyHouse(data, phone, waUrl); } catch (err) { console.error("notify", err); }
    // Customer confirmation: at most once per 6 hours per address, and never at the cost of your own notifications.
    const emKey = "em_" + Utilities.base64EncodeWebSafe(data.email.toLowerCase());
    if (CONFIG.SEND_CUSTOMER_CONFIRMATION && data.email && !cache.get(emKey)
        && MailApp.getRemainingDailyQuota() > CONFIG.RESERVE_EMAIL_QUOTA) {
      try {
        confirmCustomer(data);
        cache.put(emKey, "1", Math.min(21600, CONFIG.CONFIRM_ONCE_PER_EMAIL_HOURS * 3600));
      } catch (err) { console.error("confirm", err); }
    }
    return json({ ok: true, ref: ref });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- emails ---------- */
function notifyHouse(d, phone, waUrl) {
  const row = (k, v) => v ? `<tr><td style="padding:8px 16px 8px 0;color:#B87333;font:11px Arial;letter-spacing:2px;text-transform:uppercase;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;font:15px Arial;color:#1C2420">${esc(v)}</td></tr>` : "";
  const btn = (href, label, bg, fg) => `<a href="${href}" style="display:inline-block;padding:14px 22px;margin:0 8px 8px 0;background:${bg};color:${fg};font:bold 12px Arial;letter-spacing:2px;text-transform:uppercase;text-decoration:none">${label}</a>`;
  const html = `
  <div style="background:#F0E2D2;padding:28px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff">
      <div style="background:#0E2D27;padding:22px 28px;color:#F0E2D2;font:11px Arial;letter-spacing:3px;text-transform:uppercase">DÚNÍYÀ · New enquiry · ${d.ref}</div>
      <div style="padding:28px">
        <div style="font:26px Georgia;color:#0E2D27">${esc(d.name)}</div>
        <div style="font:14px Arial;color:#5E6A5F;margin:6px 0 22px">Prefers ${esc(d.contact)} · ${esc(d.city)}</div>
        ${btn(waUrl, "WhatsApp", "#0E2D27", "#F0E2D2")}${btn("tel:+" + phone, "Call " + d.phone, "#B87333", "#0E2D27")}
        <table style="border-collapse:collapse;margin-top:18px;width:100%">
          ${row("Looks", d.looks)}${row("Phone", d.phone)}${row("Email", d.email)}${row("Fitting", d.fitting)}
          ${row("Needed by", d.needBy ? Utilities.formatDate(d.needBy, Session.getScriptTimeZone(), "d MMM yyyy") : "")}
          ${row("Message", d.message)}${row("From page", d.page)}
        </table>
        <p style="font:12px Arial;color:#5E6A5F;margin-top:24px">Update the Status of ${d.ref} in the Enquiries sheet once you have been in touch.</p>
      </div>
    </div>
  </div>`;
  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAIL,
    subject: `New enquiry ${d.ref} · ${d.name} · ${d.looks}`,
    htmlBody: html,
    body: `New enquiry ${d.ref}\n${d.name}\n${d.phone}\nWhatsApp: ${waUrl}\nLooks: ${d.looks}\nCity: ${d.city}\nMessage: ${d.message}`,
    replyTo: d.email || CONFIG.NOTIFY_EMAIL,
    name: "DÚNÍYÀ Website"
  });
}

function confirmCustomer(d) {
  const html = `
  <div style="background:#F0E2D2;padding:28px">
    <div style="max-width:520px;margin:0 auto;background:#0E2D27;color:#F0E2D2;padding:36px 32px">
      <div style="font:11px Arial;letter-spacing:3px;text-transform:uppercase;color:#D49A63">DÚNÍYÀ · ${d.ref}</div>
      <div style="font:28px Georgia;margin:18px 0 14px">Thank you, ${esc(firstName(d.name))}.</div>
      <p style="font:15px/1.6 Arial;color:#C9D1C4">We have received your enquiry about <b style="color:#F0E2D2">${esc(d.looks)}</b>.
      A person from the house will contact you by ${esc(d.contact === "Call" ? "phone" : "WhatsApp")} on ${esc(d.phone)}.</p>
      <p style="font:15px/1.6 Arial;color:#C9D1C4">Every piece is made to your measurements. Please keep your reference, ${d.ref}, for any questions.</p>
      <p style="font:15px/1.6 Arial;color:#C9D1C4">Questions before then? WhatsApp us on <a href="https://wa.me/${CONFIG.BUSINESS_WHATSAPP.replace(/\D/g, "")}" style="color:#D49A63">${CONFIG.BUSINESS_WHATSAPP}</a>.</p>
      <p style="font-style:italic;font:18px Georgia;color:#D49A63;margin-top:26px">Made for you, to measure.</p>
    </div>
  </div>`;
  MailApp.sendEmail({
    to: d.email,
    subject: `We've received your enquiry · ${d.ref}`,
    htmlBody: html,
    body: `Thank you, ${firstName(d.name)}. We have received your enquiry (${d.ref}) about ${d.looks}. A person from the house will contact you on ${d.phone}. Questions? WhatsApp us on ${CONFIG.BUSINESS_WHATSAPP}.`,
    replyTo: CONFIG.NOTIFY_EMAIL,
    name: "DÚNÍYÀ"
  });
}

/* ---------- helpers ---------- */
function sheet() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) throw new Error("Run setup() first.");
  return sh;
}

function nextRef(sh) {
  const props = PropertiesService.getScriptProperties();
  let n = Number(props.getProperty("lastRef") || 0);
  if (!n) n = Math.max(0, sh.getLastRow() - 1);
  n += 1;
  props.setProperty("lastRef", String(n));
  return CONFIG.REF_PREFIX + String(n).padStart(4, "0");
}

// Trim, cap length, and stop spreadsheet formula injection.
function clean(v, max) {
  if (v === undefined || v === null) return "";
  let s = String(v).replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function intlPhone(raw) {
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = CONFIG.DEFAULT_COUNTRY_CODE + d.slice(1);
  if (d.length === 10 && !d.startsWith(CONFIG.DEFAULT_COUNTRY_CODE)) d = CONFIG.DEFAULT_COUNTRY_CODE + d;
  return d;
}

function parseDate(v) {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function firstName(n) { return String(n).split(" ")[0]; }

function esc(s) {
  return String(s).replace(/^'/, "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- optional: send yourself a test enquiry from the editor ---------- */
function testEnquiry() {
  const res = doPost({ parameter: {
    name: "Test Customer", phone: "08030000000", email: "", city: "Lagos",
    contact: "WhatsApp", looks: "Platinum", fitting: "Measure me in person in Lagos",
    message: "This is a test from the script editor.", page: "editor"
  }});
  console.log(res.getContent());
}
