"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        setPasswordError(true);
        throw new Error(error);
      }

      const { userId, username } = await response.json();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      
      setMessage("Login successful!");
      setFormData({ email: "", password: "" });
      setIsLoggedIn(true);
      setPasswordError(false);

      router.push("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setMessage("Logged out successfully.");
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <button className="go-back" onClick={() => window.history.back()}>Go back</button>
      {isLoggedIn ? (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit">Login</button>
        </form>
      )}
      <p><Link href="/register">Don't have an account? Click here.</Link></p>
      {message && <p>{message}</p>}
    </div>
  );
}
