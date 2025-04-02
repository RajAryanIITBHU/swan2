"use client";
import { signIn } from "next-auth/react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const router = useRouter()

  // Email validation
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  // Phone validation
  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone)
      ? ""
      : "Please enter a valid 10-digit phone number";
  };

  // Handle input changes and validate fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "phone") {
      setPhone(value);
      setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  // Validate form on input change
  useEffect(() => {
    setValid(!errors.email && !errors.phone && email !== "" && phone !== "");
  }, [email, phone, errors]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        phone,
        redirect:false,
      });
      console.log(result)
      if (result?.error) {
        switch (result.error) {
          case "EMAIL_PHONE_REQUIRED":
            setErrors({
              email: "Email is required",
              phone: "Phone number is required",
            });
            break;
          case "USER_NOT_FOUND":
            setErrors((prev) => ({
              ...prev,
              email: "No account found with this email",
            }));
            break;
          case "PHONE_MISMATCH":
            setErrors((prev) => ({
              ...prev,
              phone: "Phone number does not match our records",
            }));
            break;
            case "Configuration":
                toast.error("Invalid credentials. Please try again.");
                break

          default:
            toast.error("Invalid credentials. Please try again.");
        }
      } else {
        toast.success("Logged in successfully!");
        router.refresh()
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/logo/logo.png"
            alt="JEE Advanced Logo"
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center">Amplify JEE CBT</h1>
        <p className="mb-6 text-gray-600 text-center">Login to Dashboard</p>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label htmlFor="Email" className="relative">
              <input
                type="email"
                id="Email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`peer mt-0.5 w-full rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } shadow-sm sm:text-sm py-3 px-4`}
              />
              <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform ease-in peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:h-fit duration-100">
                Email
              </span>
            </label>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="Phone" className="relative">
              <input
                type="text"
                id="Phone"
                name="phone"
                value={phone}
                onChange={handleInputChange}
                placeholder="Phone"
                maxLength={10}
                className={`peer mt-0.5 w-full rounded ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } shadow-sm sm:text-sm py-3 px-4`}
              />
              <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform ease-in peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:text-xs peer-focus:h-fit duration-100">
                Phone
              </span>
            </label>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!valid || loading}
            className={`w-full mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            {loading ? "Loading ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
