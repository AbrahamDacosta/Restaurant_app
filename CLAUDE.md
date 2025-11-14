# CLAUDE.md - AI Assistant Guide for Restaurant_app

**Last Updated:** 2025-11-14
**Project:** Fako Drop Partner Management App (Restaurant & Parking)
**Tech Stack:** React Native 0.71.8, TypeScript/JavaScript, Redux, Zustand, React Query

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflows](#development-workflows)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Component Conventions](#component-conventions)
7. [Styling Guidelines](#styling-guidelines)
8. [Navigation Architecture](#navigation-architecture)
9. [Third-Party Integrations](#third-party-integrations)
10. [Testing Strategy](#testing-strategy)
11. [Common Tasks & Patterns](#common-tasks--patterns)
12. [Important Considerations](#important-considerations)

---

## Project Overview

### Purpose
This is a **Partner/Store Management Application** for the "Fako Drop" platform, enabling business partners to:
- **Restaurant Operations:** Accept and process food delivery orders in real-time
- **Parking Management:** Manage parking space reservations and availability
- **Product Management:** Toggle product/service availability
- **Real-time Notifications:** Receive and respond to new orders with audio alerts

### Application Architecture
- **Platform:** React Native (iOS + Android)
- **Package Name (Android):** `com.fakodrop.fakoners`
- **Target Name (iOS):** ParkingManager
- **Entry Point:** `/index.js` → `/src/App.js` → `/src/Navigation.js`
- **Base API URL:** `https://app.fakodrop.com/api`

### Key Features
- Dual authentication (partner/store login)
- Multi-tab order management (New, Processing, Completed)
- Real-time Firebase push notifications
- Foreground service for continuous operation
- Deep linking from notifications
- Automatic token refresh mechanism
- Parking reservation system with maps integration

---

## Codebase Structure

### Directory Organization

```
Restaurant_app/
├── src/                              # Main source code
│   ├── Components/                   # Reusable UI components
│   │   ├── Globals/                  # Universal primitives (Buttons, Texts, Inputs)
│   │   ├── Navigation/               # Navigation components (AppTabBarNavigation)
│   │   ├── Headers/                  # Header components
│   │   ├── Modals/                   # Modal components
│   │   ├── Commandes/                # Order-related components
│   │   ├── Parking/                  # Parking-related components
│   │   ├── CurrentUser/              # User-specific components
│   │   └── Utils/                    # Utility components
│   │
│   ├── Screens/                      # Screen components
│   │   ├── Auth/                     # Authentication flow (Login, Signup, OTP)
│   │   ├── Authenticated/            # Protected screens
│   │   │   ├── AuthenticatedNavigation.js
│   │   │   ├── HomeTab/
│   │   │   ├── CommandeTab/          # Order management
│   │   │   ├── Parking/              # Parking screens (Search, Reservation, etc.)
│   │   │   ├── Products/
│   │   │   └── Settings/
│   │   ├── Commons/                  # Common screens (Policy, CGU)
│   │   └── FirstLaunch/
│   │
│   ├── Store/                        # Redux state management
│   │   ├── index.js                  # Store configuration
│   │   └── ApplicationStore.js       # Main application state slice
│   │
│   ├── Daos/                         # Data Access Objects (API abstraction)
│   │   ├── AuthDAO.js
│   │   ├── CommandesDAO.js
│   │   ├── ParkingsDAO.js
│   │   ├── UserDAO.js
│   │   ├── ProductsDAO.js
│   │   └── index.js                  # Exports singleton instances
│   │
│   ├── api/                          # API configuration
│   │   └── routes.js                 # Centralized route constants
│   │
│   ├── Theme/                        # Theme configuration
│   │   └── Theme.js                  # Color constants
│   │
│   ├── Hooks/                        # Custom React hooks
│   │   ├── useDaoCall.js             # API call wrapper with loading/error states
│   │   ├── useUser.js
│   │   └── useAppFocusedEffect.js
│   │
│   ├── Utils/                        # Utility functions
│   │   └── Helpers/
│   │       └── SoundNotificationPlayer.js
│   │
│   ├── notifications/                # Notification handling
│   │   └── useListenDeviceToken.js
│   │
│   ├── App.js                        # Root app component with providers
│   └── Navigation.js                 # Navigation config with deep linking
│
├── android/                          # Android native code
│   └── app/
│       ├── build.gradle
│       ├── google-services.json
│       └── src/main/
│           ├── AndroidManifest.xml
│           ├── java/com/fakodrop/fakoners/
│           └── assets/fonts/         # Montserrat font variants
│
├── ios/                              # iOS native code
│   ├── Podfile
│   └── FakoStore.xcodeproj
│
├── assets/                           # Static assets
│   └── fonts/                        # Montserrat font family (18 variants)
│
├── __tests__/                        # Test files
│   └── App-test.tsx
│
├── index.js                          # App entry point
├── App.tsx                           # Sample React Native template (unused)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── babel.config.js                   # Babel with Reanimated plugin
└── metro.config.js                   # Metro bundler config
```

### File Naming Conventions
- **Components:** PascalCase (e.g., `CommandeItem.js`, `ParkingView.js`)
- **Utilities:** camelCase (e.g., `useDaoCall.js`, `routes.js`)
- **Screens:** PascalCase with "Screen" suffix (e.g., `LoginScreen.js`)
- **DAOs:** PascalCase with "DAO" suffix (e.g., `AuthDAO.js`)

---

## Development Workflows

### Setup & Installation

```bash
# Install dependencies
npm install
# or
yarn install

# iOS setup (requires macOS)
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios

# Start Metro bundler
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Git Workflow
- **Main Branch:** Not specified in git status (check with team)
- **Current Branch:** `claude/claude-md-mhy9g8u0htqgnv1u-01R9eBKGAGHVJkxEH5BhUiaR`
- **Commit Style:** Review recent commits via `git log` before committing
- **Always:** Push to branches prefixed with `claude/` when working in AI sessions

### Build Configuration
- **compileSdkVersion:** 33
- **minSdkVersion:** 21
- **targetSdkVersion:** 33
- **React Native Version:** 0.71.8
- **Hermes:** Enabled on both platforms
- **Flipper:** Disabled (iOS)

---

## State Management

### 1. Redux (Global Application State)

**Location:** `/src/Store/`

**Purpose:** Authentication, user data, app navigation state, token management

**Store Configuration:**
```javascript
// src/Store/index.js
- Uses redux-thunk for async actions
- redux-devtools-extension for debugging
- redux-persist with AsyncStorage for persistence
```

**Main State Slice:**
```javascript
// src/Store/ApplicationStore.js
{
  user: {},                  // Current user data
  token: "",                 // Auth token
  refresh_token: "",         // Refresh token
  navigateScreen: "",        // App navigation state:
                            //   - FIRST_LAUNCH
                            //   - NOT_CONNECTED
                            //   - CONNECTED
  appParameters: {}          // App configuration
}
```

**When to Use Redux:**
- User authentication state
- Global app configuration
- Cross-feature shared state
- Data that needs persistence

### 2. Zustand (Local Feature State)

**Purpose:** Component-level state management with less boilerplate than Redux

**Example Implementation:**
```javascript
// src/Screens/Authenticated/CommandeTab/CommandeTabScreen.js
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useCommandeStoreForTabScreen = create(
  immer((set) => ({
    newCommandesItems: [],
    setNewCommandesItems: (items) => set((state) => {
      state.newCommandesItems = items;
    })
  }))
);
```

**When to Use Zustand:**
- Feature-specific state (e.g., tab filters, local UI state)
- State that doesn't need persistence
- Simpler state management for isolated features

### 3. React Query (Server State)

**Purpose:** Server state management, caching, and synchronization

**Example:**
```javascript
// src/notifications/useListenDeviceToken.js
import { useMutation } from 'react-query';

const mutation = useMutation(
  (token) => axios.post('/api/device-token', { token })
);
```

**When to Use React Query:**
- API data fetching
- Mutation operations
- Automatic background refetching
- Optimistic updates

### State Management Decision Tree
```
Is this authentication data or global config?
  ✓ Yes → Use Redux

Does this data come from an API?
  ✓ Yes → Use React Query

Is this local feature state?
  ✓ Yes → Use Zustand

Is this temporary UI state?
  ✓ Yes → Use useState
```

---

## API Integration

### API Routes Configuration

**Location:** `/src/api/routes.js`

**Base URL:** `https://app.fakodrop.com/api`

**Key Routes:**
```javascript
// Authentication
LOGIN: /api/login_store
REGISTER: /api/auth/register
REFRESH_TOKEN: /api/refresh_token

// Orders
GET_COMMANDES: /api/liste_orders_by_store
ACCEPT_COMMANDE: /api/accept_order
REFUSE_COMMANDE: /api/refuse_order
UPDATE_COMMANDE_STATUS: /api/update_order_status

// Parking
SEARCH_PARKING_PLACE: /api/parkings/search
MAKE_PLACE_RESERVATION: /api/reservations

// Products
TOGGLE_PRODUCT_DISPONIBILITY: /api/switch_product_disponibility
GET_PRODUCT_LIST: /api/products
```

### DAO Pattern (Data Access Objects)

**Location:** `/src/Daos/`

**Purpose:** Clean separation between API logic and UI components

**Pattern:**
```javascript
// Example: src/Daos/CommandesDAO.js
class CommandesDAO {
  async getCommandes(storeId) {
    const response = await axios.post(GET_COMMANDES, { store_id: storeId });
    return response.data;
  }

  async acceptCommande(orderId) {
    const response = await axios.post(ACCEPT_COMMANDE, { order_id: orderId });
    return response.data;
  }
}

export default new CommandesDAO(); // Singleton instance
```

**Usage in Components:**
```javascript
// Import singleton
import { CommandesDAO } from '../Daos';

// Use in component
const orders = await CommandesDAO.getCommandes(storeId);
```

### Custom Hook for API Calls

**Location:** `/src/Hooks/useDaoCall.js`

**Purpose:** Standardized API call wrapper with loading/error states

**Usage:**
```javascript
import useDaoCall from '../Hooks/useDaoCall';

const [loading, error, data, callDao] = useDaoCall();

useEffect(() => {
  callDao(() => CommandesDAO.getCommandes(storeId));
}, []);
```

### Axios Interceptors

**Location:** `/src/App.js`

**Request Interceptor:**
- Automatically adds `Authorization: Bearer {token}` header
- Reads token from Redux store

**Response Interceptor:**
- Detects 401 Unauthorized responses
- Automatically refreshes token via `/api/refresh_token`
- Retries original request with new token
- Logs out user if refresh fails

**Implementation Note:** This automatic token refresh is critical - DO NOT remove or modify without careful consideration.

---

## Component Conventions

### Global Reusable Components

**Location:** `/src/Components/Globals/`

#### Text Components (`Texts.js`)
```javascript
import { CustomText, TitleText, LargeText, LightText } from '../Components/Globals/Texts';

<CustomText fontFamily="Montserrat-Bold" style={styles.text}>
  Bold Text
</CustomText>

<TitleText>Title</TitleText>
<LightText>Light Text</LightText>
```

**Available Props:**
- `fontFamily`: Montserrat variants (Regular, Bold, Light, Medium, SemiBold, etc.)
- All standard Text props

#### Button Components (`Butttons.js` - note the typo in filename)
```javascript
import { AppButton, GrayButton, TextButton } from '../Components/Globals/Butttons';

<AppButton
  onPress={handlePress}
  title="Submit"
  loading={isLoading}
  style={styles.button}
/>
```

**AppButton Props:**
- `onPress`: Function
- `title`: String
- `loading`: Boolean (shows ActivityIndicator)
- `style`: StyleSheet object
- `textStyle`: StyleSheet object for text

#### Input Components (`Inputs.js`)
```javascript
import { AppInput, AuthInput } from '../Components/Globals/Inputs';

<AppInput
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
  error={errors.field}
/>
```

### Component Patterns

#### 1. Feature-Based Organization
Group related components by domain:
```
src/Components/Parking/
  ├── ParkingView.js
  ├── ParkingHorizontalList.js
  ├── History/
  └── ParkingReservation/
```

#### 2. Props Destructuring with Spread
```javascript
const AppButton = ({ title, loading, onPress, ...props }) => {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      {loading ? <ActivityIndicator /> : <Text>{title}</Text>}
    </TouchableOpacity>
  );
};
```

#### 3. Style Composition
```javascript
<Text style={[styles.baseText, isDark && styles.darkText, style]}>
  {children}
</Text>
```

#### 4. Conditional Rendering
Prefer early returns and ternary operators:
```javascript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorView error={error} />;

return <SuccessView data={data} />;
```

---

## Styling Guidelines

### Theme System

**Location:** `/src/Theme/Theme.js`

**Color Palette:**
```javascript
export const PRIMARY_COLOR = "#f77f00";         // Orange (brand color)
export const PRIMARY_COLOR_DARK = "#d97000";    // Dark orange
export const ORANGE_COLOR = "#ff6839";          // Light orange
export const LIGHT_DARK = "#191818";            // Near black
export const DEFAULT_BORDER_COLOR = "#d8d8d8";  // Light gray
```

**Usage:**
```javascript
import { PRIMARY_COLOR, LIGHT_DARK } from '../Theme/Theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: PRIMARY_COLOR,
  },
  text: {
    color: LIGHT_DARK,
  }
});
```

### Typography System

**Font Family:** Montserrat (18 variants)

**Available Weights:**
- `Montserrat-Thin`
- `Montserrat-Light`
- `Montserrat-Regular`
- `Montserrat-Medium`
- `Montserrat-SemiBold`
- `Montserrat-Bold`
- `Montserrat-ExtraBold`
- `Montserrat-Black`
- Plus italic variants for each

**Font Location:** `/assets/fonts/` (linked via `react-native.config.js`)

**Usage:**
```javascript
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
  },
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  }
});
```

### Styling Best Practices

1. **Use StyleSheet.create:**
   ```javascript
   const styles = StyleSheet.create({
     container: { flex: 1 },
     text: { fontSize: 16 }
   });
   ```

2. **Import Theme Colors:**
   ```javascript
   import { PRIMARY_COLOR } from '../Theme/Theme';
   ```

3. **Compose Styles:**
   ```javascript
   <View style={[styles.base, isActive && styles.active, customStyle]} />
   ```

4. **Use Material Components When Available:**
   - `react-native-paper` for Material Design components
   - `react-native-material-ripple` for ripple effects

5. **Loading States:**
   - Use `react-native-shimmer-placeholder` for skeleton screens
   - ActivityIndicator for button loading states

### UI Libraries in Use

- **react-native-linear-gradient:** Gradient backgrounds
- **react-native-shimmer-placeholder:** Loading skeletons
- **react-native-material-ripple:** Material Design ripple effects
- **react-native-paper:** Material Design components
- **@gorhom/bottom-sheet:** Bottom sheets
- **react-native-modal:** Modals

---

## Navigation Architecture

### Navigation Stack

**Location:** `/src/Navigation.js`

**Library:** React Navigation v6
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `@react-navigation/material-bottom-tabs`

### Navigation Flow

```
App.js (Root)
  ↓
Navigation.js (Determines navigation state)
  ↓
  ├─→ FirstLaunchScreen (FIRST_LAUNCH)
  ├─→ AuthNavigation (NOT_CONNECTED)
  │     ├─→ LoginScreen
  │     ├─→ SignupScreen
  │     └─→ OTPScreen
  └─→ AuthenticatedNavigation (CONNECTED)
        ├─→ Bottom Tab Navigator
        │     ├─→ HomeTab
        │     ├─→ CommandeTab (nested tab view)
        │     └─→ [Other tabs]
        ├─→ ParkingSearchScreen
        ├─→ ParkingReservationScreen
        ├─→ CommandeDetailsScreen
        └─→ UpdateCommandeScreen
```

### Navigation State Management

**Redux-based navigation state:**
```javascript
// src/Store/ApplicationStore.js
navigateScreen: "FIRST_LAUNCH" | "NOT_CONNECTED" | "CONNECTED"
```

**Usage:**
```javascript
import { useSelector } from 'react-redux';

const navigateScreen = useSelector(state => state.application.navigateScreen);

// Navigation component uses this to determine which stack to show
```

### Deep Linking

**Scheme:** `myapp://`

**Configuration:** `/src/Navigation.js`

**Firebase Notification Deep Linking:**
```javascript
// index.js - Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { data } = remoteMessage;
  // Navigate to specific screen based on data
});
```

**Deep Link Patterns:**
- `myapp://commande/{orderId}` → CommandeDetailsScreen
- `myapp://parking` → ParkingHomeScreen

### Navigation Helpers

```javascript
// Navigate to screen
navigation.navigate('ScreenName', { param: 'value' });

// Go back
navigation.goBack();

// Replace current screen
navigation.replace('ScreenName');

// Reset navigation stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

### Custom Tab Bar

**Location:** `/src/Components/Navigation/AppTabBarNavigation.js`

**Features:**
- Material Ripple effect on tab press
- Conditional active state styling
- Custom icons and labels

---

## Third-Party Integrations

### Firebase

**Modules:**
- `@react-native-firebase/app` v18.7.3
- `@react-native-firebase/messaging` v18.7.3

**Configuration Files:**
- Android: `/android/app/google-services.json`
- iOS: Configured via CocoaPods

**Features Implemented:**

1. **Push Notifications:**
   ```javascript
   // Background handler (index.js)
   messaging().setBackgroundMessageHandler(async remoteMessage => {
     console.log('Message handled in the background!', remoteMessage);
   });
   ```

2. **Device Token Management:**
   ```javascript
   // src/notifications/useListenDeviceToken.js
   const token = await messaging().getToken();
   await API.saveDeviceToken(token);
   ```

3. **Topic Subscriptions:**
   - `stores-online` - Store goes online
   - `stores-offline` - Store goes offline

4. **Deep Linking from Notifications:**
   - Notifications can contain navigation data
   - App automatically navigates to relevant screen

### Notifee (Local Notifications)

**Package:** `@notifee/react-native` v7.8.2

**Use Cases:**
- Foreground service (keeps app running on Android)
- Local notifications
- Notification channels
- Audio alerts for new orders

**Sound Player:**
```javascript
// src/Utils/Helpers/SoundNotificationPlayer.js
- Plays custom sound: samsung_galaxy.mp3
- Vibration support
- Used when new order arrives
```

### Google Maps

**Package:** `react-native-maps` v1.10.0

**API Key:** Configured in `/android/app/src/main/AndroidManifest.xml`
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="AIzaSyAgmXk8gWOeglcdCoRTsfj0CYqTgULECXA"/>
```

**Use Cases:**
- Display parking locations
- Search parking by location
- Map markers for available spots

### Form Handling

**Formik + Yup:**
```javascript
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required'),
});

<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={LoginSchema}
  onSubmit={handleLogin}
>
  {({ handleChange, handleSubmit, values, errors }) => (
    <View>
      <AppInput
        onChangeText={handleChange('email')}
        value={values.email}
        error={errors.email}
      />
      <AppButton onPress={handleSubmit} title="Login" />
    </View>
  )}
</Formik>
```

### Date/Time Handling

**Moment.js** v2.29.4 with French locale

**Common Patterns:**
```javascript
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

// Format dates
moment(date).format('DD/MM/YYYY HH:mm');

// Relative time
moment(date).fromNow(); // "il y a 2 heures"
```

**Date Pickers:**
- `react-native-date-picker`
- `@react-native-community/datetimepicker`
- `react-native-modal-datetime-picker`

### Storage

**AsyncStorage:**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Used by redux-persist automatically
// Direct usage for non-Redux data:
await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
```

### Animations

**react-native-reanimated** v3.1.0

**Usage:** Smooth animations for carousels, bottom sheets, etc.

**Note:** Configured in `babel.config.js` as required plugin.

---

## Testing Strategy

### Current Test Setup

**Framework:** Jest v29.2.1 with React Native preset

**Test Files:** `/home/user/Restaurant_app/__tests__/`

**Configuration:**
```json
{
  "jest": {
    "preset": "react-native"
  }
}
```

**Run Tests:**
```bash
npm test
```

### Testing Libraries Available

- `@testing-library/react-test-renderer`
- `babel-jest`
- Jest matchers for React Native

### Testing Best Practices

When writing tests:

1. **Component Testing:**
   ```javascript
   import React from 'react';
   import renderer from 'react-test-renderer';
   import MyComponent from '../MyComponent';

   it('renders correctly', () => {
     const tree = renderer.create(<MyComponent />).toJSON();
     expect(tree).toMatchSnapshot();
   });
   ```

2. **DAO Testing:**
   - Mock axios responses
   - Test error handling
   - Verify request payloads

3. **Redux Testing:**
   - Test action creators
   - Test reducers with different actions
   - Test selectors

### Current Test Coverage

**Status:** Minimal (only basic App test exists)

**Recommendation:** When adding new features, write corresponding tests for:
- Critical user flows (login, order acceptance)
- DAO methods
- Complex component logic
- Redux actions/reducers

---

## Common Tasks & Patterns

### 1. Adding a New Screen

```javascript
// 1. Create screen component
// src/Screens/Authenticated/NewFeatureScreen.js
import React from 'react';
import { View, Text } from 'react-native';

const NewFeatureScreen = ({ navigation, route }) => {
  return (
    <View>
      <Text>New Feature</Text>
    </View>
  );
};

export default NewFeatureScreen;

// 2. Add to navigation
// src/Screens/Authenticated/AuthenticatedNavigation.js
import NewFeatureScreen from './NewFeatureScreen';

<Stack.Screen name="NewFeature" component={NewFeatureScreen} />

// 3. Navigate to it
navigation.navigate('NewFeature', { param: 'value' });
```

### 2. Adding a New API Endpoint

```javascript
// 1. Add route constant
// src/api/routes.js
export const NEW_ENDPOINT = '/api/new_endpoint';

// 2. Create DAO method
// src/Daos/NewFeatureDAO.js
import axios from 'axios';
import { NEW_ENDPOINT } from '../api/routes';

class NewFeatureDAO {
  async fetchData(params) {
    const response = await axios.post(NEW_ENDPOINT, params);
    return response.data;
  }
}

export default new NewFeatureDAO();

// 3. Export from index
// src/Daos/index.js
export { default as NewFeatureDAO } from './NewFeatureDAO';

// 4. Use in component with custom hook
import useDaoCall from '../Hooks/useDaoCall';
import { NewFeatureDAO } from '../Daos';

const [loading, error, data, callDao] = useDaoCall();

useEffect(() => {
  callDao(() => NewFeatureDAO.fetchData({ id: 123 }));
}, []);
```

### 3. Adding a New Global Component

```javascript
// 1. Create component
// src/Components/Globals/NewComponent.js
import React from 'react';
import { View } from 'react-native';

export const NewComponent = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

// 2. Export from Globals
// Import and use throughout the app
import { NewComponent } from '../Components/Globals/NewComponent';
```

### 4. Adding Zustand Store for Feature

```javascript
// src/Screens/Authenticated/MyFeature/useMyFeatureStore.js
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useMyFeatureStore = create(
  immer((set, get) => ({
    // State
    items: [],
    selectedItem: null,

    // Actions
    setItems: (items) => set((state) => {
      state.items = items;
    }),

    selectItem: (id) => set((state) => {
      state.selectedItem = state.items.find(item => item.id === id);
    }),

    reset: () => set(() => ({
      items: [],
      selectedItem: null,
    })),
  }))
);

// Usage in component
const { items, setItems, selectItem } = useMyFeatureStore();
```

### 5. Handling Push Notifications

```javascript
// Listen for foreground messages
import messaging from '@react-native-firebase/messaging';

useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);

    // Play sound
    import('../Utils/Helpers/SoundNotificationPlayer').then(module => {
      module.playNotificationSound();
    });

    // Show notification or update UI
  });

  return unsubscribe;
}, []);
```

### 6. Playing Notification Sound

```javascript
// src/Utils/Helpers/SoundNotificationPlayer.js
import Sound from 'react-native-sound';

export const playNotificationSound = () => {
  const sound = new Sound('samsung_galaxy.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    sound.play();
  });
};
```

### 7. Theme Color Usage

```javascript
import { PRIMARY_COLOR, LIGHT_DARK } from '../Theme/Theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  }
});
```

### 8. Form Validation with Formik + Yup

```javascript
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Trop court!')
    .max(50, 'Trop long!')
    .required('Requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Requis'),
});

