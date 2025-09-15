"use client";
import { signIn } from "next-auth/react";

export function SignIn() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    // Call client-side signIn function properly
    await signIn("credentials", {
      ...data,
      //completely optional fields below
      // redirect: true, // or false, depending on your logic
      // callbackUrl: "/", // or wherever you want to redirect
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Subtle light glow effect */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 opacity-20 rounded-full blur-3xl"></div>
      <form
        onSubmit={handleSubmit}
        className="relative bg-emerald-800/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-lg  outline-emerald-600 outline-2"
      >
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Welcome Back
        </h2>

        <label className="block mb-4">
          <span className="text-white mb-1 block">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-6">
          <span className="text-white mb-1 block">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            placeholder="********"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-400 text-white font-medium border-2 border-green-500 hover:from-green-500 hover:to-green-600 transition shadow-md shadow-green-500/50"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
