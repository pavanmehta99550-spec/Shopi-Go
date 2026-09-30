import { DropshipProduct, CustomerOrder } from '../types/dropship';

export const DEFAULT_INITIAL_PRODUCTS: DropshipProduct[] = [
  {
    id: "prod_meesho_1",
    sourceUrl: "https://www.meesho.com/s/p/8w21a",
    sourceSupplier: "Meesho",
    title: "Aesthetic Tokyo Streetwear Oversized Graphic Tee (100% Bio-Wash Cotton)",
    catchyTitle: "Tokyo Streetwear Oversized Heavyweight Anime Graphic Tee (100% Pure Cotton)",
    description: "Upgrade your casual wardrobe with our premium 240 GSM bio-washed heavy cotton oversized t-shirt. Features durable Japanese street aesthetic puff-print graphics, pre-shrunk fabric, and comfortable drop-shoulder relaxed fit.",
    seoDescription: "Buy oversized streetwear anime t-shirt online at best prices. 100% pure cotton, bio-washed, fast cash on delivery across India.",
    bulletPoints: [
      "100% Premium 240 GSM Bio-Washed Cotton",
      "Fade-proof Japanese screen and HD puff print",
      "Trendy oversized drop-shoulder unisex fit",
      "Double-stitched ribbed collar and reinforced seams"
    ],
    category: "Men Fashion",
    supplierPrice: 249,
    marginType: "fixed",
    marginValue: 200,
    retailPrice: 449,
    compareAtPrice: 899,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Jet Black", "Sage Green", "Off White"],
    inStock: true,
    stockCount: 42,
    meeshoCodAvailable: true,
    lastStockSyncAt: new Date().toISOString(),
    rating: 4.8,
    reviewsCount: 248,
    sku: "MSH-TSHIRT-001",
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_meesho_2",
    sourceUrl: "https://www.meesho.com/s/p/3b129",
    sourceSupplier: "Meesho",
    title: "Wireless Bluetooth 5.3 Deep Bass Earphones with 40H Playtime & ENC",
    catchyTitle: "SonicBlast Ultra Wireless ENC Neckband with Deep Bass & 40-Hour Battery",
    description: "Experience studio-quality audio on the move. Equipped with 13mm neodymium bass boosters, Environmental Noise Cancellation (ENC) for crystal clear HD calls, ultra-low 45ms gaming latency, and Type-C Fast Fuel flash charging.",
    seoDescription: "Order wireless bluetooth earphones with 40H battery backup and Environmental Noise Cancellation. Top quality with warranty.",
    bulletPoints: [
      "Massive 40 Hours non-stop playtime battery",
      "Environmental Noise Cancellation (ENC) dual microphones",
      "13mm Titanium Bass Drivers for punchy sound",
      "IPX5 Sweat & Water Resistance with magnetic earbuds"
    ],
    category: "Electronics & Gadgets",
    supplierPrice: 299,
    marginType: "fixed",
    marginValue: 280,
    retailPrice: 579,
    compareAtPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size"],
    colors: ["Midnight Blue", "Matte Black", "Flame Red"],
    inStock: true,
    stockCount: 19,
    meeshoCodAvailable: false,
    lastStockSyncAt: new Date().toISOString(),
    rating: 4.7,
    reviewsCount: 389,
    sku: "MSH-AUDIO-002",
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod_meesho_3",
    sourceUrl: "https://www.meesho.com/s/p/9k872",
    sourceSupplier: "Meesho",
    title: "Multipurpose Vegetable Cutter & Chopper with 8 Stainless Steel Blades",
    catchyTitle: "ChefPro 8-in-1 Smart Kitchen Vegetable Chopper & Dicer with Drain Basket",
    description: "Cut vegetable prep time by 70%. Comes with 8 interchangeable food-grade 430 stainless steel blades for effortless slicing, julienning, and grating. Includes non-slip base container and built-in strainer basket.",
    seoDescription: "Shop 8 in 1 multipurpose vegetable cutter dicer and chopper for kitchen. Heavy duty blades, easy wash container with COD and fast delivery.",
    bulletPoints: [
      "8 Interchangeable razor-sharp stainless steel blades",
      "BPA-free food grade heavy-duty ABS body",
      "Integrated wash and drain basket",
      "Hand safety guard included to prevent accidental cuts"
    ],
    category: "Home & Kitchen",
    supplierPrice: 199,
    marginType: "fixed",
    marginValue: 180,
    retailPrice: 379,
    compareAtPrice: 799,
    images: [
      "https://images.unsplash.com/photo-1584990347449-399c5f7823f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard"],
    colors: ["Mint Green", "Ocean Grey"],
    inStock: true,
    stockCount: 35,
    meeshoCodAvailable: true,
    lastStockSyncAt: new Date().toISOString(),
    rating: 4.9,
    reviewsCount: 512,
    sku: "MSH-KITCHEN-003",
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: "ord_1001",
    orderNumber: "ORD-94821",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      fullName: "Rahul Verma",
      phone: "+91 9876543210",
      email: "rahul.v@gmail.com",
      address: "Flat 402, Sai Residency, Near Metro Station, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201309"
    },
    items: [
      {
        productId: "prod_meesho_1",
        productTitle: "Aesthetic Tokyo Streetwear Oversized Graphic Tee",
        supplierSource: "Meesho",
        supplierPrice: 249,
        retailPrice: 449,
        selectedSize: "L",
        selectedColor: "Jet Black",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
      }
    ],
    paymentMethod: "COD",
    paymentStatus: "COD_CONFIRMED",
    totalRetailAmount: 449,
    totalSupplierCost: 249,
    adminCommission: 33.68,
    sellerPayoutAmount: 215.32,
    netProfit: 200,
    escrowStatus: "RETURN_WINDOW_ACTIVE",
    escrowReleaseDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    deliveryStatus: "DELIVERED",
    returnWindowDays: 7,
    returnEligibleUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
    isReturned: false,
    shippingStage: "DELIVERED",
    courierPartner: "Delhivery",
    meeshoAwbNumber: "DLVRY-IND-99401",
    currentLocation: "Noida Sector 62 Hub (Delivered)",
    estimatedDeliveryDate: new Date(Date.now() - 3600000 * 2).toLocaleDateString(),
    trackingHistory: [
      {
        title: "Order Placed & Confirmed",
        description: "Order verified and dispatched to Meesho supplier",
        timestamp: new Date(Date.now() - 86400000 * 3).toLocaleString(),
        location: "Kolkata Apparel Warehouse",
        isCompleted: true
      },
      {
        title: "Out for Doorstep Delivery",
        description: "Delhivery rider assigned for final delivery",
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString(),
        location: "Noida Delivery Hub",
        isCompleted: true
      },
      {
        title: "Delivered to Customer",
        description: "Delivered safely. 7-day buyer protection escrow window active.",
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(),
        location: "Customer Doorstep",
        isCompleted: true
      }
    ],
    forwardingStatus: "FORWARDED_TO_MEESHO",
    fulfillmentDetails: {
      forwardedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      meeshoOrderNumber: "MEESHO-SUB-8192041",
      trackingId: "DLVRY-IND-99401",
      automationLogs: [
        "[AUTO DISPATCH] Authenticated with Meesho supplier API proxy.",
        "[ESCROW LOCKED] ₹449 locked in Admin Escrow Account.",
        "[DISPATCH CONFIRMED] Item shipped via Delhivery Express."
      ]
    }
  }
];

/**
 * Robust fetch helper with exponential backoff retries and timeouts
 * Returns a graceful response if offline to prevent uncaught "Failed to fetch" errors
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 2,
  delayMs = 300
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) return res;

      if (attempt < maxRetries && res.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        continue;
      }
      return res;
    } catch (err: any) {
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  // Graceful fallback response to avoid unhandled "Failed to fetch" exceptions
  return new Response(JSON.stringify({ error: "Network offline or server busy", success: false }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}
