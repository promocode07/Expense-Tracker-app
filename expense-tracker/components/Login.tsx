"use client"

import React, { useState } from "react";
import { supabase} from "@/lib/supabase";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  //Password validation

  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isPasswordValid = hasLength && hasUpperCase && hasLowerCase && hasNumber;

  //email and passsword handler

  const handleAuth = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if(isSignUp && !isPasswordValid) {
      setError("Please meet all the password Requirments");
      return;
    }

    setLoading(true);

    if(isSignUp) {
      const {error} = await supabase.auth.signUp({email, password});

      if(error)
        setError(error.message);
      else
        setMessage("Check your email for the confirmation link!");
    }
    setLoading(false);
  }

//Google OAuth handler
  const handleGoogleLogin = async() => {
    setError(null);

    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
       redirectTo: `${window.location.origin}`
      }
    });
    if(error) setError(error.message);
  };

return (
    <div className="flex flex-col items-center justify-center w-full px-4 mt-12">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          {isSignUp ? "Create your Vault" : "Welcome Back"}
        </h2>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded mb-4 text-sm">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {/* Simple SVG Eye Icon */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Conditions Checklist (Only show when signing up) */}
          {isSignUp && (
            <div className="text-xs space-y-1 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <p className={hasLength ? "text-green-400" : "text-slate-500"}>
                {hasLength ? "✓" : "○"} At least 8 characters
              </p>
              <p className={hasUpperCase ? "text-green-400" : "text-slate-500"}>
                {hasUpperCase ? "✓" : "○"} One uppercase letter
              </p>
              <p className={hasNumber ? "text-green-400" : "text-slate-500"}>
                {hasNumber ? "✓" : "○"} One number
              </p>
              <p className={hasLowerCase ? "text-green-400" : "text-slate-500"}>
                {hasNumber ? "✓" : "○"} One lowercase letter
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (isSignUp && !isPasswordValid)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 text-white p-3 rounded-lg font-bold transition-all"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="w-full border-slate-800" />
          <span className="text-slate-500 text-sm">OR</span>
          <hr className="w-full border-slate-800" />
        </div>

        {/* Google OAuth Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-900 hover:bg-slate-200 p-3 rounded-lg font-bold transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );

}