import { NextFunction, Request, Response } from 'express';
import { User } from '../user/type';
import { ROLES } from '../utils/constant';

function isAProvider(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User;

  if (user && user.role === ROLES[0]) {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
}

export default isAProvider;
