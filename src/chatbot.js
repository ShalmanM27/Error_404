import React, { useState } from 'react';
import './Chatbot.css'; // Assuming you'll add styling here

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
            {/* Button to open/close the chatbot directly */}
            <button className="chatbot-button" onClick={toggleChatbot}>
                <i className="fas fa-comments"></i>
            </button>

            {/* Chatbot iframe - directly visible when button is clicked */}
            {isOpen && (
                <iframe
                    className="chatbot-frame"
                    src="http://localhost:5000"  // Your Flask app runs on localhost:5000
                    title="Medical Chatbot"
                    width="400"
                    height="500"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
};

export default Chatbot;
