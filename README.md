# 싸피 플리마켓

싸피 내에서 물건을 사고파는 플리마켓 프로젝트 (프론트엔드)

## 기술 스택

- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **React Router v6** - 라우팅
- **TanStack Query (React Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트
- **Socket.io** - 실시간 채팅
- **Tailwind CSS** - 스타일링
- **React Hook Form** + **Zod** - 폼 관리 및 유효성 검사

## 시작하기

### 1. 환경변수 설정

`.env.example` 파일을 복사해서 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

그리고 백엔드 API URL을 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 을 열어주세요.

## 프로젝트 구조

```
src/
├── api/              # API 호출 함수
├── components/       # 재사용 컴포넌트
│   ├── common/       # 공통 UI
│   ├── layout/       # 레이아웃
│   ├── products/     # 상품 관련
│   ├── chat/         # 채팅 관련
│   └── auth/         # 인증 관련
├── pages/            # 페이지 컴포넌트
├── hooks/            # 커스텀 훅
│   └── api/          # React Query 훅
├── store/            # Zustand 스토어
├── routes/           # 라우팅 설정
├── types/            # TypeScript 타입
└── utils/            # 유틸리티
```

## 주요 페이지

1. **홈** (`/`) - 상품 목록
2. **상품 상세** (`/products/:id`) - 상품 상세 정보
3. **판매 등록** (`/products/new`) - 상품 등록
4. **채팅** (`/chat/:roomId`) - 실시간 채팅
5. **마이페이지** (`/mypage`) - 내 판매/구매 내역
6. **프로필** (`/profile/:userId`) - 유저 프로필
7. **관리자** (`/admin`) - 관리자 페이지

## 개발 가이드

### API 호출

```typescript
// src/api/products.ts
import client from './client';

export const getProducts = async () => {
  const response = await client.get('/products');
  return response.data;
};
```

### React Query 사용

```typescript
// src/hooks/api/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};
```

### Zustand 사용

```typescript
// 스토어에서 상태 가져오기
import { useAuthStore } from '@/store/authStore';

const { user, isLoggedIn, login, logout } = useAuthStore();
```

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 배포

Vercel이나 Netlify에 배포할 수 있습니다:

1. GitHub에 푸시
2. Vercel/Netlify에 연결
3. 환경변수 설정
4. 자동 배포
