import { useAuth } from '@/components/AuthProvider';
import { useCompleteOnboardingMutation } from '@/lib/hooks';
import { CircleDTO, UserDTO } from '@/lib/responses';
import { Href, router } from 'expo-router';

/**
 * Where onboarding goes once we know who the user is.
 *
 * Someone invited from the website already belongs to a circle, so they are
 * never asked to create or join one.
 *
 * Only a *confirmed* absence — `null`, which is the 204 the circle endpoint
 * sends when `CircleId` is unset — sends someone to the create/join screen.
 * `undefined` means the query hasn't settled or has failed, and guessing "no
 * circle" there is the one guess we cannot take back: `POST /circle` reassigns
 * the caller's `CircleId` with no check for an existing one, so offering to
 * create a circle to somebody who already has one silently moves them out of
 * their family's circle and leaves their photos behind. The setup hub is the
 * recoverable guess — someone who really has no circle still reaches
 * JoinOrCreateCircle through the feed.
 */
export function circleStepHref(circle: CircleDTO | null | undefined): Href {
  return circle === null ? '/onboarding/circle' : '/onboarding/setup';
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
    router.replace('/feed');
  };
}
