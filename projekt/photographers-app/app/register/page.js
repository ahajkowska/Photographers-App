"use client";

import { useState } from "react";
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [inputErrors, setInputErrors] = useState({ username: false, password: false });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setInputErrors({ ...inputErrors, [name]: false }); // Reset errors on input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        // Validate password length
        if (formData.password.length < 6) {
            setInputErrors({ ...inputErrors, password: true });
            setMessage("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        // Check if username already exists
        try {
            const checkResponse = await fetch("/api/users");
            const users = await checkResponse.json();
            const usernameExists = users.some(user => user.username === formData.username);

            if (usernameExists) {
                setInputErrors({ ...inputErrors, username: true });
                setMessage("Username is already taken.");
                setIsLoading(false);
                return;
            }
        } catch (error) {
            setMessage("Error checking username availability.");
            setIsLoading(false);
            return;
        }

        // Proceed with registration
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            setMessage("Registration successful! Redirecting...");
            setFormData({ username: "", email: "", password: "" });
            setTimeout(() => setRedirectToLogin(true), 500);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <h1>Register</h1>
            <button className="go-back" onClick={() => window.history.back()}>Go back</button>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className={inputErrors.username ? "input-error" : ""}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={inputErrors.password ? "input-error" : ""}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
            {message && <p>{message}</p>}
            {redirectToLogin && <Link href="/login">Redirecting to login...</Link>}
            <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
    );
}
