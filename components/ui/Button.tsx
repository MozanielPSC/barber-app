import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <Text style={textStyleCombined}>
        {loading ? 'Carregando...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: '#3B82F6',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  
  secondary: {
    backgroundColor: '#6B7280',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  outlineText: {
    color: '#3B82F6',
  },
  
  danger: {
    backgroundColor: '#EF4444',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  smallText: {
    fontSize: 14,
  },
  
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  mediumText: {
    fontSize: 16,
  },
  
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  largeText: {
    fontSize: 18,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
