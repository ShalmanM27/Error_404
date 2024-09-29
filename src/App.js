import React, { useState, useEffect } from 'react';
import Contract from './contract';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Login';
import AdminPage from './Admin';
import Patient from './Patient';
import Doctor from './Doctor';
import Homepage from './Homepage';  // Import the homepage component

const ADMIN_ADDRESS = 'YOUR_ADMIN_ADDRESS';

const App = () => {
  const { acc, contract } = Contract(); // Get account and contract from Contract
  const [role, setRole] = useState(''); // To store if the user is a 'doctor' or 'patient'

  useEffect(() => {
    const determineRole = async () => {
      if (contract && acc) {
        try {
          // Check if the connected address is a doctor
          const doctor = await contract.doctors(acc);
          const isDoctor = doctor.exists;

          if (isDoctor) {
            setRole('doctor');
            return;
          }

          // Check if the connected address is a patient
          const patient = await contract.patients(acc);
          const isPatient = patient.id !== 0;

          if (isPatient) {
            setRole('patient');
          }
        } catch (err) {
          console.error('Error determining role:', err);
        }
      }
    };

    determineRole();
  }, [contract, acc]);

  if (!role && acc !== ADMIN_ADDRESS) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={acc === ADMIN_ADDRESS ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/patient"
          element={role === 'patient' ? <Patient /> : <Navigate to="/" />}
        />
        <Route
          path="/doctor"
          element={role === 'doctor' ? <Doctor /> : <Navigate to="/" />}
        />
        {/* Route to Homepage if the user is a patient */}
        <Route
          path="/homepage"
          element={role === 'patient' ? <Homepage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
