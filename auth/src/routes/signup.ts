import express from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError, BadRequestError } from '../errors';
import { User } from '../models';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').trim().isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body as { email: string; password: string };

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const hashedPassword = password;

    const user = User.build({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      user,
    });
  },
);

export { router as signUpRouter };
