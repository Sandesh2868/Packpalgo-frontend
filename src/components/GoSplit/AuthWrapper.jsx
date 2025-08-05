import React, { useState } from 'react';
import { auth, googleProvider } from '../../../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AuthWrapper({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [signingIn, setSigningIn] = useState(false);

  const signInWithGoogle = async () => {
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to GoSplit</h1>
          <p className="text-black-600 mb-8">
            Split travel expenses with your friends and family. Sign in with Google to get started.
          </p>
          
          <button
            onClick={signInWithGoogle}
            disabled={signingIn}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-3"
          >
            {signingIn ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Why sign in?</strong><br/>
              • Create and join travel groups<br/>
              • Track expenses in real-time<br/>
              • Split bills automatically<br/>
              • Settle up with friends
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* User Info & Sign Out */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="text-sm">
            <div className="font-medium text-gray-800">{user.displayName}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 ml-2"
            title="Sign out"
          >
            🚪
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
}
