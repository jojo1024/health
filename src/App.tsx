import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientForm from "./pages/PatientForm";
import Doctors from "./pages/Doctors";
import DoctorForm from "./pages/DoctorForm";
import Consultations from "./pages/Consultations";
import Prescriptions from "./pages/Prescriptions";
import PatientDetails from "./pages/PatientDetails";
import PatientConsultations from "./pages/PatientConsultations";
import DoctorDetails from "./pages/DoctorDetails";
import ConsultationForm from "./pages/ConsultationForm";
import ConsultationDetails from "./pages/ConsultationDetails";
import ReimbursementForm from "./pages/ReimbursementForm";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import PrescriptionForm from "./pages/PrescriptionForm";
import Login from "./pages/Login";

// Route protection component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log for debugging
  console.log("Protected route check:", { isAuthenticated, isLoading, path: location.pathname });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  // Log the application bootstrap
  console.log("App rendering");

  return (
    <AuthProvider>
      <Router>
        {/* Added a key to force remount when the route changes */}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Add the new patient form route before the dynamic :id route */}
          <Route path="/patients/new" element={
            <ProtectedRoute>
              <Layout>
                <PatientForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/patients" element={
            <ProtectedRoute>
              <Layout>
                <Patients />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/patients/:id" element={
            <ProtectedRoute>
              <Layout>
                <PatientDetails />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/patients/:patientId/consultations" element={
            <ProtectedRoute>
              <Layout>
                <PatientConsultations />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors" element={
            <ProtectedRoute>
              <Layout>
                <Doctors />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors/new" element={
            <ProtectedRoute>
              <Layout>
                <DoctorForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors/:id" element={
            <ProtectedRoute>
              <Layout>
                <DoctorDetails />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <DoctorForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultations" element={
            <ProtectedRoute>
              <Layout>
                <Consultations />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultations/new" element={
            <ProtectedRoute>
              <Layout>
                <ConsultationForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultations/:id" element={
            <ProtectedRoute>
              <Layout>
                <ConsultationDetails />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultations/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <ConsultationForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/consultations/:consultationId/reimbursement" element={
            <ProtectedRoute>
              <Layout>
                <ReimbursementForm />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Add the new prescription form route before the dynamic :id route */}
          <Route path="/prescriptions/new" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/prescriptions" element={
            <ProtectedRoute>
              <Layout>
                <Prescriptions />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/prescriptions/:id" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionDetails />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/prescriptions/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <PrescriptionForm />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
