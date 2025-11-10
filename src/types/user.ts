export type User = {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  profileImage?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  user: User;
  token: string;
}

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
  nickname?: string;
}
