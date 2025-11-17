import GalleryIcon from '@/assets/icons/gallery-vertical.svg';
import LogoutIcon from '@/assets/icons/log-out.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import PersonIconOrange from '@/assets/icons/users-round.svg';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import NetworkImage from '@/components/NetworkImage';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useGetSelfQuery } from '@/lib/hooks';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, Text, View } from 'react-native';

export default function Layout() {
  const selfQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();
  const { deleteToken } = useAuth();

  function handleLogout() {
    deleteToken();
    router.replace('/');
  }

  function CustomDrawerContent(props: DrawerContentComponentProps) {
    if (selfQuery.isError || circleQuery.isError) {
      return <Error />;
    }

    if (selfQuery.isLoading || circleQuery.isLoading) {
      return <Loading />;
    }

    if (!selfQuery.data) {
      return null;
    }

    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View>
          <PopPressable
            onPress={() => {
              router.navigate({
                pathname: '/profile/[id]',
                params: { id: selfQuery.data.id },
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.md,
              paddingLeft: Spacings.lg,
              marginBottom: Spacings.xl,
            }}>
            <NetworkImage
              source={
                selfQuery.data.avatarPath +
                `?timestamp=${selfQuery.data.avatarTimestamp}`
              }
              style={{
                height: 48,
                width: 48,
                borderRadius: 24,
              }}
            />
            <Text
              style={
                textStyles.heading4
              }>{`${selfQuery.data.firstName} ${selfQuery.data.lastName}`}</Text>
          </PopPressable>
          <PopPressable
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
          </PopPressable>
          <PopPressable
            disabled={!circleQuery.data}
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
            <PersonIconOrange
              height={24}
              width={24}
              color={circleQuery.data ? '#B05637' : '#868581'}
            />
            <Text
              style={
                circleQuery.data
                  ? textStyles.buttonTextOrange
                  : textStyles.buttonTextGrey
              }>
              Circle
            </Text>
          </PopPressable>
        </View>

        <View>
          <PopPressable
            onPress={() => {
              router.navigate('/settings');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.sm,
              paddingVertical: Spacings.md,
              marginBottom: Spacings.md,
              paddingLeft: Spacings.lg,
            }}>
            <SettingsIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Settings</Text>
          </PopPressable>
          <PopPressable
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: Spacings.sm,
              paddingVertical: Spacings.md,
              paddingLeft: Spacings.lg,
            }}>
            <LogoutIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Log Out</Text>
          </PopPressable>
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
          <PopPressable
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingHorizontal: 15 }}>
            <MenuIcon height={24} width={24} />
          </PopPressable>
        ),
      })}>
      <Drawer.Screen name="feed" options={{ title: '' }} />
      <Drawer.Screen name="manage" options={{ title: '' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
    </Drawer>
  );
}
