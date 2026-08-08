import Error from '@/components/Error';
import FeedContents from '@/components/FeedContents';
import JoinOrCreateCircle from '@/components/JoinOrCreateCircle';
import Loading from '@/components/Loading';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import WelcomeModalContents from '@/components/WelcomeModalContents';

import { useGetCircleQuery, useGetSelfQuery } from '@/lib/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function Feed() {
  const navigation = useNavigation();
  const circleQuery = useGetCircleQuery();
  const userQuery = useGetSelfQuery();
  const { displayDialogue } = useDialogueModal();

  useEffect(() => {
    navigation.setOptions({
      title: circleQuery.data?.title ?? '',
    });
  }, [circleQuery.data, navigation]);

  useEffect(() => {
    if (!userQuery.data) return;

    AsyncStorage.getItem('ShowWelcomeIntro').then((value) => {
      if (value === 'true') {
        AsyncStorage.removeItem('ShowWelcomeIntro');
        displayDialogue(
          <WelcomeModalContents firstName={userQuery.data.firstName} />,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data]);

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
