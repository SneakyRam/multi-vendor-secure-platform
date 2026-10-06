import { Router } from 'express';
import { registerHandler, loginHandler, googleLoginHandler, logoutHandler, meHandler, csrfTokenHandler } from './auth.controller.js';
import { requireAuthentication } from '../../middleware/authentication.js';
import { csrfProtection } from '../../middleware/csrf.js';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/google-login', googleLoginHandler);

router.use(requireAuthentication);
router.post('/logout', csrfProtection, logoutHandler);
router.get('/me', meHandler);
router.get('/csrf', csrfTokenHandler);

export { router as authRoutes };
