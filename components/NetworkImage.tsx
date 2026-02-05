import Placeholder from '@/assets/images/placeholder.png';
import { Image, ImageProps } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from './AuthProvider';

export default function NetworkImage({ style, ...props }: ImageProps) {
  const { getToken } = useAuth();
  const imagePath = props.source;

  return (
    <View>
      <Image
        {...props}
        style={style}
        placeholder={Placeholder}
        placeholderContentFit="fill"
        source={{
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          uri: 'https://app-cherami-prod.azurewebsites.net' + imagePath,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
