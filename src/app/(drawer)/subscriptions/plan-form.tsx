import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { useAppSelector } from '../../../store/hooks';
import { selectActiveOrganizationId } from '../../../features/organizations/slice/organizationSlice';
import {
  useCreatePlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
} from '../../../features/plans/api/plansApi';
import type { PlanFamily, PlanDuration } from '../../../types/api';

const FAMILIES: PlanFamily[] = ['FPU', 'PPU'];
const DURATIONS: PlanDuration[] = ['daily', 'weekly', 'monthly'];

export default function PlanFormScreen() {
  const { t } = useTranslation('plans');
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = params.id ?? null;

  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const { data: existing, isLoading: loadingExisting } = useGetPlanByIdQuery(editId!, {
    skip: !editId,
  });

  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();

  const [name, setName] = useState(existing?.name ?? '');
  const [family, setFamily] = useState<PlanFamily>(existing?.family ?? 'FPU');
  const [duration, setDuration] = useState<PlanDuration | null>(existing?.duration ?? 'daily');
  const [speedCap, setSpeedCap] = useState(String(existing?.speed_cap ?? '10'));
  const [deviceLimit, setDeviceLimit] = useState(String(existing?.device_limit ?? '1'));
  const [price, setPrice] = useState(String(existing?.price ?? ''));
  const [currency, setCurrency] = useState(existing?.currency ?? 'XAF');
  const [isActive, setIsActive] = useState(existing?.is_active ?? true);

  // Sync state when existing loads
  React.useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setFamily(existing.family);
    setDuration(existing.duration);
    setSpeedCap(String(existing.speed_cap));
    setDeviceLimit(String(existing.device_limit));
    setPrice(String(existing.price));
    setCurrency(existing.currency);
    setIsActive(existing.is_active);
  }, [existing]);

  const isSaving = creating || updating;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('form.nameRequired'));
      return;
    }
    if (!price || isNaN(Number(price))) {
      Alert.alert(t('form.priceRequired'));
      return;
    }
    const payload = {
      name: name.trim(),
      family,
      duration: family === 'PPU' ? null : duration,
      speed_cap: Number(speedCap) || 10,
      device_limit: Number(deviceLimit) || 1,
      price: Number(price),
      currency,
      is_active: isActive,
      organization: activeOrgId ?? '',
    };
    try {
      if (editId) {
        await updatePlan({ id: editId, patch: payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }
      router.back();
    } catch {
      Alert.alert(t('form.error'));
    }
  };

  if (loadingExisting) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.variants.titleMedium, { color: theme.onSurface, marginBottom: spacing.sm }]}>
        {editId ? t('form.editTitle') : t('form.addTitle')}
      </Text>

      {/* Name */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.name')}</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('form.namePlaceholder')}
        placeholderTextColor={theme.onSurfaceVariant}
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.outline, color: theme.onSurface }]}
      />

      {/* Family */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.family')}</Text>
      <View style={styles.toggleRow}>
        {FAMILIES.map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              setFamily(f);
              if (f === 'PPU') setDuration(null);
              else setDuration('daily');
            }}
            style={[
              styles.toggleBtn,
              { borderColor: theme.outline, backgroundColor: family === f ? theme.primary : theme.surface },
            ]}
          >
            <Text style={[typography.variants.labelMedium, { color: family === f ? theme.onPrimary : theme.onSurface }]}>
              {t(`family.${f}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Duration — FPU only */}
      {family === 'FPU' && (
        <>
          <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.duration')}</Text>
          <View style={styles.toggleRow}>
            {DURATIONS.map((dur) => (
              <Pressable
                key={dur}
                onPress={() => setDuration(dur)}
                style={[
                  styles.toggleBtn,
                  { flex: 1, borderColor: theme.outline, backgroundColor: duration === dur ? theme.primary : theme.surface },
                ]}
              >
                <Text style={[typography.variants.labelSmall, { color: duration === dur ? theme.onPrimary : theme.onSurface }]}>
                  {t(`duration.${dur}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Speed cap */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.speedCap')}</Text>
      <TextInput
        value={speedCap}
        onChangeText={setSpeedCap}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.outline, color: theme.onSurface }]}
      />

      {/* Device limit */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.deviceLimit')}</Text>
      <TextInput
        value={deviceLimit}
        onChangeText={setDeviceLimit}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.outline, color: theme.onSurface }]}
      />

      {/* Price */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.price')}</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.outline, color: theme.onSurface }]}
      />

      {/* Currency */}
      <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>{t('form.currency')}</Text>
      <TextInput
        value={currency}
        onChangeText={setCurrency}
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.outline, color: theme.onSurface }]}
      />

      {/* Is active */}
      <View style={styles.switchRow}>
        <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>
          {t('status.active')}
        </Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ true: theme.primary }}
        />
      </View>

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: isSaving ? 0.6 : 1 }]}
      >
        {isSaving ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>{t('form.save')}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing['3xl'] },
  input: {
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  toggleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  saveBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
});
