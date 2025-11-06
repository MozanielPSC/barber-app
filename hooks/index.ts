import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores';
import { User, Permissao } from '../types';

// Hook para autenticação
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    loginColaborador,
    register,
    logout,
    loadProfile,
    updateProfile,
    uploadProfilePhoto,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    loginColaborador,
    register,
    logout,
    loadProfile,
    updateProfile,
    uploadProfilePhoto,
  };
};

// Hook para permissões
export const usePermissions = () => {
  const { user } = useAuthStore();
  
  const hasPermission = (permissionName: string): boolean => {
    if (!user || user.tipo === 'proprietario') {
      return true; // Proprietários têm todas as permissões
    }
    
    if (user.tipo === 'colaborador') {
      // Aqui você verificaria as permissões do colaborador
      // Por enquanto, retornando true para simplificar
      return true;
    }
    
    return false;
  };

  const canAccess = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    canAccess,
    user,
  };
};

// Hook para barbearia atual
export const useBarbeariaWatch = () => {
  const { barbeariaAtual, setBarbeariaAtual } = useBarbeariasStore();
  
  return {
    barbeariaAtual,
    setBarbeariaAtual,
  };
};

// Hook para validação de formulários
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any, rules: any): string | null => {
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${name} é obrigatório`;
    }

    // Email validation
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }

    // Phone validation
    if (rules.phone && value) {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length !== 10 && cleaned.length !== 11) {
        return 'Telefone inválido';
      }
    }

    // CPF validation
    if (rules.cpf && value && !isValidCPF(value)) {
      return 'CPF inválido';
    }

    // Password validation
    if (rules.password && value && value.length < 8) {
      return 'Senha deve ter pelo menos 8 caracteres';
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} deve ter pelo menos ${rules.minLength} caracteres`;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${name} deve ter no máximo ${rules.maxLength} caracteres`;
    }

    // Min value validation
    if (rules.min && value && Number(value) < rules.min) {
      return `${name} deve ser maior que ${rules.min}`;
    }

    // Max value validation
    if (rules.max && value && Number(value) > rules.max) {
      return `${name} deve ser menor que ${rules.max}`;
    }

    return null;
  };

  const validateForm = (data: Record<string, any>, rules: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, data[field], rules[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const getError = (field: string): string | undefined => {
    return errors[field];
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    getError,
  };
};

// Hook para máscaras de input
export const useInputMask = () => {
  const applyPhoneMask = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const applyCPFMask = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const applyCNPJMask = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const applyMoneyMask = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const number = parseInt(cleaned) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  };

  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  return {
    applyPhoneMask,
    applyCPFMask,
    applyCNPJMask,
    applyMoneyMask,
    removeMask,
  };
};

// Hook para storage
export const useStorage = () => {
  const setItem = async (key: string, value: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  };

  const getItem = async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Erro ao ler do storage:', error);
      return null;
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do storage:', error);
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
};

// Hook para notificações
export const useNotifications = () => {
  const { addNotification, removeNotification, clearNotifications } = useNotificationsStore();

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: duration || 3000,
    });
  };

  const showError = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 5000,
    });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: duration || 4000,
    });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: duration || 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications,
  };
};

// Hook para debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastRan, setLastRan] = useState<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan >= limit) {
        setThrottledValue(value);
        setLastRan(Date.now());
      }
    }, limit - (Date.now() - lastRan));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit, lastRan]);

  return throttledValue;
};

// Import necessário para AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBarbeariasStore, useNotificationsStore } from '../stores';
import { isValidCPF } from '../utils';

// Export do hook de hidratação
export * from './use-store-hydration';
