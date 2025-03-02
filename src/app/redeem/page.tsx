"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Redeem = () => {
    const [points, setPoints] = useState(0);
    const [redeemedCode, setRedeemedCode] = useState("");
    const [expiry, setExpiry] = useState("");

    useEffect(() => {
        // Fetch user points
        const fetchPoints = async () => {
            try {
                const response = await fetch("/api/users/history", { credentials: "include" });
                const data = await response.json();
                if (data.success) {
                    const totalPoints = data.history.reduce((sum, entry) => sum + (entry.points > 0 ? entry.points : 0), 0);
                    setPoints(totalPoints);
                }
            } catch (error) {
                console.error("Error fetching points:", error);
            }
        };
        fetchPoints();
    }, []);

    const handleRedeem = async () => {
        if (points < 100) {
            toast.error("You need at least 100 points to redeem!");
            return;
        }

        try {
            const response = await fetch("/api/users/redeem", {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Redemption successful!");
                setRedeemedCode(data.code);
                setExpiry(new Date(data.expiry).toLocaleString());
                setPoints(0); // Reset points after redemption
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error redeeming points:", error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Redeem Points</h2>
            <div className="text-center">
                <p className="text-lg">Your Points: <span className="font-bold">{points}</span></p>
                <button 
                    onClick={handleRedeem} 
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    disabled={points < 100}
                >
                    Redeem Now
                </button>
            </div>

            {redeemedCode && (
                <div className="mt-6 p-4 border border-gray-300 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-green-600">Redemption Code</h3>
                    <p className="text-lg font-mono bg-gray-200 p-2 rounded">{redeemedCode}</p>
                    <p className="text-sm text-gray-500 mt-2">Expiry: {expiry}</p>
                </div>
            )}
        </div>
    );
};

export default Redeem;
