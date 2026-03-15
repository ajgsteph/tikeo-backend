import { Router } from 'express';
import create from '../controllers/create';
import me from '../controllers/me';
import update from '../controllers/update';
import createProviderService from '../../services/controllers/provider/createProviderService';
import getProviderService from '../../services/controllers/provider/getProviderService';
import schedulerRouter from '../../services/routes/scheduler/scheduler.route';
import { createCustomer } from '../../services/controllers/customer/createCustomer';
import { getAllCustomers, getCustomerById } from '../../services/controllers/customer/getCustomer';
import { updateCustomer } from '../../services/controllers/customer/updateCustomer';
import deleteCustomer from '../../services/controllers/customer/deleteCustomer';

const providersRouter = Router();

const servicePath = '/service';

providersRouter.post('/', create);

providersRouter.post(servicePath, createProviderService);
providersRouter.get(servicePath, getProviderService);
providersRouter.use(schedulerRouter);

providersRouter.get('/me', me);
providersRouter.put('/me', update);

providersRouter.post('/customer', createCustomer);
providersRouter.get('/customer/:id', getCustomerById);
providersRouter.get('/customers', getAllCustomers);
providersRouter.put('/customer/:id', updateCustomer);
providersRouter.delete('/customer/:id', deleteCustomer);

export default providersRouter;
