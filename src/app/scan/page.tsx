"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

export default function ScanPage() {
    const router = useRouter();
    const [scanning, setScanning] = useState(true);

    const handleScan = async (decodedText) => {
        if (!decodedText || !scanning) return;
        setScanning(false); // Prevent multiple scans

        try {
            await axios.post(
                "/api/users/scan",
                { qrCode: decodedText }, // Send only QR code, no need for token
                { withCredentials: true } // Ensure cookies (token) are included in the request
            );
            alert("Scanned successfully! Points updated.");
            router.push("/profile");
            router.refresh();
        } catch (error) {
            console.error("Error updating points:", error);
            alert(error?.response?.data?.message || "Failed to update points.");
            setScanning(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <button onClick={() => router.push("/profile")} className="absolute top-4 left-4 p-2">
                <span className="text-white text-2xl">←</span>
            </button>
            <h1 className="text-white text-2xl mt-6 font-semibold">Scan Recycling QR</h1>
            <div className="w-80 h-80 mt-6 border-2 border-green-500 p-2">
                <Scanner
                    onScan={(result) => {
                        handleScan(result);
                        router.push("/profile"); // Navigate back to profile after scan
                    }} 
                    onError={(error) => console.log("Scan error:", error)}
                />
            </div>
        </div>
    );
}
