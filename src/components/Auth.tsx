import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';

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
      const success = login(formData.email, formData.password);
      if (!success) {
        setError('Invalid credentials. Please verify your work email and password.');
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
      const success = signup(formData.name, formData.email, formData.password);
      if (!success) {
        setError('Unable to create account. Please check your credentials or contact workspace admin.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#101914] text-[#E9F5E9] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#77C98A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#B8F28B]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#17231B] border border-[#304A39] rounded-2xl shadow-2xl p-8 relative z-10 backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1B2B21] border border-[#304A39] mb-4 shadow-inner relative group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B8F28B] to-[#77C98A] flex items-center justify-center text-[#101914] shadow-md transition-transform duration-300 group-hover:scale-105">
              <span className="font-extrabold text-sm tracking-tighter">CS</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#17231B] border border-[#304A39] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#B8F28B] animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#E9F5E9] flex items-center justify-center gap-2">
            Cinemora Studios
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#77C98A]">Agency Workspace</span>
            <span className="text-[#304A39]">•</span>
            <span className="text-xs font-mono text-[#A7BDAA]">cinemorastudios.agency</span>
          </div>
          <p className="text-xs text-[#A7BDAA] mt-2">
            Brand, Content, Web & AI Growth Systems
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-5 bg-[#132018] border border-[#304A39] rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-[#B8F28B] text-[#101914] shadow-sm'
                : 'text-[#A7BDAA] hover:text-[#E9F5E9]'
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
                ? 'bg-[#B8F28B] text-[#101914] shadow-sm'
                : 'text-[#A7BDAA] hover:text-[#E9F5E9]'
            }`}
          >
            Join Team / Co-Founder
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-[#A7BDAA] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#A7BDAA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-sm text-[#E9F5E9] placeholder-[#A7BDAA]/40 focus:outline-none focus:border-[#B8F28B] focus:ring-1 focus:ring-[#B8F28B] transition-colors"
                  placeholder="e.g. Co-Founder / Team Member"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A7BDAA] uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A7BDAA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-sm text-[#E9F5E9] placeholder-[#A7BDAA]/40 focus:outline-none focus:border-[#B8F28B] focus:ring-1 focus:ring-[#B8F28B] transition-colors"
                placeholder={isLogin ? 'iqrar@cinemorastudios.agency' : 'collaborator@cinemorastudios.agency'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A7BDAA] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A7BDAA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-[#132018] border border-[#304A39] rounded-xl text-sm text-[#E9F5E9] placeholder-[#A7BDAA]/40 focus:outline-none focus:border-[#B8F28B] focus:ring-1 focus:ring-[#B8F28B] transition-colors"
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
            className="w-full bg-[#B8F28B] hover:bg-[#77C98A] text-[#101914] py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
          >
            {isLogin ? 'Enter Workspace' : 'Create Account & Join'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security / Identity Information Footer */}
        <div className="mt-5 pt-4 border-t border-[#304A39] text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A7BDAA]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#77C98A]" />
            <span>Cinemora Studios Internal Operating Workspace</span>
          </div>
          <p className="text-[10px] text-[#A7BDAA]/60 mt-1">
            Browser-persisted workspace session • cinemorastudios.agency
          </p>
        </div>
      </div>

      {/* Page footer */}
      <footer className="mt-8 text-center text-xs text-[#A7BDAA]/60 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#77C98A]" />
        <span>Cinemora Studios © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};
