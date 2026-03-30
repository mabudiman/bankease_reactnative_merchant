// features/mobile-prepaid/hooks/useMobilePrepaid.ts
import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/features/dashboard/services/dashboard-service';
import { getBeneficiaries, submitPrepaid } from '../api';
import type { PaymentCard } from '@/features/dashboard/types';
import type { AmountOption, Beneficiary } from '../types';

export function useMobilePrepaid(accountId: string) {
  // ─── Data loading ───────────────────────────────────────────────────
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardService.loadCards(accountId).then((loaded) => {
      if (!cancelled) {
        setCards(loaded);
        setCardsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [accountId]);

  const {
    data: beneficiaries = [],
    isLoading: beneficiariesLoading,
  } = useQuery({
    queryKey: ['mobile-prepaid', 'beneficiaries', accountId],
    queryFn: () => getBeneficiaries(accountId),
  });

  const isLoading = cardsLoading || beneficiariesLoading;

  // ─── Form state ─────────────────────────────────────────────────────
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<AmountOption | null>(null);
  const [phone, setPhone] = useState('');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  // ─── Submit ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submittingRef = useRef(false);

  const selectBeneficiary = useCallback((b: Beneficiary) => {
    setPhone(b.phone);
    setSelectedBeneficiaryId(b.id);
  }, []);

  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    if (!selectedCard || !phone || !selectedAmount) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await submitPrepaid({
        cardId: selectedCard.id,
        phone,
        amount: selectedAmount.value,
      });

      if (result.status === 'SUCCESS') {
        setIsSuccess(true);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Network error. Please try again.';
      Alert.alert('Failed', message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [selectedCard, phone, selectedAmount]);

  const reset = useCallback(() => {
    setSelectedCard(null);
    setSelectedAmount(null);
    setPhone('');
    setSelectedBeneficiaryId(null);
    setIsSuccess(false);
  }, []);

  return {
    cards,
    beneficiaries,
    isLoading,
    selectedCard,
    selectedAmount,
    phone,
    selectedBeneficiaryId,
    setSelectedCard,
    setSelectedAmount,
    setPhone,
    selectBeneficiary,
    submit,
    isSubmitting,
    isSuccess,
    reset,
  };
}
