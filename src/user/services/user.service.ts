import prisma from '../../config/prisma/client';
import { User } from '../type';

class UserService {
  async createUser(data: User) {
    return prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUserByEmail(email: string, data: Partial<User>) {
    return prisma.user.update({
      where: { email },
      data,
    });
  }

  async updateUserById(id: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

const userService = new UserService();

export default userService;
