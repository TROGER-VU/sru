"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        getUserDetails();
    }, []);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success("Logout successful");
            router.push('/login');
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/me');
            setUserData(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch user data");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-green-100 to-green-300">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md relative text-center">
                <div className="absolute top-4 left-4">
                    <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded" />
                </div>
                <div className="absolute top-4 right-4">
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                            <Image src="/profile-icon.jpeg" alt="Profile" width={40} height={40} className="rounded-full cursor-pointer" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2">
                                <button onClick={logout} className={"w-full text-left px-4 py-2 text-red-500 font-semibold rounded cursor-pointer"} style={{padding:"4px"}}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
                <h1 className={"text-2xl font-bold text-green-600"} style={{marginTop:"20px"}}>Smart Recycling Unit</h1>
                <div className={"mt-4 flex flex-col items-center"} style={{marginTop:"30px"}}>
                    <p className="text-gray-700 mt-2">Your GreenPoints</p>
                    <h2 className="text-3xl font-bold text-green-500">{userData?.points || 0}</h2>
                    <p className="text-xs text-gray-500">+{userData?.points || 0} point for recycling</p>
                </div>
                <div className={"mt-2 p-2 bg-gray-200 rounded"} style={{margin:"12px 20px 0px 20px", padding:"20px"}}>
                    <p className="text-ml text-gray-600">Carbon Footprint Saved: {userData?.points*0.5 || 0} kg CO₂</p>
                </div>
                <Link href="/redeem">
                    <button 
                        className={`w-4/5 rounded-lg font-bold py-2 ${userData?.points < 100 ? "bg-orange-500 text-white cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"}`} 
                        style={{margin:"15px 20px 20px 20px", padding:"10px"}} 
                        disabled={userData?.points < 100}>
                        REDEEM FOR ECO PRODUCTS
                    </button>
                </Link>
                <Link href="/scan">
                    <button className={"w-4/5 mt-2 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 cursor-pointer"} style={{marginBottom:"20px", padding:"10px"}}>
                        SCAN RECYCLING QR
                    </button>
                </Link>
                <Link href="/history">
                    <button className={"w-4/5 mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 cursor-pointer"} style={{marginBottom:"20px", padding:"10px"}}>
                        View Recycling History
                    </button>
                </Link>
                {/* <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-700">Recent Recycling Activity</h3>
                    {userData?.history?.length > 0 ? (
                        userData.history.map((activity, index) => (
                            <div key={index} className="flex justify-between p-2 mt-2 bg-white rounded-lg shadow">
                                <div>
                                    <p className="font-semibold text-gray-700">{activity.type}</p>
                                    <p className="text-sm text-gray-500">{activity.date}</p>
                                </div>
                                <span className="text-green-600 font-bold">+{activity.points}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-2">No recent activity</p>
                    )}
                </div> */}
            </div>
        </div>
    );
}