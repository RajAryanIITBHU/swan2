"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const router = useRouter();

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) ? "" : "Invalid phone number";
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        phone,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case "EMAIL_PHONE_REQUIRED":
            setErrors({ email: "Required", phone: "Required" });
            break;
          case "USER_NOT_FOUND":
            setErrors((prev) => ({ ...prev, email: "No account found" }));
            break;
          case "PHONE_MISMATCH":
            setErrors((prev) => ({ ...prev, phone: "Phone mismatch" }));
            break;
          case "Configuration":
            toast.error("Invalid credentials.");
            break;
          default:
            toast.error("Invalid credentials.");
        }
      } else {
        toast.success("Logged in successfully!");
        router.refresh(); // Refresh page to update session state
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full">
        <Image
          src={"/logo/logo.png"}
          height={90}
          width={90}
          priority
          alt=""
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold mb-4 text-center">Amplify JEE CBT</h1>
        <p className="mb-6 text-gray-600 text-center">Access your dashboard</p>

        <form className="space-y-6" onSubmit={handleLogin}>
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
            </label>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

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
            </label>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Loading ..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
