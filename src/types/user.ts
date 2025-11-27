export type User = {
  studentId: string;  // 학번 (PK)
  name: string;       // 이름
  className: string;  // 반 (백엔드와 일치)
  role: 'ROLE_USER' | 'ROLE_ADMIN';  // 권한
}

export type LoginRequest = {
  studentId: string;  // 학번으로 로그인
  password: string;
}

export type LoginResponse = {
  success: boolean;
  message: string;
  userId: string;
  roles: string[];
}

export type MeResponse = {
  success: boolean;
  user: User;
}

export type SignupRequest = {
  studentId: string;
  name: string;
  className: string;  // class → className으로 변경
  campus: string;
  password: string;
}

export type SignupResponse = {
  success: boolean;
  message: string;
  studentId: string;
}

export type UpdateProfileRequest = {
  name?: string;
  password?: string;
}

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
}

// 승인 대기 사용자 타입
export type PendingUser = {
  studentId: string;
  name: string;
  className: string;
  campus: string;
  password: string;
  approve: number;  // 0: 대기, 1: 승인
}

// 회원 승인 목록 응답
export type PendingUsersResponse = {
  success: boolean;
  list: PendingUser[];
}

// 회원 승인 요청
export type ApproveUserRequest = {
  studentId: string;
}

// 회원 승인 응답
export type ApproveUserResponse = {
  success: boolean;
  user: {
    studentId: string;
    name: string;
    className: string;
    password: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN';
  };
}

// 회원 거절 응답
export type RejectUserResponse = {
  success: boolean;
  message: string;
}

// 회원 비밀번호 초기화 요청
export type ResetPasswordRequest = {
  studentId: string;
  name: string;
  className: string;
}

// 회원 비밀번호 초기화 응답
export type ResetPasswordResponse = {
  success: boolean;
  message: string;
}
