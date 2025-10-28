import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
}) => {
  const cardStyle = [
    styles.card,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  children,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  
  // Variants
  default: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  
  // Card parts
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
