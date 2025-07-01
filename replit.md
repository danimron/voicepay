# VoicePay - Smartwatch Payment App

## Overview

This is a React-based smartwatch payment application designed for merchants to accept payments through various QRIS (Quick Response Code Indonesian Standard) methods. The application provides a simple, touch and voice-enabled interface optimized for smartwatch screens, supporting static QRIS, dynamic QRIS (MPM), and NFC tap payments.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: React hooks with TanStack Query for server state
- **Build Tool**: Vite for fast development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Storage**: PostgreSQL with connect-pg-simple
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **Database**: PostgreSQL (configured via Drizzle)
- **Connection**: Neon Database serverless driver
- **Schema**: User management with basic authentication structure
- **Migrations**: Drizzle Kit for schema management

## Key Components

### UI Components
- **SmartwatchContainer**: Main layout wrapper that simulates a smartwatch interface with status bar
- **Payment Modes**: 
  - StaticQR: Displays static QRIS codes
  - DynamicQR: Generates dynamic QRIS with specified amounts
  - TapPayment: NFC-like payment simulation
- **SuccessScreen**: Payment confirmation with auto-redirect
- **Radix UI**: Complete set of accessible UI primitives

### Custom Hooks
- **useVoiceCommand**: Speech recognition for voice-controlled payment selection
- **useQRGenerator**: QR code generation for both static and dynamic QRIS
- **useMobile**: Responsive design detection
- **useToast**: Toast notification system

### Core Features
- **Voice Commands**: Indonesian language support for hands-free operation
- **Payment Simulation**: Dummy data for testing all payment flows
- **Responsive Design**: Optimized for small smartwatch screens
- **Accessibility**: Full keyboard and screen reader support

## Data Flow

1. **User Interaction**: Voice commands or touch input on home screen
2. **Mode Selection**: Choose between Static QRIS, Dynamic QRIS, or NFC Tap
3. **Amount Input**: For dynamic/tap modes, input payment amount via voice or manual entry
4. **QR Generation**: Generate appropriate QR codes using dummy merchant data
5. **Payment Simulation**: Simulate successful payment processing
6. **Success Feedback**: Display confirmation with auto-return to home

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Framework**: Radix UI primitives, Tailwind CSS, Class Variance Authority
- **Database**: Drizzle ORM, Neon Database serverless, PostgreSQL session store
- **Development**: Vite, TypeScript, ESBuild for production builds
- **Utilities**: Date-fns, clsx, nanoid for ID generation

### Payment Integration
- **QR Code**: Custom QR data generation with Indonesian QRIS standards
- **Voice Recognition**: Web Speech API for Indonesian language commands
- **NFC Simulation**: Mock NFC payment flow for smartwatch compatibility

## Deployment Strategy

### Development
- **Server**: Node.js with tsx for TypeScript execution
- **Frontend**: Vite dev server with HMR
- **Database**: Drizzle push for schema synchronization
- **Environment**: Replit-optimized with cartographer plugin

### Production
- **Build Process**: Vite for frontend, ESBuild for backend bundling
- **Server**: Node.js production server serving static assets
- **Database**: PostgreSQL with connection pooling
- **Assets**: Compiled to dist/public directory

### Environment Configuration
- **Database**: DATABASE_URL environment variable required
- **Session**: PostgreSQL-based session storage
- **Security**: HTTPS recommended for speech recognition features

## Changelog
- July 01, 2025: Initial setup
- July 01, 2025: UI improvements - contained all elements within smartwatch screen, added voice indicators to all screens
- July 01, 2025: Fixed back button flickering by optimizing useEffect dependencies and adding small delay
- July 01, 2025: Added voice commands for NFC activation in QRIS Tap mode: "aktif NFC", "nfc", "tap", "activate"
- July 01, 2025: Added comprehensive voice feedback using Web Speech API text-to-speech for all screens
- July 01, 2025: Removed auto-redirect from success screen - users must manually return to menu
- July 01, 2025: Fixed QRIS Static navigation bugs and infinite re-render loops by simplifying component structure and fixing useEffect dependencies
- July 01, 2025: Added PostgreSQL database with transaction storage, API endpoints, and transaction list view with voice command "transaksi"
- July 01, 2025: Fixed layout issues - made home screen buttons smaller and compact so all 4 buttons fit in screen, fixed transaction list double-container layout problem
- July 01, 2025: Added responsive design - smartwatch container only shows on larger screens, direct content display on actual smartwatch screens
- July 01, 2025: Implemented interactive payment success celebration animations with multi-phase effects, confetti, sparkles, and animated success icons
- July 01, 2025: Simplified success animations - removed background, kept animated check mark with glow effect, compact layout for better screen fit
- July 01, 2025: Updated application branding - changed name from SmartPay to VoicePay, improved homepage description to "Terima Pembayaran dengan QRIS"
- July 01, 2025: Added comprehensive help system - help icon in homepage header, complete FAQ screen with voice commands "bantuan", "help", "panduan"
- July 01, 2025: Updated QRIS Static with real QR code image provided by user, replacing placeholder text with actual QR image

## User Preferences

Preferred communication style: Simple, everyday language.