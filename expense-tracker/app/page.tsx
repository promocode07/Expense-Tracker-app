"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for changes (like clicking login or logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while checking the ID
  if (isLoading) {
    return <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</main>;
  }

  // The Routing Logic
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      {!session ? <Login /> : <Dashboard />}
    </main>
  );
}