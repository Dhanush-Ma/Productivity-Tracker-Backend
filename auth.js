import { google } from "googleapis";

const auth = await google.auth.getClient({
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const range = `SheetA1:C1`;

const response = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.SPREADSHEET_ID,
  range,
});

console.log(response)
