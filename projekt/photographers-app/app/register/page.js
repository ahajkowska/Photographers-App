"use client";

import { useState } from "react";
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } catch (error) {
        setMessage(error.message);
        }
    };

    return (
        <div className="register-page">
        <h1>Register</h1>
        <button className="go-back"><Link href="/login">Go back</Link></button>
        <form onSubmit={handleSubmit} className="register-form">
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
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
            />
            <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
}
