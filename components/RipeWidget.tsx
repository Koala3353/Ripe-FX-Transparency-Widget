import React, { useState, useEffect, useMemo } from 'react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../constants';
import { calculateConversion, formatCurrency } from '../services/calcService';
import { ArrowRight, Info, TrendingUp, ShieldCheck, ChevronDown, ChevronUp, Share2, Check, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RipeWidget: React.FC = () => {
  // Helper to safely check if we can interact with history
  const isSafeEnvironment = () => {
    if (typeof window === 'undefined') return false;
    try {
      return window.location.protocol !== 'blob:' && !window.location.href.startsWith('blob:');
    } catch (e) {
      return false;
    }
  };

  // Initialize state from URL if possible, otherwise default
  const [amount, setAmount] = useState<string>(() => {
    if (isSafeEnvironment()) {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get('amount') || '1000';
      } catch (e) {
        return '1000';
      }
    }
    return '1000';
  });
  
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>(() => {
    if (isSafeEnvironment()) {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlCurrency = params.get('currency');
        return (urlCurrency && CURRENCIES[urlCurrency as CurrencyCode]) 
          ? (urlCurrency as CurrencyCode) 
          : CurrencyCode.PHP;
      } catch (e) {
        return CurrencyCode.PHP;
      }
    }
    return CurrencyCode.PHP;
  });

  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Handle browser back/forward buttons to sync state with URL
  useEffect(() => {
    if (!isSafeEnvironment()) return;

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlAmount = params.get('amount');
        const urlCurrency = params.get('currency');
        
        if (urlAmount !== null) setAmount(urlAmount);
        if (urlCurrency && CURRENCIES[urlCurrency as CurrencyCode]) {
          setTargetCurrency(urlCurrency as CurrencyCode);
        }
      } catch (e) {
        // Ignore navigation errors
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state to URL with debounce to avoid history spam
  useEffect(() => {
    const timer = setTimeout(() => {
      // Strictly prevent execution if environment is not safe
      if (!isSafeEnvironment()) return;

      try {
        const params = new URLSearchParams(window.location.search);
        const currentAmount = params.get('amount');
        const currentCurrency = params.get('currency');

        // Only replace state if actual values differ to protect the history stack
        if (currentAmount !== amount || currentCurrency !== targetCurrency) {
          params.set('amount', amount);
          params.set('currency', targetCurrency);
          
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      } catch (e) {
        // Silently catch SecurityErrors or other browser restrictions
        console.debug('URL state sync skipped due to environment restrictions.');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [amount, targetCurrency]);

  const handleShare = async () => {
    try {
      if (!isSafeEnvironment()) {
        alert("Sharing is not available in this preview mode.");
        return;
      }

      const params = new URLSearchParams();
      params.set('amount', amount);
      params.set('currency', targetCurrency);
      
      const baseUrl = window.location.href.split('?')[0];
      const shareUrl = `${baseUrl}?${params.toString()}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      // Fallback
      if (isSafeEnvironment()) {
        try {
            const params = new URLSearchParams();
            params.set('amount', amount);
            params.set('currency', targetCurrency);
            const baseUrl = window.location.href.split('?')[0];
            const shareUrl = `${baseUrl}?${params.toString()}`;
            prompt('Copy this link to share:', shareUrl);
        } catch(e) { /* ignore */ }
      }
    }
  };

  // Derived state via calculation service
  const result = useMemo(() => {
    // Parse amount, handling potential trailing dots from typing
    const cleanAmount = amount.replace(/,/g, ''); // Remove visual commas if any
    const numAmount = parseFloat(cleanAmount) || 0;
    return calculateConversion(numAmount, targetCurrency);
  }, [amount, targetCurrency]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Normalize comma to dot for international users (e.g. European keyboards)
    value = value.replace(/,/g, '.');

    // Prevent multiple dots
    if ((value.match(/\./g) || []).length > 1) return;

    // Allow empty string or valid decimal number (up to 2 places)
    // We allow just "." while typing to let user type ".5"
    if (value === '' || value === '.' || /^\d+\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const setPreset = (val: string) => setAmount(val);

  const chartData = [
    { name: 'Legacy', amount: result.legacyComparison.netReceived },
    { name: 'Ripe', amount: result.netReceived },
  ];

  return (
    <div className="relative w-full max-w-[440px] mx-auto bg-white rounded-2xl shadow-2xl shadow-ripe-900/10 overflow-hidden border border-gray-100 font-sans transform transition-all duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-ripe-800 to-ripe-600 p-6 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-2xl tracking-tight text-white">Ripe</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide border border-white/10 text-emerald-50">BETA</span>
            </div>
            <h2 className="text-emerald-100 text-sm font-medium">Global Settlement Infrastructure</h2>
          </div>
          
          <button 
            onClick={handleShare}
            className="group flex items-center gap-1.5 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border border-white/10 text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Share Quote'}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Source Input */}
        <div className="group relative">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">You Send</label>
          <div className="flex items-center bg-gray-50 group-focus-within:bg-white rounded-2xl border border-gray-200 group-focus-within:border-ripe-500 group-focus-within:ring-4 group-focus-within:ring-ripe-500/10 transition-all p-1.5">
            <div className="flex items-center gap-2 pl-3 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 select-none">
              <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" alt="USDC" className="w-6 h-6" />
              <span className="font-bold text-gray-700">USDC</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-transparent text-right text-2xl sm:text-3xl font-bold text-gray-800 focus:outline-none px-4 placeholder-gray-300"
              placeholder="0.00"
            />
          </div>
          
          {/* Quick Select Pills */}
          <div className="flex justify-end gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
            {['100', '1000', '5000', '10000'].map((preset) => (
              <button
                key={preset}
                onClick={() => setPreset(preset)}
                className="text-[11px] font-medium px-3 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-ripe-600 border border-gray-100 rounded-full transition-colors whitespace-nowrap active:scale-95"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Divider / Connector */}
        <div className="flex justify-center -my-5 relative z-10 pointer-events-none">
          <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-100 text-ripe-500">
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </div>

        {/* Destination Input */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Recipient Gets</label>
          <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 p-1.5 transition-colors hover:border-gray-300">
            <div className="flex items-center justify-between">
                <div className="relative">
                <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                    className="appearance-none bg-white font-bold text-gray-700 pl-4 pr-10 py-3 rounded-xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-ripe-500 cursor-pointer min-w-[140px] select-none"
                >
                    {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.flag} &nbsp; {c.code}
                    </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                </div>
                </div>

                <div className="text-right px-4 flex-grow min-w-0">
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 truncate">
                        {result.currency.symbol}{formatCurrency(result.netReceived, result.currency.symbol, result.currency.code)}
                    </div>
                </div>
            </div>
            <div className="px-3 pb-2 pt-1 flex justify-between items-center border-t border-gray-200/50 mt-2">
                 <div className="text-[10px] text-gray-400 font-medium">Target Account</div>
                 <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" />
                    1 USDC ≈ {result.effectiveRate.toFixed(2)} {result.currency.code}
                </div>
            </div>
          </div>
        </div>

        {/* Comparison Toggle */}
        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2" title="Compare against traditional banking rates">
                <span className="text-xs font-semibold text-gray-500">Compare vs Banks</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showComparison} 
                    onChange={() => setShowComparison(!showComparison)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ripe-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ripe-600 shadow-inner transition-colors"></div>
                </label>
            </div>
            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-ripe-600 hover:text-ripe-800 font-semibold flex items-center gap-1 px-2 py-1 hover:bg-ripe-50 rounded-md transition-colors select-none"
            >
                {showDetails ? 'Hide Fees' : 'Show Fees'}
                {showDetails ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
            </button>
        </div>

        {/* Comparison Chart */}
        {showComparison && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                     <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Net Received</p>
                     <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Save {result.currency.symbol}{formatCurrency(result.legacyComparison.savings, '', result.currency.code)}
                    </span>
                </div>
                <div className="h-32 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 45, left: 0, bottom: 0 }} barGap={4} barCategoryGap={8}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={80} 
                                tick={{fontSize: 11, fontWeight: 500, fill: '#4b5563'}} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.15)', padding: '8px 12px' }}
                                formatter={(value: number) => [`${result.currency.symbol}${formatCurrency(value, '', result.currency.code)}`, '']}
                            />
                            <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20} animationDuration={600}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 1 ? '#16a34a' : '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* Detailed Breakdown */}
        {showDetails && (
          <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 space-y-3">
                
                {/* Gross */}
                <div className="flex justify-between items-center text-sm group relative">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                     <span>Gross Amount</span>
                     <Info className="w-3.5 h-3.5 cursor-help text-slate-400" />
                  </div>
                  <span className="font-medium text-slate-700">
                    {result.currency.symbol} {formatCurrency(result.breakdown.gross, '', result.currency.code)}
                  </span>
                </div>

                {/* Fees */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5 text-rose-500/90 font-medium">
                     <span>Ripe Fee (0.5%)</span>
                  </div>
                  <span className="font-medium text-rose-500">
                    - {result.currency.symbol} {formatCurrency(result.breakdown.ripeFee, '', result.currency.code)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5 text-rose-500/90 font-medium">
                     <span>Network Gas</span>
                  </div>
                  <span className="font-medium text-rose-500">
                    - {result.currency.symbol} {formatCurrency(result.breakdown.networkFee, '', result.currency.code)}
                  </span>
                </div>

                {/* Separator */}
                <div className="h-px bg-slate-200 my-2"></div>

                {/* Final */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800">Net To Recipient</span>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-ripe-600 leading-none">
                        {result.currency.symbol} {formatCurrency(result.netReceived, '', result.currency.code)}
                    </span>
                  </div>
                </div>
             </div>
             
             {/* Trust Footer */}
             <div className="bg-slate-100/80 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">Rate: 1 USD = {result.currency.interbankRate} {result.currency.code}</span>
                <span className="flex items-center gap-1 text-[10px] text-ripe-700 font-semibold bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                    <ShieldCheck className="w-3 h-3"/> Bank-grade security
                </span>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RipeWidget;