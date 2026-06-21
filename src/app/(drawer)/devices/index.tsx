import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { useOrgDevices } from '../../../features/devices/hooks/useOrgDevices';
import { useUpdateDeviceMutation } from '../../../features/devices/api/devicesApi';
import { useCan } from '../../../features/auth/hooks/useRbac';
import type { Device } from '../../../types/api';

export default function DevicesScreen() {
  const { t } = useTranslation('devices');
  const { theme } = useTheme();
  const { devices, isLoading, isFetching, isError, refetch, activeOrgId } = useOrgDevices();
  const [updateDevice] = useUpdateDeviceMutation();
  const canManage = useCan('manage_devices');

  const handleAdopt = useCallback(
    (device: Device) => {
      Alert.alert(t('adopt.confirm'), t('adopt.message'), [
        { text: t('adopt.cancel'), style: 'cancel' },
        {
          text: t('adopt.ok'),
          onPress: async () => {
            try {
              await updateDevice({ id: device.id, patch: { status: 'managed' } }).unwrap();
            } catch {
              Alert.alert(t('adopt.error'));
            }
          },
        },
      ]);
    },
    [updateDevice, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: Device }) => {
      const isPending = item.status === 'pending';
      return (
        <View
          style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
        >
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: isPending ? theme.errorContainer : theme.primaryContainer },
            ]}
          >
            <AppIcon
              type="Feather"
              name="hard-drive"
              symbol="internaldrive"
              size={18}
              color={isPending ? theme.error : theme.primary}
            />
          </View>
          <View style={styles.rowMain}>
            <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
              {item.name}
            </Text>
            <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
              {item.model}
              {item.mac_address ? ` · ${item.mac_address}` : ''}
            </Text>
          </View>
          <View style={styles.rowRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPending ? theme.errorContainer : theme.primaryContainer },
              ]}
            >
              <Text
                style={[
                  typography.variants.labelSmall,
                  { color: isPending ? theme.error : theme.primary },
                ]}
              >
                {t(`status.${item.status}`)}
              </Text>
            </View>
            {canManage && isPending ? (
              <Pressable
                onPress={() => handleAdopt(item)}
                hitSlop={8}
                style={[styles.adoptBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={[typography.variants.labelSmall, { color: theme.onPrimary }]}>
                  {t('adopt.button')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      );
    },
    [theme, t, canManage, handleAdopt],
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={devices}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <Text
            style={[
              typography.variants.bodyMedium,
              styles.empty,
              { color: theme.onSurfaceVariant },
            ]}
          >
            {isError
              ? t('list.error')
              : !activeOrgId
                ? t('list.noActiveOrg')
                : t('list.empty')}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing['3xl'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, gap: 2 },
  rowRight: { alignItems: 'flex-end', gap: spacing.xs },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  adoptBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
});
