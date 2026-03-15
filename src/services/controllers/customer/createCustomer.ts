import { Request, Response } from 'express';
import customerService from '../../services/customer.service';
import { CreateCustomerDataSchema } from '../../dto/createCustomerData.dto';
import { getServiceFromRequest } from '../../utiles/getServiceFromRequest';

export async function createCustomer(req: Request, res: Response) {
  const validationBodyResult = CreateCustomerDataSchema.safeParse(req.body);

  if (!validationBodyResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors: validationBodyResult.error,
    });
  }

  try {
    const { firstname, lastname, phoneNumber } = validationBodyResult.data;
    const serviceData = await getServiceFromRequest(req, res);
    if (!serviceData) return;
    const { service, service_id } = serviceData;

    const customer = await customerService.createCustomer(
      firstname,
      lastname,
      phoneNumber,
      service_id,
    );

    return res.status(201).json({
      success: true,
      message: 'Customer créé avec succès',
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
