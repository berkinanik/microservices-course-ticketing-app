import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors';
import { validateRequestMiddleware } from '../middlewares';
import { User } from '../models';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').trim().isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  validateRequestMiddleware,
  async (req, res) => {
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

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send({
      user,
    });
  },
);

export { router as signUpRouter };
