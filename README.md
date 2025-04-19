# Elderly Care App

A comprehensive mobile application built with Expo and React Native to help manage elderly care, including medicine reminders, appointment scheduling, and relative management.

![App Screenshot](assets/images/screenshots/app-preview.png)

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - Profile management
  - User data persistence

- **Medicine Management**
  - Add and track medications
  - Set custom reminders
  - View medication history
  - Manage medicine stock

- **Appointment Scheduling**
  - Schedule medical appointments
  - Set reminders for upcoming appointments
  - Track appointment history
  - Add doctor and hospital details

- **Relative Management**
  - Add and manage relatives
  - Share important updates
  - Emergency contact management
  - Profile pictures and details

- **Modern UI/UX**
  - Clean and intuitive interface
  - Dark/Light theme support
  - Responsive design
  - Smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trust-subhas.git
   cd trust-subhas
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 App Structure

```
subhs/
├── app/
│   ├── (app)/              # Main app screens
│   │   ├── home/           # Home screen
│   │   ├── medicine-reminder/  # Medicine management
│   │   ├── appointment-reminder/ # Appointment scheduling
│   │   └── profile/        # User profile
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   └── loading.tsx        # Loading screen
├── assets/                # Static assets
│   ├── images/           # Image resources
│   └── fonts/            # Custom fonts
├── components/           # Reusable components
├── contexts/            # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
└── utils/              # Utility functions
```

## 🛠️ Technologies Used

- **Frontend**
  - React Native
  - Expo
  - TypeScript
  - React Navigation
  - Expo Router

- **State Management**
  - React Context API
  - AsyncStorage

- **UI Components**
  - React Native Paper
  - Ionicons
  - React Native Vector Icons


## 📞 Contact

For any questions or suggestions, please reach out to:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

Made with ❤️ for elderly care
