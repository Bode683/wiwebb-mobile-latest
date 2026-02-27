# wiweeb — Mobile Design System

## Product Intent

Multi-tenant network management platform. Network admins and IT managers managing their organization's infrastructure — routers, access points, switches, VLANs, WAN links — from their phone.

**Who:** A network admin checking a 2am alert in a dark room, or doing a quick status pass while walking the floor. One hand. Interruption context. They know their infrastructure. They need answers fast, not hand-holding.

**What they must do (on mobile):** See fleet health at a glance. Tap into a device that's failing. Read an IP or signal value without squinting. Act — reboot, push config, acknowledge alert — and get back to what they were doing.

**How it should feel:** Command center in your pocket. Not a consumer app with big friendly cards. Not enterprise gray with flat lists. Dense enough to be useful, touch-friendly enough for one-handed use at 2am. Status tells the story before text does.

**Mobile-specific stance:** Less density than the web NOC view, but the same vocabulary. What the web shows as a table row, mobile shows as a scannable card. What the web shows in a sidebar, mobile puts in a drawer or bottom sheet. The *language* is identical; the *grammar* is native.

---

## Shared Design Tokens

These tokens are identical to the web. Import from `src/theme/` — do not redefine them inline.

### Color Token Reference

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#f59e0b` | `#f59e0b` | Buttons, active state, brand |
| `onPrimary` | `#000` | `#000` | Text/icon on primary surface |
| `primaryContainer` | `#fffbeb` | `#92400e` | Accent backgrounds, highlights |
| `onPrimaryContainer` | `#92400e` | `#fde68a` | Text on accent background |
| `background` | `#fff` | `#171717` | Screen background |
| `surface` | `#fff` | `#262626` | Card / sheet / modal background |
| `surfaceVariant` | `#f9fafb` | `#1f1f1f` | Input fill, secondary surface |
| `onSurface` | `#262626` | `#e5e5e5` | Primary text |
| `onSurfaceVariant` | `#6b7280` | `#a3a3a3` | Secondary / muted text |
| `outline` | `#e5e7eb` | `#404040` | Borders, dividers |
| `sidebar` | `#f9fafb` | `#0f0f0f` | Drawer background |
| `sidebarPrimary` | `#f59e0b` | `#f59e0b` | Active drawer item |
| `sidebarAccent` | `#fffbeb` | `#92400e` | Active item background |
| `error` | `#ef4444` | `#ef4444` | Destructive, error states |

```ts
import { useTheme } from '@/src/theme';
const { theme } = useTheme();
// theme.primary, theme.surface, etc.
```

### Status Semantic Colors

Not in the token file — define these as local constants derived from the palette. Status colors are for device/entity health **only**, not for UI state.

```ts
// src/features/devices/utils/statusColors.ts
import { Colors } from '@/src/theme';

export const statusColors = {
  online:   { dot: '#16a34a', bg: 'rgba(22,163,74,0.12)',  text: '#15803d' }, // green-600/700
  warning:  { dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: '#b45309' }, // amber = primary
  critical: { dot: '#ef4444', bg: 'rgba(239,68,68,0.12)',  text: '#dc2626' }, // red
  offline:  { dot: '#6b7280', bg: 'rgba(107,114,128,0.12)',text: '#4b5563' }, // gray
} as const;

// Dark mode variants (lighter for contrast on dark surfaces)
export const statusColorsDark = {
  online:   { dot: '#4ade80', bg: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
  warning:  { dot: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
  critical: { dot: '#f87171', bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
  offline:  { dot: '#9ca3af', bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
} as const;

export type DeviceStatus = keyof typeof statusColors;
```

---

## Typography

Same typefaces as web. Fallback to platform system font until loaded.

| Font | Token | Use |
|---|---|---|
| Inter | `typography.fonts.sans` | All UI text — labels, body, headings |
| JetBrainsMono | `typography.fonts.mono` | IPs, MACs, signal (dBm), uptime, firmware |
| SourceSerif4 | `typography.fonts.serif` | Long-form docs only |

