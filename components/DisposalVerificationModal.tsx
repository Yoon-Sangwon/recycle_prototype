import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Camera, X, RotateCcw, CheckCircle, MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DisposalVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerificationComplete: (imageUri: string, location: string) => void;
  currentLocation: string;
}

export default function DisposalVerificationModal({
  visible,
  onClose,
  onVerificationComplete,
  currentLocation,
}: DisposalVerificationModalProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  const handleOpenCamera = () => {
    const mockImageUri = 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg';
    setCapturedImage(mockImageUri);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setCapturedImage(null);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);
          setShowCamera(false);
        }
      } catch (error) {
        console.error('사진 촬영 실패:', error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleConfirmVerification = () => {
    if (capturedImage) {
      onVerificationComplete(capturedImage, currentLocation);
      setCapturedImage(null);
    }
  };

  const handleModalClose = () => {
    setCapturedImage(null);
    setShowCamera(false);
    onClose();
  };

  if (!visible) return null;

  if (showCamera) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
                <X size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>배출 인증 사진 촬영</Text>
            </View>

            <View style={styles.cameraControls}>
              <View style={styles.controlSpacer} />
              <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>배출 인증하기</Text>
            <TouchableOpacity onPress={handleModalClose}>
              <X size={24} color="#212121" />
            </TouchableOpacity>
          </View>

          {capturedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />

              <View style={styles.locationInfo}>
                <MapPin size={20} color="#4CAF50" />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>배출 위치</Text>
                  <Text style={styles.locationValue}>{currentLocation}</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.retakeButton]}
                  onPress={handleOpenCamera}
                >
                  <Camera size={20} color="#757575" />
                  <Text style={styles.retakeButtonText}>다시 촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirmVerification}
                >
                  <CheckCircle size={20} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>인증 완료</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.instructionContainer}>
              <View style={styles.instructionIcon}>
                <Camera size={48} color="#4CAF50" />
              </View>
              <Text style={styles.instructionTitle}>배출 인증이란?</Text>
              <Text style={styles.instructionText}>
                쓰레기를 올바르게 분리배출한 모습을 사진으로 촬영하여 인증해주세요.
              </Text>

              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>📸 촬영 팁</Text>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>배출한 쓰레기가 잘 보이도록 촬영해주세요</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>배출 장소가 함께 나오면 좋습니다</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>밝은 곳에서 촬영하면 인증이 쉬워요</Text>
                </View>
              </View>

              <View style={styles.locationInfo}>
                <MapPin size={20} color="#4CAF50" />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>현재 위치</Text>
                  <Text style={styles.locationValue}>{currentLocation}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.startButton} onPress={handleOpenCamera}>
                <Camera size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>사진 촬영하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
  },
  instructionContainer: {
    padding: 24,
  },
  instructionIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 22,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#212121',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
    color: '#4CAF50',
    marginRight: 8,
    width: 16,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'NotoSansKR-Regular',
    color: '#616161',
    flex: 1,
    lineHeight: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: 'NotoSansKR-Regular',
    color: '#2E7D32',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#1B5E20',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  closeButton: {
    marginRight: 12,
  },
  cameraTitle: {
    fontSize: 18,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
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
  controlSpacer: {
    width: 48,
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
  previewContainer: {
    padding: 24,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#757575',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
});
