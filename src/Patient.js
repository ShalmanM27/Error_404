import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Contract from './contract'; // Assuming you have your contract functions in contract.js
import './Patient.css';
import Chatbot from './chatbot'; // Import the chatbot component

const Patient = () => {
    const { acc, contract, provider } = Contract();
    const [records, setRecords] = useState([]);
    const [doctorAddress, setDoctorAddress] = useState('');
    const [description, setDescription] = useState('');
    const [recordLink, setRecordLink] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

    useEffect(() => {
        if (contract && acc) {
            loadPatientRecords();
        }
    }, [contract, acc]);

    const loadPatientRecords = async () => {
        setLoading(true);
        try {
            const signer = provider.getSigner(acc);
            const contractWithSigner = contract.connect(signer);

            const myRecords = await contractWithSigner.viewMyRecords();
            setRecords(myRecords);
        } catch (err) {
            console.error(err);
            setError('Failed to load records.');
        } finally {
            setLoading(false);
        }
    };

    const grantDoctorAccess = async () => {
        setLoading(true);
        try {
            const signer = provider.getSigner(acc);
            const contractWithSigner = contract.connect(signer);

            await contractWithSigner.grantDoctorAccess(doctorAddress);
            loadPatientRecords();
            clearInputs();
        } catch (err) {
            console.error(err);
            setError('Failed to grant access.');
        } finally {
            setLoading(false);
        }
    };

    const revokeDoctorAccess = async () => {
        setLoading(true);
        try {
            await contract.revokeDoctorAccess(doctorAddress);
            loadPatientRecords();
            clearInputs();
        } catch (err) {
            console.error(err);
            setError('Failed to revoke access.');
        } finally {
            setLoading(false);
        }
    };

    const uploadRecord = async () => {
        setLoading(true);
        try {
            await contract.uploadPatientRecord(acc, recordLink, description);
            loadPatientRecords();
            clearInputs();
        } catch (err) {
            console.error(err);
            setError('Failed to upload record.');
        } finally {
            setLoading(false);
        }
    };

    const clearInputs = () => {
        setDoctorAddress('');
        setDescription('');
        setRecordLink('');
    };

    const handleImageClick = (hash) => {
        setSelectedImage(hash); // Set the selected image
    };

    const closeModal = () => {
        setSelectedImage(null); // Clear the selected image
    };

    return (
        <div className="patient-dashboard">
            <h1 className="patient-title">Patient Dashboard</h1>
            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="records-container">
                        <h2 className="section-title">My Records</h2>
                        <ul className="record-list">
                            {records.map((record, index) => (
                                <li className="record-item" key={index}>
                                    <img 
                                        src={record.hash} 
                                        alt={`Medical Record ${index}`} 
                                        className="record-image" 
                                        onClick={() => handleImageClick(record.hash)} // Handle image click
                                    />
                                    <p><strong>Timestamp:</strong> {new Date(record.timestamp * 1000).toLocaleString()}</p>
                                    <p><strong>Description:</strong> {record.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="access-container">
                        <h2 className="section-title">Grant Doctor Access</h2>
                        <input
                            type="text"
                            className="input-doctor-address"
                            placeholder="Doctor Address"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                            title="Enter the doctor's Ethereum address"
                        />
                        <button className="button-grant" onClick={grantDoctorAccess}>Grant Access</button>

                        <h2 className="section-title">Revoke Doctor Access</h2>
                        <input
                            type="text"
                            className="input-doctor-address"
                            placeholder="Doctor Address"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                            title="Enter the doctor's Ethereum address"
                        />
                        <button className="button-revoke" onClick={revokeDoctorAccess}>Revoke Access</button>
                    </div>

                    <div className="upload-container">
                        <h2 className="section-title">Upload Medical Record</h2>
                        <input
                            type="text"
                            className="input-record-hash"
                            placeholder="Record Link"
                            value={recordLink}
                            onChange={(e) => setRecordLink(e.target.value)}
                            title="Enter the link of the record"
                        />
                        <input
                            type="text"
                            className="input-description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            title="Enter a description of the record"
                        />
                        <button className="button-upload" onClick={uploadRecord}>Upload Record</button>
                    </div>

                    {/* Integrate the chatbot */}
                    <Chatbot />

                    {/* Modal for displaying the selected image */}
                    {selectedImage && (
                        <div className="modal" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <span className="close-button" onClick={closeModal}>&times;</span>
                                <img src={selectedImage} alt="Selected Record" className="modal-image" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Patient;