<Formik
  initialValues={{ name: '', email: '' }}
  validationSchema={Schema}
  onSubmit={handleSubmit}
>
  {({ handleChange, handleSubmit, values, errors, touched }) => (
    <>
      <AppInput
        onChangeText={handleChange('name')}
        value={values.name}
        error={touched.name && errors.name}
      />
      <AppButton onPress={handleSubmit} title="Soumettre" />
    </>
  )}
</Formik>
```

### 9. Date Formatting with Moment.js

```javascript
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

// Format display date
const displayDate = moment(date).format('DD MMMM YYYY à HH:mm');
// "14 novembre 2025 à 15:30"

// Relative time
const relativeTime = moment(date).fromNow();
// "il y a 2 heures"

// Calendar format
const calendarDate = moment(date).calendar();
// "Aujourd'hui à 15:30"
```

### 10. Redux Dispatch Pattern

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken } from '../Store/ApplicationStore';

const dispatch = useDispatch();

// Dispatch action
dispatch(setUser(userData));
dispatch(setToken(token));

// Select from state
const user = useSelector(state => state.application.user);
const token = useSelector(state => state.application.token);
```

---

## Important Considerations

### 1. Security Concerns

#### API Keys in Code
**Issue:** Google Maps API key is hardcoded in `AndroidManifest.xml`:
```xml
AIzaSyAgmXk8gWOeglcdCoRTsfj0CYqTgULECXA
```

