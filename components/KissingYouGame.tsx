
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Timer, Crown, ArrowLeft } from 'lucide-react';

interface KissingYouGameProps {
  user: any;
  room: any;
  players: any[];
  onBack: () => void;
  onGameEnd: (results: any[]) => void;
}

const KissingYouGame = ({ user, room, players, onBack, onGameEnd }: KissingYouGameProps) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'countdown' | 'recording' | 'judging' | 'result'>('waiting');
  const [countdown, setCountdown] = useState(5);
  const [recordingTime, setRecordingTime] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('사랑');
  const [keywordType, setKeywordType] = useState<'가수' | '제목'>('제목');
  const [scores, setScores] = useState<{[key: string]: number}>({});
  const [roundResult, setRoundResult] = useState<{success: boolean, score?: number, message: string} | null>(null);

  // 키워드 목록
  const keywords = [
    { word: '사랑', type: '제목' as const },
    { word: 'BTS', type: '가수' as const },
    { word: '밤', type: '제목' as const },
    { word: '아이유', type: '가수' as const },
    { word: '꽃', type: '제목' as const },
    { word: '뉴진스', type: '가수' as const },
    { word: '눈', type: '제목' as const },
    { word: '블랙핑크', type: '가수' as const }
  ];

  // 플레이어별 점수 초기화
  useEffect(() => {
    const initialScores: {[key: string]: number} = {};
    players.forEach(player => {
      initialScores[player.id] = 0;
    });
    setScores(initialScores);
  }, [players]);

  // 게임 시작 시 첫 번째 키워드 설정
  useEffect(() => {
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    setCurrentKeyword(randomKeyword.word);
    setKeywordType(randomKeyword.type);
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    if (gamePhase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'countdown' && countdown === 0) {
      setGamePhase('recording');
      setIsRecording(true);
      setRecordingTime(10);
    }
  }, [gamePhase, countdown]);

  // 녹음 타이머
  useEffect(() => {
    if (gamePhase === 'recording' && recordingTime > 0) {
      const timer = setTimeout(() => setRecordingTime(recordingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'recording' && recordingTime === 0) {
      setIsRecording(false);
      setGamePhase('judging');
      // 2초 후 결과 표시
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% 성공률로 시뮬레이션
        const score = success ? Math.floor(Math.random() * 50) + 50 : -10;
        
        if (success) {
          setScores(prev => ({
            ...prev,
            [players[currentPlayerIndex].id]: prev[players[currentPlayerIndex].id] + score
          }));
          setRoundResult({
            success: true,
            score,
            message: `정답! ${score}점 획득!`
          });
        } else {
          setScores(prev => ({
            ...prev,
            [players[currentPlayerIndex].id]: prev[players[currentPlayerIndex].id] - 10
          }));
          setRoundResult({
            success: false,
            message: "아쉬워요! 조건에 맞지 않는 노래입니다. -10점"
          });
        }
        
        setGamePhase('result');
      }, 2000);
    }
  }, [gamePhase, recordingTime, currentPlayerIndex, players]);

  const handleNextRound = () => {
    if (currentRound >= totalRounds) {
      // 게임 종료
      const results = players.map(player => ({
        ...player,
        score: scores[player.id] || 0
      })).sort((a, b) => b.score - a.score);
      onGameEnd(results);
      return;
    }

    // 다음 라운드 준비
    const nextPlayerIndex = roundResult?.success 
      ? (currentPlayerIndex + 1) % players.length 
      : currentPlayerIndex;
    
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentRound(currentRound + 1);
    setGamePhase('waiting');
    setCountdown(5);
    setRoundResult(null);
    
    // 새로운 키워드 설정
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    setCurrentKeyword(randomKeyword.word);
    setKeywordType(randomKeyword.type);
  };

  const startCountdown = () => {
    setGamePhase('countdown');
    setCountdown(5);
  };

  const currentPlayer = players[currentPlayerIndex];
  const isCurrentUser = currentPlayer?.id === user.id;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-cyan-400">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4 bg-white/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            게임 나가기
          </Button>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🎤 키싱유 게임
                </CardTitle>
                <div className="text-right">
                  <div className="text-lg font-semibold">라운드 {currentRound}/{totalRounds}</div>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">현재 키워드: {keywordType} "{currentKeyword}"</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 게임 진행 영역 */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm h-96 border-0">
              <CardContent className="p-8 h-full flex flex-col justify-center items-center">
                {gamePhase === 'waiting' && (
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Avatar className="w-16 h-16 ring-4 ring-pink-500">
                        <AvatarImage src={currentPlayer?.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">{currentPlayer?.nickname[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{currentPlayer?.nickname}님의 차례</h3>
                        <p className="text-gray-600">{keywordType} "{currentKeyword}"가 들어간 노래를 불러주세요!</p>
                      </div>
                    </div>
                    {isCurrentUser && (
                      <Button 
                        size="lg" 
                        onClick={startCountdown}
                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                      >
                        <Mic className="w-6 h-6 mr-2" />
                        노래 부르기 시작
                      </Button>
                    )}
                    {!isCurrentUser && (
                      <div className="text-gray-500">
                        {currentPlayer?.nickname}님이 노래를 부를 준비를 하고 있습니다...
                      </div>
                    )}
                  </div>
                )}

                {gamePhase === 'countdown' && (
                  <div className="text-center space-y-6">
                    <div className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                      {countdown}
                    </div>
                    <p className="text-xl text-gray-600">잠시 후 녹음이 시작됩니다</p>
                    <div className="flex items-center justify-center gap-2">
                      <Timer className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-600 font-semibold">준비하세요!</span>
                    </div>
                  </div>
                )}

                {gamePhase === 'recording' && (
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center animate-pulse">
                        <Mic className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-red-500 text-white">녹음 중</Badge>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {recordingTime}초 남음
                    </div>
                    <Progress value={(10 - recordingTime) * 10} className="w-64 mx-auto" />
                    <p className="text-lg text-gray-600">
                      키워드 "{currentKeyword}"가 들어간 노래를 불러주세요!
                    </p>
                  </div>
                )}

                {gamePhase === 'judging' && (
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center animate-spin">
                      <div className="text-4xl">🤖</div>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">채점 중...</h3>
                    <p className="text-gray-600">AI가 노래를 분석하고 있습니다</p>
                  </div>
                )}

                {gamePhase === 'result' && roundResult && (
                  <div className="text-center space-y-6">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                      roundResult.success ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}>
                      <div className="text-6xl">
                        {roundResult.success ? '✅' : '❌'}
                      </div>
                    </div>
                    <h3 className={`text-2xl font-bold ${
                      roundResult.success ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
                    }`}>
                      {roundResult.message}
                    </h3>
                    <Button 
                      size="lg" 
                      onClick={handleNextRound}
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
                    >
                      {currentRound >= totalRounds ? '게임 종료' : '다음 라운드'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 플레이어 점수판 */}
          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">🏆 점수판</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        index === currentPlayerIndex
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 ring-2 ring-purple-200'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">{player.nickname[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{player.nickname}</span>
                              {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                              {index === currentPlayerIndex && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs">현재 차례</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {scores[player.id] || 0}점
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 게임 규칙 */}
            <Card className="bg-white/90 backdrop-blur-sm mt-4 border-0">
              <CardHeader>
                <CardTitle className="text-lg">📋 게임 규칙</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• 주어진 키워드가 들어간 노래를 불러주세요</p>
                  <p>• 10초간 녹음되며, AI가 채점합니다</p>
                  <p>• 성공 시 점수 획득, 실패 시 -10점</p>
                  <p>• 성공하면 다음 사람, 실패하면 다시 도전</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KissingYouGame;
