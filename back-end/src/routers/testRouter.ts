import { Router } from 'express';
import * as testController from '../controllers/testController.js';

const testRouter = Router();
testRouter.post('/reset', testController.resetDatabase);

export default testRouter;
