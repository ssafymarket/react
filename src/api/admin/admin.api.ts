import client from '../client';
import type { PendingUsersResponse, ApproveUserResponse, RejectUserResponse } from '@/types/user';

/**
 * 회원 승인 목록 조회
 */
export const getPendingUsers = async (): Promise<PendingUsersResponse> => {
  const response = await client.get<PendingUsersResponse>('/admin/list');
  return response.data;
};

/**
 * 회원 승인
 */
export const approveUser = async (studentId: string): Promise<ApproveUserResponse> => {
  const response = await client.put<ApproveUserResponse>(`/admin/users/${studentId}/status`);
  return response.data;
};

/**
 * 회원 거절
 */
export const rejectUser = async (studentId: string): Promise<RejectUserResponse> => {
  const response = await client.delete<RejectUserResponse>(`/admin/users/${studentId}/reject`);
  return response.data;
};
