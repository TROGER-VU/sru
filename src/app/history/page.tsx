"use client";
import { useEffect, useState } from "react";

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch("/api/users/history", { credentials: "include" });
                const data = await response.json();
                if (data.success) {
                    setHistory(data.history);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="container mx-auto p-5">
            <h2 className="text-2xl font-bold mb-4 text-center">History</h2>
            <table className="w-full border-collapse border border-gray-500">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-500 px-4 py-2">Timestamp</th>
                        <th className="border border-gray-500 px-4 py-2">Event</th>
                        <th className="border border-gray-500 px-4 py-2">Points</th>
                        <th className="border border-gray-500 px-4 py-2">Redemption Code</th>
                        <th className="border border-gray-500 px-4 py-2">Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index} className={`text-center border border-gray-500 ${entry.points < 0 ? "bg-red-700" : ""}`}>
                            <td className="border border-gray-500 px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                            <td className="border border-gray-500 px-4 py-2">{entry.points < 0 ? "Redeemed" : "Scanned"}</td>
                            <td className="border border-gray-500 px-4 py-2">{entry.points}</td>
                            <td className="border border-gray-500 px-4 py-2">{entry.code || "-"}</td>
                            <td className="border border-gray-500 px-4 py-2">{entry.expiry ? new Date(entry.expiry).toLocaleString() : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default History;