### Platform font behaviour

```ts
import { Platform } from 'react-native';
import { typography } from '@/src/theme';

// Android: Roboto fallback renders font weights as separate typeface files.
// Always declare fontFamily alongside fontWeight — don't rely on weight alone.
const monoStyle = {
  fontFamily: typography.fonts.mono,  // 'JetBrainsMono'
  fontSize: typography.sizes.sm,       // 13
  fontWeight: '400' as const,
};

// Android: includeFontPadding distorts line height. Always disable for mono/label text.
const androidFontFix = Platform.OS === 'android' ? { includeFontPadding: false } : {};
```

### Technical data rule (identical to web)

Always use `JetBrainsMono` for: IP addresses, MAC addresses, signal strength, uptime counters, firmware versions, timestamps in logs.

```tsx
<Text style={{ fontFamily: typography.fonts.mono, fontSize: typography.sizes.sm }}>
  192.168.1.1
</Text>
```

### Type scale mapping (MD3 → mobile)

| Variant | Use |
|---|---|
| `headlineSmall` (24/32) | Screen titles |
| `titleLarge` (22/28) | Section headings, card titles |
| `titleMedium` (16/24) | List item primary |
| `bodyMedium` (14/20) | Body, secondary text |
| `labelLarge` (14/20 500) | Button labels, tab labels |
| `labelMedium` (12/16 500) | Badge text, meta labels |
| `labelSmall` (11/16 500) | Density labels, footer meta |

```ts
import { typography } from '@/src/theme';
// typography.variants.titleMedium, typography.variants.labelLarge, etc.
```

---

## Spacing

4pt grid — identical to web.

| Token | Value | Mobile use |
|---|---|---|
| `spacing.xs` | 4 | Icon padding, tight inline gaps |
| `spacing.sm` | 8 | Badge padding, tight list item gaps |
| `sp(3)` | 12 | Dense list cell padding |
| `spacing.md` | 16 | Card padding (compact), horizontal screen margin |
| `spacing.lg` | 24 | Card padding (default), section spacing |
| `spacing.xl` | 32 | Section top margin |

**Horizontal screen margin:** `spacing.md` (16) on both sides. Never let content touch screen edges.

**Density rule:** Device list rows → `sp(3)` (12) vertical padding. Dashboard summary cards → `spacing.md`–`spacing.lg`.

---

## Depth & Elevation

React Native requires platform-split shadow handling. The `shadows` object in `src/theme/spacing.ts` includes both iOS shadow props and `elevation` for Android.

| Level | Token | iOS | Android | Use |
|---|---|---|---|---|
| 0 | — | — | — | Screen background |
| 1 | `shadows.sm` | shadowOpacity 0.08 | elevation 1 | List rows, chip borders |
| 2 | `shadows.md` | shadowOpacity 0.12 | elevation 3 | Cards, panels |
| 3 | `shadows.lg` | shadowOpacity 0.15 | elevation 6 | Bottom sheets, popovers |
| 4 | `shadows.xl` | shadowOpacity 0.20 | elevation 12 | Modals, full-screen drawers |

**Rule:** Every card gets a border (`outline` token) **plus** a shadow. Border defines the edge in both modes; shadow adds depth. Do not use shadow alone — in dark mode, borders carry the separation.

```tsx
import { shadows } from '@/src/theme';

const cardStyle = {
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.outline,
  borderRadius: borderRadius.lg,  // 10
  ...shadows.md,
};
```

---

## Border Radius

Same base as web (`--radius: 0.375rem` = 6px).

| Token | Value | Use |
|---|---|---|
| `borderRadius.xs` | 2 | Status dots (not needed — use `full`) |
| `borderRadius.sm` | 4 | Dense badges, tight pills |
| `borderRadius.md` | 6 | Inputs, small buttons — **default component radius** |
| `borderRadius.lg` | 10 | Cards, panels, action sheets |
| `borderRadius.xl` | 16 | Modal surfaces, feature cards |
| `borderRadius.full` | 9999 | Status dots, avatars, FAB |

