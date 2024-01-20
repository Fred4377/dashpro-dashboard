import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@dashpro.com');
  const [password, setPassword] = useState('admin123');
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter all fields');
    
    setLoadingLocal(true);
    const success = await login(email, password);
    setLoadingLocal(false);
    
    if (success) {
      toast.success('Login successful');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-main text-dark-text p-4">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-primary via-accent-purple to-accent-primary"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-accent-primary/20 shadow-[0_0_15px_rgba(30,144,255,0.2)]">
            <BarChart2 size={32} className="text-accent-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">DashPro</h1>
          <p className="text-dark-subtext text-sm">Business Intelligence Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-dark-subtext">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-main border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-sm"
              placeholder="admin@dashpro.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-dark-subtext">Password</label>
              <a href="#" className="text-xs text-accent-primary hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-main border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loadingLocal}
            className="w-full bg-accent-primary hover:bg-blue-600 text-white font-medium rounded-lg py-3 transition-colors flex justify-center items-center gap-2 mt-2"
          >
            {loadingLocal ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-dark-subtext">
          <p>Don't have an account? <a href="#" className="text-accent-primary hover:underline">Request access</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
