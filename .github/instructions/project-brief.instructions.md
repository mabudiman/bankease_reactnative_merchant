---
applyTo: '**'
---

# Project Brief

## Overview
**BankEase Merchant** is a React Native mobile banking application for merchants, built on Expo. It provides merchant banking tools including account management, branch search, interest rates, exchange rates, and currency exchange features — delivered through a polished, themed UI targeting BRI (Bank Rakyat Indonesia) merchant users.

## Core Requirements
- Cross-platform mobile app (iOS, Android) with web support via Expo
- Multi-language support: English (`en`) and Indonesian (`id`)
- Dark/Light mode with automatic detection
- Merchant-focused banking flows: authentication, account overview, search utilities
- Offline-tolerant with API timeout and error handling
- MSW (Mock Service Worker) for development API mocking

## Goals
- Clean, maintainable feature-based architecture
- Type-safe throughout (TypeScript strict)
- Testable components and hooks with Jest + React Testing Library
- Accessible UI (accessibilityRole, accessibilityLabel on interactive elements)
- Poppins font family for brand consistency

## Package Identity
- App name: `bankease-reactnative-merchant`
- Bundle ID (iOS): `com.bankease.merchant`
- Package (Android): `com.bankease.merchant`
- Deep link scheme: `bankeasemerchant`
- Version: `1.0.0`
