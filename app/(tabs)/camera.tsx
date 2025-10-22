import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, RotateCcw, Zap, CircleCheck as CheckCircle } from 'lucide-react-native';
import GamificationModal from '../../components/GamificationModal';
import { supabase } from '../../lib/supabase';

export default function CameraTab() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [gamificationData, setGamificationData] = useState<any>(null);
  const cameraRef = useRef<CameraView>(null);

  // 권한이 이미 허용된 상태로 가정

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        analyzeImage(photo.uri);
      } catch (error) {
        Alert.alert('오류', '사진 촬영에 실패했습니다.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    
    // 실제로는 AI API를 호출하지만, 데모용으로 시뮬레이션
    setTimeout(() => {
      const mockResults = [
        {
          item: '플라스틱 물병',
          category: '플라스틱류',
          instructions: [
            '뚜껑과 라벨을 제거해주세요',
            '내용물을 완전히 비우고 헹구어주세요',
            '플라스틱 전용 수거함에 배출해주세요'
          ],
          confidence: 95,
          tips: 'PET 재질 확인 후 배출하면 더 좋아요!'
        },
        {
          item: '종이 상자',
          category: '종이류',
          instructions: [
            '테이프나 스테이플러 심을 제거해주세요',
            '접어서 부피를 줄여주세요',
            '젖지 않도록 주의해주세요'
          ],
          confidence: 88,
          tips: '코팅된 종이는 일반 쓰레기로 배출해주세요'
        }
      ];
      
      setAnalysisResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  const handleDisposalComplete = async () => {
    if (!analysisResult) return;

    const pointsEarned = analysisResult.confidence >= 90 ? 20 : 10;
    const isCorrect = analysisResult.confidence >= 80;

    setGamificationData({
      pointsEarned,
      wasteType: analysisResult.item,
      isCorrect,
      newLevel: undefined,
      achievement: undefined,
    });

    setShowGamification(true);
  };

  const handleGamificationClose = () => {
    setShowGamification(false);
    resetAnalysis();
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.analysisHeader}>
          <TouchableOpacity style={styles.backButton} onPress={resetAnalysis}>
            <RotateCcw size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.analysisTitle}>AI 분석 결과</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        </View>

        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <Zap size={32} color="#4CAF50" />
            <Text style={styles.loadingTitle}>AI가 분석 중입니다...</Text>
            <Text style={styles.loadingSubtitle}>잠시만 기다려주세요</Text>
          </View>
        ) : analysisResult ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <CheckCircle size={24} color="#4CAF50" />
              <Text style={styles.resultTitle}>{analysisResult.item}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>정확도 {analysisResult.confidence}%</Text>
              </View>
            </View>

            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>분류</Text>
              <Text style={styles.categoryValue}>{analysisResult.category}</Text>
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>분리수거 방법</Text>
              {analysisResult.instructions.map((instruction: string, index: number) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 추가 팁</Text>
              <Text style={styles.tipsText}>{analysisResult.tips}</Text>
            </View>

            <TouchableOpacity style={styles.completeButton} onPress={handleDisposalComplete}>
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>배출 완료</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {gamificationData && (
          <GamificationModal
            visible={showGamification}
            onClose={handleGamificationClose}
            pointsEarned={gamificationData.pointsEarned}
            wasteType={gamificationData.wasteType}
            isCorrect={gamificationData.isCorrect}
            newLevel={gamificationData.newLevel}
            achievement={gamificationData.achievement}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraHeader}>
          <Text style={styles.cameraTitle}>분리수거 물품을 촬영해보세요</Text>
        </View>
        
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <ImageIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'NotoSansKR-Regular',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FAFAFA',
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  galleryButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 28,
  },
  flipButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  analysisTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    marginTop: 4,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginLeft: 8,
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    marginRight: 12,
  },
  categoryValue: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Bold',
    color: '#4CAF50',
    marginRight: 8,
    marginTop: 2,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#212121',
    flex: 1,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#E65100',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#BF360C',
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
});