---

## Animations

Named spring presets from `src/theme/animations.ts` cover all standard interactions.

| Preset | Use |
|---|---|
| `gentle` | Standard UI — button press scale, opacity fade |
| `bouncy` | List items appearing, cards, FABs entering |
| `stiff` | Drawer open/close, navigation transitions |
| `slow` | Background color transitions, theme switch |
| `snap` | Modals, overlays, bottom sheets — crisp entry |

### Status dot animation (Reanimated — replaces CSS keyframes from web)

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Online: radiating ring (replaces animate-status-ping)
function OnlineRing() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.8, { duration: 1400, easing: Easing.out(Easing.ease) }), -1);
    opacity.value = withRepeat(withTiming(0, { duration: 1400, easing: Easing.out(Easing.ease) }), -1);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.dotWrapper}>
      <Animated.View style={[styles.ring, ringStyle, { backgroundColor: statusColors.online.dot }]} />
      <View style={[styles.dot, { backgroundColor: statusColors.online.dot }]} />
    </View>
  );
}

// Warning: slow breathing pulse (replaces animate-status-pulse)
function WarningDot() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.35, { duration: 2000 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, style, { backgroundColor: statusColors.warning.dot }]} />;
}

// Offline / Critical: static — no animation (finality)
```

---

## Platform-Specific Patterns

### Touch feedback

Use `Pressable` everywhere. Platform-specific feedback is declarative.

```tsx
import { Platform, Pressable } from 'react-native';

<Pressable
  android_ripple={{
    color: 'rgba(245,158,11,0.15)',  // amber ripple on Android
    borderless: false,
  }}
  style={({ pressed }) => [
    styles.item,
    // iOS: dim on press. Android: ripple handles feedback, no dim needed
    Platform.OS === 'ios' && pressed && { opacity: 0.7 },
  ]}
>
```

**Rule:** Never use `TouchableOpacity` for new components. `Pressable` gives platform-correct feedback. `TouchableHighlight` is acceptable for list rows that need an underlay color.

### Minimum touch targets

| Platform | Minimum | Guidance |
|---|---|---|
| iOS (HIG) | 44×44pt | Including invisible padding |
| Android (Material) | 48×48dp | Touchable area, not visual size |

For small icons/dots: wrap in a `Pressable` with `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`.

### Navigation chrome

**Android:**
- Hardware back button handled by React Navigation — do not intercept unless intentional
- Use `gestureEnabled: false` on onboarding steps (already configured) to prevent accidental back swipe
- Status bar: set `barStyle` + `backgroundColor` to match screen. Use `translucent` on auth screens.

**iOS:**
- Swipe-from-left-edge is the primary back gesture — do not obscure with custom left header buttons
- On modals: swipe-down to dismiss. Set `gestureEnabled: true` on sheet-style modals.
- Dynamic Island / notch: handled by `useSafeAreaInsets()` — always apply `top` inset to screen headers

### Keyboard avoidance

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

// behavior differs per platform:
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
```

**iOS `'padding'`**: shifts content up by keyboard height — correct for forms anchored to bottom.
**Android `'height'`**: shrinks the view — use when window `softInputMode` is `adjustResize`. If `adjustPan` is set in `app.json`, remove `KeyboardAvoidingView` entirely for Android.

### Haptic feedback

Use `expo-haptics` for consequential actions. Not for navigation or list scrolls.

```ts
import * as Haptics from 'expo-haptics';

// Light: toggle switches, selection changes
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium: confirming a device action (e.g. "Start Monitoring")
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success: onboarding complete, device activated
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error: form validation failure, device unreachable
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

Android: `expo-haptics` works on Android 26+. Always call without guarding — it silently no-ops on unsupported devices.

### Safe areas

Always consume insets. Never hardcode top/bottom padding for headers or tab bars.

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ScreenHeader() {
  const insets = useSafeAreaInsets();
  return <View style={{ paddingTop: insets.top + spacing.md, ... }} />;
}
```

