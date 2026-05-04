import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      await (isSignup ? signup(email, password) : login(email, password));
      toast.success(isSignup ? 'Account created!' : 'Welcome back!');
      navigate('/bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignup ? 'Create Account' : 'Login'} - StyleAura</title>
      </Helmet>

      <div className="container-custom py-16 md:py-24 min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img src="/sa_logo.png" alt="StyleAura" className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-glow mb-4" />
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Save outfits, products, and likes across all your devices.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-card rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-neutral-800 rounded-2xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-xl text-sm font-semibold transition-colors ${!isSignup ? 'bg-white dark:bg-neutral-950 shadow text-primary-600' : 'text-gray-500'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-xl text-sm font-semibold transition-colors ${isSignup ? 'bg-white dark:bg-neutral-950 shadow text-primary-600' : 'text-gray-500'}`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="input pl-11"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input pl-11"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-70">
                {loading ? 'Please wait...' : (
                  <span className="flex items-center gap-2">
                    {isSignup ? <FiUserPlus /> : <FiArrowRight />}
                    {isSignup ? 'Create Account' : 'Login'}
                  </span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Admin? <Link to="/admin/login" className="text-primary-600 font-semibold hover:underline">Use the admin portal</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
