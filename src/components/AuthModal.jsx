import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { loginMock, registerMock } from '../services/auth';

const AuthForm = ({ isLogin, onCancel, toggleMode, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

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
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onCancel} 
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        aria-label="Close Form"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Input */}
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />
        
        {/* Password Input */}
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
        />

        {/* Registration Specific Fields */}
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center space-x-2"
        >
          {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          <span>{buttonText}</span>
        </button>
      </form>

      {/* Toggle Link */}
      <p className="text-center text-sm mt-4 text-gray-600">
        {isLogin ? "New user?" : "Already have an account?"}
        <button 
          type="button"
          onClick={toggleMode} 
          className="text-blue-600 font-medium ml-1 hover:underline"
        >
          {isLogin ? "Register here" : "Sign In"}
        </button>
      </p>

    </div>
  );
};


export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[200] p-4 transition-opacity duration-300">
      
      {/* Pass the auth success handler */}
      <AuthForm 
        isLogin={isLogin} 
        onCancel={onClose} 
        toggleMode={toggleMode} 
        onAuthSuccess={onAuthSuccess}
      />
      
    </div>
  );
}