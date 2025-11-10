import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UserProfile } from '@/components/common/UserProfile';
import iconSearch from '@/assets/icon_search.svg';
import iconPicture from '@/assets/icon_picture.svg';
import type { User } from '@/types/user';

// 채팅방 타입
type ChatRoom = {
  id: number;
  user: User;
  productTitle: string;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

// 메시지 타입
type Message = {
  id: number;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
};

// 더미 채팅방 목록
const dummyChatRooms: ChatRoom[] = [
  {
    id: 1,
    user: { studentId: '1327907', name: '김민지', class: '13기', role: 'ROLE_USER' },
    productTitle: '소니 WH-1000XM5 무선 헤드폰',
    productImage: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=100',
    lastMessage: '네, 앞쪽숍니다! 내일 받으 😊',
    lastMessageTime: '2분 전',
    unreadCount: 1,
  },
  {
    id: 2,
    user: { studentId: '1327907', name: '김민지', class: '13기', role: 'ROLE_USER' },
    productTitle: '맥북 프로 14인치',
    lastMessage: '네, 앞쪽숍니다! 내일 받으 😊',
    lastMessageTime: '2분 전',
    unreadCount: 0,
  },
];

// 더미 메시지
const dummyMessages: Message[] = [
  {
    id: 1,
    senderId: '1327907',
    content: '안녕하세요! 물건 발표도지 궁금합니다!',
    timestamp: '오전 10:24',
    isMe: false,
  },
  {
    id: 2,
    senderId: 'me',
    content: '아직 안팔렸어요! 구매하시겠어요?',
    timestamp: '오전 10:25',
    isMe: true,
  },
  {
    id: 3,
    senderId: 'me',
    content: '내일 가져갈꺼면 4층 복도에서 안나갈!',
    timestamp: '오전 10:25',
    isMe: true,
  },
  {
    id: 4,
    senderId: '1327907',
    content: '네, 앞쪽숍니다! 내일 받으 😊',
    timestamp: '오전 10:28',
    isMe: false,
  },
];

export const ChatListPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // TODO: 메시지 전송 API 호출
    setMessageInput('');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-20 py-8">
        <div className="grid grid-cols-[320px_1fr] gap-0 h-[calc(100vh-120px)] bg-white rounded-2xl overflow-hidden border border-gray-200">
          {/* 왼쪽: 채팅 목록 */}
          <aside className="border-r border-gray-200 flex flex-col">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">메시지</h1>
              {/* 검색창 */}
              <div className="relative">
                <img src={iconSearch} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  placeholder="검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* 채팅방 목록 */}
            <div className="flex-1 overflow-y-auto">
              {dummyChatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedRoom?.id === room.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <UserProfile user={room.user} size="md" showInfo={false} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {room.user.name}({room.user.studentId})
                      </span>
                      <span className="text-xs text-gray-500">{room.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {room.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* 오른쪽: 채팅 화면 */}
          <main className="flex flex-col">
            {selectedRoom ? (
              <>
                {/* 채팅 헤더 */}
                <header className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedRoom.productImage && (
                      <img
                        src={selectedRoom.productImage}
                        alt={selectedRoom.productTitle}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedRoom.user.name}({selectedRoom.user.studentId})
                      </p>
                      <p className="text-sm text-gray-600">{selectedRoom.productTitle}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                    거래완료하기
                  </button>
                </header>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {dummyMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[70%] ${message.isMe ? 'flex-row-reverse' : ''}`}>
                        {!message.isMe && (
                          <UserProfile
                            user={selectedRoom.user}
                            size="sm"
                            showInfo={false}
                          />
                        )}
                        <div>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              message.isMe
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${message.isMe ? 'text-right' : ''}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 입력 영역 */}
                <footer className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors">
                      <img src={iconPicture} alt="이미지" className="w-6 h-6" />
                    </button>
                    <input
                      type="text"
                      placeholder="메시지 입력..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                      전송
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              // 빈 상태
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">대화를 선택해주세요</h2>
                <p className="text-sm text-gray-600">왼쪽 목록에서 대화를 선택하여 메시지를 확인하세요.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};
