import Placeholder from '@/assets/images/placeholder.png';
import { Image, ImageProps } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from './AuthProvider';

export default function NetworkImage({ style, ...props }: ImageProps) {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const imagePath = props.source;

  useEffect(() => {
    async function loadToken() {
      const token = getToken();
      setToken(token);
    }
    loadToken();
  }, [getToken]);

  return (
    <View>
      <Image
        {...props}
        style={style}
        placeholder={Placeholder}
        placeholderContentFit="fill"
        source={{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          uri: 'https://app-cherami-prod.azurewebsites.net' + imagePath,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
