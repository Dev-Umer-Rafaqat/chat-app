function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // collect all errors, not just the first
      stripUnknown: true, // drop fields not in the schema
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return res.status(400).json({ success: false, message });
    }

    req.body = value; // sanitized/validated body
    next();
  };
}

module.exports = validate;
