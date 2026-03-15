interface Provider {
  id: string;
  businessName: string;
  description?: string;
  address?: string;
  linkCode: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export { Provider };
