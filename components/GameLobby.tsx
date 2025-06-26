
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, RefreshCw, Users, LogOut, Settings, Zap, Play } from 'lucide-react';

interface GameLobbyProps {
  user: any;
  onCreateRoom: () => void;
  onJoinRoom: (room: any) => void;
  onLogout: () => void;
}

const GameLobby = ({ user, onCreateRoom, onJoinRoom, onLogout }: GameLobbyProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: '관리자', message: '뮤직 게임 로비에 오신 것을 환영합니다!', time: '10:30' },
    { id: 2, user: '음악왕', message: '누구 게임 하실 분~', time: '10:32' }
  ]);

  // 더미 게임방 데이터
  const [rooms] = useState([
    {
      id: 1,
      name: '신나는 K-POP 퀴즈',
      gameMode: '키싱유',
      description: '2010년대 K-POP 노래만!',
      currentPlayers: 3,
      maxPlayers: 6,
      isPrivate: false
    },
    {
      id: 2,
      name: '올드팝 맞추기',
      gameMode: '랜덤 노래 맞추기',
      description: '80-90년대 팝송 전문',
      currentPlayers: 2,
      maxPlayers: 4,
      isPrivate: false
    },
    {
      id: 3,
      name: '발라드 천국',
      gameMode: '평어 노래 맞추기',
      description: '눈물나는 발라드만 모았어요',
      currentPlayers: 1,
      maxPlayers: 8,
      isPrivate: true
    }
  ]);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.gameMode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: user.nickname,
        message: chatMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const handleQuickMatch = () => {
    // TODO: 빠른 대전 로직 구현
    console.log('Quick match started');
  };

  const getGameModeColor = (mode: string) => {
    switch (mode) {
      case '키싱유': return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case '랜덤 노래 맞추기': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case '평어 노래 맞추기': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case '놀라운 토요일': return 'bg-gradient-to-r from-orange-500 to-amber-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
        
        {/* 메인 게임방 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 빠른 대전 카드 */}
          <Card className="bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-orange-500/90 backdrop-blur-sm border-0 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-300" />
                ⚡ 빠른 대전
              </CardTitle>
              <CardDescription className="text-purple-100">
                즉시 매칭으로 빠르게 게임을 시작하세요!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                onClick={handleQuickMatch}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
              >
                <Play className="w-6 h-6 mr-2" />
                빠른 대전 시작
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🎵 게임 로비
                </CardTitle>
                <Button onClick={onCreateRoom} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600">
                  방 만들기
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="방 제목이나 게임 모드로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredRooms.map((room) => (
                    <Card key={room.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-pink-500"
                          onClick={() => onJoinRoom(room)}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{room.name}</h3>
                          <div className="flex items-center gap-2">
                            {room.isPrivate && <Badge variant="secondary">🔒</Badge>}
                            <Badge className={getGameModeColor(room.gameMode)}>
                              {room.gameMode}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            {room.currentPlayers}/{room.maxPlayers}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 로비 채팅 */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">💬 로비 채팅</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 text-sm">
                      <span className="font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{msg.user}:</span>
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
                <Button onClick={handleSendMessage} className="bg-gradient-to-r from-pink-500 to-purple-500">전송</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측 사이드바 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 유저 정보 */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">👤 내 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16 ring-4 ring-gradient-to-r ring-pink-500">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">{user.nickname[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user.nickname}</h3>
                  <p className="text-gray-600 text-sm">레벨 1 • 새내기 🎵</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </Button>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 게임 모드 안내 */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">🎮 게임 모드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-500">
                  <h4 className="font-semibold text-pink-700">🎤 키싱유</h4>
                  <p className="text-sm text-pink-600">키워드에 맞는 노래를 불러보세요</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700">🎵 랜덤 노래 맞추기</h4>
                  <p className="text-sm text-blue-600">노래를 듣고 제목을 맞춰보세요</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700">📖 평어 노래 맞추기</h4>
                  <p className="text-sm text-green-600">가사를 듣고 노래를 맞춰보세요</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-700">🎯 놀라운 토요일</h4>
                  <p className="text-sm text-orange-600">빈칸의 가사를 맞춰보세요</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
