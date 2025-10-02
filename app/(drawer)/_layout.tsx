import GalleryIcon from '@/assets/icons/gallery-vertical.svg';
import LogoutIcon from '@/assets/icons/log-out.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import SettingsIcon from '@/assets/icons/settings-2.svg';
import PersonIcon from '@/assets/icons/users-round.svg';
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
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.md,
              paddingLeft: Spacings.lg,
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
              paddingLeft: Spacings.lg,
            }}>
            <GalleryIcon height={24} width={24} />
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
              paddingLeft: Spacings.lg,
            }}>
            <PersonIcon height={24} width={24} />
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
              paddingLeft: Spacings.lg,
            }}>
            <SettingsIcon height={24} width={24} />
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
              paddingLeft: Spacings.lg,
            }}>
            <LogoutIcon height={24} width={24} />
            <Text style={{ color: '#B05637', fontSize: 16, fontWeight: 500 }}>
              Log Out
            </Text>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={({ navigation }) => ({
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
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingHorizontal: 15 }}>
            <MenuIcon height={24} width={24} />
          </Pressable>
        ),
      })}>
      <Drawer.Screen name="feed" />
      <Drawer.Screen name="manage" />
      <Drawer.Screen name="settings" />
      <Drawer.Screen name="logout" />
    </Drawer>
  );
}
