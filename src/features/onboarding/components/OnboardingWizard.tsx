import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../../store/hooks';
import { completeOnboarding } from '../slice/onboardingSlice';
import { useTheme, spacing } from '../../../theme';
import { ProgressBar } from './ProgressBar';
import { OrgSetupStep } from './steps/OrgSetupStep';
import { SiteSetupStep } from './steps/SiteSetupStep';
import { DeviceClaimStep } from './steps/DeviceClaimStep';
import { ConfigStep } from './steps/ConfigStep';
import { ActivationStep } from './steps/ActivationStep';
import { SuccessStep } from './steps/SuccessStep';

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

export function OnboardingWizard() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<Record<string, any>>({});

  const handleNext = useCallback(
    (stepData?: Record<string, any>) => {
      if (stepData) {
        setWizardData((prev) => ({ ...prev, ...stepData }));
      }

      if (currentStep === TOTAL_STEPS - 1) {
        // Last step completed → finish onboarding
        dispatch(completeOnboarding());
      } else {
        setCurrentStep((s) => s + 1);
      }
    },
    [currentStep, dispatch],
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const StepComponent = STEPS[currentStep];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      <ProgressBar current={currentStep} total={TOTAL_STEPS} />
      <View style={styles.content}>
        <StepComponent
          onNext={handleNext}
          onBack={handleBack}
          data={wizardData}
          isFirst={currentStep === 0}
          isLast={currentStep === TOTAL_STEPS - 1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    marginTop: spacing.lg,
  },
});
