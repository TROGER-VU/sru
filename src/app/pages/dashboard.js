import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get('/api/points');
        setPoints(response.data.points);
      } catch (error) {
        console.error('Fetching points failed:', error);
      }
    };

    fetchPoints();
  }, []);

  const handleRedeem = async () => {
    try {
      await axios.post('/api/redeem');
      setPoints(0);
    } catch (error) {
      console.error('Redemption failed:', error);
    }
  };

  return (
    <div>
      <motion.h1 initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
        Dashboard
      </motion.h1>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        Your Points: {points}
      </motion.p>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleRedeem}>
        Redeem Points
      </motion.button>
    </div>
  );
};

export default Dashboard;
