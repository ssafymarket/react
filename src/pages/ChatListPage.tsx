import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { UserProfile } from '@/components/common/UserProfile';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useWebSocket } from '@/contexts/WebSocketContext';
import websocketService from '@/services/websocket.service';
import { getChatRooms, getChatRoom, getMessages } from '@/api/chat/chat.api';
import { completeSale, getPostById } from '@/api/post';
import type { ChatRoom, ChatMessage } from '@/types/chat';
import iconSearch from '@/assets/icon_search.svg';
import iconPicture from '@/assets/icon_picture.svg';
import iconLogo from '@/assets/icon_logo.svg';

export const ChatListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();
  const { setTotalUnreadCount } = useChatStore();
  const { setActiveRoomId } = useWebSocket();

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [showRoomList, setShowRoomList] = useState(true); // 모바일: 목록 표시 여부
  const [postStatus, setPostStatus] = useState<'판매중' | '판매완료'>('판매중'); // 게시글 상태
  const [isLoadingPostStatus, setIsLoadingPostStatus] = useState(false); // 게시글 상태 로딩
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || '';

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 채팅방 목록 조회 (refetchInterval 제거 - WebSocket으로 실시간 업데이트)
  const { data: chatRooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
    enabled: isLoggedIn,
    staleTime: 0, // 항상 fresh 상태로 간주하지 않음
    refetchOnMount: true, // 마운트될 때마다 새로 가져오기
  });

  // chatRooms가 업데이트되면 selectedRoom도 동기화
  useEffect(() => {
    if (selectedRoom && chatRooms.length > 0) {
      const updatedRoom = chatRooms.find(room => room.roomId === selectedRoom.roomId);
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRooms]);

  // WebSocket 연결 상태 확인 (WebSocketProvider에서 관리)
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkConnection = () => {
      const isConnected = websocketService.isConnected();
      setConnected(isConnected);
    };

    checkConnection();
    const timer = setTimeout(checkConnection, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // URL 파라미터로 채팅방 자동 선택 및 로드 (최적화)
  useEffect(() => {
    const roomIdParam = searchParams.get('roomId');
    if (!roomIdParam) return;

    const roomId = Number(roomIdParam);

    // 이미 선택된 방이 있고, 같은 방이면 리턴
    if (selectedRoom && selectedRoom.roomId === roomId) return;

    // 먼저 기존 목록에서 찾기 (이미 로드된 경우)
    const existingRoom = chatRooms.find((r) => r.roomId === roomId);
    if (existingRoom) {
      setSelectedRoom(existingRoom);
      return;
    }

    // 목록에 없으면 특정 채팅방만 조회 (병렬 처리)
    const loadRoomAndMessages = async () => {
      try {
        const [room, msgs] = await Promise.all([
          getChatRoom(roomId),
          getMessages(roomId),
        ]);

        setSelectedRoom(room);

        // 메시지 정렬 및 설정
        const sorted = msgs.sort((a, b) =>
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
        setMessages(sorted);
      } catch (error) {
        console.error('채팅방 로드 실패:', error);
        setMessageError('채팅방을 불러오는데 실패했습니다.');
      }
    };

    loadRoomAndMessages();
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

  // 선택된 채팅방의 게시글 상태 조회
  useEffect(() => {
    if (!selectedRoom) return;

    const loadPostStatus = async () => {
      setIsLoadingPostStatus(true);
      try {
        const response = await getPostById(selectedRoom.postId);
        setPostStatus(response.post.status);
      } catch (error) {
        console.error('게시글 상태 조회 실패:', error);
      } finally {
        setIsLoadingPostStatus(false);
      }
    };

    loadPostStatus();
  }, [selectedRoom]);

  // 전역 알림과 읽음 알림은 WebSocketProvider에서 관리
  // ChatListPage에서는 채팅방 목록 갱신만 처리
  useEffect(() => {
    if (!connected) return;

    // 채팅방 목록 주기적 갱신 (WebSocket 알림 수신 시 자동으로 갱신됨)
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    }, 60000); // 1분마다 백업 갱신

    return () => clearInterval(interval);
  }, [connected, queryClient]);

  // WebSocket 구독 (채팅방 선택 & 연결 완료 시)
  useEffect(() => {
    if (!selectedRoom || !connected) return;

    const roomId = selectedRoom.roomId;

    // WebSocket 구독
    websocketService.subscribeToRoom(roomId, (newMessage: ChatMessage) => {
      // 중복 메시지 방지
      setMessages((prev) => {
        if (prev.some(msg => msg.messageId === newMessage.messageId)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // 상대방 메시지인 경우 즉시 읽음 처리
      if (newMessage.senderId !== user?.studentId) {
        websocketService.markAsRead(roomId);
      }

      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    });

    // 활성 채팅방 설정
    setActiveRoomId(roomId);

    // 입장 메시지 전송
    websocketService.enterRoom(roomId);

    // 입장 시 읽음 처리
    websocketService.markAsRead(roomId);

    // 낙관적 업데이트: 로컬 상태 즉시 갱신
    if (selectedRoom.unreadCount && selectedRoom.unreadCount > 0) {
      const currentTotal = useChatStore.getState().totalUnreadCount;
      setTotalUnreadCount(Math.max(0, currentTotal - selectedRoom.unreadCount));

      queryClient.setQueryData(['chatRooms'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((room: any) =>
          room.roomId === roomId ? { ...room, unreadCount: 0 } : room
        );
      });
    }

    // cleanup 함수
    return () => {
      websocketService.unsubscribeFromRoom(roomId);

      setTimeout(() => {
        setActiveRoomId(null);
        queryClient.invalidateQueries({ queryKey: ['totalUnreadCount'] });
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      }, 200);
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
    setShowRoomList(false); // 모바일: 대화 화면으로 전환
    // 메시지는 useEffect에서 자동으로 로드되므로 초기화하지 않음
  };

  // 거래 완료
  const handleCompleteSale = async () => {
    if (!selectedRoom) return;

    if (!confirm(`${selectedRoom.buyer.name}님과의 거래를 완료하시겠습니까?`)) {
      return;
    }

    try {
      const response = await completeSale(selectedRoom.postId, selectedRoom.buyerId);
      if (response.success) {
        // 최신 게시글 상태 조회
        const postResponse = await getPostById(selectedRoom.postId);
        setPostStatus(postResponse.post.status);
        alert('거래가 완료되었습니다!');
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      } else {
        alert(response.message || '거래 완료에 실패했습니다.');
      }
    } catch (error) {
      console.error('거래 완료 실패:', error);
      alert('거래 완료 중 오류가 발생했습니다.');
    }
  };

  // 뒤로가기 (모바일)
  const handleBackToList = () => {
    setShowRoomList(true); // 목록으로 돌아가기
  };

  // 검색 필터 (판매자 기준)
  const filteredRooms = chatRooms.filter((room) => {
    if (!searchQuery) return true; // 검색어가 없으면 모두 표시
    const seller = room.seller;
    const searchLower = searchQuery.toLowerCase();
    return (
      seller.name.toLowerCase().includes(searchLower) ||
      seller.studentId.includes(searchLower) ||
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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header />

      {/* 채팅 메인 영역 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0 h-full bg-white border-t border-gray-200">
          {/* 왼쪽: 채팅 목록 (데스크탑 항상 표시, 모바일 조건부) */}
          <aside className={`${showRoomList ? 'flex' : 'hidden'} lg:flex border-r border-gray-200 flex-col h-full overflow-hidden`}>
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">메시지</h1>
                <span className={`text-xs px-2 py-1 rounded-full ${connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {connected ? '연결됨' : '끊김'}
                </span>
              </div>
            </div>

            {/* 채팅방 목록 */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
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
                  // 상대방 정보 표시 (내 studentId와 다른 사람)
                  const otherUser = room.buyer.studentId === user?.studentId ? room.seller : room.buyer;
                  const postImageUrl = room.postImage
                    ? (room.postImage.startsWith('http') ? room.postImage : `${IMAGE_BASE_URL}${room.postImage}`)
                    : null;

                  return (
                    <button
                      key={room.roomId}
                      onClick={() => handleSelectRoom(room)}
                      className={`relative w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
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
                          <img
                            src={iconLogo}
                            alt="로고"
                            className="w-full h-full object-contain p-2"
                          />
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

                      {/* 읽지 않은 메시지 수 표시 */}
                      {room.unreadCount > 0 && (
                        <Badge count={room.unreadCount} className="absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* 오른쪽: 채팅 화면 (데스크탑 항상 표시, 모바일 조건부) */}
          <main className={`${!showRoomList ? 'flex' : 'hidden'} lg:flex flex-col h-full overflow-hidden`}>
            {selectedRoom ? (
              <>
                {/* 채팅 헤더 */}
                <header className="p-4 border-b border-gray-200 flex items-center justify-between">
                  {/* 모바일: 뒤로가기 버튼 */}
                  <button
                    onClick={handleBackToList}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {selectedRoom.postImage ? (
                        <img
                          src={selectedRoom.postImage.startsWith('http') ? selectedRoom.postImage : `${IMAGE_BASE_URL}${selectedRoom.postImage}`}
                          alt={selectedRoom.postTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={iconLogo}
                          alt="로고"
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {selectedRoom.buyer.studentId === user?.studentId ? selectedRoom.seller.name : selectedRoom.buyer.name}
                        ({selectedRoom.buyer.studentId === user?.studentId ? selectedRoom.seller.studentId : selectedRoom.buyer.studentId})
                      </p>
                      <p className="text-xs text-gray-600 truncate">{selectedRoom.postTitle}</p>
                    </div>
                  </div>
                  {user?.studentId === selectedRoom.sellerId && (
                    <button
                      onClick={handleCompleteSale}
                      disabled={isLoadingPostStatus || postStatus === '판매완료'}
                      className={`px-2 py-2 w-[100px] rounded-lg text-sm font-medium transition-colors ${
                        isLoadingPostStatus || postStatus === '판매완료'
                          ? 'bg-gray-200 text-gray-400 cursor-default'
                          : 'bg-primary text-white hover:bg-primary-600'
                      }`}
                    >
                      {isLoadingPostStatus
                        ? '불러오는 중..'
                        : postStatus === '판매완료'
                        ? '거래완료'
                        : '거래완료하기'}
                    </button>
                  )}
                </header>

                {/* 메시지 영역 */}
                <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-4">
                  {isLoadingMessages ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      메시지를 불러오는 중...
                    </div>
                  ) : messageError ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-500">
                      <p>{messageError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                      >
                        새로고침
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      메시지가 없습니다. 첫 메시지를 보내보세요!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {messages
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
                        })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* 입력 영역 */}
                <footer className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors" disabled>
                      <img src={iconPicture} alt="이미지" className="w-5 h-5 opacity-50" />
                    </button>
                    <input
                      type="text"
                      placeholder="메시지 입력..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={!connected}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!connected || !messageInput.trim()}
                      className="px-5 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};
