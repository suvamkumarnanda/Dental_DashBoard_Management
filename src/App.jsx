import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";

import PatientDashboard from "./pages/PatientDashboard";
import AdminRoute from "./components/AdminRoute";

import AppointmentsProvider from "./context/AppointmentsContext";

const App=()=>{
return (
    <>
    <AppointmentsProvider>
    <Router>
    <Header></Header>
        <Routes>
        <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login/>}/>
             <Route path="/register" element={<Register />} />
            
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            

            <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute roles={['admin']}>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute roles={['patient']}>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
       

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
    </AppointmentsProvider>
    </>
);

}
export default App;