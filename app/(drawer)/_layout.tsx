import PlusIcon from '@/assets/icons/add-outline.svg';
import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { Spacings } from '@/constants/Spacings';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Layout() {
  function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: Spacings.md,
                paddingLeft: 12,
                marginBottom: Spacings.xl,
              }}>
              <Image
                source={PlaceholderImage}
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                }}
              />
              <Text style={{ color: '#242832', fontSize: 20, fontWeight: 500 }}>
                Jessica Williams
              </Text>
            </View>
            <Pressable
              onPress={() => {
                router.navigate('/feed');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: Spacings.sm,
                paddingVertical: Spacings.md,
                marginBottom: Spacings.md,
              }}>
              <PlusIcon height={24} width={24} />
              <Text style={{ color: '#B05637', fontSize: 16, fontWeight: 500 }}>
                Feed
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                router.navigate('/manage');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: Spacings.sm,
                paddingVertical: Spacings.md,
              }}>
              <PlusIcon height={24} width={24} />
              <Text style={{ color: '#B05637', fontSize: 16, fontWeight: 500 }}>
                Circle
              </Text>
            </Pressable>
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: Spacings.sm,
                paddingVertical: Spacings.md,
                marginBottom: Spacings.md,
              }}>
              <PlusIcon height={24} width={24} />
              <Text style={{ color: '#B05637', fontSize: 16, fontWeight: 500 }}>
                Settings
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: Spacings.sm,
                paddingVertical: Spacings.md,
              }}>
              <PlusIcon height={24} width={24} />
              <Text style={{ color: '#B05637', fontSize: 16, fontWeight: 500 }}>
                Log Out
              </Text>
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: 400, color: '#C15F3C', fontSize: 28 },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#FCFBF8',
        },
        drawerStyle: {
          backgroundColor: '#FCFBF8',
          width: Dimensions.get('window').width * 0.75,
        },
      }}>
      <Drawer.Screen name="feed" />
      <Drawer.Screen name="manage" />
      <Drawer.Screen name="settings" />
      <Drawer.Screen name="logout" />
    </Drawer>
  );
}
