import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { subscribe } from '../../services/api';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { data } = await subscribe(email);
      toast.success(data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-600 to-rose-400 p-10 md:p-16 text-white">
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <FiMail size={14} /> Weekly picks, just for you
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          Get StyleAura Picks First
        </h2>
        <p className="text-white/80 mb-8 text-lg">
          Get handpicked clothing ideas, cosmetics guides, skincare basics, and value-focused product picks delivered weekly.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white
                       placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50
                       backdrop-blur-sm"
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="btn bg-white text-primary-600 hover:bg-gray-50 font-bold shadow-lg
                       disabled:opacity-60 px-6 py-3.5"
          >
            {loading ? 'Subscribing...' : (
              <span className="flex items-center gap-2">Subscribe <FiArrowRight /></span>
            )}
          </motion.button>
        </form>
        <p className="text-white/60 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
