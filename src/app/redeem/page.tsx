"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

const Redeem = () => {
    const [points, setPoints] = useState(0);
    const [redeemedCode, setRedeemedCode] = useState("");
    const [expiry, setExpiry] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch user points
        const fetchPoints = async () => {
            try {
                const response = await fetch("/api/users/history", { credentials: "include" });
                const data = await response.json();
                if (data.success) {
                    console.log(points);
                    const totalPoints = data.history.reduce((sum, entry) => sum + (entry.points > 0 ? entry.points : 0), 0);
                    console.log(totalPoints);
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
                setExpiry(new Date(data.expiry).toLocaleDateString());
                setPoints(points - 100); // Deduct 100 points after redemption
                setShowModal(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error redeeming points:", error);
            toast.error("Something went wrong!");
        }
    };

    const handleShare = () => {
        const shareText = `I just redeemed a special SOULO discount from SRU! 🎉 Use this code: ${redeemedCode} and get 15% OFF on all SOULO products! 🌱 #GreenPoints #EcoRewards`;
        if (navigator.share) {
            navigator.share({ text: shareText }).catch((error) => console.error("Error sharing:", error));
        } else {
            navigator.clipboard.writeText(shareText);
            toast.success("Coupon code copied to clipboard!");
        }
    };

    return (
        <div className="bg-green-100 min-h-screen flex flex-col items-center p-6 text-center">
            <div className="bg-white p-4 rounded-lg shadow-md w-80" style={{marginTop:"70px", padding:"10px"}}>
                <h2 className="text-lg font-semibold">Your GreenPoints</h2>
                <p className="text-4xl font-bold text-green-600">{points}</p>
                <p className="text-gray-500">Points available for redemption</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80 mt-4" style={{margin:"20px", padding:"10px"}}>
                <p className="text-sm font-medium">Minimum points required: <b>100</b></p>
                <p className="text-sm font-medium">After redemption: <b>{Math.max(points - 100, 0)} points</b></p>
            </div>

            <button 
                onClick={handleRedeem} 
                className="mt-4 px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400"
                disabled={points < 100}
                style={{padding:"10px"}}
            >
                REDEEM NOW
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{padding:"10px"}}>
                    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center relative" style={{padding:"10px"}}>
                        <div className="text-green-600 text-4xl" style={{margin:"10px"}}>✅</div>
                        <h2 className="text-green-600 text-lg font-bold" style={{margin:"10px"}}>Redeemed Successfully!</h2>
                        <p className="text-gray-600 text-sm">You've redeemed 100 GreenPoints</p>
                        <p className="text-gray-500 text-sm"style={{margin:"10px"}}>Remaining: {Math.max(points - 100, 0)} points</p>
                        <div className="border-t border-gray-300 my-2"></div>
                        <div className="bg-gradient-to-t from-green-300 to-green-100 p-4 rounded-lg border border-green-500 text-white">
                            <div className="flex items-center justify-center mt-2" style={{marginTop:"10px"}}>
                                <Image src="/s_logo.png" alt="Soulo Icon" width={60} height={20} className="mr-2" />
                                <h3 className="text-green-600 text-lg font-bold">SOULO Discount</h3>
                            </div>
                            <p className="text-orange-500 text-lg font-bold">15% OFF</p>
                            <p className="text-gray-700 text-sm">on all SOULO products</p>
                            <p className="text-white text-lg font-bold bg-green-600 p-2 rounded-md" style={{margin:"10px"}}>{redeemedCode}</p>
                            <p className="text-gray-700 text-sm mt-1" style={{margin:"10px"}}>Valid until: {expiry}</p>
                            <p className="text-gray-700 text-xs italic mt-2" style={{margin:"10px"}}>Earn rewards, save the planet! 🌍 <br></br> Powered by SRU</p>
                        </div>
                        <div className="flex justify-around mt-4" style={{marginTop:"10px"}}>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" style={{padding:"6px"}} onClick={handleShare}>Share</button>
                            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg mt-4" style={{padding:"6px"}} onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-green-600 mt-2 font-medium" style={{margin:"10px"}}>You'll receive a SOULO voucher</p>

            <div className="bg-white p-4 rounded-lg shadow-md w-80 mt-4 border-dashed border border-gray-300" 
                style={{padding:"10px"}}>
                <h3 className="text-gray-600 text-sm font-medium">Coupon Preview</h3>
                <div className="flex items-center justify-center mt-2">
                    <div className="bg-green-200 p-2 rounded-full">
                        <svg className="w-11 h-13 text-green-600"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 4 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-2">
                    <Image src="/s_logo.jpg" alt="Soulo Icon" width={60} height={20} className="mr-2" />
                    <h3 className="text-green-600 text-lg font-bold">SOULO Discount</h3>
                </div>
                <p className="text-gray-600 text-sm">15% OFF on all products</p>
                <p className="text-black text-lg font-bold">CODE: ########</p>
                <p className="text-gray-500 text-xs mt-1">Valid until: MM/DD/YYYY</p>
            </div>
        </div>
    );
};

export default Redeem;