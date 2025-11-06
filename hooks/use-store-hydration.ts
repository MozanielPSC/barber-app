import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/services';

/**
 * Hook para garantir que todas as stores foram hidratadas
 * antes de fazer qualquer operação que dependa do estado persistido
 */
export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const checkHydration = async () => {
      try {
        // Aguarda um tick para garantir que o persist foi executado
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!mounted) return;

        const authState = useAuthStore.getState();
        
        console.log('🔄 [Hydration] Verificando estado da store...', {
          hasToken: !!authState.token,
          isAuthenticated: authState.isAuthenticated,
          userName: authState.user?.nome || null,
          attempt: retryCount + 1
        });

        // Se tem token, sincroniza com o apiClient
        if (authState.token) {
          console.log('✅ [Hydration] Token encontrado, sincronizando com API client');
          await apiClient.setToken(authState.token);
        }

        // Marca como hidratado
        if (mounted) {
          console.log('✅ [Hydration] Store hidratada com sucesso');
          setIsHydrated(true);
        }
      } catch (error) {
        console.error('❌ [Hydration] Erro ao verificar hidratação:', error);
        
        // Tenta novamente até 3 vezes
        if (retryCount < 3 && mounted) {
          console.log(`🔄 [Hydration] Tentando novamente (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
        } else if (mounted) {
          // Mesmo com erro, marca como hidratado para não travar o app
          console.log('⚠️ [Hydration] Prosseguindo sem token após 3 tentativas');
          setIsHydrated(true);
        }
      }
    };

    checkHydration();

    return () => {
      mounted = false;
    };
  }, [retryCount]);

  return isHydrated;
}