For `ScrollView` content that should clear the tab bar, use `contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT }}`.

### Status bar

```tsx
import { StatusBar } from 'expo-status-bar';

// Auth screens (over background image)
<StatusBar style="light" translucent backgroundColor="transparent" />

// Main app (drawer)
<StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.background} />
```

Android-only: set `StatusBar.setBackgroundColor()` when navigating between screens with different surface colors. iOS ignores background color.

---

## Assets

| Asset | Path | Use |
|---|---|---|
| Auth background (light) | `src/assets/common/auth-background-light.svg` | Welcome/login/signup screen background |
| Auth background (dark) | `src/assets/common/auth-background-dark.svg` | Auth screens in dark mode |
| Mobile bg (light) | `src/assets/common/wiweeb-bg-mobile-light.svg` | Onboarding background |
| Mobile bg (dark) | `src/assets/common/wiweeb-bg-mobile-dark.svg` | Onboarding background (dark) |
| Logo (orange) | `src/assets/brand-logo/wiweeb-orange.svg` | Primary — on white/light surfaces |
| Logo (white) | `src/assets/brand-logo/wiweeb-white.svg` | On dark surfaces or over colored backgrounds |
| Logo (black) | `src/assets/brand-logo/wiweeb-black.svg` | Print, monochrome contexts |
| Signal animation | `src/assets/animation/signal-broadcast.json` | Lottie — activation/polling screen |

Use `react-native-svg` for SVG assets. Do not use `<Image>` with SVG sources.

```tsx
import AuthBgLight from '@/src/assets/common/auth-background-light.svg';
import AuthBgDark from '@/src/assets/common/auth-background-dark.svg';

const AuthBackground = isDark ? AuthBgDark : AuthBgLight;
<AuthBackground width="100%" height="100%" style={StyleSheet.absoluteFill} />
```

---

## Component Patterns

### Status dot

```tsx
// Compact: used inline in device list rows
function StatusDot({ status }: { status: DeviceStatus }) {
  const colors = isDark ? statusColorsDark[status] : statusColors[status];
  if (status === 'online') return <OnlineRing />;     // animated
  if (status === 'warning') return <WarningDot />;    // pulsing
  return <View style={[styles.dot, { backgroundColor: colors.dot }]} />;  // static
}

// Sizes
const styles = StyleSheet.create({
  dot:     { width: 8,  height: 8,  borderRadius: 4 },
  ring:    { width: 8,  height: 8,  borderRadius: 4, position: 'absolute' },
  dotWrapper: { width: 8, height: 8 },
});
```

### Status badge (inline chip)

```tsx
function StatusBadge({ status, label }: { status: DeviceStatus; label: string }) {
  const colors = isDark ? statusColorsDark[status] : statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: colors.dot }]} />
      <Text style={[typography.variants.labelMedium, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,   // 8
    paddingVertical: spacing.xs,     // 4
    borderRadius: borderRadius.sm,   // 4
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
});
```

### Device list row

```tsx
// Optimized for one-handed scanning: status left, hostname prominent, IP in mono
function DeviceRow({ device, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
      style={({ pressed }) => [
        styles.row,
        Platform.OS === 'ios' && pressed && { opacity: 0.75 },
      ]}
    >
      <StatusDot status={device.status} />
      <View style={styles.info}>
        <Text style={typography.variants.titleSmall} numberOfLines={1}>
          {device.hostname}
        </Text>
        <Text style={[
          typography.variants.labelSmall,
          { fontFamily: typography.fonts.mono, color: theme.onSurfaceVariant },
          Platform.OS === 'android' && { includeFontPadding: false },
        ]}>
          {device.ip}
        </Text>
      </View>
      <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}>
        {device.lastSeen}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: sp(3),           // 12 — dense
    borderBottomWidth: 1,
    borderBottomColor: theme.outline,
  },
  info: { flex: 1 },
});
```

### Fleet summary bar

