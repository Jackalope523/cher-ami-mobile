import { useAuth } from '@/components/AuthProvider';
import { Spacings } from '@/constants/Spacings';
import { useGetCircleQuery } from '@/lib/hooks';
import { router, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { getToken, getOnboarded } = useAuth();
  const circleQuery = useGetCircleQuery();

  useEffect(() => {
    async function startup() {
      const token = await getToken();
      const onboarded = await getOnboarded();

      if (token !== null) {
        if (onboarded) {
          if (circleQuery.data) {
            router.replace('/feed');
          } else {
            router.replace('/onboarding/joinOrCreateCircle');
          }
        } else {
          router.replace('/onboarding/firstName');
        }
      } else {
        router.replace('/landing');
      }
    }

    startup().then(() => {
      SplashScreen.hideAsync();
    });
  }, [circleQuery.data, getOnboarded, getToken]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FCFBF8',
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    marginVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
  },
});
