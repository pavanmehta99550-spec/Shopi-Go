import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Star, 
  TrendingUp, 
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Tag,
  RefreshCw,
  PackageCheck,
  PackageX,
  CreditCard,
  SlidersHorizontal
} from 'lucide-react';
import { DropshipProduct } from '../types/dropship';

interface StorefrontCatalogProps {
  products: DropshipProduct[];
  onOrderNow: (product: DropshipProduct) => void;
  onDeleteProduct?: (id: string) => void;
  onProductUpdated?: (product: DropshipProduct) => void;
  onScrollToOrders?: () => void;
  isSupplierMode?: boolean; // When true: displays wholesale price, profit breakdown, stock sync button. When false: authentic Meesho-like retail store.
}

export const StorefrontCatalog: React.FC<StorefrontCatalogProps> = ({
  products,
  onOrderNow,
  onDeleteProduct,
  onProductUpdated,
  onScrollToOrders,
  isSupplierMode = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        p.catchyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      // Prioritize Ad-boosted products to the top, exactly like Meesho!
      if (a.isAdBoosted && !b.isAdBoosted) return -1;
      if (!a.isAdBoosted && b.isAdBoosted) return 1;
      return 0;
    });

  // Supplier action: trigger real-time stock sync with Meesho
  const handleSyncStock = async (product: DropshipProduct) => {
    setSyncingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}/sync-meesho-stock`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success && onProductUpdated) {
        onProductUpdated(data.product);
      }
    } catch (e) {
      console.warn("Stock sync failed:", e);
    } finally {
      setTimeout(() => setSyncingId(null), 600);
    }
  };

  // Supplier action: Toggle Meesho COD availability manually for testing
  const handleToggleCod = async (product: DropshipProduct) => {
    try {
      const updatedCod = !product.meeshoCodAvailable;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeshoCodAvailable: updatedCod })
      });
      const data = await res.json();
      if (res.ok && data.success && onProductUpdated) {
        onProductUpdated(data.product);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer / Supplier Mode Banner */}
      {!isSupplierMode ? (
        /* Real Customer E-Commerce Hero Header (Meesho style) */
        <div className="bg-gradient-to-r from-pink-900/60 via-purple-900/40 to-slate-900 border border-pink-500/20 rounded-3xl p-5 sm:p-7 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-pink-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  All India Free Delivery
                </span>
                <span className="text-[11px] text-pink-300 font-medium">Real-time Meesho Stock & COD Verified</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Lowest Prices, Best Quality Fashion & Essentials
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Direct from top manufacturers across India with 7-Day Hassle-Free Returns.
              </p>
            </div>

            {/* Trust Badges & Track My Order Button */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 shrink-0">
              {onScrollToOrders && (
                <button
                  type="button"
                  onClick={onScrollToOrders}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>My Orders & Tracking (ऑर्डर्स व स्टेटस)</span>
                </button>
              )}
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <RotateCcw className="w-4 h-4 text-pink-400" />
                <span>7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Supplier Admin Header */
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-950 text-purple-300 border border-purple-700 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                SUPPLIER & RESELLER CONTROL PANEL
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">Automated Meesho Stock & COD Sync</span>
            </div>
            <h3 className="font-bold text-base text-white mt-1">
              Active Listed Inventory & Profit Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Agar Meesho par product ka COD band hota hai ya stock khatam hota hai, toh website par automatic sync ho jata hai.
            </p>
          </div>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search products, clothing, electronics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 sm:w-64"
        />
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="font-bold text-white text-sm">No products found</h4>
          <p className="text-xs text-slate-400">
            {isSupplierMode
              ? "Use the AI Importer tab to import products from Meesho."
              : "Try searching with a different keyword or category."}
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((p) => {
          const discountPercent = Math.round(((p.compareAtPrice - p.retailPrice) / p.compareAtPrice) * 100);
          const profit = p.retailPrice - p.supplierPrice;
          const isCodEnabled = p.meeshoCodAvailable !== false;
          const isAvailable = p.inStock !== false && (p.stockCount === undefined || p.stockCount > 0);

          return (
            <div
              key={p.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all flex flex-col shadow-lg group relative ${
                !isAvailable ? 'border-red-900/50 opacity-80' : 'border-slate-800 hover:border-pink-500/50'
              }`}
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={p.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}
                  alt={p.catchyTitle}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
                />

                {/* Customer Visible Discount Badge */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {p.isAdBoosted && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                      <span>AD / SPONSORED</span>
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-600 text-white shadow-md font-sans">
                    {discountPercent}% OFF
                  </span>
                  
                  {/* Real-time Meesho COD Status Badge */}
                  {isCodEnabled ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-mono shadow-md flex items-center gap-1">
                      <Truck className="w-2.5 h-2.5" /> COD Available
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-950/90 border border-purple-700 text-purple-300 font-mono shadow-md flex items-center gap-1">
                      <CreditCard className="w-2.5 h-2.5" /> Prepaid Only (Online)
                    </span>
                  )}
                </div>

                {/* Stock Status Badge */}
                <div className="absolute bottom-2.5 left-2.5">
                  {isAvailable ? (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Stock: {p.stockCount ?? 25}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-red-950 text-red-300 border border-red-700">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm border border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-mono text-white flex items-center gap-1 shadow">
                  <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded text-[10px] font-bold flex items-center gap-0.5">
                    {p.rating} <Star className="w-2.5 h-2.5 fill-white" />
                  </span>
                  <span className="text-slate-400 text-[10px]">({p.reviewsCount})</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="text-[10px] text-pink-400 font-mono uppercase font-bold tracking-wider">
                    {p.category}
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug">
                    {p.catchyTitle || p.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Pricing Box */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-black text-white font-mono">
                        ₹{p.retailPrice}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        ₹{p.compareAtPrice}
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Free Delivery
                    </span>
                  </div>

                  {/* ONLY IN SUPPLIER PANEL: Show wholesale price, stock sync & COD toggle */}
                  {isSupplierMode && (
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-[11px] font-mono animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">
                          Wholesale: <strong className="text-white">₹{p.supplierPrice}</strong>
                        </span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Profit: +₹{profit}</span>
                        </span>
                      </div>

                      {/* Stock & COD Quick Controls for Supplier */}
                      <div className="pt-1.5 border-t border-purple-900/60 flex items-center justify-between gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleToggleCod(p)}
                          className={`px-2 py-1 rounded-lg border font-bold flex items-center gap-1 transition-colors ${
                            isCodEnabled 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                              : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                          title="Click to toggle Meesho COD status"
                        >
                          <span>Meesho COD:</span>
                          <strong>{isCodEnabled ? 'ON ✅' : 'OFF ❌'}</strong>
                        </button>

                        <button
                          type="button"
                          disabled={syncingId === p.id}
                          onClick={() => handleSyncStock(p)}
                          className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${syncingId === p.id ? 'animate-spin' : ''}`} />
                          <span>Sync Stock</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOrderNow(p)}
                      disabled={!isAvailable}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm font-sans flex items-center justify-center gap-1.5 shadow-md transition-all ${
                        isAvailable 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-600/20 hover:scale-[1.01]' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {!isAvailable ? 'OUT OF STOCK' : isCodEnabled ? 'BUY NOW (COD / UPI)' : 'BUY NOW (UPI ONLY)'}
                      </span>
                    </button>

                    {isSupplierMode && onDeleteProduct && (
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete product from store"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorefrontCatalog;
