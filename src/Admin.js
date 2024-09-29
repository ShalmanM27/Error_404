import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import './index.css'; // Assuming you named your CSS file index.css
import Contract from './contract'; // Assuming you have your contract functions in contract.js
import './Admin.css'; // Import the CSS file for styles

const AdminPage = () => {
  const { provider, contract, acc } = Contract();
  const [doctor, setDoctor] = useState({ address: '', id: '', name: '', specialization: '', experienceYears: '' });
  const [patient, setPatient] = useState({ address: '', id: '', name: '' });
  const [record, setRecord] = useState({ patientAddress: '', hash: '', description: '' });
  const [doctors, setDoctors] = useState([]); // State to store all doctors
  const [deleteDoctorAddress, setDeleteDoctorAddress] = useState(''); // For deleting a doctor

  const addDoctorRef = useRef(null);
  const registerPatientRef = useRef(null);
  const uploadRecordRef = useRef(null);
  const deleteDoctorRef = useRef(null);
  const doctorsListRef = useRef(null);

  useEffect(() => {
    if (contract && acc) {
      loadDoctors();
    }
  }, [contract, acc]);

  // Load all doctors from the contract
  const loadDoctors = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractwithsigner = contract.connect(signer);
      const [doctorAddresses, doctorList] = await contractwithsigner.getAllDoctors();

      const formattedDoctors = doctorList.map((doc, index) => ({
        address: doctorAddresses[index],
        id: doc.id.toNumber(), // Convert BigNumber to Number
        name: doc.name,
        specialization: doc.specialization,
        experienceYears: doc.experienceYears.toNumber(), // Convert BigNumber to Number
      }));

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleAddDoctor = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractwithsigner = contract.connect(signer);

      const tx = await contractwithsigner.addDoctor(
        doctor.address,
        doctor.id,
        doctor.name,
        doctor.specialization,
        doctor.experienceYears
      );
      await tx.wait();
      console.log(tx);
      alert('Doctor added successfully!');
      loadDoctors(); // Reload doctors after adding one
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const handleRegisterPatient = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractwithsigner = contract.connect(signer);

      const tx = await contractwithsigner.registerPatient(
        patient.address,
        patient.id,
        patient.name
      );
      await tx.wait();
      console.log(tx);
      alert('Patient registered successfully!');
    } catch (error) {
      console.error('Error registering patient:', error);
    }
  };

  const handleUploadRecord = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractwithsigner = contract.connect(signer);

      const tx = await contractwithsigner.uploadPatientRecord(
        record.patientAddress,
        record.hash,
        record.description
      );
      await tx.wait();
      console.log(tx);
      alert('Record uploaded successfully!');
    } catch (error) {
      console.error('Error uploading record:', error);
    }
  };

  const handleDeleteDoctor = async () => {
    try {
      const signer = provider.getSigner(acc);
      const contractwithsigner = contract.connect(signer);

      const tx = await contractwithsigner.deleteDoctor(deleteDoctorAddress);
      await tx.wait();
      console.log(tx);
      alert('Doctor deleted successfully!');
      loadDoctors(); // Reload doctors after deletion
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  return (
    <>
      <nav className="navbar">
        <ul>
          <li onClick={() => scrollToRef(addDoctorRef)}>Add Doctor</li>
          <li onClick={() => scrollToRef(registerPatientRef)}>Register Patient</li>
          <li onClick={() => scrollToRef(uploadRecordRef)}>Upload Patient Record</li>
          <li onClick={() => scrollToRef(deleteDoctorRef)}>Delete Doctor</li>
          <li onClick={() => scrollToRef(doctorsListRef)}>Doctors List</li>
        </ul>
      </nav>

      <div className="extra-container">
        <div className="container">
          <h1 className="admin-heading">Admin Page</h1>

          {/* Add Doctor Section */}
          <div className="section-container" ref={addDoctorRef}>
            <h2>Add Doctor</h2>
            <form>
              <input type="text" placeholder="Address" onChange={(e) => setDoctor({ ...doctor, address: e.target.value })} />
              <input type="number" placeholder="ID" onChange={(e) => setDoctor({ ...doctor, id: e.target.value })} />
              <input type="text" placeholder="Name" onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} />
              <input type="text" placeholder="Specialization" onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })} />
              <input type="number" placeholder="Experience Years" onChange={(e) => setDoctor({ ...doctor, experienceYears: e.target.value })} />
              <button type="button" onClick={handleAddDoctor}>Add Doctor</button>
            </form>
          </div>

          {/* Register Patient Section */}
          <div className="section-container" ref={registerPatientRef}>
            <h2>Register Patient</h2>
            <form>
              <input type="text" placeholder="Patient Address" onChange={(e) => setPatient({ ...patient, address: e.target.value })} />
              <input type="number" placeholder="Patient ID" onChange={(e) => setPatient({ ...patient, id: e.target.value })} />
              <input type="text" placeholder="Patient Name" onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
              <button type="button" onClick={handleRegisterPatient}>Register Patient</button>
            </form>
          </div>

          {/* Upload Patient Record Section */}
          <div className="section-container" ref={uploadRecordRef}>
            <h2>Upload Patient Record</h2>
            <form>
              <input type="text" placeholder="Patient Address" onChange={(e) => setRecord({ ...record, patientAddress: e.target.value })} />
              <input type="text" placeholder="Record Link" onChange={(e) => setRecord({ ...record, hash: e.target.value })} />
              <input type="text" placeholder="Description" onChange={(e) => setRecord({ ...record, description: e.target.value })} />
              <button type="button" onClick={handleUploadRecord}>Upload Record</button>
            </form>
          </div>

          {/* Delete Doctor Section */}
          <div className="section-container" ref={deleteDoctorRef}>
            <h2>Delete Doctor</h2>
            <form>
              <input type="text" placeholder="Doctor Address" onChange={(e) => setDeleteDoctorAddress(e.target.value)} />
              <button type="button" onClick={handleDeleteDoctor}>Delete Doctor</button>
            </form>
          </div>

          {/* Doctors List Section */}
          <div className="section-container doctors-list-container" ref={doctorsListRef}>
            <h2>Doctors List</h2>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
