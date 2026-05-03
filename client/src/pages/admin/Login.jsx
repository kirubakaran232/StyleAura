import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - StyleAura</title>
      </Helmet>

      <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:mx-auto sm:w-full sm:max-w-md text-center"
        >
          <img src="/sa_logo.png" alt="StyleAura" className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-glow mb-4" />
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your blog and products
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow-card sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-neutral-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="input pl-11"
                    placeholder="admin@example.com"
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
                    className="input pl-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? 'Signing in...' : (
                  <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
