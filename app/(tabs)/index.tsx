import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, MapPin, Recycle, Leaf, Award, TrendingUp, Sparkles, ChartBar as BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeTab() {
  const router = useRouter();

  const quickActions = [
    {
      icon: <Camera size={32} color="#4CAF50" />,
      title: 'AI 분석',
      subtitle: '사진으로 분석하기',
      gradient: ['#4CAF50', '#66BB6A'],
      shadowColor: '#4CAF50',
      onPress: () => router.push('/camera')
    },
    {
      icon: <MapPin size={32} color="#2196F3" />,
      title: '내 지역 정보',
      subtitle: '배출 방법 확인',
      gradient: ['#2196F3', '#42A5F5'],
      shadowColor: '#2196F3',
      onPress: () => router.push('/location')
    }
  ];

  const stats = [
    { 
      icon: <Recycle size={24} color="#4CAF50" />, 
      label: '분석 횟수', 
      value: '156',
      unit: '회',
      trend: '+12%'
    },
    { 
      icon: <Leaf size={24} color="#4CAF50" />, 
      label: '환경 기여도', 
      value: '85',
      unit: '%',
      trend: '+5%'
    },
    { 
      icon: <Award size={24} color="#FF9800" />, 
      label: '이번 달 순위', 
      value: '12',
      unit: '위',
      trend: '↑3'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Sparkles size={20} color="#FFFFFF" style={styles.sparkleIcon} />
            <Text style={styles.welcomeText}>안녕하세요! 환경지킴이님</Text>
          </View>
          <Text style={styles.titleText}>스마트 분리수거</Text>
          <Text style={styles.subtitleText}>AI와 함께하는 지속가능한 환경보호</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard} onPress={action.onPress}>
                <LinearGradient
                  colors={action.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.actionGradient, { shadowColor: action.shadowColor }]}>
                  <View style={styles.actionIcon}>{action.icon}</View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 활동</Text>
            <BarChart3 size={20} color="#4CAF50" />
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={styles.statIcon}>{stat.icon}</View>
                  <Text style={styles.statTrend}>{stat.trend}</Text>
                </View>
                <View style={styles.statValueContainer}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statUnit}>{stat.unit}</Text>
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘의 에코 팁</Text>
            <Text style={styles.sectionSubtitle}>매일 새로운 환경보호 지식</Text>
          </View>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={['#E8F5E8', '#F1F8E9']}
              style={styles.tipGradient}>
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <TrendingUp size={20} color="#4CAF50" />
                </View>
                <Text style={styles.tipBadge}>HOT TIP</Text>
              </View>
              <Text style={styles.tipTitle}>플라스틱 용기 세척법</Text>
              <Text style={styles.tipText}>
                음식물이 묻은 플라스틱 용기는 깨끗이 세척한 후 배출해주세요. 
                라벨 제거도 잊지 마세요!
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.achievementContainer}>
          <View style={styles.achievementCard}>
            <LinearGradient
              colors={['#FFF3E0', '#FFF8E1']}
              style={styles.achievementGradient}>
              <Award size={24} color="#FF9800" />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>이번 주 성과</Text>
                <Text style={styles.achievementText}>분리수거 마스터 달성! 🎉</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sparkleIcon: {
    marginRight: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
    opacity: 0.95,
  },
  titleText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Regular',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#666666',
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    marginBottom: 12,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statIcon: {
    padding: 4,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  statTrend: {
    fontSize: 11,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'NotoSansKR-Bold',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  statUnit: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: '#666666',
    marginLeft: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#888888',
  },
  tipsContainer: {
    marginBottom: 32,
  },
  tipCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tipGradient: {
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipIconContainer: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tipBadge: {
    fontSize: 9,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#388E3C',
    lineHeight: 20,
  },
  achievementContainer: {
    marginBottom: 32,
  },
  achievementCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  achievementContent: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontFamily: 'NotoSansKR-Bold',
    color: '#E65100',
    marginBottom: 2,
  },
  achievementText: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Regular',
    color: '#BF360C',
  },
});