**Recommendation:**
- Move to environment variables
- Restrict API key usage in Google Cloud Console
- Add API key restrictions (app package name, etc.)

#### Token Management
- Tokens are stored in Redux Persist (AsyncStorage)
- AsyncStorage is NOT encrypted by default
- Consider using `react-native-keychain` for sensitive data

### 2. Code Quality

#### TypeScript Configuration
- Project has `tsconfig.json` configured
- Most files are `.js` instead of `.ts`
- **Recommendation:** Gradually migrate to TypeScript for type safety

#### File Naming Typo
- `/src/Components/Globals/Butttons.js` (should be "Buttons")
- **Consider:** Renaming for consistency

#### Test Coverage
- Minimal test coverage (1 test file)
- **Recommendation:** Add tests for critical flows

### 3. Performance Optimizations

#### Potential Improvements
1. **Memoization:** Use `React.memo`, `useMemo`, `useCallback` for expensive renders
2. **List Optimization:** Use `FlatList` with `getItemLayout` for better performance
3. **Image Optimization:** Consider lazy loading and caching strategies
4. **Bundle Size:** Analyze and optimize bundle size

### 4. Accessibility

**Current State:** Limited accessibility support

**Recommendations:**
- Add `accessibilityLabel` to interactive elements
- Use `accessibilityRole` appropriately
- Test with screen readers
- Ensure sufficient color contrast

