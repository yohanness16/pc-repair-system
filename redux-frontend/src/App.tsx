import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DeviceList from "./pages/DashboardPage";
import LoginForm from "./pages/LoginPage";
import RegisterForm from "./pages/RegisterPage";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/authSlice";

function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <header className="App-header">
        <h1>IT Device Management</h1>
        <div>
          {user && (
            <>
              <span style={{ marginRight: "15px" }}>
                Welcome, {user.username} ({user.role})
              </span>
              {/* Admin-only link to the registration page */}
              {user.role === "admin" && (
                <Link
                  to="/register"
                  style={{ color: "white", marginRight: "15px" }}
                >
                  Register User
                </Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>
      <main>
        <DashboardPage />
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        />
        <Route
          path="register"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <header className="App-header">
                  <h1>IT Device Management</h1>
                  <div>
                    <span style={{ marginRight: "15px" }}>Admin Panel</span>
                    <Link
                      to="/"
                      style={{ color: "white", marginRight: "15px" }}
                    >
                      Dashboard
                    </Link>
                  </div>
                </header>
                <main>
                  <RegisterForm />
                </main>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
