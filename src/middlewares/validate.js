const { z } = require('zod');
const { ValidationError } = require('../utils/errors');

const validate = (schema) => (resolver) => async (parent, args, context, info) => {
  try {
    const data = args.input || args;

    if (!data) {
      throw new ValidationError('Invalid input: input is required');
    }

    await schema.parseAsync(data);
    return resolver(parent, args, context, info);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.errors
        .map((error) => `${error.path.join('.')}: ${error.message}`)
        .join(', ');
      throw new ValidationError(formattedErrors);
    }
    throw err;
  }
};

module.exports = validate;
