import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as contactController from './contact.controller';

const router = Router();

router.post('/', contactController.submitContact);
router.get('/', authGuard('ADMIN'), contactController.getContacts);
router.patch('/:id/read', authGuard('ADMIN'), contactController.markAsRead);

export default router;
