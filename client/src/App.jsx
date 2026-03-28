import { useAuth } from "./hooks/useAuth.js";
import { useGrid } from "./hooks/useGrid.js";
import { LoadingPage } from "./pages/LoadingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { ColorPage } from "./pages/ColorPage.jsx";
import { GridPage } from "./pages/GridPage.jsx";
import { AUTH_MODES } from "./utils/constants.js";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const auth = useAuth();
  const grid = useGrid(auth.token, auth.user, auth.isLoggedIn);

  const handleAuth = async (mode, payload) => {
    if (mode === AUTH_MODES.REGISTER) {
      await auth.register(payload);
    } else {
      await auth.login(payload);
    }
  };

  const handleColorSubmit = async (color) => {
    await auth.updatePreferences({ color });
  };

  // Loading state
  if (auth.isLoading) {
    return <LoadingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/auth"
        element={
          auth.isLoggedIn ? <Navigate to="/arena" replace /> : <AuthPage onAuth={handleAuth} />
        }
      />

      <Route
        path="/arena"
        element={
          !auth.isLoggedIn ? (
            <Navigate to="/auth" replace />
          ) : !auth.hasColorPreference ? (
            <ColorPage username={auth.user.username} onColorSubmit={handleColorSubmit} />
          ) : (
            <GridPage
              user={auth.user}
              grid={grid.grid}
              capturedCount={grid.capturedCount}
              statusMessage={grid.statusMessage}
              liveFeed={grid.liveFeed}
              onBlockClick={grid.claimBlock}
              onLogout={auth.logout}
            />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;