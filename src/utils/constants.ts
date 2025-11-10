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

// 상품 카테고리
export const CATEGORIES = [
  '전체',
  '전자기기',
  '의류',
  '도서',
  '가구',
  '생활용품',
  '기타',
] as const;

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '낮은 가격순' },
  { value: 'price-high', label: '높은 가격순' },
  { value: 'views', label: '조회수순' },
] as const;
