import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import cinemoraLogo from '../assets/cinemora-logo.png';

export const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const email = formData.email.trim();
      const password = formData.password.trim();
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Please verify your work email and passphrase.');
      }
    } else {
      if (!formData.name.trim()) {
        setError('Full Name is required.');
        return;
      }
      if (!formData.email.trim()) {
        setError('Work email is required.');
        return;
      }
      if (!formData.password.trim()) {
        setError('Password is required.');
        return;
      }
      const success = signup(formData.name.trim(), formData.email.trim(), formData.password.trim());
      if (!success) {
        setError('Unable to create account. Please check your credentials or contact workspace admin.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f2f4f8] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a237]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#d4a237]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#0e111a] border border-[#1c2232] rounded-2xl shadow-2xl p-8 relative z-10 backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#141824] border border-[#1c2232] p-2.5 mb-3.5 shadow-xl shadow-black/40 relative group">
            <img
              src={cinemoraLogo}
              alt="Cinemora Studios"
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0e111a] border border-[#1c2232] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#d4a237] animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#f2f4f8] flex items-center justify-center gap-2">
            Cinemora Studios
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#d4a237]">Agency Workspace</span>
            <span className="text-[#1c2232]">•</span>
            <span className="text-xs font-mono text-[#8c93a8]">cinemorastudios.agency</span>
          </div>
          <p className="text-xs text-[#8c93a8] mt-1.5">
            Brand, Content, Web & AI Growth Systems
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-5 bg-[#10141f] border border-[#1c2232] rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-[#d4a237] text-[#08090d] shadow-sm'
                : 'text-[#8c93a8] hover:text-[#f2f4f8]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? 'bg-[#d4a237] text-[#08090d] shadow-sm'
                : 'text-[#8c93a8] hover:text-[#f2f4f8]'
            }`}
          >
            Join Team / Co-Founder
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-[#8c93a8] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8c93a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-sm text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237] focus:ring-1 focus:ring-[#d4a237] transition-colors"
                  placeholder="e.g. Co-Founder / Team Member"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8c93a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-sm text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237] focus:ring-1 focus:ring-[#d4a237] transition-colors"
                placeholder={isLogin ? 'iqrar@cinemorastudios.agency' : 'collaborator@cinemorastudios.agency'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8c93a8] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8c93a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-[#10141f] border border-[#1c2232] rounded-xl text-sm text-[#f2f4f8] placeholder-[#8c93a8]/40 focus:outline-none focus:border-[#d4a237] focus:ring-1 focus:ring-[#d4a237] transition-colors"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-800/60 text-red-300 p-3 rounded-xl text-xs flex items-start gap-2">
              <span className="font-semibold text-red-400">Notice:</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#d4a237] hover:bg-[#e5be60] text-[#08090d] py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
          >
            {isLogin ? 'Enter Workspace' : 'Create Account & Join'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security / Identity Information Footer */}
        <div className="mt-5 pt-4 border-t border-[#1c2232] text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8c93a8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#e5be60]" />
            <span>Cinemora Studios Internal Operating Workspace</span>
          </div>
          <p className="text-[10px] text-[#8c93a8]/60 mt-1">
            Browser-persisted workspace session • cinemorastudios.agency
          </p>
        </div>
      </div>

      {/* Page footer */}
      <footer className="mt-8 text-center text-xs text-[#8c93a8]/60 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#e5be60]" />
        <span>Cinemora Studios © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};
