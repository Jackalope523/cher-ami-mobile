import Hedgehog from '@/assets/images/hedgehog.png';
import Mouse from '@/assets/images/mouse.png';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import UnblockUserContents from '@/components/UnblockUserContents';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useBlockedUsersQuery } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Blocked() {
  const showToastMessage = useToastMessage();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const blockedUsersQuery = useBlockedUsersQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const { displayDialogue, dismissDialogue } = useDialogueModal();

  function renderEmptyComponent() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FCFBF8',
          justifyContent: 'center',
        }}>
        <View
          style={{
            rowGap: Spacings.md,
            alignItems: 'center',
            marginHorizontal: 94,
          }}>
          <View
            style={{
              marginHorizontal: 126 - 94,
            }}>
            <Image
              source={Hedgehog}
              style={{
                aspectRatio: 160 / 223,
                width: '100%',
                maxHeight: 223,
                maxWidth: 160,
              }}
            />
          </View>

          <Text style={[textStyles.fancyText, { marginBottom: Spacings.xxl }]}>
            {'Nothing to see here :)'}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Image
            source={Mouse}
            style={{
              aspectRatio: 71 / 73,
              width: '100%',
              maxHeight: 73,
              maxWidth: 71,
            }}
          />
        </View>
      </View>
    );
  }

  if (blockedUsersQuery.isError) {
    return <Error />;
  }

  if (blockedUsersQuery.isLoading) {
    return <Loading />;
  }

  if (!blockedUsersQuery.data) {
    return null;
  }

  if (blockedUsersQuery.data.length === 0) {
    return renderEmptyComponent();
  }

  return (
    <ScrollView
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#FCFBF8' }}
      contentContainerStyle={{
        paddingBottom: 100,
      }}>
      <View
        style={{
          rowGap: Spacings.lg,
          marginVertical: Spacings.lg,
          marginHorizontal: 20,
        }}>
        {blockedUsersQuery.data.map((x) => (
          <UserItem
            key={x.id}
            text={x.firstName}
            imageSource={x.avatarUrl ? x.avatarUrl : null}
            tagLeft={'(Unblock)'}
            onPress={() =>
              displayDialogue(<UnblockUserContents userId={x.id} />)
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
