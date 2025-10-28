import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToAuth = () => {
    navigation.navigate('Auth');
  };

  const navigateToSelectBarbearia = () => {
    navigation.navigate('SelectBarbearia');
  };

  const navigateToMain = () => {
    navigation.navigate('Main');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    navigateToAuth,
    navigateToSelectBarbearia,
    navigateToMain,
    goBack,
    navigation,
  };
};
