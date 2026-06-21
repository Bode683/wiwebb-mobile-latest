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
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { RoleGate } from '../../../features/auth/components/RoleGate';
import { useOrgSites } from '../../../features/sites/hooks/useOrgSites';
import { useDeleteSiteMutation } from '../../../features/sites/api/sitesApi';
import { useCan } from '../../../features/auth/hooks/useRbac';
import type { Site } from '../../../types/api';

export default function LocationsScreen() {
  const { t } = useTranslation('sites');
  const { theme } = useTheme();
  const router = useRouter();
  const { sites, isLoading, isFetching, isError, refetch, activeOrgId } = useOrgSites();
  const [deleteSite] = useDeleteSiteMutation();
  const canManage = useCan('manage_sites');

  const handleDelete = useCallback(
    (site: Site) => {
      Alert.alert(t('detail.deleteConfirm'), t('detail.deleteMessage'), [
        { text: t('detail.deleteCancel'), style: 'cancel' },
        {
          text: t('detail.deleteOk'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSite(site.id).unwrap();
            } catch {
              Alert.alert(t('detail.deleteError'));
            }
          },
        },
      ]);
    },
    [deleteSite, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: Site }) => (
      <Pressable
        onPress={() => router.push(`/(drawer)/geographic-info/${item.id}` as any)}
        style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
      >
        <View style={[styles.typeIcon, { backgroundColor: theme.primaryContainer }]}>
          <AppIcon
            type="Feather"
            name={item.is_mobile ? 'truck' : item.location_type === 'indoor' ? 'home' : 'map-pin'}
            symbol={item.is_mobile ? 'car' : item.location_type === 'indoor' ? 'house' : 'mappin'}
            size={18}
            color={theme.primary}
          />
        </View>
        <View style={styles.rowMain}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {item.name}
          </Text>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {item.is_mobile
              ? t('mobile')
              : t(`locationType.${item.location_type}`)}
            {item.address ? ` · ${item.address}` : ''}
          </Text>
        </View>
        {canManage ? (
          <Pressable onPress={() => handleDelete(item)} hitSlop={8} style={styles.deleteBtn}>
            <AppIcon type="Feather" name="trash-2" symbol="trash" size={18} color={theme.error} />
          </Pressable>
        ) : null}
        <AppIcon
          type="Feather"
          name="chevron-right"
          symbol="chevron.right"
          size={20}
          color={theme.onSurfaceVariant}
        />
      </Pressable>
    ),
    [router, theme, t, canManage, handleDelete],
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
        data={sites}
        keyExtractor={(s) => s.id}
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

      <RoleGate action="manage_sites">
        <Pressable
          onPress={() => router.push('/(drawer)/geographic-info/site-form' as any)}
          style={[styles.fab, { backgroundColor: theme.primary }]}
        >
          <AppIcon type="Feather" name="plus" symbol="plus" size={20} color={theme.onPrimary} />
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('list.add')}
          </Text>
        </Pressable>
      </RoleGate>
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
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, gap: 2 },
  deleteBtn: { padding: 4 },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderRadius: borderRadius.full,
    elevation: 3,
  },
});
