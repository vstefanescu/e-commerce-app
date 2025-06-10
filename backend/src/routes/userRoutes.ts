import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = Router();

router.get('/profile', authenticateToken, (req, res) => {
  console.log('Decoded user:', req.user);
  res.json({
    message: 'Access granted!',
    user: req.user
  });
});


export default router;
