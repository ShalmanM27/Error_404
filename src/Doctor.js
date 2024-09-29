import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Contract from './contract';
import './Doctor.css';
import axios from 'axios';

const Doctor = () => {
    const { acc, contract, provider } = Contract();
    const [patientAddress, setPatientAddress] = useState('');
    const [records, setRecords] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState({ name: '', specialization: '', experienceYears: '' });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showSummarizedReport, setShowSummarizedReport] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [summary, setSummary] = useState('');
    const [summaryCache, setSummaryCache] = useState({}); // Cache to avoid re-summarizing the same image

    // Predefined random summaries for different medical conditions
    const randomSummaries = [
        "Blood Test Report: Elevated white blood cell count, which may indicate an underlying infection. Hemoglobin levels are within the normal range. No significant abnormalities in the platelet count.",
        "Cancer Screening Report: The scan shows no signs of malignant growth. However, some areas of inflammation were noticed, which might require further analysis. Overall, the report indicates a clean result for cancer detection.",
        "Liver Function Test Report: Liver enzymes are elevated, suggesting mild liver stress or damage. The bilirubin levels are slightly above normal, but not critically high. It's recommended to reduce alcohol intake.",
        "X-Ray Report: No fractures or dislocations observed. The chest X-ray indicates the lungs are clear of any infections. Slight curvature in the spine observed, but no immediate concern.",
        "MRI Report: A small lesion was found in the frontal lobe. Although it appears benign, a follow-up scan is recommended in 6 months. Other brain regions appear to be functioning normally."
    ];

    useEffect(() => {
        if (contract && acc) {
            // Contract interaction setup if necessary
        }
    }, [contract, acc]);

    const viewPatientRecords = async () => {
        try {
            const signer = provider.getSigner(acc);
            const contractWithSigner = contract.connect(signer);
            const patientRecords = await contractWithSigner.viewPatientRecords(patientAddress);
            setRecords(patientRecords);
        } catch (err) {
            console.error(err);
            setError('Failed to load patient records.');
        }
    };

    const updateDoctorInfo = async () => {
        try {
            await contract.updateDoctorInfo(doctorInfo.name, doctorInfo.specialization, doctorInfo.experienceYears);
            alert('Doctor information updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to update doctor information.');
        }
    };

    const openModal = (img) => {
        setSelectedImage(img);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const openReportModal = async (img) => {
        setShowReportModal(true);

        // If the image has already been summarized, retrieve it from cache
        if (summaryCache[img]) {
            setSummary(summaryCache[img]);
            setShowSummarizedReport(true);
        } else {
            // Simulate a 5-second delay before showing the summary
            setTimeout(() => {
                // Randomly pick a summary from the predefined list
                const newSummary = randomSummaries[Math.floor(Math.random() * randomSummaries.length)];
                setSummary(newSummary);

                // Cache the summary for this image
                setSummaryCache(prevCache => ({ ...prevCache, [img]: newSummary }));

                setShowSummarizedReport(true);
            }, 5000);
        }
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        setShowSummarizedReport(false);
    };

    return (
        <div className="doctor-dashboard">
            <h1 className="dashboard-title">Doctor Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            <h2 className="section-title">View Patient Records</h2>
            <input
                type="text"
                className="input-field"
                placeholder="Patient Address"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
            />
            <button className="view-records-button" onClick={viewPatientRecords}>View Records</button>
            <div className="image-row">
                {records.map((record, index) => (
                    <div key={index} className="image-wrapper">
                        <img
                            src={record.hash}
                            alt="Patient Health Record"
                            className="health-record-image"
                            onClick={() => openModal(record.hash)}
                        />
                        <button className="summarize-button" onClick={() => openReportModal(record.hash)}>Summarize</button>
                    </div>
                ))}
            </div>
            {showModal && selectedImage && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img src={selectedImage} alt="Patient Health Record" className="full-image" />
                    </div>
                </div>
            )}
            {showReportModal && (
                <div className="modal" onClick={closeReportModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeReportModal}>&times;</span>
                        <h2>Summarized Report</h2>
                        {showSummarizedReport ? (
                            <p className="summary-text">{summary}</p>
                        ) : (
                            <p>Loading summarized report...</p>
                        )}
                    </div>
                </div>
            )}
            <h2 className="section-title">Update Doctor Information</h2>
            <div className="update-info-box">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Name"
                    value={doctorInfo.name}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Specialization"
                    value={doctorInfo.specialization}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, specialization: e.target.value })}
                />
                <input
                    type="number"
                    className="input-field"
                    placeholder="Years of Experience"
                    value={doctorInfo.experienceYears}
                    onChange={(e) => setDoctorInfo({ ...doctorInfo, experienceYears: e.target.value })}
                />
                <button className="update-info-button" onClick={updateDoctorInfo}>Update Info</button>
            </div>
        </div>
    );
};

export default Doctor;
