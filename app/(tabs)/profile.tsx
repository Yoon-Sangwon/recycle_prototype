import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { User, Settings, Bell, Shield, Circle as HelpCircle, Info, ChevronRight, Award, TrendingUp, Star, Target, Zap } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function ProfileTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    disposalCount: 0,
    correctDisposalCount: 0,
    streakDays: 0,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    setUserStats({
      totalPoints: 1250,
      level: 5,
      disposalCount: 156,
      correctDisposalCount: 147,
      streakDays: 12,
    });
  };

  const accuracyRate = userStats.disposalCount > 0
    ? Math.round((userStats.correctDisposalCount / userStats.disposalCount) * 100)
    : 0;

  const statsData = [
    { icon: <TrendingUp size={20} color="#4CAF50" />, label: '총 분석 횟수', value: `${userStats.disposalCount}회` },
    { icon: <Award size={20} color="#FF9800" />, label: '정확도', value: `${accuracyRate}%` },
    { icon: <Target size={20} color="#2196F3" />, label: '연속 일수', value: `${userStats.streakDays}일` }
  ];

  const menuItems = [
    {
      icon: <Bell size={20} color="#757575" />,
      title: '알림 설정',
      subtitle: '분리수거 일정 및 팁 알림',
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
          thumbColor={notificationsEnabled ? '#4CAF50' : '#FFFFFF'}
        />
      )
    },
    {
      icon: <Shield size={20} color="#757575" />,
      title: '위치 서비스',
      subtitle: '내 지역 정보 제공을 위한 위치 사용',
      rightElement: (
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
          thumbColor={locationEnabled ? '#4CAF50' : '#FFFFFF'}
        />
      )
    },
    {
      icon: <HelpCircle size={20} color="#757575" />,
      title: '도움말',
      subtitle: '앱 사용법 및 FAQ',
      rightElement: <ChevronRight size={20} color="#BDBDBD" />
    },
    {
      icon: <Info size={20} color="#757575" />,
      title: '앱 정보',
      subtitle: '버전 1.0.0',
      rightElement: <ChevronRight size={20} color="#BDBDBD" />
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>환경지킴이</Text>
          <Text style={styles.userEmail}>eco.guardian@example.com</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.levelText}>Level {userStats.level}</Text>
            </View>
            <View style={styles.pointsBadge}>
              <Zap size={16} color="#FF9800" />
              <Text style={styles.pointsText}>{userStats.totalPoints} 포인트</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>내 활동 통계</Text>
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>{stat.icon}</View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>최근 성과</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Award size={24} color="#FF9800" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>분리수거 마스터</Text>
              <Text style={styles.achievementDescription}>
                100회 이상 정확한 분석을 완료했어요!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuIcon}>{item.icon}</View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.menuRight}>{item.rightElement}</View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>분리수거 도우미 v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            지구를 위한 작은 실천, 함께해주셔서 감사합니다 💚
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    textAlign: 'center',
  },
  achievementsContainer: {
    marginBottom: 32,
  },
  achievementCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#E65100',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#BF360C',
    lineHeight: 18,
  },
  menuContainer: {
    marginBottom: 32,
  },
  menuList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Medium',
    color: '#212121',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
  },
  menuRight: {
    marginLeft: 8,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#9E9E9E',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#BDBDBD',
    textAlign: 'center',
  }
});