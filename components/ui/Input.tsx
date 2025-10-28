import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  const inputStyle = [
    styles.input,
    styles[variant],
    styles[size],
    error && styles.error,
    style,
  ];

  const containerStyleCombined = [
    styles.container,
    containerStyle,
  ];

  return (
    <View style={containerStyleCombined}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={inputStyle}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  
  // Variants
  default: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  filled: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  // Sizes
  small: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  
  // States
  error: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
