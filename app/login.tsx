import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Recycle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    
    // 카카오 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleNaverLogin = async () => {
    setIsLoading(true);
    
    // 네이버 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.subtitle}>AI와 함께하는 스마트한</Text>
          <Text style={styles.title}>분리수거 도우미</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.iconContainer}>
            <Recycle size={80} color="#4CAF50" />
          </View>
          <View style={styles.decorativeLine} />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.loginPrompt}>SNS 계정으로 간편 가입하기</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.loginButton, styles.kakaoButton]}
              onPress={handleKakaoLogin}
              disabled={isLoading}
            >
              <View style={styles.kakaoIcon}>
                <Text style={styles.kakaoIconText}>K</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, styles.naverButton]}
              onPress={handleNaverLogin}
              disabled={isLoading}
            >
              <Text style={styles.naverText}>N</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
  },
  headerSection: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666666',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 32,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
    letterSpacing: -0.5,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#F8FFF8',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    opacity: 0.6,
  },
  bottomSection: {
    alignItems: 'center',
  },
  loginPrompt: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999999',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  loginButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoIconText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverText: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
});