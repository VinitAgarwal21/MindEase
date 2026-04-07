import nodemailer from "nodemailer";

let transporterCache = null;

function getTransporter() {
  if (transporterCache) return transporterCache;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporterCache = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporterCache;
}

export async function sendAppointmentConfirmedEmail({
  to,
  userName,
  therapistName,
  preferredDate,
  preferredTime,
}) {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const subject = "Your MindEase Appointment is Confirmed";
  const text = [
    `Hi ${userName || "there"},`,
    "",
    "Your appointment has been confirmed.",
    `Therapist: ${therapistName}`,
    `Date: ${preferredDate}`,
    `Time: ${preferredTime}`,
    "",
    "Thank you for choosing MindEase.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="margin-bottom: 12px;">Appointment Confirmed</h2>
      <p>Hi ${userName || "there"},</p>
      <p>Your appointment has been confirmed.</p>
      <ul>
        <li><strong>Therapist:</strong> ${therapistName}</li>
        <li><strong>Date:</strong> ${preferredDate}</li>
        <li><strong>Time:</strong> ${preferredTime}</li>
      </ul>
      <p>Thank you for choosing MindEase.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
}
