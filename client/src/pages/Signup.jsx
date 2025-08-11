import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation helper
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("a number");
    if (!/[\W_]/.test(password)) errors.push("a symbol");
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const pwErrors = validatePassword(form.password);
      if (pwErrors.length > 0)
        newErrors.password = `Password must contain ${pwErrors.join(", ")}`;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post("/api/auth/signup", form);
      // Assuming successful response means user should verify OTP

      // Redirect to OTP verify page, passing email in state
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (error) {
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Signup failed. Please try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl max-w-md w-full p-10">
        <h1 className="text-4xl font-extrabold text-center text-indigo-500 mb-8">
          Create Account
        </h1>

        {serverError && (
          <div className="mb-4 text-red-500 font-semibold text-center">{serverError}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 font-semibold text-gray-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl bg-gray-800 border ${
                errors.firstName ? "border-red-500" : "border-gray-600"
              } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 font-semibold text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl bg-gray-800 border ${
                errors.lastName ? "border-red-500" : "border-gray-600"
              } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-5 py-3 rounded-xl bg-gray-800 border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              className={`w-full pr-12 px-5 py-3 rounded-xl bg-gray-800 border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-9-7 0-1.325.675-2.575 1.75-3.575m1.678-1.677A9.953 9.953 0 0112 5c5 0 9 3.5 9 7 0 1.053-.294 2.064-.804 2.925M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
            {!errors.password && (
              <p className="mt-1 text-indigo-300 text-sm">
                Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.
              </p>
            )}
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-semibold text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full pr-12 px-5 py-3 rounded-xl bg-gray-800 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-9-7 0-1.325.675-2.575 1.75-3.575m1.678-1.677A9.953 9.953 0 0112 5c5 0 9 3.5 9 7 0 1.053-.294 2.064-.804 2.925M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
