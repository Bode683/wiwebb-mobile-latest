import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { useAppSelector } from '../../../store/hooks';
import { selectActiveOrganizationId } from '../../../features/organizations/slice/organizationSlice';
import {
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useGetSiteByIdQuery,
} from '../../../features/sites/api/sitesApi';
import { uuid } from '../../../features/users/utils/ids';
import type { LocationType } from '../../../types/api';

const LOCATION_TYPES: LocationType[] = ['outdoor', 'indoor'];

/**
 * Used for both create (no `editId` param) and edit (`editId` = site id).
 */
export default function SiteFormScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { t } = useTranslation('sites');
  const { theme } = useTheme();
  const router = useRouter();
  const activeOrgId = useAppSelector(selectActiveOrganizationId);

  const { data: existing } = useGetSiteByIdQuery(editId!, { skip: !editId });
  const [createSite, { isLoading: creating }] = useCreateSiteMutation();
  const [updateSite, { isLoading: updating }] = useUpdateSiteMutation();
  const saving = creating || updating;

  const [name, setName] = useState(existing?.name ?? '');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [locationType, setLocationType] = useState<LocationType>(
    existing?.location_type ?? 'outdoor',
  );
  const [isMobile, setIsMobile] = useState(existing?.is_mobile ?? false);
  const [error, setError] = useState('');

  // Populate fields once existing data loads (edit mode)
  React.useEffect(() => {
    if (existing) {
      setName(existing.name);
      setAddress(existing.address);
      setLocationType(existing.location_type);
      setIsMobile(existing.is_mobile);
    }
  }, [existing]);

  const handleSave = async () => {
    setError('');
    if (!name.trim()) {
      setError(t('form.nameRequired'));
      return;
    }
    try {
      if (editId) {
        await updateSite({
          id: editId,
          patch: { name: name.trim(), address, location_type: locationType, is_mobile: isMobile },
        }).unwrap();
      } else {
        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        await createSite({
          id: uuid(),
          name: name.trim(),
          slug,
          address,
          location_type: locationType,
          is_mobile: isMobile,
          geometry: null,
          organization: activeOrgId ?? '',
        }).unwrap();
      }
      router.back();
    } catch {
      setError(t('form.error'));
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
        {t('form.name')}
      </Text>
      <TextInput
        style={[styles.input, { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface }]}
        placeholder={t('form.namePlaceholder')}
        placeholderTextColor={theme.onSurfaceVariant}
        value={name}
        onChangeText={setName}
        editable={!saving}
      />

      <Text style={[typography.variants.labelLarge, { color: theme.onSurface, marginTop: spacing.lg }]}>
        {t('form.address')}
      </Text>
      <TextInput
        style={[styles.input, { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface }]}
        placeholder={t('form.addressPlaceholder')}
        placeholderTextColor={theme.onSurfaceVariant}
        value={address}
        onChangeText={setAddress}
        editable={!saving}
      />

      <Text style={[typography.variants.labelLarge, { color: theme.onSurface, marginTop: spacing.lg }]}>
        {t('form.locationType')}
      </Text>
      <View style={styles.chips}>
        {LOCATION_TYPES.map((lt) => {
          const selected = lt === locationType;
          return (
            <Pressable
              key={lt}
              onPress={() => setLocationType(lt)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? theme.primary : theme.outline,
                  backgroundColor: selected ? theme.primaryContainer : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  typography.variants.labelLarge,
                  { color: selected ? theme.onPrimaryContainer : theme.onSurface },
                ]}
              >
                {t(`locationType.${lt}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.switchRow}>
        <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
          {t('form.isMobile')}
        </Text>
        <Switch
          value={isMobile}
          onValueChange={setIsMobile}
          disabled={saving}
          trackColor={{ true: theme.primary }}
        />
      </View>

      {error ? (
        <Text style={[typography.variants.bodySmall, { color: theme.error, marginTop: spacing.md }]}>
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={[styles.btn, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
      >
        {saving ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {editId ? t('form.save') : t('form.create')}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.xs },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  chip: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
