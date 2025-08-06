import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function AuthButton({ className = "", showText = true, compact = false }) {
  const { user, signInWithGoogle, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      alert('Error signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      alert('Error signing out. Please try again.');
    }
  };

  if (user) {
    // User is signed in
    if (compact) {
      return (
        <div className={`flex items-center space-x-2 ${className}`}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-800 text-sm"
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
        )}
        {showText && (
          <div className="text-sm">
            <div className="font-medium text-gray-800">{user.displayName}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // User is not signed in
  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`bg-black-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {showText && <span>Sign in with Google</span>}
        </>
      )}
    </button>
  );
}
