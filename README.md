# Oro RN

A modern React Native app scaffolded with Expo, TypeScript, NativeWind (TailwindCSS), and Expo Router, following industry best practices.

## Features
- Expo + TypeScript
- NativeWind (TailwindCSS for React Native)
- **Expo Router** for file-based routing and layouts
- Scalable project structure (`app/`)
- Path aliases for easy imports

## Getting Started

### 1. Install dependencies
```sh
npm install
```

### 2. Start the development server
```sh
npm start
```

### 3. Open the app
- Use the Expo Go app on your device, or
- Run on an emulator with `npm run ios` or `npm run android`

## Project Structure
```
app/
  _layout.tsx         # Root layout (applies to all screens)
  index.tsx           # Home screen
  auth/
    _layout.tsx       # Auth group layout
    login.tsx         # Login screen
  dashboard/
    _layout.tsx       # Dashboard group layout
    index.tsx         # Dashboard home screen
src/
  components/         # Reusable UI components
  hooks/              # Custom React hooks
  utils/              # Utility functions
```

## Routing & Layouts
- Uses [Expo Router](https://docs.expo.dev/router/) for file-based routing.
- Each folder in `app/` can have its own `_layout.tsx` for shared UI.
- Screens are defined by `.tsx` files; nested folders = nested routes.

## Styling
- Uses [NativeWind](https://www.nativewind.dev/) for utility-first styling.
- Tailwind config is in `tailwind.config.js`.

## Best Practices
- Group screens by feature/domain in `app/`.
- Use `_layout.tsx` for shared layouts per group.
- Keep shared components in `src/components`.
- Use hooks and utils for business logic.

---

Feel free to customize further as your project grows! 