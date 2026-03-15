interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: RoleUserType;
  refreshToken?: string;
}

type RoleUserType = 'PROVIDER' | 'CUSTOMER' | 'ADMIN';
export { User, RoleUserType };
