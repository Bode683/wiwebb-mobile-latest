import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "../../../store/hooks";
import { spacing, useTheme } from "../../../theme";
import { completeOnboarding, saveOnboardingResult } from "../slice/onboardingSlice";
import { ProgressBar } from "./ProgressBar";
import { ActivationStep } from "./steps/ActivationStep";
import { ConfigStep } from "./steps/ConfigStep";
import { DeviceClaimStep } from "./steps/DeviceClaimStep";
import { OrgSetupStep } from "./steps/OrgSetupStep";
import { SiteSetupStep } from "./steps/SiteSetupStep";
import { SuccessStep } from "./steps/SuccessStep";

export interface OnboardingStepProps {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  data: Record<string, any>;
  isFirst: boolean;
  isLast: boolean;
}

const STEPS = [
  OrgSetupStep,
  SiteSetupStep,
  DeviceClaimStep,
  ConfigStep,
  ActivationStep,
  SuccessStep,
] as const;

const TOTAL_STEPS = STEPS.length;

// Step transition: fade + subtle horizontal slide
const ANIM_OUT_MS = 110;
const ANIM_IN_MS = 200;

export function OnboardingWizard() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<Record<string, any>>({});

  // Animation shared values
  const opacity = useSharedValue(1);
  const offsetX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: offsetX.value }],
  }));

  /** Animate out → swap step → animate in */
  const animateTransition = useCallback(
    (nextStep: number, forward: boolean) => {
      opacity.value = withTiming(0, { duration: ANIM_OUT_MS }, (done) => {
        if (!done) return;
        // Position for enter direction, then advance state
        offsetX.value = forward ? 16 : -16;
        runOnJS(setCurrentStep)(nextStep);
        // Animate in
        offsetX.value = withTiming(0, { duration: ANIM_IN_MS });
        opacity.value = withTiming(1, { duration: ANIM_IN_MS });
      });
    },
    [opacity, offsetX],
  );

  const handleNext = useCallback(
    (stepData?: Record<string, any>) => {
      const merged = stepData ? { ...wizardData, ...stepData } : wizardData;
      if (stepData) {
        setWizardData(merged);
      }
      if (currentStep === TOTAL_STEPS - 1) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(
          saveOnboardingResult({
            orgName: merged.orgName,
            configMode: merged.configMode ?? 'standard',
            ssid: merged.ssid,
            wifiPassword: merged.wifiPassword,
            securityType: merged.securityType,
            vlanId: merged.vlanId ?? null,
          }),
        );
        dispatch(completeOnboarding());
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animateTransition(currentStep + 1, true);
      }
    },
    [currentStep, dispatch, animateTransition, wizardData],
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateTransition(currentStep - 1, false);
    }
  }, [currentStep, animateTransition]);

  const StepComponent = STEPS[currentStep];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Content */}
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.sm,
          },
        ]}
      >
        {/* Progress header */}
        <View style={styles.header}>
          <ProgressBar current={currentStep} total={TOTAL_STEPS} />
        </View>

        {/* Animated step content */}
        <Animated.View style={[styles.content, animatedStyle]}>
          <StepComponent
            onNext={handleNext}
            onBack={handleBack}
            data={wizardData}
            isFirst={currentStep === 0}
            isLast={currentStep === TOTAL_STEPS - 1}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
});
