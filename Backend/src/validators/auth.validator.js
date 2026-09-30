import Joi from 'joi';

export const validateAuth = {
  register: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },

  login: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};

export const validateRepository = {
  create: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};

export const validateUser = {
  update: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      bio: Joi.string(),
      avatar: Joi.string().uri(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
