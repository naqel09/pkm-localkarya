"use client"
import React,{useState} from "react";

const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            setErrorMsg("Email dan password wajib diisi.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password minimal 6 karakter.");
            return;
        }

        setErrorMsg("");

        // Simulasi login success (tanpa backend)
        alert(`Login berhasil!\nEmail: ${email}`);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Login Akun Anda
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-600">{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    Belum punya akun?{" "}
                    <a
                        href="/Register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default page;
