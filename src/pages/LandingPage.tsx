import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  ShieldAlert,
  Anchor,
  Radio,
  Eye,
  FileSpreadsheet,
  MapPin,
  Cpu,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Compass,
  BarChart3,
  UploadCloud,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-cyan-500/15">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-cyan-600/12 via-blue-900/8 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI-Powered Marine Anomaly Detection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit'] tracking-tight leading-[1.15]">
              AI-Powered{' '}
              <span className="ocean-gradient-text drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                Underwater Marine Debris Detection
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Intelligent analysis of Side-Scan Sonar imagery for detecting underwater anomalies and marine hazards in real-time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/upload"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide uppercase text-sm shadow-[0_0_28px_rgba(6,182,212,0.45)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Start Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="px-7 py-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-cyan-300 hover:text-white font-semibold tracking-wide uppercase text-sm border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center gap-2 shadow-lg"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Open Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-[#040a1c] border-b border-cyan-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Analysis Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              How It Works
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              From raw sonar imagery to actionable intelligence in five steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Upload Sonar Image', desc: 'Upload PNG, JPG, or TIFF acoustic swath', icon: Radio },
              { step: '02', title: 'Image Processing', desc: 'Noise filtering and contrast enhancement', icon: Sliders },
              { step: '03', title: 'AI Analysis', desc: 'Deep learning detection and segmentation', icon: Cpu },
              { step: '04', title: 'Anomaly Detection', desc: 'Object classification with confidence scoring', icon: Eye },
              { step: '05', title: 'Results & Report', desc: 'Geotagged results with JSON and CSV export', icon: FileSpreadsheet },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="glass-panel p-5 rounded-xl border-cyan-500/20 hover:border-cyan-400/40 transition-all relative group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-lg font-extrabold text-cyan-400/50">{st.step}</span>
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white font-['Outfit'] mb-1.5">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>

                  {idx < 4 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-cyan-500/60 font-bold text-lg">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section id="features" className="py-20 bg-[#030712] border-b border-cyan-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Key Features
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Built for marine researchers and hydrographic survey teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'AI Detection',
                desc: 'Identifies shipwrecks, ghost nets, marine debris, and unknown anomalies from acoustic signatures.',
                icon: Cpu,
              },
              {
                title: 'Noise Filtering',
                desc: 'Eliminates acoustic reverberation and seafloor speckle with adaptive filters.',
                icon: Sliders,
              },
              {
                title: 'Confidence Scoring',
                desc: 'Probabilistic confidence scores from Low to Very High for each detected object.',
                icon: CheckCircle2,
              },
              {
                title: 'Object Classification',
                desc: 'Multi-class classification covering shipwrecks, ghost nets, pipes, debris, and anomalies.',
                icon: Layers,
              },
              {
                title: 'Geotagging',
                desc: 'Latitude/longitude coordinates linked to survey logs and interactive map markers.',
                icon: MapPin,
              },
              {
                title: 'Automated Reports',
                desc: 'One-click generation of JSON and CSV reports ready for hydrographic archives.',
                icon: FileSpreadsheet,
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-panel p-6 rounded-xl border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-[0_0_18px_rgba(6,182,212,0.12)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-['Outfit'] mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROBLEM OVERVIEW ── */}
      <section className="py-20 bg-[#040a1c] border-b border-cyan-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              What We Detect
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Underwater Threats
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Ghost Nets',
                desc: 'Abandoned fishing nets that ghost fish marine mammals and destroy reef ecosystems.',
                icon: ShieldAlert,
                color: 'rose',
              },
              {
                title: 'Marine Debris',
                desc: 'Metallic containers, drums, and plastics scattered across the continental shelf.',
                icon: AlertTriangle,
                color: 'amber',
              },
              {
                title: 'Shipwrecks',
                desc: 'Sunken vessel hulls that pose navigation hazards and fuel contamination risks.',
                icon: Anchor,
                color: 'cyan',
              },
              {
                title: 'Underwater Hazards',
                desc: 'Unburied pipes, exposed cables, and unidentified cylindrical anomalies.',
                icon: Zap,
                color: 'teal',
              },
            ].map((item) => {
              const Icon = item.icon;
              const colorMap: Record<string, string> = {
                rose: 'border-rose-500/25 bg-rose-500/10 text-rose-400 hover:border-rose-400/50',
                amber: 'border-amber-500/25 bg-amber-500/10 text-amber-400 hover:border-amber-400/50',
                cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-400 hover:border-cyan-400/50',
                teal: 'border-teal-500/25 bg-teal-500/10 text-teal-400 hover:border-teal-400/50',
              };
              const iconBg = colorMap[item.color];
              return (
                <div
                  key={item.title}
                  className="glass-panel p-6 rounded-xl border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${iconBg} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-['Outfit'] mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#030712]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Ready to Analyze Sonar Imagery?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Upload your Side-Scan Sonar image or try one of our demo presets to see AI-powered detection in action.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/upload"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Sonar Image
            </Link>
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-xl glass-panel text-cyan-300 hover:text-white font-semibold text-sm uppercase tracking-wide border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
