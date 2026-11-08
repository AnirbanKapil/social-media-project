import nodemailer, { type Transporter } from "nodemailer";

const globalForMailer = global as typeof globalThis & {
  mailTransporter?: Transporter;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTransport(): Transporter {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "Missing SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)",
    );
  }

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  if (!globalForMailer.mailTransporter) {
    globalForMailer.mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user, pass },
      pool: true,
    });
  }

  return globalForMailer.mailTransporter;
}

function buildPasswordResetHtml(resetUrl: string): string {
  const safeUrl = escapeHtml(resetUrl);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;padding:32px;">
            <tr>
              <td style="padding:0 0 16px 0;">
                <h1 style="margin:0;font-size:22px;line-height:30px;color:#18181b;">Reset your password</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 16px 0;font-size:15px;line-height:24px;color:#3f3f46;">
                <p style="margin:0 0 12px 0;">We received a request to reset the password for your account.</p>
                <p style="margin:0 0 12px 0;">Click the button below to choose a new password. This link expires in 30 minutes and can only be used once.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0 20px 0;">
                <a href="${safeUrl}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;">Reset password</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 16px 0;font-size:13px;line-height:21px;color:#71717a;">
                <p style="margin:0 0 8px 0;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0;word-break:break-all;"><a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0 0 0;border-top:1px solid #e4e4e7;font-size:13px;line-height:21px;color:#71717a;">
                If you did not request a password reset, you can safely ignore this email. Your password will not change.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildPasswordResetText(resetUrl: string): string {
  return [
    "Reset your password",
    "",
    "We received a request to reset the password for your account.",
    "Open the link below to choose a new password. This link expires in 30 minutes and can only be used once.",
    "",
    resetUrl,
    "",
    "If you did not request a password reset, you can safely ignore this email.",
  ].join("\n");
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error("Missing SMTP configuration (SMTP_FROM)");
  }

  await getTransport().sendMail({
    from,
    to,
    subject: "Reset your password",
    text: buildPasswordResetText(resetUrl),
    html: buildPasswordResetHtml(resetUrl),
  });
}
