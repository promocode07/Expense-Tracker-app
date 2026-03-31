"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa} from "@supabase/auth-ui-shared";
import { supabase} from "@/lib/supabase";

export default function login () {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Sign in to access your secure expense vault.
        </p>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
    );
}