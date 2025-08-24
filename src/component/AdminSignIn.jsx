// src/components/AdminSignIn.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, ENDPOINT_LOGIN } from "../apiConfig.js"; // Adjust the path if needed
/**
 * AdminSignIn Component
 * Handles user sign-in with email and password.
 * Displays a success message upon successful sign-in and redirects to the dashboard.
 */
const AdminSignIn = () => {
  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State variables for UI feedback
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles the form submission for sign-in.
   * Sends credentials to an API, shows a success message, and redirects.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states for a new submission attempt
    setIsLoading(true);
    setLoginSuccess(false);
    setError(null);

    try {
      // Send a POST request to the login API endpoint
      const response = await fetch(`${BASE_URL}${ENDPOINT_LOGIN}`, {
        // Replace with your actual API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle server-side errors (e.g., 401 Unauthorized)
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      // const data = await response.json(); // Optional: handle response data (e.g., auth token)
      // console.log('Login successful:', data);

      setLoginSuccess(true);

      //Parse the JSON data from the response body
      const data = await response.json();
      // Store the authentication token and user data in session storage
      console.log("Token:", data.token);
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 200);
    } catch (err) {
      console.error("Sign in failed:", err);
      // Set the error message for the user to see
      setError(err.message);
    } finally {
      // Stop the loading indicator regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="w-full"></div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white py-12 px-8 shadow-sm rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
            </div>

            {/* Success Message */}
            {loginSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                Sign in successful! Redirecting to Dashboard...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  E-MAIL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-400 hover:bg-teal-500 text-white font-medium py-3 px-4 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-xl font-bold text-gray-900">SLGPS</div>
            <nav className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-8 sm:space-y-0">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                TOOLS
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                PRIVACY
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                TERMS & CONDITIONS
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                CONTACT
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminSignIn;
