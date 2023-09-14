const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sender = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

app.post("/restrict", async (req, res) => {
  const { siteName, timestamp, email } = req.body;

  if (!siteName || !timestamp || !email)
    return res.status(400).send("Bad Request");

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.SHEET_CREDENTIALS,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SHEET_ID;

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:C",
    valueInputOption: "RAW",
    resource: {
      values: [[email, siteName, timestamp]],
    },
  });

  const info = `<p>Dear User,</p>
    <p>We hope this email finds you well. We wanted to inform you that a site that was previously blocked has been accessed from your account. The details can be found below.</p>
  
  <p>Site Name: ${siteName}<br />
  Access Time: <b>${timestamp}</b></p>
  <p>Best regards,<br/>
     Productivity Tracker Support Team.</p>`;

  const composeEmail = {
    from: "Productivity Tracker Extension <productivitytrackerextension@gmail.com>",
    to: email,
    subject: "Blocked Site Access Alert",
    html: info,
  };

  sender.sendMail(composeEmail, (err, info) => {
    if (err) console.log(err);
  });

  res.status(200).send("OK");
});

app.post("/disabled", (req, res) => {
  const { timestamp, email } = req.body;

  if (!timestamp || !email) return res.status(400).send("Bad Request");

  const info = `<p>Dear User,</p>
    <p>The Productivity Tracker Chrome extension has been re-enabled as of <b>${timestamp}</b></p>
  
  <p>Best regards,<br/>
     Productivity Tracker Support Team.</p>
  `;

  const composeEmail = {
    from: "Productivity Tracker Extension <productivitytrackerextension@gmail.com>",
    to: email,
    subject: "Productivity Tracker Extension Enabled",
    html: info,
  };

  sender.sendMail(composeEmail, (err, info) => {
    if (err) console.log(err);
  });

  res.status(200).send("OK");
});

app.post("/send-otp", (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) return res.status(400).send("Bad Request");

  const info = `<p>Dear User,</p>
    <p>The One-Time-Pasword to reset the the account PIN is:  <b>${otp}</b></p>
  
     <p>Best regards,<br/>
     Productivity Tracker Support Team.</p>
  `;

  const composeEmail = {
    from: "Productivity Tracker Extension <productivitytrackerextension@gmail.com>",
    to: email,
    subject: "Reset PIN",
    html: info,
  };

  sender.sendMail(composeEmail, (err, info) => {
    if (err) console.log(err);
  });

  res.status(200).send("OK");
});

app.post("/users", async (req, res) => {
  const { timestamp, email } = req.body;

  if (!timestamp || !email) return res.status(400).send("Bad Request");

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.SHEET_CREDENTIALS,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SHEET_ID;

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet2!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[email, timestamp]],
    },
  });

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 8055;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
