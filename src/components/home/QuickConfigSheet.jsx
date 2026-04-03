import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { AppIcon } from '../AppIcon';

const ITEMS = [
  { label: 'Add Device',      type: 'Feather',        name: 'plus',          symbol: 'plus'                },
  { label: 'SSID',            type: 'Feather',        name: 'wifi',          symbol: 'wifi'                },
  { label: 'Extend Mode',     type: 'MaterialIcons',  name: 'sensors',       symbol: 'antenna.radiowaves.left.and.right' },
  { label: 'Port Reboot',     type: 'Feather',        name: 'refresh-cw',    symbol: 'arrow.clockwise'     },
  { label: 'Port Isolation',  type: 'Feather',        name: 'git-branch',    symbol: 'arrow.branch'        },
  { label: 'Network Wizard',  type: 'Feather',        name: 'alert-triangle',symbol: 'wand.and.stars'      },
];

export function QuickConfigSheet({ visible, onClose }) {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.surface, paddingBottom: bottom + 32 },
        ]}
      >
        <Text style={[styles.title, { color: theme.onSurface }]}>Quick Config</Text>

        <View style={styles.grid}>
          {ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.item}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.secondary }]}>
                <AppIcon
                  type={item.type}
                  name={item.name}
                  symbol={item.symbol}
                  size={24}
                  color={theme.onSurface}
                />
              </View>
              <Text style={[styles.label, { color: theme.onSurfaceVariant }]}>
                {item.label}
              </Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  item: {
    width: 90,
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
