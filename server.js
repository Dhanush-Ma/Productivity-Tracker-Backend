const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
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

function getFormattedDateAndTime(timestamp) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const dateTime = new Date(timestamp);
  return dateTime.toLocaleString("en-US", options);
}

app.post("/restrict", (req, res) => {
  const { siteName, timestamp, email } = req.body;

  const formattedDateTime = getFormattedDateAndTime(timestamp);

  const info = `<p>Dear User,</p>
    <p>We hope this email finds you well. We wanted to inform you that a site that was previously blocked has been accessed from your account. The details can be found below.</p>
  
  <p>Site Name: ${siteName}<br />
  Access Time: <b>${formattedDateTime}</b></p>
  <p>Best regards,<br/>
     Productivity Tracker Support Team.</p>`;

  const composeEmail = {
    from: "productivitytrackerextension@gmail.com",
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

  const formattedDateTime = getFormattedDateAndTime(timestamp);

  const info = `<p>Dear User,</p>
    <p>The Productivity Tracker Chrome extension has been re-enabled as of <b>${formattedDateTime}</b></p>
  
  <p>Best regards,<br/>
     Productivity Tracker Support Team.</p>
  `;

  const composeEmail = {
    from: "productivitytrackerextension@gmail.com",
    to: email,
    subject: "Productivity Tracker Extension Enabled",
    html: info,
  };

  sender.sendMail(composeEmail, (err, info) => {
    if (err) console.log(err);
  });

  res.status(200).send("OK");
});

const PORT = process.env.PORT || 8055;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
