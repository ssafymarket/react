import client from '../client';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '@/types/user';

/**
 * 회원가입 API
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await client.post<SignupResponse>('/auth/signup', data);
  return response.data;
};

/**
 * 로그인 API
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/auth/login', data);
  return response.data;
};

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};
