const { createMailTransporter } = require('../config/mail');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailText({ name, email, phone, message }) {
  return [
    'New Booking - MS Studio',
    '',
    `Customer Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');
}

function buildEmailHtml({ name, email, phone, message }) {
  // Keep the HTML simple so the email renders cleanly across mail clients.
  return `
    <h2>New Booking - MS Studio</h2>
    <p><strong>Customer Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;
}

async function sendContactEmail(req, res) {
  const booking = req.body;


  try {
    const transporter = createMailTransporter();

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: booking.email,
      subject: 'New Booking - MS Studio',
      text: buildEmailText(booking),
      html: buildEmailHtml(booking),
    });

    return res.status(200).json({
      success: true,
      message: 'Booking sent successfully.',
    });
  } catch (error) {
    console.error('Contact email failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send your booking right now. Please try again later.',
    });
  }
}

module.exports = {
  sendContactEmail,
};
