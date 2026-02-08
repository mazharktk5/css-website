"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        // TODO: call your backend API for authentication
        if (email === "admin@example.com" && password === "123456") {
            // Save token (for now, just localStorage)
            localStorage.setItem("adminToken", "dummy-token");
            router.push("/admin"); // redirect to admin panel
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 rounded bg-gray-700 placeholder-gray-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 p-3 rounded bg-gray-700 placeholder-gray-400"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
