import UserIcon from '@/assets/icons/user.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import NetworkImage from './NetworkImage';
import PopPressable from './PopPressable';

interface UserItemProps {
  imageSource?: string;
  text?: string;
  tag?: string;
  showTag?: boolean;
  onPress?: () => void;
}

export default function UserItem({
  imageSource,
  text = 'John Doe',
  tag = '(You)',
  showTag = false,
  onPress = () => {},
}: UserItemProps) {
  return (
    <PopPressable style={styles.contributorContainer} onPress={onPress}>
      {imageSource ? (
        <NetworkImage style={styles.image} source={imageSource} />
      ) : (
        <View
          style={[
            styles.image,
            {
              backgroundColor: '#F4F1EA',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <UserIcon height={24} width={24} color={'#868581'} />
        </View>
      )}
      <View style={{ columnGap: Spacings.sm, flexDirection: 'row' }}>
        <Text style={textStyles.labelLargeBlack}>{text}</Text>
        {showTag && <Text style={textStyles.labelLargeGrey}>{tag}</Text>}
      </View>
    </PopPressable>
  );
}
const styles = StyleSheet.create({
  contributorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacings.md,
  },
});
