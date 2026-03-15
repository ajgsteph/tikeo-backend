import prisma from '../../config/prisma/client';

class CustomerService {
  async createCustomer(
    firstname: string,
    lastname: string,
    phoneNumber: string,
    serviceId: string,
  ) {
    return prisma.customer.create({
      data: { firstname, lastname, phoneNumber, serviceId },
    });
  }

  async getCustomerById(customerId: string, serviceId: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });
      if (!customer || customer.serviceId !== serviceId) {
        throw new Error('Accès refusé ou customer non trouvé');
      }
      return customer;
    } catch (error) {
      throw new Error(`Error : ${error}`);
    }
  }
  async getAllCustomers(serviceId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where: {
            serviceId,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.customer.count({
          where: {
            serviceId,
          },
        }),
      ]);

      return {
        customers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des customers: ${error}`);
    }
  }

  async updateCustomer(id: string, firstname?: string, lastname?: string, phoneNumber?: string) {
    return prisma.customer.update({
      where: { id },
      data: { firstname, lastname, phoneNumber },
    });
  }

  async deleteCustomer(id: string, serviceId: string) {
    const customer = await this.getCustomerById(id, serviceId);
    if (!customer) {
      throw new Error('Customer non trouvé ou accès refusé');
    }

    return prisma.customer.delete({ where: { id } });
  }
}

const customerService = new CustomerService();

export default customerService;
