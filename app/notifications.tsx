import PopPressable from '@/components/PopPressable';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
    useGetSelfQuery,
    useUpdateNotificationPreferencesMutation,
} from '@/lib/hooks';
import { NotificationPreferencesRequest } from '@/lib/requests';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

const DEFAULTS: NotificationPreferencesRequest = {
  pushNewPosts: true,
  pushIssueReminders: true,
  pushNewMembers: true,
  emailIssueReminders: true,
  emailMarketing: true,
};

interface Row {
  label: string;
  key: keyof NotificationPreferencesRequest;
}

const PUSH_ROWS: Row[] = [
  { label: 'New photos', key: 'pushNewPosts' },
  { label: 'New members', key: 'pushNewMembers' },
  { label: 'Magazine reminders', key: 'pushIssueReminders' },
];

const EMAIL_ROWS: Row[] = [
  { label: 'Magazine reminders', key: 'emailIssueReminders' },
  { label: 'News from Cher Ami', key: 'emailMarketing' },
];

export default function Notifications() {
  const selfQuery = useGetSelfQuery();
  const updatePreferences = useUpdateNotificationPreferencesMutation();

  const [preferences, setPreferences] =
    useState<NotificationPreferencesRequest>(DEFAULTS);
  const [permitted, setPermitted] = useState(true);

  useEffect(() => {
    if (!selfQuery.data) return;

    const {
      pushNewPosts,
      pushIssueReminders,
      pushNewMembers,
      emailIssueReminders,
      emailMarketing,
    } = selfQuery.data;

    setPreferences({
      pushNewPosts,
      pushIssueReminders,
      pushNewMembers,
      emailIssueReminders,
      emailMarketing,
    });
  }, [selfQuery.data]);

  // Rechecked on focus: once someone has said no, the only way back is the
  // Settings app, so the answer changes while we're in the background.
  useFocusEffect(
    useCallback(() => {
      OneSignal.Notifications.getPermissionAsync().then(setPermitted);
    }, []),
  );

  function save(key: keyof NotificationPreferencesRequest, value: boolean) {
    const merged = { ...preferences, [key]: value };

    setPreferences(merged);
    updatePreferences.mutate(merged);
  }

  function renderGroup(title: string, rows: Row[], needsPermission: boolean) {
    const off = needsPermission && !permitted;

    return (
      <View>
        <Text style={[textStyles.labelSmall, styles.groupTitle]}>{title}</Text>
        <View style={styles.group}>
          {rows.map((row, index) => (
            <View
              key={row.key}
              style={[styles.row, index > 0 && styles.rowDivided]}>
              <Text style={[textStyles.buttonTextOrange, styles.rowLabel]}>
                {row.label}
              </Text>
              <Switch
                value={!off && preferences[row.key]}
                disabled={off}
                onValueChange={(value) => save(row.key, value)}
                trackColor={{ false: '#868581', true: '#C15F3C' }}
                thumbColor="#FCFBF8"
                ios_backgroundColor="#868581"
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!permitted && (
        <PopPressable
          onPress={() => Linking.openSettings()}
          style={styles.notice}>
          <Text style={textStyles.body}>
            Notifications are turned off on this device. You can
            turn them back on in your phone&apos;s settings.
          </Text>
        </PopPressable>
      )}

      {renderGroup('To your device', PUSH_ROWS, true)}
      {renderGroup('To your email', EMAIL_ROWS, false)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
    rowGap: Spacings.lg,
  },

  notice: {
    borderRadius: borderRadius.mdsm,
    backgroundColor: '#F4F1EA',
    padding: Spacings.md,
  },

  groupTitle: {
    marginBottom: Spacings.sm,
    marginLeft: Spacings.xs,
  },

  group: {
    borderRadius: borderRadius.mdsm,
    backgroundColor: '#F4F1EA',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
  },

  rowDivided: {
    borderTopWidth: 1.5 / 2,
    borderTopColor: '#DEDBD5',
  },

  rowLabel: {
    flexShrink: 1,
  },
});
