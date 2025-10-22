import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // 실제로는 인증 상태를 확인하지만, 데모용으로 로그인 화면으로 리다이렉트
    router.replace('/login');
  }, []);

  return null;
}