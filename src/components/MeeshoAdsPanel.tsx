import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  BarChart3, 
  Eye, 
  MousePointerClick, 
  ShoppingBag, 
  Wallet,
  AlertCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { DropshipProduct, AdCampaign } from '../types/dropship';
import { fetchWithRetry } from '../utils/apiClient';

interface MeeshoAdsPanelProps {
  products: DropshipProduct[];
  onAdCreated?: (campaign: AdCampaign) => void;
}

export const MeeshoAdsPanel: React.FC<MeeshoAdsPanelProps> = ({ products, onAdCreated }) => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(1200);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [campaignName, setCampaignName] = useState('');
  const [dailyBudget, setDailyBudget] = useState<number>(300);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetchWithRetry('/api/ads/campaigns', undefined, 2, 400);
      if (res.ok) {
        const data = await res.json();
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.adWalletBalance !== undefined) setWalletBalance(data.adWalletBalance);
      }
    } catch (e) {
      console.warn("Operating with local ads cache");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setErrorMsg("Kripya promote karne ke liye product chunein!");
      return;
    }
    if (walletBalance < dailyBudget) {
      setErrorMsg("Ad Wallet me balance kam hai! Kripya pehle wallet recharge karein.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/ads/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          campaignName: campaignName.trim(),
          dailyBudget
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create campaign");

      setCampaigns(prev => [data.campaign, ...prev]);
      setWalletBalance(data.remainingWalletBalance);
      setSuccessMsg(data.message);
      if (onAdCreated) onAdCreated(data.campaign);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create ad campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/ads/campaigns/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCampaigns(prev => prev.map(c => c.id === id ? data.campaign : c));
      }
    } catch (e) {
      console.warn("Failed to toggle campaign:", e);
    }
  };

  const handleQuickRecharge = async (amount: number) => {
    try {
      const res = await fetch('/api/ads/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalletBalance(data.walletBalance);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalOrders = campaigns.reduce((s, c) => s + c.ordersGenerated, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenueGenerated, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-pink-950 via-purple-950 to-slate-900 border border-pink-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Megaphone className="w-7 h-7 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-pink-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  MEESHO ADS & CATALOG BOOST
                </span>
                <span className="text-[11px] text-pink-300 font-mono">10x Views & Instant Sales Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Meesho Ads Manager: Run Campaigns & Boost Visibility
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Jaise Meesho par sellers apne product par <strong>Ads chala kar pehle page par rank karte hain</strong>, 
                waise hi yahan sellers apna daily budget set karke ad run kar sakte hain. Ad ka saara revenue direct Platform Owner (Pavan Mehta) ke paas jata hai!
              </p>
            </div>
          </div>

          {/* Ad Wallet Balance Box */}
          <div className="p-4 bg-slate-950/80 border border-pink-500/30 rounded-2xl space-y-2 text-right shrink-0">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1">
              <Wallet className="w-3.5 h-3.5 text-pink-400" />
              <span>Seller Ad Wallet Balance:</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">₹{walletBalance}</div>
            <div className="flex items-center gap-1.5 justify-end pt-1">
              <button
                type="button"
                onClick={() => handleQuickRecharge(500)}
                className="px-2 py-1 bg-pink-950 hover:bg-pink-900 border border-pink-700 text-pink-300 rounded text-[10px] font-mono font-bold"
              >
                +₹500
              </button>
              <button
                type="button"
                onClick={() => handleQuickRecharge(1000)}
                className="px-2 py-1 bg-pink-950 hover:bg-pink-900 border border-pink-700 text-pink-300 rounded text-[10px] font-mono font-bold"
              >
                +₹1000
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Catalog Impressions</span>
            <Eye className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{totalImpressions.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-mono">+340% High Visibility</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Product Clicks</span>
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{totalClicks.toLocaleString()}</div>
          <div className="text-[10px] text-cyan-300 font-mono">Avg CPC: ₹1.95</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Orders via Ads</span>
            <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-pink-400 font-mono">{totalOrders} Orders</div>
          <div className="text-[10px] text-pink-300 font-mono">Conversion Rate: 8.2%</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1">
          <div className="text-[11px] font-mono text-emerald-400 font-bold flex items-center justify-between">
            <span>Sales Revenue via Ads</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono font-bold">Average ROAS: ~14.5x</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CREATE NEW AD CAMPAIGN FORM */}
        <form onSubmit={handleCreateAd} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>RUN NEW MEESHO AD CAMPAIGN</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
              Top Search Ranking
            </span>
          </div>

          {/* Select Product to Promote */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 font-bold">Select Product to Boost *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.catchyTitle.substring(0, 45)}... (₹{p.retailPrice})
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 font-bold">Campaign Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Festival Mega Sale Boost"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Daily Budget Selection */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 font-bold flex items-center justify-between">
              <span>Daily Ad Budget (INR) *</span>
              <span className="text-emerald-400 font-bold">Expected ~{dailyBudget * 12} Views</span>
            </label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[200, 300, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDailyBudget(amt)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    dailyBudget === amt
                      ? 'bg-pink-600 text-white border-pink-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ₹{amt}/day
                </button>
              ))}
            </div>
          </div>

          {/* Benefit bullets */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 text-pink-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ad Boost Perks:</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <div>• Product gets <strong>Sponsored Tag</strong> & pins to Storefront Top!</div>
              <div>• High priority on customer search and category listings.</div>
              <div>• Ad budget automatically deducts from your Ad Wallet.</div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || walletBalance < dailyBudget}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm font-sans flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            <Megaphone className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Launching Campaign...' : `LAUNCH MEESHO AD (₹${dailyBudget})`}</span>
          </button>
        </form>

        {/* ACTIVE AD CAMPAIGNS LIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE PROMOTIONS & PERFORMANCE ({campaigns.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Live Real-Time
              </span>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Megaphone className="w-8 h-8 mx-auto text-slate-600" />
                <div className="text-xs">No active campaigns. Run an ad from left panel!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={camp.productImage}
                        alt={camp.productTitle}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white line-clamp-1">{camp.campaignName}</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                            camp.status === 'ACTIVE' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {camp.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{camp.productTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Budget: ₹{camp.dailyBudget}/day • Total Spent: ₹{camp.totalSpent}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-emerald-400">{camp.ordersGenerated} Orders (₹{camp.revenueGenerated})</div>
                        <div className="text-[10px] text-slate-400">{camp.clicks} Clicks • {camp.impressions} Views</div>
                        <div className="text-[10px] text-pink-400 font-bold">ROAS: {camp.roas}x</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(camp.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          camp.status === 'ACTIVE'
                            ? 'bg-amber-950/60 border-amber-700 text-amber-300 hover:bg-amber-900'
                            : 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                        }`}
                        title={camp.status === 'ACTIVE' ? 'Pause Campaign' : 'Resume Campaign'}
                      >
                        {camp.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeeshoAdsPanel;
