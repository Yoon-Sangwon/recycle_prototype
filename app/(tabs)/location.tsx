import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Clock, Phone, CircleAlert as AlertCircle, Calendar, Trash2, Recycle, Camera, Edit2 } from 'lucide-react-native';
import DisposalVerificationModal from '../../components/DisposalVerificationModal';
import GamificationModal from '../../components/GamificationModal';

// 웹에서는 MapView를 조건부로 import
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
}

const { width, height } = Dimensions.get('window');

export default function LocationTab() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showGamificationModal, setShowGamificationModal] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    getCurrentLocation();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      // 위치 권한이 이미 허용된 상태로 가정

      const currentLocation = await Location.getCurrentPositionAsync({});

      // 주소 변환 (실제로는 geocoding API 사용)
      const mockAddress = '서울특별시 강남구 역삼동';
      
      if (isMountedRef.current) {
        setLocation(currentLocation);
        setAddress(mockAddress);
        setLoading(false);
      }
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // 오늘의 배출 일정 (요일별)
  const getScheduleByDay = (dayIndex: number) => {
    const schedules = [
      { day: '일요일', items: '휴무', time: '-', color: '#9E9E9E', icon: <Calendar size={20} color="#9E9E9E" /> },
      { day: '월요일', items: '일반쓰레기, 음식물쓰레기', time: '21:00 ~ 24:00', color: '#FF5722', icon: <Trash2 size={20} color="#FF5722" /> },
      { day: '화요일', items: '재활용품 (플라스틱, 캔)', time: '21:00 ~ 24:00', color: '#4CAF50', icon: <Recycle size={20} color="#4CAF50" /> },
      { day: '수요일', items: '일반쓰레기, 음식물쓰레기', time: '21:00 ~ 24:00', color: '#FF5722', icon: <Trash2 size={20} color="#FF5722" /> },
      { day: '목요일', items: '재활용품 (종이, 유리)', time: '21:00 ~ 24:00', color: '#2196F3', icon: <Recycle size={20} color="#2196F3" /> },
      { day: '금요일', items: '일반쓰레기, 음식물쓰레기', time: '21:00 ~ 24:00', color: '#FF5722', icon: <Trash2 size={20} color="#FF5722" /> },
      { day: '토요일', items: '대형폐기물 (신고 후)', time: '09:00 ~ 18:00', color: '#9C27B0', icon: <AlertCircle size={20} color="#9C27B0" /> },
    ];
    return schedules[dayIndex];
  };

  const selectedSchedule = getScheduleByDay(selectedDay);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date().getDay();

  const handleVerificationComplete = (imageUri: string, location: string) => {
    setShowVerificationModal(false);

    const points = 15;
    setVerificationData({
      pointsEarned: points,
      wasteType: '배출 인증',
      isCorrect: true,
      imageUri,
      location,
    });

    setShowGamificationModal(true);
  };

  const handleGamificationClose = () => {
    setShowGamificationModal(false);
    setVerificationData(null);
  };

  // 지도에 표시할 쓰레기장 위치
  const trashLocations = [
    {
      id: 1,
      name: '역삼동 재활용품 수거함',
      type: '재활용품',
      coordinate: { latitude: 37.5006, longitude: 127.0366 },
      items: ['플라스틱', '캔', '병'],
      phone: '02-1234-5678'
    },
    {
      id: 2,
      name: '강남구 대형폐기물 센터',
      type: '대형폐기물',
      coordinate: { latitude: 37.4979, longitude: 127.0276 },
      items: ['가구', '가전제품', '매트리스'],
      phone: '02-2345-6789'
    },
    {
      id: 3,
      name: '역삼동 의류수거함',
      type: '의류',
      coordinate: { latitude: 37.5026, longitude: 127.0386 },
      items: ['의류', '신발', '가방'],
      phone: '02-3456-7890'
    },
    {
      id: 4,
      name: '역삼동 일반쓰레기장',
      type: '일반쓰레기',
      coordinate: { latitude: 37.4996, longitude: 127.0356 },
      items: ['일반쓰레기', '음식물쓰레기'],
      phone: '02-4567-8901'
    }
  ];

  const getMarkerColor = (type: string) => {
    switch (type) {
      case '재활용품': return '#4CAF50';
      case '대형폐기물': return '#9C27B0';
      case '의류': return '#FF9800';
      case '일반쓰레기': return '#FF5722';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MapPin size={48} color="#4CAF50" />
        <Text style={styles.loadingText}>위치를 확인하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <MapPin size={24} color="#FFFFFF" />
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>현재 위치</Text>
            <Text style={styles.locationAddress}>{address || '위치를 가져올 수 없습니다'}</Text>
          </View>
          <View style={styles.locationActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('위치 수정', '위치 수정 기능은 준비 중입니다.')}>
              <Edit2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton} onPress={getCurrentLocation}>
              <Navigation size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 오늘의 배출 일정 */}
        <View style={styles.todayScheduleContainer}>
          <View style={styles.daySelector}>
            {dayNames.map((dayName, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDay === index && styles.dayButtonActive,
                  today === index && styles.dayButtonToday
                ]}
                onPress={() => setSelectedDay(index)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDay === index && styles.dayButtonTextActive,
                  today === index && styles.dayButtonTextToday
                ]}>
                  {dayName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.todayScheduleCard, { borderLeftColor: selectedSchedule.color }]}>
            <View style={styles.todayScheduleHeader}>
              <View style={styles.todayScheduleIcon}>
                {selectedSchedule.icon}
              </View>
              <View style={styles.todayScheduleInfo}>
                <Text style={styles.todayScheduleDay}>{selectedSchedule.day}</Text>
                <Text style={styles.todayScheduleItems}>{selectedSchedule.items}</Text>
              </View>
              <View style={styles.todayScheduleTime}>
                <Clock size={16} color="#757575" />
                <Text style={styles.todayScheduleTimeText}>{selectedSchedule.time}</Text>
              </View>
            </View>
            {selectedSchedule.items !== '휴무' && (
              <View style={styles.todayScheduleNotice}>
                <AlertCircle size={16} color="#FF9800" />
                <Text style={styles.todayScheduleNoticeText}>
                  배출 시간을 꼭 지켜주세요!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 지도 영역 */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>근처 쓰레기 배출장소</Text>
          <View style={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.0!2d127.0366!3d37.5006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMwJzAyLjIiTiAxMjfCsDAyJzExLjgiRQ!5e0!3m2!1sko!2skr!4v1234567890123!5m2!1sko!2skr"
              style={{
                border: 0,
                width: '100%',
                height: '300px',
                borderRadius: 16,
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </View>
          
          {/* 지도 범례 */}
          <View style={styles.mapLegend}>
            <Text style={styles.mapLegendTitle}>배출장소 구분</Text>
            <View style={styles.mapLegendItems}>
              <View style={styles.mapLegendItem}>
                <View style={[styles.mapLegendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.mapLegendText}>재활용품</Text>
              </View>
              <View style={styles.mapLegendItem}>
                <View style={[styles.mapLegendColor, { backgroundColor: '#FF5722' }]} />
                <Text style={styles.mapLegendText}>일반쓰레기</Text>
              </View>
              <View style={styles.mapLegendItem}>
                <View style={[styles.mapLegendColor, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.mapLegendText}>대형폐기물</Text>
              </View>
              <View style={styles.mapLegendItem}>
                <View style={[styles.mapLegendColor, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.mapLegendText}>의류</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 상세 정보 리스트 */}
        <View style={styles.nearbyContainer}>
          <Text style={styles.sectionTitle}>상세 정보</Text>
          <View style={styles.nearbyList}>
            {trashLocations.map((place, index) => (
              <View key={index} style={styles.nearbyCard}>
                <View style={styles.nearbyHeader}>
                  <View style={styles.nearbyInfo}>
                    <Text style={styles.nearbyName}>{place.name}</Text>
                    <Text style={[styles.nearbyType, { color: getMarkerColor(place.type) }]}>
                      {place.type}
                    </Text>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(place.type) + '20' }]}>
                    <Text style={[styles.typeText, { color: getMarkerColor(place.type) }]}>
                      {place.type}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.nearbyItems}>
                  {place.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.itemTag}>
                      <Text style={styles.itemTagText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.phoneButton}>
                  <Phone size={16} color="#4CAF50" />
                  <Text style={styles.phoneText}>{place.phone}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.verificationButton}
            onPress={() => setShowVerificationModal(true)}
          >
            <Camera size={24} color="#FFFFFF" />
            <Text style={styles.verificationButtonText}>배출 인증하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeContainer}>
          <View style={styles.noticeHeader}>
            <AlertCircle size={20} color="#FF9800" />
            <Text style={styles.noticeTitle}>중요 공지</Text>
          </View>
          <Text style={styles.noticeText}>
            설날 연휴기간(2024.2.9~2.12) 쓰레기 수거가 중단됩니다. 
            연휴 전 배출일정을 확인해주세요.
          </Text>
        </View>
      </View>

      <DisposalVerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerificationComplete={handleVerificationComplete}
        currentLocation={address || '위치를 가져올 수 없습니다'}
      />

      {verificationData && (
        <GamificationModal
          visible={showGamificationModal}
          onClose={handleGamificationClose}
          pointsEarned={verificationData.pointsEarned}
          wasteType={verificationData.wasteType}
          isCorrect={verificationData.isCorrect}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    marginTop: 16,
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  locationTitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  locationAddress: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  todayScheduleContainer: {
    marginBottom: 32,
  },
  sectionHeaderWithSelector: {
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#4CAF50',
  },
  dayButtonToday: {
    backgroundColor: '#E3F2FD',
  },
  dayButtonText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: '#757575',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: 'NotoSansKR-Bold',
  },
  dayButtonTextToday: {
    color: '#1976D2',
    fontFamily: 'NotoSansKR-Bold',
  },
  todayScheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todayScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayScheduleIcon: {
    marginRight: 12,
  },
  todayScheduleInfo: {
    flex: 1,
  },
  todayScheduleDay: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  todayScheduleItems: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
  },
  todayScheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayScheduleTimeText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Medium',
    color: '#757575',
    marginLeft: 4,
  },
  todayScheduleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  todayScheduleNoticeText: {
    fontSize: 13,
    fontFamily: 'NotoSansKR-Regular',
    color: '#E65100',
    marginLeft: 8,
  },
  mapContainer: {
    marginBottom: 32,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    width: '100%',
    height: 300,
  },
  webMapPlaceholder: {
    height: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  webMapText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Medium',
    color: '#424242',
    textAlign: 'center',
    marginTop: 16,
  },
  webMapSubText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  mapLegend: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLegendTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 12,
  },
  mapLegendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  mapLegendText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#616161',
  },
  nearbyContainer: {
    marginBottom: 32,
  },
  nearbyList: {
    gap: 12,
  },
  nearbyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 2,
  },
  nearbyType: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Bold',
  },
  nearbyItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  itemTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemTagText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#616161',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#4CAF50',
    marginLeft: 6,
  },
  noticeContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#E65100',
    marginLeft: 8,
  },
  noticeText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#BF360C',
    lineHeight: 20,
  },
  verificationButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    gap: 12,
  },
  verificationButtonText: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
});