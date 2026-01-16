import Error from '@/components/Error';
import FeedContents from '@/components/FeedContents';
import JoinOrCreateCircle from '@/components/JoinOrCreateCircle';
import Loading from '@/components/Loading';

import { useGetCircleQuery } from '@/lib/hooks';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function Feed() {
  const navigation = useNavigation();
  const circleQuery = useGetCircleQuery();

  useEffect(() => {
    navigation.setOptions({
      title: circleQuery.data?.title ?? '',
    });
  }, [circleQuery.data, navigation]);

  if (circleQuery.isError) {
    return <Error />;
  }
  if (circleQuery.isLoading) {
    return <Loading />;
  }

  if (!circleQuery.data) {
    return <JoinOrCreateCircle />;
  }

  return <FeedContents />;
}

const styles = StyleSheet.create({});
