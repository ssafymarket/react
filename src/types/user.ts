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
