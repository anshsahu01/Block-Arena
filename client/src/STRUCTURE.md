## Frontend Folder Structure

A well-organized React project using a feature-driven architecture.

```
client/src/
├── pages/               # Full page components (view-level)
│   ├── LoadingPage.jsx  # Loading screen
│   ├── LoginPage.jsx    # Login/Register page
│   ├── ColorPage.jsx    # Color selection page
│   └── GridPage.jsx     # Main grid/game page
│
├── components/          # Reusable UI components
│   ├── AuthForm.jsx     # Login/Register form
│   ├── ColorPicker.jsx  # Color selection component
│   ├── Grid.jsx         # Grid rendering
│   └── Header.jsx       # Page header
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication state & logic
│   └── useGrid.js       # Grid state & socket logic
│
├── services/            # External service integrations
│   └── socket.js        # Socket.IO client & event handlers
│
├── utils/               # Utility functions & constants
│   ├── constants.js     # Global constants (GRID_SIZE, API_URL, etc)
│   ├── api.js          # API request functions
│   └── helpers.js      # Helper functions (randomColor, buildGridMap, etc)
│
├── styles/              # Global styles
│   ├── index.css       # Tailwind imports
│   └── App.css         # Component-specific styles
│
├── assets/              # Images, fonts, etc
│
├── App.jsx              # Main app component (clean 50 lines)
├── main.jsx             # React entry point
└── vite.config.js       # Vite configuration
```

## File Responsibilities

### Pages
- **Responsible for**: Full page layout and routing logic
- **Structure**: Contains page-level components that might span entire viewport
- **Pattern**: Use hooks for state, render components for UI

### Components
- **Responsible for**: Reusable UI fragments with specific purposes
- **Props**: Accept data and callbacks as props
- **Pattern**: Pure functional components, no business logic

### Hooks
- **Responsible for**: State management and side effects
- **Pattern**: Custom hooks that encapsulate related state logic
- **Benefits**: Reusable, testable, separation from UI

### Services
- **Responsible for**: External API/library integrations
- **Pattern**: Wrapper functions for third-party services
- **Usage**: Imported by hooks, not components

### Utils
- **constants.js**: Configuration values, theme constants
- **api.js**: HTTP request functions and endpoints
- **helpers.js**: Pure utility functions

### Styles
- **index.css**: Global Tailwind imports
- **App.css**: App-level styles (rarely needed with Tailwind)

## Data Flow

```
Page Component
    ↓
    └─→ Components (receive data via props)
    └─→ Hooks (manage state & effects)
        ↓
        └─→ Services (call APIs, sockets)
        └─→ Utils (execute helper functions)
```

## Adding New Features

### 1. New Page
```bash
# Create page
touch src/pages/MyPage.jsx

# Keep it as a container that uses hooks
import { useMyHook } from "../hooks/useMyHook.js";
import { MyComponent } from "../components/MyComponent.jsx";

export const MyPage = () => {
  const state = useMyHook();
  return <MyComponent data={state} />;
};
```

### 2. New Component
```bash
# Create component
touch src/components/MyComponent.jsx

# Pure UI component
export const MyComponent = ({ data, onAction }) => {
  return <div onClick={onAction}>{data}</div>;
};
```

### 3. New Hook
```bash
# Create hook
touch src/hooks/useMyState.js

# Encapsulate state logic
import { useState, useEffect } from "react";
export const useMyState = () => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // side effects
  }, []);
  
  return { state, setState };
};
```

## Import Conventions

✅ **Correct**
```js
import { useAuth } from "../hooks/useAuth.js";
import { randomHexColor } from "../utils/helpers.js";
import { socket } from "../services/socket.js";
import { AuthForm } from "../components/AuthForm.jsx";
```

❌ **Avoid**
```js
// Don't import from sibling folders
import { useAuth } from "./useAuth.js";
// Don't import business logic into components
import { apiRequest } from "../utils/api.js"; // use hooks instead
```

## Benefits of This Structure

1. **Scalability**: Easy to add features without cluttering root
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Pure functions in utils, isolated hooks
4. **Reusability**: Components and hooks can be reused across pages
5. **Performance**: Hooks manage re-renders efficiently
6. **Collaboration**: Teams can work on different features independently

## Next Steps

- Add more pages as features grow
- Create component library in components/
- Add integration tests for hooks
- Move complex logic from components to hooks
