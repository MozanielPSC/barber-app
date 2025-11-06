import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { DrawerContent } from './DrawerContent';

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
  isOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }
  return context;
};

interface DrawerProviderProps {
  children: ReactNode;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [overlayAnim] = useState(new Animated.Value(0));

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    // Fecha o overlay imediatamente
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    // Anima o drawer para fora
    Animated.spring(slideAnim, {
      toValue: -DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start(() => {
      setIsOpen(false);
    });
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      {children}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalContainer} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
              },
            ]}
            pointerEvents="auto"
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeDrawer}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
            pointerEvents="auto"
          >
            <DrawerContent />
          </Animated.View>
        </View>
      </Modal>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
    backgroundColor: 'transparent', // Deixa o DrawerContent controlar a cor
  },
});

