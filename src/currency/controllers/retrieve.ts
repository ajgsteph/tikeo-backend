import { Request, Response } from 'express';

const SUPPORTED_CURRENCIES = [{ code: 'XOF', symbol: 'CFA' }];

function retrieve(req: Request, res: Response) {
  return res.status(200).json({
    message: 'Currencies retrieved successfully',
    currencies: SUPPORTED_CURRENCIES,
  });
}

export default retrieve;
