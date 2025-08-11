# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Taiwan mortgage calculator web application that supports multi-stage interest rates including the government's Youth Housing Loan program (新青安). It's a pure frontend application built with React, TypeScript, and Vite.

## Key Commands

```bash
# Development
npm run dev           # Start dev server at http://localhost:5173

# Build & Deploy
npm run build        # TypeScript check + production build to /dist
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Architecture & Core Components

### Calculation Engine
- **`src/utils/calculations/mortgageCalculator.ts`**: Core calculation logic
  - Handles both equal principal & interest and equal principal repayment methods
  - Supports grace period calculations (寬限期) where only interest is paid
  - Multi-stage interest rate support with automatic period detection

### Data Flow
1. **Input State**: `LoanInput` type contains all loan parameters (amount, years, grace period, rates)
2. **Validation**: `validateLoanInput()` validates ranges and business rules before calculation
3. **Calculation**: `calculateMortgage()` generates monthly payment schedule with principal/interest breakdown
4. **Display**: Results shown in real-time with detailed payment tables and summaries

### Key Business Logic

#### Youth Housing Loan (新青安)
- Fixed rates: Years 1-2 at 1.775%, Year 3+ at 2.075%
- Max loan amount: NT$10 million
- Max term: 40 years
- Max grace period: 5 years

#### Custom Rate Periods
- Users can define multiple rate periods with start/end months
- Rates automatically apply based on payment month
- Each period can have description for clarity

#### Grace Period
- During grace period: Only interest payments, no principal
- After grace period: Remaining principal amortized over remaining months
- Affects average monthly payment calculation

#### Interest Rate Ratio (利息佔比)
- Calculated as: Total Interest / Principal × 100%
- Normal ranges by loan term:
  - 20 years: ~40-60% (depends on interest rate)
  - 30 years: ~60-120% (depends on interest rate)
  - 40 years: ~80-160% (depends on interest rate)
- Grace periods increase total interest as principal remains unchanged during grace
- Ratios over 100% are normal for long-term loans, meaning total interest exceeds principal

### Component Structure
- **`MortgageCalculator`**: Main container managing state and calculation triggers
- **`LoanInputForm`**: Handles all user inputs with real-time validation
- **`ResultSummary`**: Displays key metrics (average payment, total interest)
- **`PaymentTable`**: Detailed payment schedule with monthly/yearly views
- **`PolicyInfo`**: Youth loan policy details and requirements

### State Management
- Uses React's built-in `useState` and `useEffect`
- All calculations triggered automatically on input changes
- No external state management library needed

## Important Constants

Located in `src/constants/index.ts`:
- `YOUTH_LOAN_POLICY`: Youth loan rates and requirements
- `LOAN_LIMITS`: Validation boundaries (amounts, years, ratios)
- `INPUT_MODES`: Input mode options (total price vs loan amount)
- `REPAYMENT_METHODS`: Calculation method options

## TypeScript Types

Core types in `src/types/index.ts`:
- `LoanInput`: All input parameters including grace period
- `MonthlyPayment`: Single payment details with grace period flag
- `LoanCalculationResult`: Complete calculation output
- `RatePeriod`: Interest rate period definition

## Testing Approach

Development mode auto-runs tests in console (`src/App.test.tsx`):
- Basic loan calculations
- Grace period calculations
- Multi-stage rate applications
- Input validation rules

## Styling

Uses TailwindCSS with:
- Responsive design for mobile/tablet/desktop
- Color-coded sections (blue for youth loan, amber for grace period)
- Gradient cards for key metrics
- Consistent spacing and typography scale

## Taiwan-Specific Features

1. **Currency**: All amounts in TWD with proper formatting
2. **Terminology**: Uses Taiwan mortgage terms (本息平均攤還, 寬限期)
3. **Regulations**: Follows Taiwan mortgage rules (max 30-40 years, typical ratios)
4. **Youth Loan**: Implements actual government program rates and limits