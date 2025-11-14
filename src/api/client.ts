import axios from 'axios';
import { showToast } from '@/utils/toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // 쿠키를 자동으로 포함 (세션 인증 필요)
});

// 에러 토스트 중복 방지를 위한 변수
let lastErrorTime = 0;
let lastErrorMessage = '';
const ERROR_THROTTLE_MS = 1000; // 1초 내 같은 에러는 무시

// 응답 인터셉터 - 에러 처리
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const now = Date.now();
    const errorMessage = error.response?.data?.message || error.message;
    // 401 Unauthorized - 세션 만료 또는 인증 필요
    if (error.response?.status === 401) {
      // 로그인 페이지가 아닌 경우에만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        showToast.error('로그인이 필요합니다.');
        // auth store 초기화
        localStorage.removeItem('auth-storage');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }

    // 403 Forbidden - 권한 없음
    if (error.response?.status === 403) {
      showToast.error('로그인을 다시 해주세요.');
      // 세션 클리어
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      const message = error.response?.data?.message || '요청한 리소스를 찾을 수 없습니다.';
      console.error('404 Error:', message);
      showToast.warning(message);
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
      console.error('Server Error:', message);

      // 중복 방지: 1초 내 같은 에러 메시지는 무시
      const toastMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      if (now - lastErrorTime > ERROR_THROTTLE_MS || lastErrorMessage !== toastMessage) {
        showToast.error(toastMessage);
        lastErrorTime = now;
        lastErrorMessage = toastMessage;
      }
    }

    // 네트워크 오류
    if (!error.response) {
      console.error('Network Error:', error.message);

      // 중복 방지: 1초 내 같은 에러 메시지는 무시
      const toastMessage = '네트워크 연결을 확인해주세요.';
      if (now - lastErrorTime > ERROR_THROTTLE_MS || lastErrorMessage !== toastMessage) {
        showToast.error(toastMessage);
        lastErrorTime = now;
        lastErrorMessage = toastMessage;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
