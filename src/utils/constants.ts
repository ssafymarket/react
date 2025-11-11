// 디자인 시스템 색상
export const COLORS = {
  primary: '#034EA2',
  danger: '#EF4444',
  gray: {
    50: '#F9FAFB',
    100: '#E6EDF6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#ADAEBC',
    500: '#9CA3AF',
    600: '#4B5563',
    700: '#374151',
    900: '#111827',
  },
} as const;

// 레이아웃 상수
export const LAYOUT = {
  maxWidth: '1440px',
  headerHeight: '64px',
  contentPadding: '80px',
} as const;

// 상품 카테고리 (백엔드와 일치)
export const CATEGORIES = [
  '전체',
  '디지털/가전',
  '가구/인테리어',
  '의류',
  '도서',
  '스포츠',
  '취미',
  '뷰티',
  '기타',
] as const;

// 정렬 옵션 (백엔드 API와 일치)
export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'lowPrice', label: '낮은 가격순' },
  { value: 'highPrice', label: '높은 가격순' },
] as const;

// 페이지네이션 설정
export const PAGINATION = {
  defaultPage: 0,       // 백엔드는 0-indexed
  pageSize: 8,          // 한 페이지에 8개씩
} as const;

// 이미지 업로드 제한
export const IMAGE_UPLOAD = {
  minCount: 1,
  maxCount: 10,
  maxSizeMB: 10,
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;
