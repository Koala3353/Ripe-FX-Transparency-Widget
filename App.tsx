import React from 'react';
import RipeWidget from './components/RipeWidget';
import { Globe, Zap, BadgePercent, Lock } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-white p-3 rounded-full shadow-md text-ripe-600 mb-3 ring-4 ring-ripe-50 transition-transform hover:scale-105 duration-300">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">{desc}</p>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>

      <main className="relative z-10 flex flex-col items-center px-4 pt-12 pb-16 md:pt-20">
        
        {/* Header Content */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-ripe-700 shadow-sm mb-2 hover:bg-white transition-colors cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live FX Rates & Fees
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Global Payments, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ripe-600 to-emerald-400">
              Local Feel.
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Instant stablecoin-to-fiat settlement for Southeast Asia. 
            <span className="font-medium text-gray-900"> Zero hidden spreads.</span>
          </p>
        </div>

        {/* The Widget */}
        <div className="w-full flex justify-center mb-16">
           <RipeWidget />
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto w-full border-t border-gray-200/60 pt-12">
          <FeatureCard 
            icon={Zap} 
            title="Instant Settlement" 
            desc="Funds arrive in local bank accounts in seconds, not days."
          />
          <FeatureCard 
            icon={BadgePercent} 
            title="0.5% Flat Fee" 
            desc="Industry-leading rates with no markup on the FX spread."
          />
          <FeatureCard 
            icon={Globe} 
            title="Pan-Asian Coverage" 
            desc="Direct connections to local payment rails in TH, ID, PH, VN, MY."
          />
           <FeatureCard 
            icon={Lock} 
            title="Regulated & Secure" 
            desc="Enterprise-grade security compliant with local regulations."
          />
        </div>

        {/* CTA Footer */}
        <div className="mt-20 text-center">
            <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-gray-900/20 transition-all hover:-translate-y-1 active:translate-y-0">
                Integrate Ripe API
            </button>
            <p className="mt-6 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Ripe Financial. Simulated rates for demonstration.
            </p>
        </div>

      </main>
    </div>
  );
};

export default App;