### 5. Error Handling

**Current Patterns:**
- Try-catch in DAO methods
- Error states in `useDaoCall` hook
- Axios interceptor for 401 errors

**Best Practices:**
- Always handle API errors gracefully
- Show user-friendly error messages
- Log errors for debugging
- Consider error boundary for React errors

### 6. Localization

**Current State:** French language appears throughout (form validation messages, etc.)

**Considerations:**
- No i18n library detected
- Hardcoded strings in components
- **Recommendation:** Implement `react-i18next` if multi-language support needed

### 7. Maintenance Notes

#### Deprecated Dependencies
Check for deprecated packages:
```bash
npm outdated
```

#### React Native Version
- Currently on 0.71.8
- **Recommendation:** Plan upgrade to latest stable version
- Check upgrade guides before upgrading

#### Firebase Configuration
- Multiple Google Services JSON files exist:
  - `google-services.json`
  - `google-services_old.json`
  - `google-services_new_old.json`
  - `google-services_last_old.json`
- **Recommendation:** Clean up unused configuration files

### 8. Environment-Specific Considerations

#### API Base URL
- Hardcoded in `/src/api/routes.js`: `https://app.fakodrop.com/api`
- **Recommendation:** Use environment variables for different environments (dev, staging, prod)

#### Debug Configuration
- Clear text traffic enabled in AndroidManifest
- **Warning:** Disable for production builds

