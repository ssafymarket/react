import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { UserProfile } from '@/components/common/UserProfile';
import { useAuthStore } from '@/store/authStore';
import websocketService from '@/services/websocket.service';
import { getChatRooms, getMessages, markAsRead } from '@/api/chat/chat.api';
import type { ChatRoom, ChatMessage } from '@/types/chat';
import iconSearch from '@/assets/icon_search.svg';
import iconPicture from '@/assets/icon_picture.svg';

export const ChatListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 채팅방 목록 조회
  const { data: chatRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
    enabled: isLoggedIn,
    refetchInterval: 30000, // 30초마다 갱신
  });

  // WebSocket 연결
  useEffect(() => {
    if (!isLoggedIn) return;

    websocketService.connect(
      () => {
        console.log('WebSocket 연결 성공');
        setConnected(true);
      },
      (error) => {
        console.error('WebSocket 연결 실패:', error);
        setConnected(false);
        alert('실시간 채팅 연결에 실패했습니다. 로그인 상태를 확인해주세요.');
      }
    );

    return () => {
      websocketService.disconnect();
      setConnected(false);
    };
  }, [isLoggedIn]);

  // URL 파라미터로 채팅방 자동 선택 (최초 1회만)
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    if (roomId && chatRooms.length > 0 && !selectedRoom) {
      const room = chatRooms.find((r) => r.roomId === Number(roomId));
      if (room) {
        setSelectedRoom(room);
      }
    }
  }, [searchParams, chatRooms, selectedRoom]);

  // 선택된 채팅방 메시지 로드 (채팅방 변경 시에만)
  useEffect(() => {
    if (!selectedRoom) return;

    const roomId = selectedRoom.roomId;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      setMessageError(null);
      try {
        const msgs = await getMessages(roomId);
        // sentAt 기준 오름차순 정렬 (오래된 메시지 → 최신 메시지)
        const sorted = msgs.sort((a, b) =>
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
        setMessages(sorted);
      } catch (error) {
        console.error('메시지 로드 실패:', error);
        setMessageError('메시지를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom?.roomId]);

  // WebSocket 구독 (채팅방 선택 & 연결 완료 시)
  useEffect(() => {
    if (!selectedRoom || !connected) return;

    const roomId = selectedRoom.roomId;

    // WebSocket 구독
    websocketService.subscribeToRoom(roomId, (newMessage: ChatMessage) => {
      console.log('새 메시지 수신:', newMessage);
      // 중복 메시지 방지
      setMessages((prev) => {
        if (prev.some(msg => msg.messageId === newMessage.messageId)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    });

    // 입장 메시지 전송
    websocketService.enterRoom(roomId);

    // 읽음 처리
    markAsRead(roomId).catch(console.error);

    // cleanup 함수
    return () => {
      websocketService.unsubscribeFromRoom(roomId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom?.roomId, connected]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedRoom) return;
    if (!connected) {
      alert('WebSocket이 연결되지 않았습니다.');
      return;
    }

    try {
      websocketService.sendMessage(selectedRoom.roomId, messageInput, 'CHAT');
      setMessageInput('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  };

  // 채팅방 선택
  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    // 메시지는 useEffect에서 자동으로 로드되므로 초기화하지 않음
  };

  // 검색 필터
  const filteredRooms = chatRooms.filter((room) => {
    const otherUser = room.iAmBuyer ? room.seller : room.buyer;
    const searchLower = searchQuery.toLowerCase();
    return (
      otherUser.name.toLowerCase().includes(searchLower) ||
      otherUser.studentId.includes(searchLower) ||
      room.postTitle?.toLowerCase().includes(searchLower)
    );
  });

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const formatMessageTime = (dateString: string) => {
    // 서버에서 시간대 정보 없이 UTC 시간을 보냄
    // 2025-11-11T17:06:03 형식은 'Z'가 없으면 로컬 시간으로 해석됨
    // 따라서 명시적으로 'Z'를 붙여 UTC로 파싱한 후 한국 시간으로 변환
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!isLoggedIn) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-20 py-8">
        <div className="grid grid-cols-[320px_1fr] gap-0 h-[calc(100vh-120px)] bg-white rounded-2xl overflow-hidden border border-gray-200">
          {/* 왼쪽: 채팅 목록 */}
          <aside className="border-r border-gray-200 flex flex-col">
            {/* 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">메시지</h1>
                <span className={`text-xs px-2 py-1 rounded-full ${connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {connected ? '🟢 연결됨' : '🔴 끊김'}
                </span>
              </div>
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
              {isLoadingRooms ? (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  로딩 중...
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  채팅 내역이 없습니다
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const otherUser = room.iAmBuyer ? room.seller : room.buyer;
                  const postImageUrl = room.postImage
                    ? (room.postImage.startsWith('http') ? room.postImage : `${IMAGE_BASE_URL}${room.postImage}`)
                    : null;

                  return (
                    <button
                      key={room.roomId}
                      onClick={() => handleSelectRoom(room)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedRoom?.roomId === room.roomId ? 'bg-gray-50' : ''
                      }`}
                    >
                      {/* 물건 사진 */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {postImageUrl ? (
                          <img
                            src={postImageUrl}
                            alt={room.postTitle || '상품'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            이미지 없음
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {otherUser.name}({otherUser.studentId})
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(room.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{room.lastMessage || '메시지 없음'}</p>
                      </div>
                      {room.unreadCount && room.unreadCount > 0 ? (
                        <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {room.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* 오른쪽: 채팅 화면 */}
          <main className="flex flex-col">
            {selectedRoom ? (
              <>
                {/* 채팅 헤더 */}
                <header className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedRoom.postImage && (
                      <img
                        src={selectedRoom.postImage}
                        alt={selectedRoom.postTitle}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {(selectedRoom.iAmBuyer ? selectedRoom.seller : selectedRoom.buyer).name}
                        ({(selectedRoom.iAmBuyer ? selectedRoom.seller : selectedRoom.buyer).studentId})
                      </p>
                      <p className="text-sm text-gray-600">{selectedRoom.postTitle}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                    거래완료하기
                  </button>
                </header>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      메시지를 불러오는 중...
                    </div>
                  ) : messageError ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500">
                      <p>{messageError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                      >
                        새로고침
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      메시지가 없습니다. 첫 메시지를 보내보세요!
                    </div>
                  ) : (
                    messages
                      .filter((message) => !message.messageType || message.messageType === 'CHAT')
                      .map((message) => {
                        console.log(message.messageType);
                        const isMe = message.senderId === user?.studentId;
                        const otherUser = selectedRoom.iAmBuyer ? selectedRoom.seller : selectedRoom.buyer;

                        return (
                          <div
                            key={message.messageId}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                              {!isMe && (
                                <UserProfile
                                  user={otherUser}
                                  size="sm"
                                  showInfo={false}
                                />
                              )}
                              <div>
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isMe
                                      ? 'bg-primary text-white rounded-tr-none'
                                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : ''}`}>
                                  {formatMessageTime(message.sentAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <footer className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors" disabled>
                      <img src={iconPicture} alt="이미지" className="w-6 h-6 opacity-50" />
                    </button>
                    <input
                      type="text"
                      placeholder="메시지 입력..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={!connected}
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!connected || !messageInput.trim()}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
