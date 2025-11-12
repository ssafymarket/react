import client from '../client';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, MeResponse } from '@/types/user';

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

/**
 * 내 정보 조회 API
 */
export const getMe = async (): Promise<MeResponse> => {
  const response = await client.get<MeResponse>('/auth/me');
  return response.data;
};
