import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Trophy, Star, Award, TrendingUp, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface GamificationModalProps {
  visible: boolean;
  onClose: () => void;
  pointsEarned: number;
  wasteType: string;
  isCorrect: boolean;
  newLevel?: number;
  achievement?: {
    title: string;
    description: string;
  };
}

export default function GamificationModal({
  visible,
  onClose,
  pointsEarned,
  wasteType,
  isCorrect,
  newLevel,
  achievement,
}: GamificationModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;
  const starAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(pointsAnim, {
          toValue: pointsEarned,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.stagger(100, starAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          })
        )),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      pointsAnim.setValue(0);
      starAnims.forEach(anim => anim.setValue(0));
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, isCorrect ? styles.successCircle : styles.warningCircle]}>
              {isCorrect ? (
                <Trophy size={48} color="#FFFFFF" />
              ) : (
                <Target size={48} color="#FFFFFF" />
              )}
            </View>
          </View>

          <Text style={styles.title}>
            {isCorrect ? '완벽한 분리배출!' : '배출 완료!'}
          </Text>

          <Text style={styles.subtitle}>
            {wasteType}을(를) 올바르게 처리했어요
          </Text>

          <View style={styles.pointsContainer}>
            <Star size={32} color="#FFD700" fill="#FFD700" />
            <Text style={styles.points}>+{pointsEarned}</Text>
            <Text style={styles.pointsLabel}>포인트</Text>
          </View>

          <View style={styles.starsRow}>
            {starAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: anim,
                  transform: [
                    {
                      scale: anim,
                    },
                    {
                      rotate: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
              >
                <Star size={24} color="#FFD700" fill="#FFD700" />
              </Animated.View>
            ))}
          </View>

          {newLevel && (
            <View style={styles.levelUpContainer}>
              <TrendingUp size={24} color="#4CAF50" />
              <Text style={styles.levelUpText}>레벨 {newLevel} 달성!</Text>
            </View>
          )}

          {achievement && (
            <View style={styles.achievementContainer}>
              <Award size={20} color="#FF9800" />
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>+1</Text>
              <Text style={styles.statLabel}>배출 횟수</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{isCorrect ? '+1' : '0'}</Text>
              <Text style={styles.statLabel}>정확도</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>확인</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  successCircle: {
    backgroundColor: '#4CAF50',
  },
  warningCircle: {
    backgroundColor: '#FF9800',
  },
  title: {
    fontSize: 28,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    marginBottom: 24,
    textAlign: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    gap: 8,
  },
  points: {
    fontSize: 36,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FF9800',
  },
  pointsLabel: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Medium',
    color: '#FF9800',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  levelUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  levelUpText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    width: '100%',
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FF9800',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#E65100',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
});
