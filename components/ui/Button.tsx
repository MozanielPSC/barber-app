import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[];
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
  gradientColors,
}) => {
  const buttonStyle = [
    styles.button,
    variant !== 'gradient' && styles[variant],
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

  const isGradient = variant === 'gradient' || (variant === 'primary' && !disabled);

  const gradientColorsFinal = disabled
    ? ['#9CA3AF', '#6B7280']
    : gradientColors || ['#9333EA', '#2563EB'];

  if (isGradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.buttonContainer, style]}
      >
        <LinearGradient
          colors={gradientColorsFinal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles[size], disabled && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[textStyleCombined, { color: '#FFFFFF' }]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'} />
      ) : (
        <Text style={textStyleCombined}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    borderRadius: 12,
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
    backgroundColor: '#6366F1',
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
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  outlineText: {
    color: '#6366F1',
  },
  
  danger: {
    backgroundColor: '#EF4444',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  
  gradientText: {
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
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 44,
  },
  mediumText: {
    fontSize: 16,
  },
  
  large: {
    paddingHorizontal: 32,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.7,
  },
});
