import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Key } from 'lucide-react';
import { signIn, signUp } from '../utils/authClient';

export default function AuthModal({ isOpen, onClose, onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lock scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Apply blur to main content container if we had a specific ID, but we can do it via a wrapper or just trust the overlay
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await signUp.email({
          email,
          password,
          name: name || 'User',
        });
        if (error) throw new Error(error.message);
        
        // Auto sign in after sign up
        const { error: signInErr } = await signIn.email({ email, password });
        if (signInErr) throw new Error(signInErr.message);
      } else {
        const { error } = await signIn.email({ email, password });
        if (error) throw new Error(error.message);
      }
      
      // Success!
      onAuthenticated();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    try {
      setError('');
      const { data, error } = await signIn.social({ 
        provider,
        callbackURL: window.location.href // Send them right back to where they are
      });
      
      if (error) {
        console.error("OAuth Error:", error);
        setError(error.message || `Failed to sign in with ${provider}`);
      }
    } catch (err) {
      console.error("OAuth Exception:", err);
      setError(`Exception: ${err.message || err.toString()}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Animated Background Overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px) brightness(1)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px) brightness(0.8)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px) brightness(1)' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-stone-900/40"
            onClick={onClose}
          />

          {/* Premium Floating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="relative w-full max-w-[440px] m-4 overflow-hidden"
          >
            {/* Gradient Border Illusion using padding and nested div */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-amber-200/50 via-white/10 to-amber-900/30 p-[1px]">
              <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-[23px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]" />
            </div>

            {/* Content Container */}
            <div className="relative px-8 pt-10 pb-8 z-10 flex flex-col items-center">
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 rounded-2xl flex items-center justify-center shadow-inner mb-6">
                <Lock className="w-6 h-6 text-amber-800" />
              </div>

              <h2 className="text-2xl font-bold text-stone-900 mb-2 font-sans tracking-tight text-center">
                Welcome to Food Intelligence Lab
              </h2>
              <p className="text-sm text-stone-500 text-center mb-8 px-2">
                Sign in to unlock AI-powered nutritional analysis, interactive dashboards, reports, and advanced research tools.
              </p>

              {/* OAuth Buttons */}
              <div className="w-full space-y-3 mb-6">
                <button 
                  onClick={() => handleOAuth('google')}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/80 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-sm font-semibold text-stone-700 transition-all shadow-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
                <button 
                  onClick={() => handleOAuth('github')}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#24292F] hover:bg-[#1f2328] text-sm font-semibold text-white transition-all shadow-sm"
                >
                  <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 invert" />
                  Continue with GitHub
                </button>
              </div>

              <div className="w-full flex items-center justify-between gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-stone-200"></div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">OR</span>
                <div className="h-[1px] flex-1 bg-stone-200"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                    {error}
                  </div>
                )}
                
                {isSignUp && (
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm"
                  />
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer hover:text-stone-700">
                      <input type="checkbox" className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                      Remember me
                    </label>
                    <button type="button" className="text-xs font-semibold text-amber-700 hover:text-amber-800">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-stone-500">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button 
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                    className="ml-1.5 font-bold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Create Account'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
