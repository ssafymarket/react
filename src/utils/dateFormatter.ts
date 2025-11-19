/**
 * 날짜/시간 포맷팅 유틸리티
 * 모든 시간은 한국 시간(KST, UTC+9) 기준으로 표시
 */

/**
 * UTC 시간을 KST(한국 시간, UTC+9)로 변환
 */
export const toKST = (dateString: string): Date => {
  // 서버에서 'Z' 없이 보내는 경우 UTC로 간주하고 'Z' 추가
  const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  const utcDate = new Date(utcString);

  // KST = UTC + 9시간
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
  return new Date(utcDate.getTime() + kstOffset);
};

/**
 * 상대 시간 포맷 (방금 전, N분 전, N시간 전 등)
 * 한국 시간 기준으로 계산
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = toKST(dateString);
  const now = toKST(new Date().toISOString());
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  // 7일 이상이면 날짜 표시
  return formatKSTDate(dateString);
};

/**
 * 한국 날짜 형식으로 포맷 (예: 2025. 11. 19.)
 */
export const formatKSTDate = (dateString: string): string => {
  const date = toKST(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}. ${month}. ${day}.`;
};

/**
 * 채팅 메시지용 시간 포맷 (예: 오후 5:06)
 */
export const formatMessageTime = (dateString: string): string => {
  const date = toKST(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${period} ${displayHours}:${displayMinutes}`;
};

/**
 * 채팅방 목록용 시간 포맷 (상대시간 또는 날짜)
 */
export const formatChatListTime = (dateString: string | null): string => {
  if (!dateString) return '';

  const date = toKST(dateString);
  const now = toKST(new Date().toISOString());
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days === 1) return '어제';

  // 2일 이상이면 날짜 표시 (년도 제외)
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};

/**
 * 거래 완료 날짜 포맷 (예: 2025년 11월 19일)
 */
export const formatTransactionDate = (dateString: string): string => {
  const date = toKST(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};
