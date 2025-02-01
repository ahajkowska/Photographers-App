"use client";

import { useState } from "react";
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
    const [message, setMessage] = useState("");
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        setMessage("");

        try {
            // czy istnieje
            const checkResponse = await fetch("/api/users");
            const users = await checkResponse.json();
            const usernameExists = users.some(user => user.username === values.username);

            if (usernameExists) {
                setErrors({ username: "Username is already taken." });
                return;
            }

            // rejestracja
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            resetForm();
            setTimeout(() => setRedirectToLogin(true), 500);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <h1>Register</h1>
            <button className="go-back" onClick={() => window.history.back()}>Go back</button>

            <Formik
                initialValues={{ username: "", email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="register-form">
                        <Field type="text" name="username" placeholder="Username" />
                        <ErrorMessage name="username" component="div" className="error-message" />

                        <Field type="email" name="email" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="error-message" />

                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error-message" />

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </Form>
                )}
            </Formik>

            {message && <p>{message}</p>}
            {redirectToLogin && <Link href="/login">Redirecting to login...</Link>}
            <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
    );
}
