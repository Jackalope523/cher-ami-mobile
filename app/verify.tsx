import { useAuth } from '@/components/AuthProvider';
import { useVerifyCodeMutation } from '@/lib/hooks';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Verify() {
  const { updateToken } = useAuth();
  const mutation = useVerifyCodeMutation(
    (response) => {
      updateToken(response.token);
      router.replace('/feed');
    },
    () => {
      console.log('VERIFY ERROR');
    },
  );

  useEffect(() => {
    mutation.mutate({ email: 'ecote523@gmail.com', code: '600613' });
  }, [mutation]);

  return <View></View>;
}

const styles = StyleSheet.create({});
