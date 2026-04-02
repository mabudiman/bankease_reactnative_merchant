// features/mobile-prepaid/hooks/useMobilePrepaid.ts
import { useState, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { getCards, getBeneficiaries, submitPrepaid } from "../api";
import type { PaymentCard } from "@/features/dashboard/types";
import type { AmountOption, Beneficiary } from "../types";

export function useMobilePrepaid(accountId: string) {
  // ─── Data loading ───────────────────────────────────────────────────
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["mobile-prepaid", "cards", accountId],
    queryFn: () => getCards(accountId),
  });

  const { data: beneficiaries = [], isLoading: beneficiariesLoading } = useQuery({
    queryKey: ["mobile-prepaid", "beneficiaries", accountId],
    queryFn: () => getBeneficiaries(accountId),
  });

  const isLoading = cardsLoading || beneficiariesLoading;

  // ─── Form state ─────────────────────────────────────────────────────
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<AmountOption | null>(null);
  const [phone, setPhone] = useState("");
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  // ─── Submit ─────────────────────────────────────────────────────────
  const idempotencyKeyRef = useRef(Crypto.randomUUID());

  const {
    mutate,
    isPending: isSubmitting,
    isSuccess,
  } = useMutation({
    mutationFn: submitPrepaid,
    onSuccess: (result) => {
      if (result.status !== "SUCCESS") {
        Alert.alert("Failed", result.message);
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Network error. Please try again.";
      Alert.alert("Failed", message);
    },
  });

  const selectBeneficiary = useCallback((b: Beneficiary) => {
    setPhone(b.phone);
    setSelectedBeneficiaryId(b.id);
  }, []);

  const submit = useCallback(() => {
    if (!selectedCard || !phone || !selectedAmount) return;
    mutate({
      cardId: selectedCard.id,
      phone,
      amount: selectedAmount.value,
      idempotencyKey: idempotencyKeyRef.current,
    });
  }, [selectedCard, phone, selectedAmount, mutate]);

  const reset = useCallback(() => {
    setSelectedCard(null);
    setSelectedAmount(null);
    setPhone("");
    setSelectedBeneficiaryId(null);
    idempotencyKeyRef.current = Crypto.randomUUID();
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
