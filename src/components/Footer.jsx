import React from 'react';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>Group 7 &copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
};

export default Footer;
