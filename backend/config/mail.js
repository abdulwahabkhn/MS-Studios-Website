const nodemailer = require('nodemailer');

const REQUIRED_MAIL_ENV = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
  'MAIL_TO',
];

function getMailConfig() {
  const missing = REQUIRED_MAIL_ENV.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing mail environment variables: ${missing.join(', ')}`);
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('SMTP_PORT must be a valid positive number.');
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
}

function createMailTransporter() {
  return nodemailer.createTransport(getMailConfig());
}

module.exports = {
  createMailTransporter,
};
