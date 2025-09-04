import { Colors } from '@/constants/Colors';
import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface SparrowIconProps extends SvgProps {
  Icon: FC<SvgProps>;
}

export default function SparrowIcon({
  Icon,
  onPress,
  width = 24,
  height = 24,
  fill = Colors.canaryDarkBrown,
  style,
  ...props
}: SparrowIconProps) {
  // Don't trust hitSlop he lies to you and will break your heart
  // He does not extend past the parent view

  return (
    <View pointerEvents={onPress === undefined ? 'none' : 'auto'} style={style}>
      <TouchableOpacity onPress={onPress}>
        <Icon width={width} height={height} fill={fill} {...props} />
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            width: 48,
            height: 48,
            left: -12,
            bottom: -12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
