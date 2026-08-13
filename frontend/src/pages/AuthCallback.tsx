// frontend/src/pages/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../store/useUser';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser(); // now we have setUser
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const id = searchParams.get('id');
      const scope = searchParams.get('scope');

      if (success !== 'True' || !id) {
        setError('Missing success or id in OAuth callback');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/digilocker/callback`,
          { params: { success, id, scope } }
        );

        const { token, user } = response.data;

        // ✅ Store both user and token using the store method
        setUser(user, token);

        // Navigate to the unified dashboard
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Callback error:', err);
        setError(err.response?.data?.error || 'Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
        Verifying Identity via DigiLocker...
      </h2>
      <p className="text-sm text-gray-500 mt-1">Please do not close this window.</p>
    </div>
  );
};