### 9. Known Issues & Warnings

#### Zone.Identifier Files
- Multiple `:Zone.Identifier` files exist (Windows download markers)
- **Action:** Safe to delete, don't commit to git
- Add to `.gitignore`: `**/:Zone.Identifier`

### 10. Development Best Practices for AI Assistants

When working on this codebase:

1. **Always check existing patterns** before implementing new features
2. **Use established DAOs** for API calls rather than direct axios calls
3. **Follow the component organization** structure (feature-based)
4. **Respect the state management hierarchy** (Redux for global, Zustand for local, React Query for server)
5. **Import theme colors** rather than hardcoding color values
6. **Use Montserrat font family** for consistency
7. **Test on both iOS and Android** when adding platform-specific code
8. **Handle loading and error states** for all async operations
9. **Follow Git workflow** with proper commit messages
10. **Document new features** and update this CLAUDE.md file

---

## Quick Reference Commands

```bash
# Development
npm start                    # Start Metro bundler
npm run android              # Run on Android
npm run ios                  # Run on iOS (macOS only)
npm run lint                 # Run ESLint
npm test                     # Run Jest tests

# Debugging
npx react-native log-android # View Android logs
npx react-native log-ios     # View iOS logs

# Cleanup
npm run clean                # Clean build (if script exists)
cd android && ./gradlew clean # Clean Android build
cd ios && pod deintegrate && pod install # Reinstall iOS pods

# Git
git status                   # Check git status
git log --oneline -10        # View recent commits
git branch                   # List branches
```

---

## Resources & Documentation

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/v3)
- [Firebase React Native](https://rnfirebase.io/)
- [Formik](https://formik.org/docs/overview)
- [Yup](https://github.com/jquense/yup)

---

**End of CLAUDE.md**

*This file should be updated whenever significant architectural changes are made to the codebase.*
