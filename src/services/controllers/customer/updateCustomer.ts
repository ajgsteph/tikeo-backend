import { Request, Response } from 'express';
import customerService from '../../services/customer.service';
import { CreateCustomerDataSchema } from '../../dto/createCustomerData.dto';
import { getServiceFromRequest } from '../../utiles/getServiceFromRequest';

export async function updateCustomer(req: Request, res: Response) {
  const validationBodyResult = CreateCustomerDataSchema.safeParse(req.body);

  if (!validationBodyResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Données de validation incorrectes',
      errors: validationBodyResult.error,
    });
  }
  const jsonHasKey = Object.keys(validationBodyResult.data).length > 0;

  if (!jsonHasKey) {
    return res.status(400).json({ message: 'Aucun service fourni pour la mise à jour' });
  }

  try {
    const { firstname, lastname, phoneNumber } = validationBodyResult.data;
    const providerData = await getServiceFromRequest(req, res);
    if (!providerData) return;
    const { service, service_id } = providerData;

    if (service_id === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID is missing',
      });
    }

    const customer = await customerService.updateCustomer(
      firstname,
      lastname,
      phoneNumber,
      service_id,
    );

    return res.status(201).json({
      success: true,
      message: 'Customer mis à jour avec succès',
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
