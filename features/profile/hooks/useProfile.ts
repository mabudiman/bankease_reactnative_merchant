import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService } from '@/features/auth/services/auth-service';
import { profileService } from '../services/profile-service';
import type { UserProfile, UserProfileInput } from '../types';
import type { LocalAuthAccount } from '@/features/auth/types';

interface ProfileState {
  user: LocalAuthAccount | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
}

interface UseProfileResult extends ProfileState {
  saveProfile: (data: UserProfileInput) => Promise<boolean>;
}

export function useProfile(): UseProfileResult {
  const [state, setState] = useState<ProfileState>({
    user: null,
    profile: null,
    isLoading: true,
    isSaving: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const user = await authService.getSessionAccount();
      if (!user) {
        if (!cancelled) setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }
      const profile = await profileService.loadProfile(user.id);
      if (!cancelled) {
        setState({ user, profile, isLoading: false, isSaving: false });
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const saveProfile = useCallback(
    async (data: UserProfileInput): Promise<boolean> => {
      const accountId = state.user?.id;
      if (!accountId) return false;

      setState((prev) => ({ ...prev, isSaving: true }));
      try {
        await profileService.saveProfile(accountId, data);
        // Do NOT update profile state here — updating it would re-trigger
        // useEffect([profile]) in the screen and overwrite the form fields.
        setState((prev) => ({ ...prev, isSaving: false }));
        Alert.alert('Success', 'Profile updated successfully.');
        return true;
      } catch {
        setState((prev) => ({ ...prev, isSaving: false }));
        Alert.alert('Failed', 'Failed to update profile. Please try again.');
        return false;
      }
    },
    [state.user?.id],
  );

  return { ...state, saveProfile };
}
