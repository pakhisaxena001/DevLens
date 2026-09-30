import Joi from 'joi';

export const validateUser = {
  update: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      bio: Joi.string().max(500),
      avatar: Joi.string().uri(),
      email: Joi.string().email(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },

  changePassword: (req, res, next) => {
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  },
};
