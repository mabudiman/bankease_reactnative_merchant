---
applyTo: '**'
---

# Product Context

## Why This Project Exists
BankEase Merchant gives BRI bank merchants a dedicated mobile app to manage their banking needs on the go. Traditional banking apps are customer-oriented; this app is built specifically for the merchant journey — accessing account status, searching nearby branches, checking rates, and performing currency exchange.

## Problems It Solves
- Merchants need quick access to account balances and status without visiting a branch
- Finding nearest BRI branches with relevant info is cumbersome in generic apps
- Interest rate and exchange rate lookups require separate tools today
- Currency exchange workflows for merchants are not streamlined

## How It Should Work
1. **Authentication** — Merchant signs in with email + password; biometric login placeholder exists for future implementation. On success, navigates to the main tab shell.
2. **Home Tab** — Welcome screen (stub, to be built out with account summaries).
3. **Search Tab** — Category cards for Branch Search, Interest Rate, Exchange Rate, Currency Exchange. Each card navigates to a dedicated search flow. Currently shows "Coming Soon" alerts.
4. **Messages Tab** — Placeholder for notifications/messages.
5. **Settings Tab** — Placeholder for app settings and account management.

## User Experience Goals
- Instant feel: splash screen hides only after fonts + MSW are ready
- Smooth tab animations via `AnimatedTabBar`
- Branded purple primary palette (`#3629B7`) with Poppins typography
- Card-based UI with subtle shadows for a clean, modern banking look
- Accessible interactive elements (accessibilityRole + accessibilityLabel)
- Locale switching between English and Indonesian at runtime
