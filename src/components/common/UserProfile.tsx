import type { User } from '@/types/user';
import user13th from '@/assets/13th_user.png';
import user14th from '@/assets/14th_user.png';

interface UserProfileProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  className?: string;
}

export const UserProfile = ({
  user,
  size = 'md',
  showInfo = false,
  className = '',
}: UserProfileProps) => {
  // 13기/14기에 따라 프로필 이미지 선택
  const profileImage = user.className === '13기' ? user13th : user14th;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 프로필 이미지 */}
      <img
        src={profileImage}
        alt={`${user.name} 프로필`}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />

      {/* 유저 정보 (선택사항) */}
      {showInfo && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{user.name}</span>
          <span className="text-sm text-gray-600">
            {user.studentId} · {user.className}
          </span>
        </div>
      )}
    </div>
  );
};
