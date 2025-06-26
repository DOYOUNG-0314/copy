
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Crown, Users, Play, CheckCircle, Circle } from 'lucide-react';
import KissingYouGame from './KissingYouGame';

interface GameRoomProps {
  user: any;
  room: any;
  onBack: () => void;
}

const GameRoom = ({ user, room, onBack }: GameRoomProps) => {
  const [isReady, setIsReady] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: '시스템', message: `${user.nickname}님이 입장하셨습니다.`, time: '10:35', isSystem: true }
  ]);

  // 더미 플레이어 데이터
  const [players] = useState([
    {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      isHost: true,
      isReady: false
    },
    {
      id: '2',
      nickname: '음악왕',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musicking',
      isHost: false,
      isReady: true
    },
    {
      id: '3',
      nickname: '노래좋아',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=songlover',
      isHost: false,
      isReady: true
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: user.nickname,
        message: chatMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isSystem: false
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const handleReadyToggle = () => {
    setIsReady(!isReady);
  };

  const handleStartGame = () => {
    if (room.gameMode === '키싱유') {
      setGameStarted(true);
    }
  };

  const handleGameEnd = (results: any[]) => {
    console.log('Game results:', results);
    setGameStarted(false);
    // TODO: 결과 화면 표시
  };

  const allPlayersReady = players.filter(p => !p.isHost).every(p => p.isReady);
  const currentUser = players.find(p => p.id === user.id);
  const isHost = currentUser?.isHost;

  const getGameModeColor = (mode: string) => {
    switch (mode) {
      case '키싱유': return 'bg-purple-500';
      case '랜덤 노래 맞추기': return 'bg-blue-500';
      case '평어 노래 맞추기': return 'bg-green-500';
      case '놀라운 토요일': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // 게임이 시작된 경우 게임 화면 표시
  if (gameStarted && room.gameMode === '키싱유') {
    return (
      <KissingYouGame 
        user={user}
        room={room}
        players={players}
        onBack={() => setGameStarted(false)}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            로비로 돌아가기
          </Button>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🎮 {room.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge className={getGameModeColor(room.gameMode)}>
                      {room.gameMode}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {players.length}/{room.maxPlayers}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  {isHost ? (
                    <Button
                      size="lg"
                      disabled={!allPlayersReady}
                      onClick={handleStartGame}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      게임 시작
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant={isReady ? "secondary" : "default"}
                      onClick={handleReadyToggle}
                      className={isReady ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}
                    >
                      {isReady ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          준비 완료
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 mr-2" />
                          준비하기
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 플레이어 목록 */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">👥 참가자 ({players.length}/{room.maxPlayers})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        player.isReady || player.isHost 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{player.nickname}</h4>
                            {player.isHost && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {player.isHost ? (
                              <Badge variant="outline" className="text-xs">방장</Badge>
                            ) : player.isReady ? (
                              <Badge className="text-xs bg-green-500">준비완료</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">대기중</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 빈 슬롯 */}
                  {Array.from({ length: room.maxPlayers - players.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-sm">빈 자리</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 채팅 */}
            <Card className="bg-white/90 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-xl">💬 채팅</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 text-sm ${
                          msg.isSystem ? 'text-gray-500 italic' : ''
                        }`}
                      >
                        <span className={`font-semibold ${
                          msg.isSystem ? 'text-gray-500' : 'text-purple-600'
                        }`}>
                          {msg.user}:
                        </span>
                        <span>{msg.message}</span>
                        <span className="text-gray-400 text-xs ml-auto">{msg.time}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>전송</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 방 정보 */}
          <div>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">📋 방 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">방 이름</h4>
                  <p className="text-gray-900">{room.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">게임 모드</h4>
                  <Badge className={getGameModeColor(room.gameMode)}>
                    {room.gameMode}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">설명</h4>
                  <p className="text-gray-600 text-sm">{room.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">참가자</h4>
                  <p className="text-gray-900">{players.length}/{room.maxPlayers}명</p>
                </div>
                
                {/* 게임 모드별 규칙 */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-2">🎯 게임 규칙</h4>
                  {room.gameMode === '키싱유' && (
                    <div className="text-sm text-purple-600 space-y-1">
                      <p>• 주어진 키워드에 맞는 노래를 불러보세요</p>
                      <p>• 10초간 녹음하여 채점받습니다</p>
                      <p>• 정답 시 점수 획득, 오답 시 감점</p>
                    </div>
                  )}
                  {room.gameMode === '랜덤 노래 맞추기' && (
                    <div className="text-sm text-purple-600 space-y-1">
                      <p>• 재생되는 노래의 제목을 맞춰보세요</p>
                      <p>• 채팅으로 정답을 입력하세요</p>
                      <p>• 빠르게 맞출수록 높은 점수</p>
                    </div>
                  )}
                  {room.gameMode === '평어 노래 맞추기' && (
                    <div className="text-sm text-purple-600 space-y-1">
                      <p>• TTS로 읽어주는 가사를 들어보세요</p>
                      <p>• 해당 노래의 제목을 맞춰보세요</p>
                      <p>• 빠르게 맞출수록 높은 점수</p>
                    </div>
                  )}
                  {room.gameMode === '놀라운 토요일' && (
                    <div className="text-sm text-purple-600 space-y-1">
                      <p>• 노래를 듣고 빈칸 가사를 맞춰보세요</p>
                      <p>• 정확한 가사를 입력해야 합니다</p>
                      <p>• 정답 시 1점씩 획득</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
