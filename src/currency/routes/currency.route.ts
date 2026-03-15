import { Router } from 'express';
import retrieve from '../controllers/retrieve';

const currencyRouter = Router();

currencyRouter.get('/', retrieve);

export default currencyRouter;
