# VoicePay 🎙️💰

A modern smartwatch payment application designed for merchants to accept QRIS (Quick Response Code Indonesian Standard) payments with voice command functionality.

## ✨ Features

### 🎯 Payment Modes
- **QRIS Static** - Display static QR codes for customer scanning
- **QRIS Dynamic (MPM)** - Generate dynamic QR codes with specific payment amounts
- **QRIS Tap** - NFC-based payment processing
- **Transaction History** - View previous payment transactions

### 🎤 Voice Commands
- Navigate through payment modes using voice commands
- Input payment amounts via speech recognition
- Multi-language support (Indonesian/English)
- Voice feedback and instructions

### 📱 Smartwatch Optimized
- Responsive design for smartwatch displays
- Touch-friendly interface with large buttons
- Optimized for small screen interactions
- Adaptive layout for different screen sizes

### 🔧 Additional Features
- Real-time payment processing simulation
- Success animations and feedback
- Help screen with usage instructions
- Modern UI with dark theme
- Accessibility features

## 🎮 Usage

### Basic Navigation
1. **Voice Commands**: Press and hold the microphone button to activate voice commands
2. **Touch Interface**: Tap on payment mode buttons to navigate
3. **Back Navigation**: Use the back button or say "kembali" to return to home

### Voice Commands Reference
- **"static"** or **"statik"** - Switch to QRIS Static mode
- **"dynamic"** or **"dinamik"** - Switch to QRIS Dynamic mode  
- **"tap"** or **"nfc"** - Switch to QRIS Tap mode
- **"transaksi"** or **"riwayat"** - View transaction history
- **"bantuan"** or **"help"** - Open help screen

### Payment Flow
1. Select payment mode (Static/Dynamic/Tap)
2. For Dynamic/Tap: Input payment amount via voice or keypad
3. Display QR code or activate NFC
4. Customer completes payment
5. View success confirmation


## 🧪 Testing

The application includes dummy data and simulated payment flows for demonstration purposes. To implement real payment processing:

1. Integrate with Indonesian payment gateways (e.g., GoPay, OVO, DANA)
2. Implement real QRIS generation
3. Add actual NFC payment processing
4. Set up webhook handlers for payment confirmations


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Anton Rifco Susilo** 
- **R Pryahitha Bagus Prameshwara**  
- **Imron Madani** 

## 🙏 Acknowledgments

- Thanks to the Indonesian payment ecosystem for QRIS standards
- Radix UI for accessible component primitives
- The React and TypeScript communities for excellent tooling
- Open source contributors who made this project possible

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for Indonesian merchants**
