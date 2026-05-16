import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { AppIcon } from '../AppIcon';

const buildShareMessage = ({ ssid, password, securityType }) => {
  const lines = [
    'Wi-Fi access for you:',
    `Network: ${ssid}`,
  ];
  if (password) {
    lines.push(`Password: ${password}`);
  }
  if (securityType === 'open') {
    lines.push('Security: Open (no password required)');
  }
  return lines.join('\n');
};

const openExternal = async (url, fallbackMessage) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Not available', fallbackMessage);
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Not available', fallbackMessage);
  }
};

export function WifiShareSheet({ visible, onClose, network }) {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [revealed, setRevealed] = useState(false);

  if (!network) return null;

  const { ssid, password = '', securityType = 'wpa2-personal' } = network;
  const message = buildShareMessage({ ssid, password, securityType });
  const hasPassword = password.length > 0;
  const maskedPassword = hasPassword ? '•'.repeat(Math.min(password.length, 10)) : '—';

  const handleEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent('Wi-Fi Access')}&body=${encodeURIComponent(
      message,
    )}`;
    openExternal(url, 'No email app is configured on this device.');
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    openExternal(url, 'WhatsApp is not installed on this device.');
  };

  const handleMore = async () => {
    try {
      await Share.share({ message, title: 'Wi-Fi Access' });
    } catch {
      // user cancelled — ignore
    }
  };

  const handleClose = () => {
    setRevealed(false);
    onClose();
  };

  const actions = [
    {
      key: 'email',
      label: 'Email',
      icon: 'mail',
      symbol: 'envelope',
      onPress: handleEmail,
      tint: theme.primary,
      bg: theme.primaryContainer,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'message-circle',
      symbol: 'message.fill',
      onPress: handleWhatsApp,
      tint: '#25D366',
      bg: 'rgba(37,211,102,0.12)',
    },
    {
      key: 'more',
      label: 'More',
      icon: 'share-2',
      symbol: 'square.and.arrow.up',
      onPress: handleMore,
      tint: theme.onSurface,
      bg: theme.secondary,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.surface, paddingBottom: bottom + 24 },
        ]}
      >
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: theme.outline }]} />
        </View>

        <View style={styles.header}>
          <View style={[styles.heroIcon, { backgroundColor: theme.primaryContainer }]}>
            <AppIcon type="Feather" name="wifi" symbol="wifi" size={22} color={theme.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.onSurface }]}>Share Wi-Fi</Text>
            <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>
              Send these credentials to a guest
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} hitSlop={8} activeOpacity={0.7}>
            <AppIcon type="Feather" name="x" symbol="xmark" size={20} color={theme.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={[styles.credentialCard, { borderColor: theme.outline, backgroundColor: theme.surfaceVariant }]}>
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: theme.onSurfaceVariant }]}>Network</Text>
            <Text style={[styles.fieldValue, { color: theme.onSurface }]} numberOfLines={1}>
              {ssid}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.outline }]} />

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: theme.onSurfaceVariant }]}>Password</Text>
            <View style={styles.passwordRow}>
              <Text style={[styles.fieldValue, { color: theme.onSurface, flex: 1 }]} numberOfLines={1}>
                {hasPassword ? (revealed ? password : maskedPassword) : '—'}
              </Text>
              {hasPassword && (
                <TouchableOpacity
                  onPress={() => setRevealed((v) => !v)}
                  hitSlop={8}
                  activeOpacity={0.7}
                  style={styles.revealBtn}
                >
                  <AppIcon
                    type="Feather"
                    name={revealed ? 'eye-off' : 'eye'}
                    symbol={revealed ? 'eye.slash' : 'eye'}
                    size={16}
                    color={theme.onSurfaceVariant}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.key}
              onPress={a.onPress}
              activeOpacity={0.75}
              style={styles.action}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                <AppIcon type="Feather" name={a.icon} symbol={a.symbol} size={20} color={a.tint} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.onSurface }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
    gap: 16,
    ...Platform.select({
      android: { elevation: 12 },
      default: {},
    }),
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  credentialCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldRow: {
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  revealBtn: {
    padding: 4,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  action: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
