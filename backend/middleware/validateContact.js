const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]+$/;

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isReasonablePhone(phone) {
  const digits = phone.replace(/\D/g, '');

  return PHONE_PATTERN.test(phone) && digits.length >= 7 && digits.length <= 15;
}

function validateContact(req, res, next) {
  const body = req.body || {};
  const payload = {
    name: trimValue(body.name),
    email: trimValue(body.email),
    phone: trimValue(body.phone),
    message: trimValue(body.message),
  };

  const errors = {};

  if (!payload.name) {
    errors.name = 'Name is required.';
  } else if (payload.name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!payload.email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(payload.email) || payload.email.length > 254) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!isReasonablePhone(payload.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!payload.message) {
    errors.message = 'Message is required.';
  } else if (payload.message.length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer.';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      message: 'Please check the highlighted fields and try again.',
      errors,
    });
  }

  req.body = payload;
  return next();
}

module.exports = validateContact;
