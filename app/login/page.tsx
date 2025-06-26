'use client';

import LoginPage from '@/components/LoginPage';

export default function LoginPageWrapper() {
  // 로그인 후 라우팅 처리를 여기에 추가해도 됨
  const handleLogin = (userData: any) => {
    console.log('로그인 성공:', userData);
    // 예: 라우터로 lobby 이동 등
  };

  return <LoginPage onLogin={handleLogin} />;
}
