import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

interface ChipProps extends BadgeProps {
  onPress?: () => void;
  onClose?: () => void;
  closable?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  onPress,
  onClose,
  closable = false,
  style,
}) => {
  const chipStyle = [
    styles.chip,
    styles[variant],
    styles[size],
    onPress && styles.pressable,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={chipStyle} onPress={onPress} activeOpacity={0.7}>
      <Text style={textStyle}>{children}</Text>
      {closable && onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  chip: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Variants
  default: {
    backgroundColor: '#F3F4F6',
  },
  defaultText: {
    color: '#374151',
  },
  
  success: {
    backgroundColor: '#D1FAE5',
  },
  successText: {
    color: '#065F46',
  },
  
  warning: {
    backgroundColor: '#FEF3C7',
  },
  warningText: {
    color: '#92400E',
  },
  
  error: {
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    color: '#991B1B',
  },
  
  info: {
    backgroundColor: '#DBEAFE',
  },
  infoText: {
    color: '#1E40AF',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 20,
  },
  smallText: {
    fontSize: 12,
  },
  
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 24,
  },
  mediumText: {
    fontSize: 14,
  },
  
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  largeText: {
    fontSize: 16,
  },
  
  // States
  pressable: {
    // Additional styles for pressable chips
  },
  closeButton: {
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
