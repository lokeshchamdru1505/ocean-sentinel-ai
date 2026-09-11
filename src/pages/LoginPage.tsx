import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Cpu,
  Radio,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('kalaiyarasan@niot.res.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Dr. Kalaiyarasan K.');
  const [role, setRole] = useState('Chief Marine Sonar Scientist');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    'Chief Marine Sonar Scientist',
    'Hydrographic Survey Officer',
    'Naval Operations Command',
    'Deep-Sea ROV Operator',
    'Environmental Risk Analyst',
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(name || 'Operator', role, email);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleQuickDemoAccess = (demoRole: string, demoName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(demoName, demoRole, `${demoName.toLowerCase().replace(/[^a-z]/g, '')}@niot.res.in`);
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      {/* Background Animated Atmosphere Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-cyan-600/15 via-blue-900/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06163015_1px,transparent_1px),linear-gradient(to_bottom,#06163015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Simple Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <Link to="/">
          <Logo size="md" />
        </Link>
        <Link
          to="/"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <span>← Back to Home</span>
        </Link>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md">

          {/* Glass Card Container */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-2xl relative">

            {/* Top Badge & Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Restricted Portal • SIH 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
                Operator Portal
              </h2>
              <p className="text-xs text-slate-400">
                Acoustic Swath Analysis & Marine Hazard Command
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-cyan-500/20 mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quick Demo Login
              </button>
            </div>

            {/* SIGN IN FORM */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Operator Email / NIOT ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@niot.res.in"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Operator Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Kalaiyarasan K."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Command Role
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none cursor-pointer"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r} className="bg-slate-900 text-slate-200">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Security Passcode
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Demo Passcode: Any passcode works for evaluation.')}
                      className="text-[10px] font-mono text-cyan-400 hover:underline"
                    >
                      Forgot Passcode?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-cyan-500/30 text-cyan-500 focus:ring-cyan-400 accent-cyan-500 cursor-pointer"
                    />
                    <span>Keep session active</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Encrypted Token
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide uppercase text-xs shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Authenticate Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* QUICK DEMO ACCESS TAB */}
            {activeTab === 'register' && (
              <div className="space-y-3 py-1">
                <p className="text-xs text-slate-300 leading-relaxed bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/20">
                  Select a predefined role below for <strong>instant 1-click evaluation access</strong> without typing credentials.
                </p>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleQuickDemoAccess('Chief Marine Sonar Scientist', 'Dr. Kalaiyarasan K.')}
                    className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-500/25 hover:border-cyan-400 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                        Dr. Kalaiyarasan K.
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Chief Marine Sonar Scientist</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </button>

                  <button
                    onClick={() => handleQuickDemoAccess('Hydrographic Survey Officer', 'Officer R. Subramanian')}
                    className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-500/25 hover:border-cyan-400 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                        Officer R. Subramanian
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Hydrographic Survey Officer</div>
                    </div>
                    <Radio className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </button>

                  <button
                    onClick={() => handleQuickDemoAccess('Naval Operations Command', 'Cmdr. V. Ramanathan')}
                    className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-500/25 hover:border-cyan-400 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                        Cmdr. V. Ramanathan
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Naval Operations Command</div>
                    </div>
                    <Cpu className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer Notice */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] font-mono text-slate-400">
              Ocean Sentinel AI Platform • Ground Truth U-Net Model (SIH 2026)
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-slate-400 text-[11px] font-mono border-t border-white/5">
        © 2026 Ocean Sentinel AI • Ministry of Earth Sciences & NIOT
      </footer>
    </div>
  );
};
