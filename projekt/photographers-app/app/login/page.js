"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.text();
        setErrors({ password: error }); // błąd do pola hasła
        throw new Error(error);
      }

      const { userId, username } = await response.json();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);

      setMessage("Login successful!");
      setIsLoggedIn(true);
      router.push("/");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
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
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="error-message" />

              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error-message" />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      )}

      <p><Link href="/register">Don't have an account? Click here.</Link></p>
      {message && <p>{message}</p>}
    </div>
  );
}
