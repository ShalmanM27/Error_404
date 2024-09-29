import React, { useState, useEffect, useRef } from 'react';
import Contract from './contract';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const { acc, contract, provider } = Contract();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const doctorsListRef = useRef(null);

  const goToPatientPage = () => {
    navigate('/patient');
  };

  // Function to load all doctors from the smart contract
  const loadDoctors = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractWithSigner = contract.connect(signer);

      // Fetch doctor addresses and doctor details
      const [doctorAddresses, doctorList] = await contractWithSigner.getAllDoctors();

      // Format the data to display properly
      const formattedDoctors = doctorList.map((doc, index) => ({
        address: doctorAddresses[index],
        id: doc.id.toNumber(), // Convert BigNumber to number
        name: doc.name,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears.toNumber(), // Convert BigNumber to number
      }));

      // Update state with the formatted doctor list
      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  // Load doctors on component mount
  useEffect(() => {
    loadDoctors();
  }, [acc, contract]);

  return (
    <div className="homepage-container">
      <h1>Welcome to HealthChain</h1>
      <p>Your decentralized healthcare system.</p>
      <div className="button-container">
        <button className="patient-button" onClick={goToPatientPage}>
          Go to Patient Dashboard
        </button>
      </div>

      {/* Doctor List Section */}
      <div className="section-container doctors-list-container" ref={doctorsListRef}>
        <h2>Doctors List</h2>
        {doctors.length > 0 ? (
          <ul>
            {doctors.map((doc, index) => (
              <li key={index}>
                <div>
                  <strong>Name:</strong> {doc.name} <br />
                  <strong>ID:</strong> {doc.id} <br />
                  <strong>Specialization:</strong> {doc.specialization} <br />
                  <strong>Experience:</strong> {doc.experienceYears} years
                </div>
                <div>
                  <strong>Address:</strong> {doc.address}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading doctors...</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
