import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/current-user', (req, res) => {
  try {
    const { email, id } = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as {
      email: string;
      id: string;
    };

    res.send({
      currentUser: {
        email,
        id,
      },
    });
  } catch (err) {
    res.send({
      currentUser: null,
    });
  }
});

export { router as currentUserRouter };
