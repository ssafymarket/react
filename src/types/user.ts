export type User = {
  studentId: string;  // 학번 (PK)
  name: string;       // 이름
  class: string;      // 반 (13기/14기)
  role: 'ROLE_USER' | 'ROLE_ADMIN';  // 권한
}

export type LoginRequest = {
  studentId: string;  // 학번으로 로그인
  password: string;
}

export type LoginResponse = {
  user: User;
  token: string;
}

export type SignupRequest = {
  studentId: string;
  name: string;
  class: string;
  password: string;
}
