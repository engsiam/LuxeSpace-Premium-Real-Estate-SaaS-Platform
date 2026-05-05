import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as contactController from './contact.controller';

const router = Router();

router.post('/', contactController.submitContact);
router.get('/', authGuard('ADMIN'), contactController.getContacts);
router.get('/:id', authGuard('ADMIN'), contactController.getContactById);
router.patch('/:id/read', authGuard('ADMIN'), contactController.markAsRead);
router.post('/:id/reply', authGuard('ADMIN'), contactController.replyToContact);
router.delete('/:id', authGuard('ADMIN'), contactController.deleteContact);

export default router;