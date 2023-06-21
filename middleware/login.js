const Joi = require('joi');
const responses = require('../helper/response');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required().messages({
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password cannot exceed {#limit} characters',
    'any.required': 'Password is required',
  }),
});

const loginValidationMiddleware = (req, res, next) => {
  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorDetails = error.details.map(detail => {
      const errorMessage = {
        field: detail.context.key,
        message: '',
      };
  
      const fieldName = errorMessage.field.split('.').pop();
      const isRequired = detail.type === 'any.required';
  
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
      } else {
        errorMessage.message = `${fieldName} cannot be empty`;
      }
  
      return errorMessage;
    });
  
    responses.errorResponseBadRequest(res, { error: errorDetails });
  } else {
    next();
  }
};

module.exports = loginValidationMiddleware;
