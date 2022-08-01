import { Router } from 'express';
import * as testController from '../controllers/testController.js';

const testRouter = Router();
testRouter.post('/reset', testController.resetDatabase);
testRouter.post('/pop', testController.deleteOne);

export default testRouter;
