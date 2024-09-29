import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Contract from './contract';
import './Login.css'; // Import the new CSS file

const LoginPage = () => {
    const navigate = useNavigate();
    const { acc, contract } = Contract();
    const [isConnected, setIsConnected] = useState(false);

    const handleConnectWallet = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setIsConnected(true);

            // Check if the current account is a doctor
            const doctor = await contract.doctors(acc);
            const isDoctor = doctor.exists;

            if (acc === 'ADMIN_ADDRESS') {
                navigate('/admin');
            } else if (isDoctor) {
                navigate('/doctor');
            } else {
                const patient = await contract.patients(acc);
                const isPatient = patient.id !== 0;

                if (isPatient) {
                    navigate('/homepage');
                } else {
                    console.error('Not a valid patient or doctor');
                }
            }
        } catch (error) {
            console.error('Connection failed', error);
        }
    };

    return (
        <div className="login-page">
            <div className="main-container">
                <div className="login-content glassy-box-with-hover">
                    <h1 className="login-title">Welcome to mediSphere</h1>
                    <p className="login-description">
                        Connect your wallet to access personalized health services.
                    </p>
                    {!isConnected ? (
                        <div className="connect-section">
                            <button className="connect-button" onClick={handleConnectWallet}>
                                Connect Wallet
                            </button>
                        </div>
                    ) : (
                        <div className="connected-section">
                            <h3 className="connected-title">Connected Account:</h3>
                            <p className="connected-account">{acc}</p>
                            <p className="connected-message">You are now connected! Redirecting you shortly...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
