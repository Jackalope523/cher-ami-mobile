import UserIcon from '@/assets/icons/user.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import NetworkImage from './NetworkImage';
import PopPressable from './PopPressable';

interface UserItemProps {
  imageSource?: string;
  text?: string;
  tagLeft?: string;
  tagRight?: string;
  onPress?: () => void;
}

export default function UserItem({
  imageSource,
  text = 'John Doe',
  tagLeft,
  tagRight,
  onPress,
}: UserItemProps) {
  return (
    <PopPressable
      style={styles.contributorContainer}
      onPress={onPress}
      disabled={onPress === undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
          {tagLeft && <Text style={textStyles.labelLargeGrey}>{tagLeft}</Text>}
        </View>
      </View>
      {tagRight && <Text style={textStyles.labelLargeGrey}>{tagRight}</Text>}
    </PopPressable>
  );
}
const styles = StyleSheet.create({
  contributorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacings.md,
  },
});
