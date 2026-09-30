import Joi from 'joi';

export const validateRepository = {
  create: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
      description: Joi.string(),
      language: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      language: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
