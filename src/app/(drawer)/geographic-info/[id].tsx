import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { RoleGate } from '../../../features/auth/components/RoleGate';
import { useGetSiteByIdQuery, useDeleteSiteMutation } from '../../../features/sites/api/sitesApi';
import { useGetOrganizationByIdQuery } from '../../../features/organizations/api/organizationApi';

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation('sites');
  const { theme } = useTheme();
  const router = useRouter();

  const { data: site, isLoading } = useGetSiteByIdQuery(id!);
  const { data: org } = useGetOrganizationByIdQuery(site?.organization ?? '', {
    skip: !site?.organization,
  });
  const [deleteSite, { isLoading: deleting }] = useDeleteSiteMutation();

  const handleDelete = () => {
    Alert.alert(t('detail.deleteConfirm'), t('detail.deleteMessage'), [
      { text: t('detail.deleteCancel'), style: 'cancel' },
      {
        text: t('detail.deleteOk'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSite(id!).unwrap();
            router.back();
          } catch {
            Alert.alert(t('detail.deleteError'));
          }
        },
      },
    ]);
  };

  if (isLoading || !site) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
        <AppIcon
          type="Feather"
          name={site.is_mobile ? 'truck' : site.location_type === 'indoor' ? 'home' : 'map-pin'}
          symbol={site.is_mobile ? 'car' : site.location_type === 'indoor' ? 'house' : 'mappin'}
          size={28}
          color={theme.primary}
        />
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, marginTop: spacing.md }]}>
        {site.name}
      </Text>

      <View style={styles.fields}>
        {site.address ? (
          <Field label={t('detail.address')} value={site.address} theme={theme} />
        ) : null}
        <Field
          label={t('detail.locationType')}
          value={site.is_mobile ? t('mobile') : t(`locationType.${site.location_type}`)}
          theme={theme}
        />
        {org ? (
          <Field label={t('detail.organization')} value={org.name} theme={theme} />
        ) : null}
      </View>

      <RoleGate action="manage_sites">
        <View style={styles.actions}>
          <Pressable
            onPress={() =>
              router.push(
                `/(drawer)/geographic-info/site-form?editId=${site.id}` as any,
              )
            }
            style={[styles.btn, { borderColor: theme.primary, borderWidth: 1 }]}
          >
            <AppIcon type="Feather" name="edit-2" symbol="pencil" size={16} color={theme.primary} />
            <Text style={[typography.variants.labelLarge, { color: theme.primary }]}>
              {t('detail.edit')}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            style={[styles.btn, { borderColor: theme.error, borderWidth: 1, opacity: deleting ? 0.6 : 1 }]}
          >
            <AppIcon type="Feather" name="trash-2" symbol="trash" size={16} color={theme.error} />
            <Text style={[typography.variants.labelLarge, { color: theme.error }]}>
              {t('detail.delete')}
            </Text>
          </Pressable>
        </View>
      </RoleGate>
    </ScrollView>
  );
}

function Field({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={styles.field}>
      <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurface }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: { marginTop: spacing.xl, gap: spacing.md },
  field: { gap: 2 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderRadius: borderRadius.md,
  },
});
