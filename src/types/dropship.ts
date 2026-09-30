export interface DropshipProduct {
  id: string;
  sourceUrl?: string;
  sourceSupplier: 'Meesho' | 'AliExpress' | 'IndiaMART' | 'Shopsy' | 'Custom';
  title: string;
  catchyTitle: string;
  description: string;
  seoDescription: string;
  bulletPoints: string[];
  category: string;
  supplierPrice: number; // e.g. 299 (What seller/supplier charges)
  marginType: 'fixed' | 'percentage';
  marginValue: number; // e.g. 150 or 25%
  retailPrice: number; // Final selling price customer pays e.g. 449
  compareAtPrice: number; // Strikethrough price e.g. 899
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockCount: number; // e.g. 24 items in stock, 0 if out of stock
  meeshoCodAvailable: boolean; // TRUE: COD enabled on Meesho, FALSE: Only Online payment allowed on Meesho
  lastStockSyncAt?: string; // Last time auto-checked with Meesho inventory
  rating: number;
  reviewsCount: number;
  sku: string;
  isPublished: boolean;
  createdAt: string;
  sellerId?: string; // Which seller listed this product
  sellerName?: string;
  
  // Meesho Ads / Promotion Boost
  isAdBoosted?: boolean;
  adBudget?: number; // e.g. ₹300 daily budget
  adImpressions?: number;
  adClicks?: number;
}

export interface AdCampaign {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  campaignName: string;
  dailyBudget: number; // in INR (e.g. ₹200, ₹500, ₹1000)
  totalSpent: number;  // Paid to Admin Pavan Mehta for running ads!
  cpc: number;         // Cost per click e.g. ₹1.80
  impressions: number;
  clicks: number;
  ordersGenerated: number;
  revenueGenerated: number;
  roas: number;        // Return on Ad Spend (e.g. 4.2x)
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
}

export type EscrowStatus = 
  | 'HELD_IN_ADMIN_ACCOUNT'    // Customer paid, amount safe in Pavan (Admin/Owner) account
  | 'RETURN_WINDOW_ACTIVE'     // Product delivered, 7-day return period running
  | 'SETTLED_TO_SELLER'        // 7-day return passed without return -> Payout sent to seller!
  | 'REFUNDED_TO_CUSTOMER'     // Product was returned -> Refunded to buyer, supplier gets 0
  | 'CANCELLED_AND_REFUNDED';  // Order cancelled -> 100% refund/COD nullified

export type MeeshoShippingStage = 
  | 'ORDER_CONFIRMED'          // Order verified by supplier
  | 'SHIPPED_FROM_MEESHO'      // Dispatched from supplier warehouse
  | 'IN_TRANSIT'               // En route to customer hub via Delhivery/Shadowfax/Ecom Express
  | 'OUT_FOR_DELIVERY'         // With delivery agent out for doorstep delivery
  | 'DELIVERED'                // Safely delivered to customer
  | 'RETURNED_REFUNDED'        // Returned by customer
  | 'CANCELLED';               // Cancelled by buyer or admin

export interface TrackingCheckpoint {
  title: string;
  description: string;
  timestamp: string;
  location: string;
  isCompleted: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    productTitle: string;
    supplierSource: string;
    sourceUrl?: string; // Direct link to Meesho/Supplier product page for 1-click fulfillment!
    supplierPrice: number;
    retailPrice: number;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    image: string;
    sellerId?: string;
  }[];
  paymentMethod: 'COD' | 'ONLINE_UPI';
  paymentStatus: 'PENDING' | 'PAID' | 'COD_CONFIRMED' | 'REFUND_INITIATED' | 'CANCELLED';
  transactionId?: string;
  totalRetailAmount: number; // What customer paid (100% hits Admin account first!)
  totalSupplierCost: number; // Seller base wholesale cost
  adminCommission: number;   // Admin/App Creator fee (e.g. 5% to 10% platform commission)
  sellerPayoutAmount: number;// Amount to be paid to seller ONLY after 7-day return period
  netProfit: number;
  
  // Escrow / Return Protection System
  escrowStatus: EscrowStatus;
  escrowReleaseDate: string; // 7 days from delivery date
  deliveryStatus: 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';
  returnWindowDays: number;   // e.g. 7 days
  returnEligibleUntil: string;
  isReturned: boolean;

  // Cancellation Information
  isCancelled?: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: 'BUYER' | 'ADMIN' | 'SUPPLIER';

  // Real-time Meesho Live Shipping & Courier Tracking
  shippingStage: MeeshoShippingStage;
  courierPartner: 'Delhivery' | 'Shadowfax' | 'Ecom Express' | 'XpressBees' | 'BlueDart';
  meeshoAwbNumber: string;
  currentLocation: string;
  estimatedDeliveryDate: string;
  trackingHistory: TrackingCheckpoint[];

  forwardingStatus: 'PENDING' | 'PROCESSING' | 'FORWARDED_TO_MEESHO' | 'DISPATCHED' | 'FAILED' | 'CANCELLED';
  fulfillmentDetails?: {
    forwardedAt?: string;
    meeshoOrderNumber?: string;
    trackingId?: string;
    automationLogs: string[];
  };
}

export interface MarginSettings {
  defaultMarginType: 'fixed' | 'percentage';
  defaultMarginValue: number; // e.g. 180 (rupees) or 30 (%)
  roundTo9: boolean; // e.g. 499 instead of 491
  freeShippingAbove: number;
  codFee: number;
}

export interface PlatformOwnerAccount {
  ownerName: string;
  businessName: string;
  ownerUpiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  platformFeePercent: number; // e.g. 7.5% cut on every order
  totalAdminEarnings: number; // Total platform commission accumulated
  totalAdRevenueEarned: number; // Money earned from sellers running Meesho Ads!
  totalFundsHeldInEscrow: number; // Buyer funds held safely awaiting 7-day return expiry
  updatedAt?: string;
}

export interface SupplierBankAccount {
  sellerId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  accountType: 'SAVINGS' | 'CURRENT';
  pendingSettlementAmount: number; // Funds pending 7-day return window
  totalPaidOutAmount: number;      // Amount released after successful non-returned deliveries
  adWalletBalance: number;         // Seller ad recharge balance
  isVerified: boolean;
  updatedAt?: string;
}

export interface SupplierPayoutSummary {
  sellerId: string;
  sellerName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  totalDeliveredSales: number;     // Gross sales from delivered items
  totalWholesaleBaseCost: number;  // Supplier product cost
  supplierGrossProfit: number;     // Profit earned before ad deduction
  totalAdSpend: number;            // Total Ads budget spent on platform
  netPayableToSupplier: number;    // Exactly what Admin (Pavan) must pay to supplier bank/UPI!
  paidOutAmount: number;           // Already disbursed
  balanceDueNow: number;           // Pending to transfer right now
  eligibleOrdersCount: number;
  activeCampaignsCount: number;
}
