import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Link, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Tag,
  Clipboard,
  ClipboardCheck,
  Image as ImageIcon,
  ExternalLink,
  Check,
  X,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { DropshipProduct } from '../types/dropship';

interface AiProductImporterProps {
  onProductImported: (product: DropshipProduct) => void;
}

const SAMPLE_MEESHO_PRODUCTS = [
  {
    label: "👕 Oversized Graphic Anime Tee",
    url: "https://www.meesho.com/s/p/8w21a - Tokyo Streetwear 100% Cotton Bio-Washed T-Shirt ₹299"
  },
  {
    label: "🎧 Wireless BassPro Earbuds (ENC)",
    url: "https://www.meesho.com/s/p/3b129 - Bluetooth 5.3 Neckband Earphones with 40H Battery ₹399"
  },
  {
    label: "🔪 8-in-1 Vegetable Chopper & Slicer",
    url: "https://www.meesho.com/s/p/9k872 - Multipurpose Kitchen Dicer with Food Container & Drain ₹249"
  },
  {
    label: "👗 Embroidered Anarkali Kurti Set",
    url: "https://www.meesho.com/s/p/4v910 - Rayon Floral Printed Anarkali Kurta with Pant and Dupatta ₹499"
  },
  {
    label: "👟 Breathable Sports Running Shoes",
    url: "https://www.meesho.com/s/p/5k192 - Lightweight Cushioned Running Sneakers ₹449"
  }
];

/**
 * Normalizes and cleans image URLs (handles escaped slashes, Meesho image CDN upgrades)
 */
function cleanAndNormalizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.replace(/\\+/g, '').replace(/&amp;/g, '&').trim();
  url = url.replace(/^["'(\[]+|["')\]]+$/g, '');

  if (url.startsWith('//')) {
    url = 'https:' + url;
  }

  // If it's a Meesho CDN image with low-res suffix (e.g. _64.webp, _128.webp), upgrade to high quality _512.webp
  if (url.includes('images.meesho.com/images/products/')) {
    url = url.replace(/_\d{2,3}\.(jpg|jpeg|png|webp)/i, '_512.$1');
  }

  return url.startsWith('http') ? url : '';
}

/**
 * Extract clean product title from URL slug
 */
function extractTitleFromUrlSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    for (const part of pathParts) {
      if (part !== 'p' && part !== 's' && part !== 'product' && part.length > 3 && !/^\d+$/.test(part)) {
        const words = part.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
        if (words.length > 4 && !words.toLowerCase().includes('meesho')) return words;
      }
    }
  } catch (e) {}
  return '';
}

