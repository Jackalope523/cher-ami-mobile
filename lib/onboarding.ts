import { useAuth } from '@/components/AuthProvider';
import { useCompleteOnboardingMutation } from '@/lib/hooks';
import { CircleDTO, UserDTO } from '@/lib/responses';
import { Href } from 'expo-router';

/**
 * Where onboarding goes once we know who the user is.
 *
 * Someone invited from the website already belongs to a circle, so they are
 * never asked to create or join one.
 */
export function circleStepHref(circle: CircleDTO | null | undefined): Href {
  return circle ? '/onboarding/setup' : '/onboarding/circle';
}

/** The first step after the welcome: ask about them only if sign-in gave no name. */
export function firstStepHref(
  user: UserDTO | undefined,
  circle: CircleDTO | null | undefined,
): Href {
  if (!user?.nameProvidedByUser) return '/onboarding/about';
  return circleStepHref(circle);
}

/**
 * Finishes onboarding: tells the server, then flips the local flag so the
 * app's guarded routes swap over to the feed.
 */
export function useFinishOnboarding() {
  const { updateOnboarded } = useAuth();
  const completeOnboardingMutation = useCompleteOnboardingMutation();

  return async function finishOnboarding() {
    try {
      await completeOnboardingMutation.mutateAsync();
    } catch {
      // Never strand someone in onboarding over a failed call — the flag is
      // re-sent on the next sign-in if it didn't stick.
    }

    updateOnboarded(true);
  };
}
