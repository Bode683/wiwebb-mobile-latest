import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');

  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const email = 'admin@wiweeb.network';

  const s = styles(theme);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Avatar */}
      <View style={s.avatarSection}>
        <View style={s.avatarWrap}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={s.avatar}
          />
          <TouchableOpacity style={s.avatarEdit} activeOpacity={0.8}>
            <AppIcon
              type="Feather"
              name="edit-2"
              symbol="pencil"
              size={12}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information */}
      <Text style={s.sectionHeader}>
        {t('profile.sections.personalInfo').toUpperCase()}
      </Text>
      <View style={s.card}>
        {/* First Name */}
        <View style={s.field}>
          <Text style={s.fieldLabel}>{t('profile.fields.firstName')}</Text>
          <TextInput
            style={s.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={theme.onSurfaceVariant}
            returnKeyType="next"
          />
        </View>

        {/* Last Name */}
        <View style={[s.field, s.fieldBorder]}>
          <Text style={s.fieldLabel}>{t('profile.fields.lastName')}</Text>
          <TextInput
            style={s.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={theme.onSurfaceVariant}
            returnKeyType="next"
          />
        </View>

        {/* Email — read only */}
        <View style={[s.field, s.fieldBorder]}>
          <View style={s.emailLabelRow}>
            <Text style={s.fieldLabel}>{t('profile.fields.email')}</Text>
            <Text style={s.readOnlyTag}>{t('profile.fields.readOnly')}</Text>
          </View>
          <TextInput
            style={[s.input, s.inputReadOnly]}
            value={email}
            editable={false}
            placeholderTextColor={theme.onSurfaceVariant}
          />
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={s.saveButton} activeOpacity={0.85}>
        <Text style={s.saveButtonText}>{t('profile.saveChanges')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },

    /* Avatar */
    avatarSection: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    avatarWrap: {
      position: 'relative',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarEdit: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#f59e0b',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.surfaceVariant,
    },

    /* Section header */
    sectionHeader: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.semibold,
      color: theme.onSurfaceVariant,
      letterSpacing: 0.8,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },

    /* Card */
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      overflow: 'hidden',
    },
    field: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    fieldBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    emailLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    fieldLabel: {
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
    },
    readOnlyTag: {
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
      opacity: 0.6,
      fontStyle: 'italic',
    },
    input: {
      fontSize: typography.sizes.md,
      color: theme.onSurface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      backgroundColor: theme.surfaceVariant,
      borderRadius: borderRadius.sm,
    },
    inputReadOnly: {
      color: theme.onSurfaceVariant,
    },

    /* Save button */
    saveButton: {
      marginTop: spacing.xl,
      backgroundColor: '#f59e0b',
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md + 2,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      color: '#000',
    },
  });