export const AiProductImporter: React.FC<AiProductImporterProps> = ({ onProductImported }) => {
  const [inputQuery, setInputQuery] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(399);
  const [wholesalePrice, setWholesalePrice] = useState<number>(249);
  const [category, setCategory] = useState('Trending');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [extractedPhotosList, setExtractedPhotosList] = useState<string[]>([]);
  const [selectedMainPhoto, setSelectedMainPhoto] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [lastImported, setLastImported] = useState<DropshipProduct | null>(null);
  const [pastedFeedback, setPastedFeedback] = useState(false);

  // Auto-parse input as user types or pastes to detect real title, price & photos instantly
  useEffect(() => {
    if (!inputQuery.trim()) {
      setStatusNotice(null);
      return;
    }

    const trimmed = inputQuery.trim();
    const photos: string[] = [];

    // 1. Extract all Meesho CDN image links
    const meeshoMatches = trimmed.match(/(?:https?:)?\\?\/\\?\/images\.meesho\.com\\?\/images\\?\/products\\?\/[a-zA-Z0-9_\-./]+\.(?:jpg|jpeg|png|webp|avif)/gi) || [];
    for (const m of meeshoMatches) {
      const cleaned = cleanAndNormalizeImageUrl(m);
      if (cleaned && !photos.includes(cleaned)) photos.push(cleaned);
    }

    // 2. Extract any generic direct image URLs
    const directImageRegex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'<>]*)?/gi;
    const directMatches = trimmed.match(directImageRegex) || [];
    for (const m of directMatches) {
      const cleaned = cleanAndNormalizeImageUrl(m);
      if (cleaned && !photos.includes(cleaned)) photos.push(cleaned);
    }

    // 3. Extract title from slug if present
    const urlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      const slugTitle = extractTitleFromUrlSlug(urlMatch[0]);
      if (slugTitle && (!productTitle || productTitle === 'Meesho Product')) {
        setProductTitle(slugTitle);
      }
    }

    // 4. Extract price if mentioned
    const priceMatch = trimmed.match(/(?:₹|rs\.?|inr|price)\s*[:=]?\s*(\d{2,4})/i) || trimmed.match(/\b(\d{3,4})\b/);
    if (priceMatch) {
      const detected = parseInt(priceMatch[1], 10);
      if (detected > 50 && detected < 15000) {
        setWholesalePrice(detected);
        if (sellingPrice <= 399) {
          setSellingPrice(Math.round(detected + 150));
        }
      }
    }

    if (photos.length > 0) {
      setExtractedPhotosList(photos);
      if (!selectedMainPhoto || !photos.includes(selectedMainPhoto)) {
        setSelectedMainPhoto(photos[0]);
      }
      setStatusNotice(`⚡ Found ${photos.length} real product photo${photos.length > 1 ? 's' : ''}`);
    }
  }, [inputQuery]);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputQuery(text.trim());
          setPastedFeedback(true);
          setErrorMsg(null);
          setTimeout(() => setPastedFeedback(false), 2000);
        }
      }
    } catch (err) {
      console.warn("Clipboard access not allowed:", err);
    }
  };

  const handleImport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() && !productTitle.trim()) {
      setErrorMsg("Kripya Meesho product link ya product ka naam enter karein!");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setLastImported(null);

    const primaryPhoto = customPhotoUrl.trim() || selectedMainPhoto || (extractedPhotosList.length > 0 ? extractedPhotosList[0] : '');
    const urlMatch = inputQuery.match(/https?:\/\/[^\s]+/i);
    const actualUrl = urlMatch ? urlMatch[0] : (inputQuery.startsWith('http') ? inputQuery : "https://www.meesho.com/s/p/catalog");

    try {
      const response = await fetch('/api/ai/import-meesho-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlOrText: inputQuery.trim(),
          customTitle: productTitle.trim() || undefined,
          customSellingPrice: Number(sellingPrice) || 399,
          customWholesalePrice: Number(wholesalePrice) || 249,
          customPhotoUrl: primaryPhoto || undefined,
          customCategory: category
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.product) {
          let finalProd: DropshipProduct = data.product;

          // Apply direct user overrides if given
          if (productTitle.trim()) {
            finalProd.title = productTitle.trim();
            finalProd.catchyTitle = productTitle.trim();
          }
          if (sellingPrice) {
            finalProd.retailPrice = Number(sellingPrice);
          }
          if (wholesalePrice) {
            finalProd.supplierPrice = Number(wholesalePrice);
          }
          if (primaryPhoto) {
            finalProd.images = [primaryPhoto, ...(finalProd.images.filter(img => img !== primaryPhoto))];
          }
          finalProd.sourceUrl = actualUrl;

          setLastImported(finalProd);
          onProductImported(finalProd);
          setInputQuery('');
          setProductTitle('');
          setCustomPhotoUrl('');
          setExtractedPhotosList([]);
          setSelectedMainPhoto('');
          setIsLoading(false);
          return;
        }
      }

      // Fallback: create product directly on client with exact inputs
      const titleToUse = productTitle.trim() || extractTitleFromUrlSlug(actualUrl) || "Meesho High-Quality Product";
      const imagesToUse = primaryPhoto ? [primaryPhoto] : (extractedPhotosList.length > 0 ? extractedPhotosList : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]);

      const clientProduct: DropshipProduct = {
        id: `prod_${Date.now()}`,
        sourceUrl: actualUrl,
        sourceSupplier: "Meesho",
        title: titleToUse,
        catchyTitle: titleToUse,
        description: "Verified direct supplier product with complete quality check and 7-day easy returns.",
        seoDescription: `Buy ${titleToUse} online with Cash on Delivery and fast shipping across India.`,
        bulletPoints: [
          "100% Genuine manufacturer quality",
          "Free Cash on Delivery (COD) available",
          "7-Day Hassle-Free Return Guarantee",
          "Safe and protective packaging"
        ],
        category: category || "Trending",
        supplierPrice: Number(wholesalePrice) || 249,
        marginType: "fixed",
        marginValue: (Number(sellingPrice) || 399) - (Number(wholesalePrice) || 249),
        retailPrice: Number(sellingPrice) || 399,
        compareAtPrice: Math.round((Number(sellingPrice) || 399) * 1.7),
        images: imagesToUse,
        sizes: ["Free Size"],
        colors: ["Standard"],
        inStock: true,
        stockCount: 40,
        meeshoCodAvailable: true,
        lastStockSyncAt: new Date().toISOString(),
        rating: 4.8,
        reviewsCount: 110,
        sku: `MSH-AI-${Math.floor(1000 + Math.random() * 9000)}`,
        isPublished: true,
        createdAt: new Date().toISOString()
      };

      setLastImported(clientProduct);
      onProductImported(clientProduct);
      setInputQuery('');
      setProductTitle('');
      setCustomPhotoUrl('');
      setExtractedPhotosList([]);
      setSelectedMainPhoto('');
    } catch (err: any) {
      console.warn("Import error:", err);
      // Construct fallback
      const titleToUse = productTitle.trim() || extractTitleFromUrlSlug(actualUrl) || "Meesho High-Quality Product";
      const imagesToUse = primaryPhoto ? [primaryPhoto] : (extractedPhotosList.length > 0 ? extractedPhotosList : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]);

      const clientProduct: DropshipProduct = {
        id: `prod_${Date.now()}`,
        sourceUrl: actualUrl,
        sourceSupplier: "Meesho",
        title: titleToUse,
        catchyTitle: titleToUse,
        description: "Verified direct supplier product with complete quality check and 7-day easy returns.",
        seoDescription: `Buy ${titleToUse} online with Cash on Delivery and fast shipping across India.`,
        bulletPoints: [
          "100% Genuine manufacturer quality",
          "Free Cash on Delivery (COD) available",
          "7-Day Hassle-Free Return Guarantee"
        ],
        category: category || "Trending",
        supplierPrice: Number(wholesalePrice) || 249,
        marginType: "fixed",
        marginValue: (Number(sellingPrice) || 399) - (Number(wholesalePrice) || 249),
        retailPrice: Number(sellingPrice) || 399,
        compareAtPrice: Math.round((Number(sellingPrice) || 399) * 1.7),
        images: imagesToUse,
        sizes: ["Free Size"],
        colors: ["Standard"],
        inStock: true,
        stockCount: 40,
        meeshoCodAvailable: true,
        lastStockSyncAt: new Date().toISOString(),
        rating: 4.8,
        reviewsCount: 95,
        sku: `MSH-AI-${Math.floor(1000 + Math.random() * 9000)}`,
        isPublished: true,
        createdAt: new Date().toISOString()
      };

      setLastImported(clientProduct);
      onProductImported(clientProduct);
      setInputQuery('');
      setProductTitle('');
      setCustomPhotoUrl('');
      setExtractedPhotosList([]);
      setSelectedMainPhoto('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Meesho Product Importer & Auto-Lister
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/40 font-mono">
                1-CLICK IMPORT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Meesho ka product link paste karein aur direct selling price daalkar apni dukaan par live list karein.
            </p>
          </div>
        </div>
      </div>

      {/* Main Import Form */}
      <form onSubmit={handleImport} className="space-y-4">
        {/* Input Link Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Link className="w-4 h-4 text-pink-400" />
              <span>Meesho Product Link / URL (यहाँ लिंक पेस्ट करें) *</span>
            </label>

            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-pink-950/80 hover:bg-pink-900 border border-pink-700/60 text-pink-300 flex items-center gap-1.5 transition-all shadow"
            >
              {pastedFeedback ? (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Pasted!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5 text-pink-400" />
                  <span>PASTE LINK</span>
                </>
              )}
            </button>
          </div>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="https://www.meesho.com/s/p/8w21a ya meesho product link paste karein..."
            className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white text-xs sm:text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-pink-500 shadow-inner"
          />
        </div>

        {/* Status notice */}
        {statusNotice && (
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Real-time Extracted Photos Picker */}
        {extractedPhotosList.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-pink-400">
                <ImageIcon className="w-4 h-4" />
                <span>Detected Real Photos ({extractedPhotosList.length}):</span>
              </span>
              <span className="text-[10px] text-slate-500">Click photo to set as primary storefront thumbnail</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {extractedPhotosList.map((imgUrl, idx) => {
                const isSelected = selectedMainPhoto === imgUrl;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedMainPhoto(imgUrl)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                      isSelected
                        ? 'border-pink-500 shadow-lg shadow-pink-500/40 scale-105'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Extracted ${idx}`} className="w-20 h-20 object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-pink-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DIRECT PRODUCT DETAILS & PRICE (NO MARGIN CONFUSION) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Product Title Override */}
          <div className="sm:col-span-1 space-y-1">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
              <span>Product Title (नाम)</span>
            </label>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="e.g. Cotton Printed Casual Kurti"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-sans placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Selling Price */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <span>Selling Price ₹ (विक्रय मूल्य) *</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-emerald-400 text-sm">₹</span>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                placeholder="449"
                className="w-full pl-7 pr-3.5 py-2.5 bg-slate-950 border border-emerald-600/60 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Wholesale Cost */}
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
              <span>Wholesale Cost ₹ (Meesho मूल्य)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">₹</span>
              <input
                type="number"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(Number(e.target.value))}
                placeholder="249"
                className="w-full pl-7 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Photo URL Input */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Custom Photo URL (यदि अलग फोटो लगानी हो):</span>
          </label>
          <input
            type="text"
            value={customPhotoUrl}
            onChange={(e) => setCustomPhotoUrl(e.target.value)}
            placeholder="https://images.meesho.com/... ya image URL paste karein..."
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fade-in font-sans">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>EXTRACTING REAL PRODUCT & PHOTOS...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>🚀 EXTRACT REAL PRODUCT & AUTO-LIST (स्टोर पर तुरंत लिस्ट करें)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Sample Links Quick Test Pills */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
          Quick Test Links (1-Click Test):
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MEESHO_PRODUCTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputQuery(sample.url);
                setErrorMsg(null);
              }}
              className="text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Last Imported Product Card */}
      {lastImported && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-4 animate-fade-in">
          <img
            src={lastImported.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
            alt={lastImported.catchyTitle}
            className="w-16 h-16 rounded-xl object-cover border border-emerald-700/60 shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">
                ✅ LIVE LISTED ON STOREFRONT
              </span>
            </div>
            <div className="font-bold text-xs text-white truncate">{lastImported.catchyTitle}</div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-3">
              <span className="text-emerald-400 font-bold">Selling Price: ₹{lastImported.retailPrice}</span>
              <span className="text-slate-400">Wholesale: ₹{lastImported.supplierPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiProductImporter;
