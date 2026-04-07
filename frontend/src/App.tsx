import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import RootRedirect from "./routes/RootRedirect";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";

function App() { 
  return (
    <AuthProvider>
      <AppRoutes />

      <Toaster 
        position="bottom-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: "#1C1F2A",
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            borderRadius: "1rem",
            padding: "0.75rem 1.5rem",
          },
          success: { duration: 4000 },
          error: { duration: 5000 },
        }}
      />
    </AuthProvider>
  );
}
  
const AppRoutes = () => {
  const auth = useContext(AuthContext);
  
  return (
    <BrowserRouter>
      {auth?.token && <Navbar />}
      
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App
