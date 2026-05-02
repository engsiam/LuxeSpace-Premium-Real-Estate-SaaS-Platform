import { Router } from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import * as blogController from './blog.controller';

const router = Router();

router.post('/', authGuard('ADMIN'), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/all', authGuard('ADMIN'), blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);

export default router;
