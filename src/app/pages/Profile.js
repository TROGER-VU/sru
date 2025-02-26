import React, { useState, useRef, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';
import { Scanner } from '@yudiel/react-qr-scanner';

const Profile = () => {
  const [points, setPoints] = useState(0);
  const scannerRef = useRef(null);

  const handleScan = (result) => {
    if (result) {
      setPoints((prevPoints) => prevPoints + 1);
    }
  };

  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  useEffect(() => {
    const svgElement = scannerRef.current.querySelector("svg");
    if (svgElement) {
      svgElement.style.width = '300px';
      svgElement.style.height = '300px';
    }
  }, []);

  return (
    <div style={styles.container}>
      <img src="/logo.jpg" alt="Logo" style={styles.logo} />
      <h1 style={styles.header}>Scan the QR</h1>
      <div ref={scannerRef} style={styles.qrScannerContainer}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          style={styles.qrReader}
        />
      </div>
      <div style={styles.pointsContainer}>
        <FaCoins style={styles.coinIcon} />
        <p style={styles.points}>{points} Points</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(to right, #56ab2f, #a8e063)', // Green gradient background
    padding: '20px',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '70px', // Size of the logo
    height: '70px',
    borderRadius: '20%', // Curved border for the logo
  },
  header: {
    fontSize: '2.5rem', // Header size
    color: '#ffffff',
    fontFamily: 'Verdana, sans-serif', // Changed font style
    textShadow: '2px 2px #000000', // Added text shadow for the header
    textAlign: 'center', // Center the text
    margin: '10px 0',
  },
  qrScannerContainer: {
    width: '300px',
    height: '300px',
    marginBottom: '20px',
  },
  qrReader: {
    width: '100%', // Ensures the scanner fills the container
    height: '100%',
  },
  pointsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  coinIcon: {
    fontSize: '2.5rem', // Coin icon size
    color: '#FFD700',
    marginRight: '10px',
  },
  points: {
    fontSize: '1.5rem', // Points text size
    color: '#fff',
    textAlign: 'center', // Center the text
  },
};

export default Profile;
