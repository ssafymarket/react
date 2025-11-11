import client from '../client';
import type { UpdateProfileRequest, UpdateProfileResponse } from '@/types/user';

/**
 * 사용자 프로필 수정 API
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const response = await client.put<UpdateProfileResponse>('/user/update', data);
  return response.data;
};
