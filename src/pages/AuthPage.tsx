import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  Car,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { loginUser, addToast } = useApp();

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('citizen@puducherry.gov.in');
  const [password, setPassword] = useState<string>('demo1234');
  const [name, setName] = useState<string>('Arun Kumar');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (email.includes('police')) {
      loginUser('police', { email, name: 'Insp. S. Vijayaraghavan' });
    } else {
      loginUser('citizen', { email, name: isRegister ? name : 'Arun Kumar' });
    }
    onSuccess();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginUser(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F7FB] selection:bg-[#1769E8] selection:text-white">
      {/* Left Column: Waterfront Backdrop & Branding */}
      <div className="lg:w-1/2 relative min-h-[380px] lg:min-h-screen bg-[#071D38] overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white">
        {/* Background Image with Deep Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071D38] via-[#071D38]/80 to-transparent" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1769E8] to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MapPin className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-black font-heading tracking-tight text-white flex items-center gap-2">
              SmartCity <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">PY</span>
            </div>
            <p className="text-xs text-blue-200">Puducherry Traffic Police & Smart City Portal</p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 my-auto py-8 space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Smart City Digital Gateway
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
            Park smart.
            <br />
            Report easily.
            <br />
            Enforce digitally.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            A unified municipal mobility platform designed for citizens, drivers, and police officers in Puducherry.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="block text-xl font-extrabold text-blue-300 font-heading">7</span>
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                Parking Zones
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="block text-xl font-extrabold text-emerald-300 font-heading">100%</span>
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                Digital Pass
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="block text-xl font-extrabold text-amber-300 font-heading">24/7</span>
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                Police Action
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Location Notice */}
        <div className="relative z-10 text-[11px] text-gray-400">
          Boulevard Town · White Town · Goubert Avenue · Heritage Precinct
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xl space-y-6">
          <div>
            <h3 className="text-2xl font-black text-[#172B45] font-heading">
              {showForgotPassword
                ? 'Reset Password'
                : isRegister
                ? 'Create SmartCity Account'
                : 'Sign In to SmartCity'}
            </h3>
            <p className="text-xs text-[#6B7B90] mt-1">
              {showForgotPassword
                ? 'Enter your registered email to receive demo password reset instructions.'
                : isRegister
                ? 'Register as a citizen or driver for instant parking reservations and report tracking.'
                : 'Access parking reservations, citizen violation tracking, or traffic police portal.'}
            </p>
          </div>

          {/* Quick Demo Personas Bar */}
          <div className="bg-[#F4F7FB] p-3 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              ⚡ Quick Demo 1-Click Login (Hackathon):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('citizen')}
                className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-[#172B45] text-center text-xs font-bold transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('police')}
                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 text-[#172B45] text-center text-xs font-bold transition-all shadow-sm"
              >
                <Shield className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                Police
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('public')}
                className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-[#172B45] text-center text-xs font-bold transition-all shadow-sm"
              >
                <Car className="w-4 h-4 text-[#1769E8] mx-auto mb-1" />
                Driver
              </button>
            </div>
          </div>

          {showForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-4 text-xs">
              {resetEmailSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 space-y-2">
                  <div className="font-bold">Password Reset Link Sent!</div>
                  <p>
                    Check your demo inbox. A recovery link was sent to <span className="font-mono">{email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    className="text-xs font-bold text-[#1769E8] underline block pt-1"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResetEmailSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-3 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1769E8] text-white font-bold hover:bg-blue-700 shadow-md"
                  >
                    Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-center text-gray-500 hover:text-gray-800"
                  >
                    Cancel and return to login
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Standard Login / Register Form */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {isRegister && (
                <div>
                  <label className="block font-bold text-[#172B45] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl p-3 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#172B45] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@puducherry.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#172B45]">Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] text-[#1769E8] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F4F7FB] border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-xs text-[#172B45] focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#1769E8] focus:ring-[#1769E8]"
                  />
                  <span>Remember my credentials</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1769E8] hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{isRegister ? 'Complete Registration' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 text-xs text-gray-500">
                {isRegister ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(false)}
                      className="text-[#1769E8] font-bold hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    New citizen or visiting tourist?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="text-[#1769E8] font-bold hover:underline"
                    >
                      Register Now
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
