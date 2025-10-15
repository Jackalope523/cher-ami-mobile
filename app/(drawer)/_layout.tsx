import GalleryIcon from '@/assets/icons/gallery-vertical.svg';
import LogoutIcon from '@/assets/icons/log-out.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import SettingsIcon from '@/assets/icons/settings-orange.svg';
import PersonIcon from '@/assets/icons/users-round.svg';
import { useAuth } from '@/components/AuthProvider';
import NetworkImage from '@/components/NetworkImage';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetUserQuery } from '@/lib/hooks';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Layout() {
  function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { deleteToken } = useAuth();
    const { data } = useGetUserQuery();

    function handleLogout() {
      deleteToken().then(() => router.replace('/'));
    }

    if (!data) {
      return <Text>Loading...</Text>;
    }

    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <Pressable
            onPress={() => {
              router.navigate('/profile');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.md,
              paddingLeft: Spacings.lg,
              marginBottom: Spacings.xl,
            }}>
            <NetworkImage
              source={data.avatarPath + `?timestamp=${data.avatarTimestamp}`}
              style={{
                height: 48,
                width: 48,
                borderRadius: 24,
              }}
            />
            <Text
              style={
                textStyles.heading4
              }>{`${data.firstName} ${data.lastName}`}</Text>
          </Pressable>
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
            <Text style={textStyles.buttonTextOrange}>Feed</Text>
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
            <Text style={textStyles.buttonTextOrange}>Circle</Text>
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
            <Text style={textStyles.buttonTextOrange}>Settings</Text>
          </View>
          <Pressable
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.sm,
              paddingVertical: Spacings.md,
              paddingLeft: Spacings.lg,
            }}>
            <LogoutIcon height={24} width={24} />
            <Text style={textStyles.buttonTextOrange}>Log Out</Text>
          </Pressable>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleStyle: textStyles.screenHeader,
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
