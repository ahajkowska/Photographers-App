"use client";

import { useState } from "react";
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password
        if (formData.password.length < 6) {
            setPasswordError(true);
            setMessage("Password must be at least 6 characters long.");
            return;
        } else {
            setPasswordError(false);
        }

        // Check if username already exists
        try {
            const checkResponse = await fetch(`/api/users/check-username?username=${formData.username}`);
            const checkData = await checkResponse.json();

            if (checkData.exists) {
                setUsernameError(true);
                setMessage("Username is already taken.");
                return;
            } else {
                setUsernameError(false);
            }
        } catch (error) {
            setMessage("Error checking username availability.");
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

            setMessage("Registration successful!");
            setFormData({ username: "", email: "", password: "" });
            setRedirectToLogin(true);
        } catch (error) {
            setMessage(error.message);
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
                    className={usernameError ? "input-error" : ""}
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
                    className={passwordError ? "input-error" : ""}
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
            {redirectToLogin && <Link href="/login">Redirecting to login...</Link>}
            <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
    );
}
