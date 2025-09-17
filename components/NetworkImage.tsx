import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { Image, ImageProps } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from './AuthProvider';

export default function NetworkImage({
  placeholder = PlaceholderImage,
  ...props
}: ImageProps) {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadToken() {
      const token = await getToken();
      setToken(token);
    }
    loadToken();
  }, [getToken]);

  return (
    <View style={styles.container}>
      <Image
        {...props}
        source={{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
