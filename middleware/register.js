const Joi = require('joi');

const schema = Joi.object({
  firstName: Joi.string().required().empty(),
  lastName: Joi.string().required().empty(),
  username: Joi.string().required().empty(),
  email: Joi.string().email().required().messages({
    'string.email': 'Email format is Invalid',
    'any.required': 'Email cannot be empty'
  }),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .min(4).max(30).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      'string.min': 'Password must be at least {#limit} characters long',
      'string.max': 'Password cannot exceed {#limit} characters',
      'any.required': 'Password cannot be empty'
    }),
  avatar: Joi.object({
    avatarName: Joi.string().required(),
    avatarType: Joi.string().required().empty()
  }),

});

const validateRegister = (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map((detail) => {
      let errorMessage = {
        field: detail.context.key,
        message: ''
      };
      const fieldName = errorMessage.field.split('-').pop();
      const isRequired = detail.type === 'any.required';
      const oneRequired = detail.type === 'any.only';
      if (isRequired) {
        errorMessage.message = `${fieldName} is required`;
      } else if (detail.type === 'string.email') {
        errorMessage.message = 'Invalid email format';
      } else if (detail.type === 'string.pattern.base') {
        errorMessage.message = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
      } else if (detail.type === 'string.min') {
        errorMessage.message = `Password must be at least ${detail.context.limit} characters long`;
      } else if (detail.type === 'string.max') {
        errorMessage.message = `Password cannot exceed ${detail.context.limit} characters`;
      } else if (oneRequired) {
        errorMessage.message = `Invalid ${fieldName}. It should be one of these: ${role.join(', ')}`;
      } else {
        errorMessage.message = `${fieldName} cannot be empty`;
      }
      return errorMessage;
    });
    return res.status(400).json({ errors: errorDetails[0] });
  }
  next();
};

module.exports = validateRegister;
