import React from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveOrganization, selectActiveOrganizationId } from '../../features/organizations/slice/organizationSlice';
import { useGetOrganizationsQuery } from '../../features/organizations/api/organizationApi';
import { AppIcon } from '../../components/AppIcon';
import type { Organization } from '../../types/api';

export default function OrgSelectModal() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const activeOrgId = useAppSelector(selectActiveOrganizationId);

  const { data, isLoading, isError } = useGetOrganizationsQuery();
  const orgs = data?.results ?? [];

  const handleSelect = (org: Organization) => {
    dispatch(setActiveOrganization(org.id));
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Handle bar */}
      <View style={styles.handleWrap}>
        <View style={[styles.handle, { backgroundColor: theme.outline }]} />
      </View>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.outline }]}>
        <Text style={[styles.title, { color: theme.onBackground }]}>Select Organization</Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [Platform.OS === 'ios' && pressed && { opacity: 0.6 }]}
        >
          <AppIcon type="Feather" name="x" size={20} color={theme.onSurfaceVariant} />
        </Pressable>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.onSurfaceVariant }]}>
            Failed to load organizations
          </Text>
        </View>
      ) : (
        <FlatList
          data={orgs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
          renderItem={({ item }) => {
            const isActive = item.id === activeOrgId;
            return (
              <Pressable
                onPress={() => handleSelect(item)}
                android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
                style={({ pressed }) => [
                  styles.orgRow,
                  { borderBottomColor: theme.outline },
                  isActive && { backgroundColor: theme.primaryContainer },
                  Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                ]}
              >
                <View style={[styles.orgIconWrap, { backgroundColor: theme.primary }]}>
                  <AppIcon type="Ionicons" name="business" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.orgInfo}>
                  <Text style={[styles.orgName, { color: theme.onBackground }]}>{item.name}</Text>
                  {item.description ? (
                    <Text style={[styles.orgDesc, { color: theme.onSurfaceVariant }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                {isActive && (
                  <AppIcon type="Feather" name="check" size={18} color={theme.primary} />
                )}
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  orgIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '500',
  },
  orgDesc: {
    fontSize: 13,
    marginTop: 2,
  },
});
