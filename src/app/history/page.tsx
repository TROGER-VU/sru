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
        <div className="bg-green-100 min-h-screen w-full">
            <div className="container mx-auto p-5">
                <h2 className="text-4xl font-bold mb-4 text-center" style={{ marginBottom: "6px" }}>History</h2>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-500">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-500 px-4 py-2">Timestamp</th>
                                <th className="border border-gray-500 px-4 py-2">Event</th>
                                <th className="border border-gray-500 px-4 py-2">Points</th>
                                <th className="border border-gray-500 px-4 py-2">Company</th>
                                <th className="border border-gray-500 px-4 py-2">Label</th>
                                <th className="border border-gray-500 px-4 py-2">Redemption Code</th>
                                <th className="border border-gray-500 px-4 py-2">Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, index) => (
                                <tr
                                    key={index}
                                    className={`text-center border border-gray-500 ${entry.points < 0 ? "bg-red-700 text-white" : "bg-green-50"}`}
                                >
                                    <td className="border border-gray-500 px-4 py-2 text-sm">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">
                                        {entry.points < 0 ? "Redeemed" : "Scanned"}
                                    </td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">{entry.points}</td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">{entry.company}</td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">{entry.label}</td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">{entry.code || "-"}</td>
                                    <td className="border border-gray-500 px-4 py-2 text-sm">
                                        {entry.expiry ? new Date(entry.expiry).toLocaleString() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4" style={{padding: "10px", margin: "10px"}}>
                    {history.map((entry, index) => (
                        <div
                            key={index}
                            className={`rounded-lg shadow-md p-4 border ${
                                entry.points < 0 ? "bg-red-700 text-white" : "bg-green-50"
                            }`} style={{padding: "10px", margin: "10px"}}
                        >
                            <p className="text-sm font-semibold">
                                Timestamp:{" "}
                                <span className="font-normal">{new Date(entry.timestamp).toLocaleString()}</span>
                            </p>
                            <p className="text-sm font-semibold">
                                Event: <span className="font-normal">{entry.points < 0 ? "Redeemed" : "Scanned"}</span>
                            </p>
                            <p className="text-sm font-semibold">
                                Points: <span className="font-normal">{entry.points}</span>
                            </p>
                            <p className="text-sm font-semibold">
                                Company: <span className="font-normal">{entry.company}</span>
                            </p>
                            <p className="text-sm font-semibold">
                                Label: <span className="font-normal">{entry.label}</span>
                            </p>
                            {entry.code && (
                                <p className="text-sm font-semibold">
                                    Code:{" "}
                                    <span className="font-mono bg-white text-black px-2 py-1 rounded inline-block mt-1" style={{padding: "0.5px"}}>
                                        {entry.code}
                                    </span>
                                </p>
                            )}
                            {entry.expiry && (
                                <p className="text-sm font-semibold">
                                    Expiry: <span className="font-normal">{new Date(entry.expiry).toLocaleString()}</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default History;
