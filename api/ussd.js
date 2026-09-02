// Vercel serverless function: the Africa's Talking USSD callback.
//
// Africa's Talking POSTs sessionId, serviceCode, phoneNumber and text
// (form-encoded) on every keypress and expects a plain-text reply that
// starts with CON or END, within about 10 seconds. All the logic lives in
// ../ussd.js; this file only speaks HTTP.
import { ussdMenu } from "../ussd.js";

export default function handler(req, res) {
  const body = req.body || {};
  const text = typeof body === "string" ? new URLSearchParams(body).get("text") || "" : body.text || "";
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(ussdMenu(text));
}
