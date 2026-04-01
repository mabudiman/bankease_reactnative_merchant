import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService } from '@/features/auth/services/auth-service';
import { profileService } from '../services/profile-service';
import { profileEvents } from '../profileEvents';
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
      // Use profile's own ID (from GET /api/profile response), NOT the auth user ID
      const accountId = state.profile?.accountId;
      if (!accountId) return false;

      console.log('[useProfile] saving profile with accountId (profile ID):', accountId);
      setState((prev) => ({ ...prev, isSaving: true }));
      try {
        const updated = await profileService.saveProfile(accountId, data);
        console.log('[useProfile] saveProfile success, updated:', JSON.stringify(updated, null, 2));
        setState((prev) => ({ ...prev, profile: updated, isSaving: false }));
        // Signal dashboard (and any other subscriber) to reload immediately
        console.log('[useProfile] emitting profileSaved event...');
        profileEvents.emitProfileSaved();
        console.log('[useProfile] profileSaved event emitted');
        Alert.alert('Success', 'Profile updated successfully.');
        return true;
      } catch (err) {
        console.error('[useProfile] saveProfile FAILED:', err);
        setState((prev) => ({ ...prev, isSaving: false }));
        Alert.alert('Failed', 'Failed to update profile. Please try again.');
        return false;
      }
    },
    [state.profile?.accountId],
  );

  return { ...state, saveProfile };
}
