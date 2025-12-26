import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginMock, registerMock } from '../services/auth';

const AuthForm = ({ isLogin, onCancel, toggleMode, onAuthSuccess, canClose = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const title = isLogin ? 'Sign In to Ecomap' : 'Create an Account';
  const buttonText = isLogin ? 'Login' : 'Register';

  const handleSubmit = (e) => {
    e.preventDefault();
    let success = false;
    let action = isLogin ? 'Login' : 'Registration';

    if (isLogin) {
      success = loginMock(email, password);
    } else {
      success = registerMock(email, username, password);
    }
    
    if (success) {
        onAuthSuccess(action); // Notify App.jsx
    } else {
        alert("Authentication failed. Please fill all required fields.");
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative glow */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-emerald-400 via-blue-400 to-cyan-400 opacity-30 blur-xl"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-gray-200/60 p-8">
        {/* Close Button */}
        {canClose && (
          <button 
            onClick={onCancel} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close Form"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-gray-800 text-center">{title}</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Welcome to a greener map experience</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-300/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Registration Specific Fields */}
          {!isLogin && (
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300/80 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-shadow bg-white/70"
              />
            </div>
          )}

          {/* Helper Row */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-emerald-500 rounded" />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-emerald-600 hover:text-emerald-700 hover:underline">Forgot password?</button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-tr from-emerald-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 active:scale-[0.99] transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            <span>{buttonText}</span>
          </button>
        </form>

        {/* Toggle Link */}
        <p className="text-center text-sm mt-5 text-gray-600">
          {isLogin ? "New to Ecomap?" : "Already have an account?"}
          <button 
            type="button"
            onClick={toggleMode} 
            className="text-emerald-600 font-medium ml-1 hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};


export default function AuthModal({ onClose, onAuthSuccess, canClose = true }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-[200] p-4">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-cyan-100 animate-gradient" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px]" aria-hidden="true"></div>

      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl animate-float-slow" aria-hidden="true"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl animate-float-fast" aria-hidden="true"></div>

      <div className="relative h-full w-full flex items-center justify-center">
        {/* Pass the auth success handler */}
        <AuthForm 
          isLogin={isLogin} 
          onCancel={onClose} 
          toggleMode={toggleMode} 
          onAuthSuccess={onAuthSuccess}
          canClose={canClose}
        />
      </div>
    </div>
  );
}