Four status counters: online / warning / critical / offline. Touch target per counter ≥ 44pt.

```tsx
function FleetSummaryBar({ counts }: { counts: Record<DeviceStatus, number> }) {
  return (
    <View style={styles.bar}>
      {(['online','warning','critical','offline'] as DeviceStatus[]).map(status => (
        <Pressable key={status} style={styles.counter} onPress={() => filterByStatus(status)}>
          <Text style={[typography.variants.titleLarge, { color: statusColors[status].dot }]}>
            {counts[status]}
          </Text>
          <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}>
            {status}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.outline,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  counter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,   // iOS HIG minimum
  },
});
```

### Input field

```tsx
// Same border treatment as web. surfaceVariant fill, outline border.
const inputStyle = {
  backgroundColor: theme.surfaceVariant,
  borderWidth: 1,
  borderColor: isFocused ? theme.primary : theme.outline,
  borderRadius: borderRadius.md,   // 6
  paddingHorizontal: spacing.md,
  paddingVertical: sp(3),
  ...typography.variants.bodyMedium,
  color: theme.onSurface,
};
```

### Bottom sheet / action sheet

**iOS:** Use `react-native` `Modal` with `presentationStyle="pageSheet"` or a library like `@gorhom/bottom-sheet`. Supports swipe-down dismiss natively.

**Android:** Use the same bottom sheet library — Android has no native equivalent, but the library provides consistent UX. Set `enablePanDownToClose`.

Prefer bottom sheets over navigation pushes for: device quick-actions (reboot, details), filter panels, confirmation prompts.

### Drawer navigation

The `sidebar*` tokens map directly to the custom `DrawerContent`:
- `sidebar` → drawer background
- `sidebarForeground` → nav item text
- `sidebarPrimary` / `sidebarAccent` → active item (already implemented)
- `sidebarBorder` → dividers

Drawer width: 75% of screen width, max 320. Never full-screen — user must see the app behind it.

---

## Layout Patterns

### Screen structure

```
SafeAreaView (top inset)
├── Header (platform-appropriate title + back)
│   Android: left-aligned title, back arrow from drawer icon
│   iOS: centered title, back arrow from swipe gesture
├── Content (ScrollView or FlatList)
│   paddingHorizontal: spacing.md (16)
└── SafeAreaView bottom / Tab bar inset
```

### Navigation shell

- **Drawer** (left, 75% width): tenant/org switcher at top → nav items → profile/logout at bottom
- **Tab bar** (bottom): 3–5 primary destinations. Currently: Home | [2nd] | [3rd]. Future: Home | Devices | Alerts | Settings
- **Stack** within each tab: drill down to device detail, site detail, etc.

### Data density on mobile vs web

| Web | Mobile equivalent |
|---|---|
| Full device table (many columns) | FlatList with 2-line rows: hostname + IP + status dot |
| Sidebar filters | Bottom sheet filter panel |
| Inline config diff | Full-screen modal with scroll |
| Dashboard summary cards | Horizontal scroll strip or stacked cards |

---

## Dark Mode

Theme switch persisted in MMKV (`app-color-scheme`). All components use `theme.*` tokens — no hardcoded colors.

- Surfaces in dark: `background` → `surface` → `surfaceVariant` (three-level charcoal stack, same as web)
- Status colors are lighter in dark mode (use `statusColorsDark` variants)
- Borders remain visible in dark mode — do not remove `outline` borders on dark surfaces
- Auth background SVG: swap between `auth-background-light.svg` and `auth-background-dark.svg` based on `isDark`

---

## What Belongs in This System

| Yes | No |
|---|---|
| Device status badges + animated dots | Generic success/error toasts (use a toast library) |
| Fleet summary counters | Marketing illustration |
| Dense device list rows | Decorative gradients |
| Config input forms | Animations on non-status elements |
| Monospace technical data | Hardcoded colors or platform-unchecked shadows |
| Platform-split Pressable feedback | TouchableOpacity on new components |
| Bottom sheets for quick actions | Modal pushes for 2-field forms |
