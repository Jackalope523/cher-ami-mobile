import Placeholder from '@/assets/images/placeholder.jpg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import NetworkImage from './NetworkImage';

interface UserItemProps {
  imageSource?: string;
  text?: string;
  tag?: string;
  showTag?: boolean;
  onPress?: () => void;
}

export default function UserItem({
  imageSource = '',
  text = 'John Doe',
  tag = '(You)',
  showTag = false,
  onPress = () => {},
}: UserItemProps) {
  return (
    <Pressable style={styles.contributorContainer} onPress={onPress}>
      <NetworkImage
        source={imageSource}
        placeholder={Placeholder}
        style={styles.image}
      />
      <View style={{ columnGap: Spacings.sm, flexDirection: 'row' }}>
        <Text style={textStyles.labelLargeBlack}>{text}</Text>
        {showTag && <Text style={textStyles.labelLargeGrey}>{tag}</Text>}
      </View>
    </Pressable>
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
