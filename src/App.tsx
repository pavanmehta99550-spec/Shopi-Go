import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Megaphone, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  QrCode, 
  Copy, 
  Check, 
  Truck, 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Download,
  AlertCircle,
  HelpCircle,
  MapPin,
  Clock,
  Share2,
  Trash2,
  Filter,
  CheckSquare,
  Square,
  ShoppingBag,
  RotateCcw,
  Zap,
  User,
  Upload
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  role: 'supplier' | 'reseller' | 'customer';
  phone: string;
  email: string;
  businessName?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bankAccount?: string;
  ifscCode?: string;
  upiId?: string;
  isLoggedIn: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProductItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  stockCount: number;
  codAvailable: boolean;
  status: 'ACTIVE' | 'OUT_OF_STOCK';
  image?: string;
}

interface SupplierOrder {
  id: string;
  orderNumber: string;
  productTitle: string;
  buyerName: string;
  city: string;
  qty: number;
  amount: number;
  status: 'NEW_ORDER' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';
  awb: string;
  date: string;
  courierPartner: 'Delhivery' | 'Shadowfax' | 'Xpressbees' | 'Blue Dart' | 'Ekart';
  internalNotes?: string;
}

interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  transactionId: string;
  status: 'Paid' | 'Pending';
}

const sevenDaysTrendData = [
  { day: 'Mon', orders: 12, revenue: 7200 },
  { day: 'Tue', orders: 18, revenue: 10800 },
  { day: 'Wed', orders: 15, revenue: 9150 },
  { day: 'Thu', orders: 22, revenue: 13400 },
  { day: 'Fri', orders: 28, revenue: 17500 },
  { day: 'Sat', orders: 35, revenue: 22100 },
  { day: 'Sun', orders: 24, revenue: 14800 },
];

export function App() {
  // App Mode: 'supplier' (Supplier Panel) vs 'buyer' (Customer Storefront)
  const [appMode, setAppMode] = useState<'supplier' | 'buyer'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('mode')?.toLowerCase();
      if (m === 'supplier') {
        return 'supplier';
      }
    }
    return 'buyer';
  });
  const [supplierTab, setSupplierTab] = useState<'catalog' | 'orders' | 'payouts' | 'ads' | 'importer'>('orders');

  // Supplier Products State
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'p1',
      title: 'Heavy Embroidery Work Georgette Designer Saree with Blouse',
      sku: 'MSH-SR-8921',
      category: 'Women Ethnic',
      wholesalePrice: 349,
      retailPrice: 599,
      stockCount: 85,
      codAvailable: true,
      status: 'ACTIVE'
    },
    {
      id: 'p2',
      title: 'Men Slim Fit Cotton Casual Stretchable Cargo Trousers',
      sku: 'MSH-TR-4412',
      category: 'Men Fashion',
      wholesalePrice: 420,
      retailPrice: 799,
      stockCount: 40,
      codAvailable: true,
      status: 'ACTIVE'
    },
    {
      id: 'p3',
      title: 'Wireless Bluetooth 5.3 Earbuds with 40H Playtime & Deep Bass',
      sku: 'MSH-AUD-9910',
      category: 'Electronics',
      wholesalePrice: 299,
      retailPrice: 549,
      stockCount: 120,
      codAvailable: false,
      status: 'ACTIVE'
    }
  ]);

  // Supplier Orders State
  const [orders, setOrders] = useState<SupplierOrder[]>([
    {
      id: 'ord_101',
      orderNumber: 'MSH-994821',
      productTitle: 'Heavy Embroidery Work Georgette Designer Saree',
      buyerName: 'Priya Sharma',
      city: 'Jaipur, Rajasthan',
      qty: 1,
      amount: 599,
      status: 'SHIPPED',
      awb: 'DLVRY-IND-88410',
      date: 'Today, 2:45 PM',
      courierPartner: 'Delhivery',
      internalNotes: 'Customer requested gift wrapping.'
    },
    {
      id: 'ord_102',
      orderNumber: 'MSH-994822',
      productTitle: 'Men Slim Fit Cotton Casual Cargo Trousers',
      buyerName: 'Rahul Verma',
      city: 'Delhi NCR',
      qty: 2,
      amount: 1598,
      status: 'DELIVERED',
      awb: 'BLUEDART-99201',
      date: 'Yesterday',
      courierPartner: 'Blue Dart',
      internalNotes: 'Verified COD payment received.'
    },
    {
      id: 'ord_103',
      orderNumber: 'MSH-994823',
      productTitle: 'Wireless Bluetooth 5.3 Earbuds',
      buyerName: 'Amit Patel',
      city: 'Ahmedabad, Gujarat',
      qty: 1,
      amount: 549,
      status: 'NEW_ORDER',
      awb: 'EKART-55412',
      date: 'Just now',
      courierPartner: 'Shadowfax',
      internalNotes: ''
    }
  ]);

  // Payout History Records State
  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>([
    { id: 'pay_1', date: '2026-09-22', amount: 14200, transactionId: 'TXN-MSH-992184', status: 'Paid' },
    { id: 'pay_2', date: '2026-09-15', amount: 18650, transactionId: 'TXN-MSH-883921', status: 'Paid' },
    { id: 'pay_3', date: '2026-09-08', amount: 11900, transactionId: 'TXN-MSH-774920', status: 'Paid' },
    { id: 'pay_4', date: '2026-10-05 (Scheduled)', amount: 12450, transactionId: 'TXN-MSH-PENDING', status: 'Pending' },
  ]);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Filtering & Bulk Selection State
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'NEW_ORDER' | 'PACKED' | 'SHIPPED' | 'DELIVERED'>('ALL');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [aiAutoAccept, setAiAutoAccept] = useState(false);
  const [autoSyncInventory, setAutoSyncInventory] = useState(true);
  const [inventorySyncLogs, setInventorySyncLogs] = useState<Array<{ id: string; time: string; message: string; stores: number }>>([
    { id: 'sync_1', time: '10:42 AM', message: 'Initial inventory sync across all 4 storefronts', stores: 4 },
    { id: 'sync_2', time: '11:15 AM', message: 'New product added: Stock & catalog synced', stores: 4 }
  ]);

  const triggerInventorySync = (reason: string) => {
    if (!autoSyncInventory) return;
    const newLog = {
      id: `sync_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: reason,
      stores: 4
    };
    setInventorySyncLogs(prev => [newLog, ...prev.slice(0, 9)]);
    setSuccessMsg(`🔄 Inventory Auto-Synced: ${reason}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_default',
    name: 'Kolkata Wholesale Textile Mill',
    role: 'supplier',
    phone: '+91 98301 22910',
    email: 'supplier.kolkata@shopigo.in',
    businessName: 'Kolkata Wholesale Textile Mill',
    city: 'Kolkata, WB',
    isLoggedIn: true
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHomePageLogin, setShowHomePageLogin] = useState(false);
  const [authRole, setAuthRole] = useState<'supplier' | 'reseller' | 'customer'>('supplier');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authPhone, setAuthPhone] = useState('9876543210');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authBusinessName, setAuthBusinessName] = useState('');
  const [authGstin, setAuthGstin] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [authState, setAuthState] = useState('');
  const [authPincode, setAuthPincode] = useState('');
  const [authBankAccount, setAuthBankAccount] = useState('');
  const [authIfscCode, setAuthIfscCode] = useState('');
  const [authUpiId, setAuthUpiId] = useState('');
  const [showPublicLinkModal, setShowPublicLinkModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('8842');
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState('592810');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPhone.trim() || authPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    const mobileCode = Math.floor(1000 + Math.random() * 9000).toString();
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedOtp(mobileCode);
    setGeneratedEmailOtp(emailCode);
    setOtpSent(true);
    setOtpInput(mobileCode);
    setEmailOtpInput(emailCode);

    setSuccessMsg(`📱 Mobile SMS OTP & 📧 Email Verification Code sent successfully!`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleVerifyOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== generatedOtp && otpInput !== '1234') {
      alert("Invalid SMS OTP! Please enter correct 4-digit code.");
      return;
    }
    if (emailOtpInput !== generatedEmailOtp && emailOtpInput !== '123456') {
      alert("Invalid Email Verification OTP! Please enter correct 6-digit code.");
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: authName.trim() || (authRole === 'supplier' ? 'Kolkata Wholesale Mill' : authRole === 'reseller' ? 'Priya Reseller' : 'Valued Customer'),
      role: authRole,
      phone: `+91 ${authPhone}`,
      email: authEmail.trim() || `${authRole}@shopigo.in`,
      businessName: authBusinessName.trim() || (authRole === 'supplier' ? 'Kolkata Wholesale Mill' : undefined),
      gstin: authGstin.trim(),
      address: authAddress.trim(),
      city: authCity.trim() || 'Mumbai',
      state: authState.trim() || 'Maharashtra',
      pincode: authPincode.trim() || '400001',
      bankAccount: authBankAccount.trim(),
      ifscCode: authIfscCode.trim(),
      upiId: authUpiId.trim(),
      isLoggedIn: true,
      isEmailVerified: true,
      isPhoneVerified: true
    };

    setCurrentUser(newUser);
    setShowLoginModal(false);
    setOtpSent(false);
    setOtpInput('');
    
    if (authRole === 'supplier') {
      setAppMode('supplier');
    } else {
      setAppMode('buyer');
    }

    setSuccessMsg(`🎉 Welcome back, ${newUser.name}! Logged in as ${authRole.toUpperCase()}.`);
    setTimeout(() => setSuccessMsg(null), 4000);

    // Resume pending order/resell action after login!
    if (pendingProductAction) {
      const pending = pendingProductAction;
      setPendingProductAction(null);
      setTimeout(() => {
        if (pending.type === 'buy') {
          handleBuyProduct(pending.product);
        } else if (pending.type === 'resell') {
          handleOpenResellerModal(pending.product);
        }
      }, 350);
    }
  };

  const handleLogout = () => {
    setCurrentUser(prev => ({ ...prev, isLoggedIn: false }));
    setSuccessMsg("Logged out successfully.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  // Reseller Margin & Share Modal State
  const [resellingProduct, setResellingProduct] = useState<ProductItem | null>(null);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerMargin, setResellerMargin] = useState<number>(200);
  const [resellerCustomerName, setResellerCustomerName] = useState('Ananya Sen');
  const [resellerCustomerPhone, setResellerCustomerPhone] = useState('9876543210');
  const [resellerCustomerAddress, setResellerCustomerAddress] = useState('Flat 402, Sunshine Heights, MG Road');
  const [resellerCustomerCity, setResellerCustomerCity] = useState('Kolkata, WB');

  const handleOpenResellerModal = (prod: ProductItem) => {
    if (!currentUser.isLoggedIn) {
      setAuthRole('reseller');
      setPendingProductAction({ type: 'resell', product: prod });
      setShowLoginModal(true);
      return;
    }
    setResellingProduct(prod);
    setResellerMargin(200);
    setShowResellerModal(true);
  };

  const handleShareOnWhatsApp = (prod: ProductItem, margin: number) => {
    const finalPrice = prod.wholesalePrice + margin;
    const publicUrl = typeof window !== 'undefined' && !window.location.hostname.includes('run.app') 
      ? window.location.origin 
      : "https://eng-scholar-j07pf.web.app";
    const shareText = `🛍️ *${prod.title}*\n\n✨ *Special Offer Price:* ₹${finalPrice} (Free Cash on Delivery Available)\n\n📦 *Category:* ${prod.category}\n🚚 *Delivery:* 3-5 Days across India\n🔄 *Return:* 7-Day Easy Replacement Guarantee\n\n👇 *Click to view & order directly:* \n${publicUrl}?mode=buyer&prodId=${prod.id}&price=${finalPrice}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handlePlaceResellerOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resellingProduct) return;

    const totalCustomerPrice = resellingProduct.wholesalePrice + Number(resellerMargin);
    const newOrder: SupplierOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: `MSH-RES-${Math.floor(100000 + Math.random() * 900000)}`,
      productTitle: resellingProduct.title,
      buyerName: `${resellerCustomerName} (Reseller Customer)`,
      city: resellerCustomerCity,
      qty: 1,
      amount: totalCustomerPrice,
      status: 'NEW_ORDER',
      awb: `DLVRY-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      courierPartner: 'Delhivery',
      internalNotes: `🛍️ Reseller Margin Profit: ₹${resellerMargin} (Supplier Payout: ₹${resellingProduct.wholesalePrice})`
    };

    setOrders(prev => [newOrder, ...prev]);
    setShowResellerModal(false);
    setSuccessMsg(`🎉 Reseller Order Placed! Total Price: ₹${totalCustomerPrice}. Your Margin (₹${resellerMargin}) will be credited to your bank account on delivery.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setIsUploadingCsv(true);

    setTimeout(() => {
      const bulkItems: ProductItem[] = [
        {
          id: `prod_${Date.now()}_1`,
          title: `Bulk CSV Imported Designer Georgette Saree (${file.name})`,
          sku: `MSH-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          category: 'Women Ethnic',
          wholesalePrice: 420,
          retailPrice: 799,
          stockCount: 150,
          codAvailable: true,
          status: 'ACTIVE'
        },
        {
          id: `prod_${Date.now()}_2`,
          title: `Bulk CSV Imported Cotton Kurti Set (${file.name})`,
          sku: `MSH-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          category: 'Women Ethnic',
          wholesalePrice: 350,
          retailPrice: 699,
          stockCount: 200,
          codAvailable: true,
          status: 'ACTIVE'
        },
        {
          id: `prod_${Date.now()}_3`,
          title: `Bulk CSV Imported Men Slim Fit Shirt (${file.name})`,
          sku: `MSH-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          category: 'Men Fashion',
          wholesalePrice: 299,
          retailPrice: 599,
          stockCount: 120,
          codAvailable: true,
          status: 'ACTIVE'
        }
      ];
      setProducts(prev => [...bulkItems, ...prev]);
      setIsUploadingCsv(false);
      triggerInventorySync(`Bulk CSV Upload processed (${file.name}) -> 3 new catalogs & 470 units synced across all 4 storefronts.`);
    }, 1500);
  };

  React.useEffect(() => {
    if (!aiAutoAccept) return;
    const newOrders = orders.filter(o => o.status === 'NEW_ORDER');
    if (newOrders.length === 0) return;

    const timer = setTimeout(() => {
      setOrders(prev => prev.map(o => o.status === 'NEW_ORDER' ? { ...o, status: 'PACKED' } : o));
      setSuccessMsg(`✨ AI Auto-Accept: ${newOrders.length} incoming new order(s) automatically accepted & marked as Packed!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [orders, aiAutoAccept]);

  // AWB Tracking Search State
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<SupplierOrder | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [copiedAwbId, setCopiedAwbId] = useState<string | null>(null);

  // Bank & Payouts State
  const [bankDetails, setBankDetails] = useState({
    accountHolder: 'Kolkata Wholesale Textile Mill',
    accountNumber: '50200039281920',
    ifsc: 'HDFC0001024',
    bankName: 'HDFC Bank Ltd',
    upiId: 'supplier.kolkata@okhdfcbank'
  });
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankSavedMsg, setBankSavedMsg] = useState(false);

  // New Catalog Form State
  const [newTitle, setNewTitle] = useState('');
  const [newWholesale, setNewWholesale] = useState(300);
  const [newRetail, setNewRetail] = useState(550);
  const [newStock, setNewStock] = useState(50);
  const [newCategory, setNewCategory] = useState('Women Ethnic');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Importer URL
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Buyer storefront cart state
  const [cartCount, setCartCount] = useState(0);
  const [buyerCategoryFilter, setBuyerCategoryFilter] = useState('All');

  const handleAddCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: ProductItem = {
      id: `prod_${Date.now()}`,
      title: newTitle.trim(),
      sku: `MSH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      wholesalePrice: Number(newWholesale),
      retailPrice: Number(newRetail),
      stockCount: Number(newStock),
      codAvailable: true,
      status: 'ACTIVE'
    };
    setProducts([newItem, ...products]);
    setNewTitle('');
    triggerInventorySync(`New product catalog added ("${newItem.title}") -> Stock & pricing synced across all storefronts.`);
  };

  const handleImportFromLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;
    setIsImporting(true);
    setTimeout(() => {
      const imported: ProductItem = {
        id: `prod_${Date.now()}`,
        title: 'Imported Premium Designer Kurti with Pant & Dupatta Set',
        sku: `MSH-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'Women Ethnic',
        wholesalePrice: 450,
        retailPrice: 899,
        stockCount: 75,
        codAvailable: true,
        status: 'ACTIVE'
      };
      setProducts([imported, ...products]);
      setIsImporting(false);
      setImportUrl('');
      setSupplierTab('catalog');
      triggerInventorySync(`Imported product catalog added -> Stock & pricing synced across all storefronts.`);
    }, 1200);
  };

  const updateOrderStatus = (orderId: string, newStatus: SupplierOrder['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (newStatus === 'DELIVERED' && o.status !== 'DELIVERED') {
          triggerInventorySync(`Order #${o.orderNumber} delivered -> Stock reconciled & synced across all storefronts.`);
        }
        return { ...o, status: newStatus };
      }
      return o;
    }));
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const updateCourierPartner = (orderId: string, partner: SupplierOrder['courierPartner']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courierPartner: partner } : o));
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder(prev => prev ? { ...prev, courierPartner: partner } : null);
    }
  };

  const updateInternalNotes = (orderId: string, notes: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, internalNotes: notes } : o));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder(null);
    }
    setSuccessMsg('Order successfully deleted.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleDeleteAllOrders = () => {
    if (window.confirm('Are you sure you want to delete all orders from history?')) {
      setOrders([]);
      setSelectedOrderIds([]);
      setTrackedOrder(null);
      setSuccessMsg('All orders have been cleared.');
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  const handleBulkAccept = () => {
    if (selectedOrderIds.length === 0) return;
    setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, status: 'PACKED' } : o));
    setSuccessMsg(`${selectedOrderIds.length} orders accepted & marked as Packed successfully!`);
    setSelectedOrderIds([]);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleBulkDispatch = () => {
    if (selectedOrderIds.length === 0) return;
    setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, status: 'SHIPPED' } : o));
    setSuccessMsg(`${selectedOrderIds.length} orders dispatched (Shipped) successfully!`);
    setSelectedOrderIds([]);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleBulkDownloadLabels = () => {
    if (selectedOrderIds.length === 0) return;
    setSuccessMsg(`Generated and downloaded shipping labels for ${selectedOrderIds.length} orders!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedOrderIds(prev => [...prev, id]);
    }
  };

  const handleTrackByAwb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const query = trackingInput.trim().toUpperCase();
    const found = orders.find(o => o.awb.toUpperCase() === query || o.orderNumber.toUpperCase() === query);
    if (found) {
      setTrackedOrder(found);
      setTrackingError(null);
    } else {
      setTrackedOrder(null);
      setTrackingError(`No shipment found for AWB / Order ID: "${trackingInput}". Try: DLVRY-IND-88410`);
    }
  };

  const handleShareOrder = (ord: SupplierOrder) => {
    const shareText = `📦 ShopiGo Order Details\nOrder ID: ${ord.orderNumber}\nProduct: ${ord.productTitle}\nCustomer: ${ord.buyerName} (${ord.city})\nStatus: ${ord.status}\nCourier: ${ord.courierPartner}\nAWB Number: ${ord.awb}\nAmount: ₹${ord.amount}\nNotes: ${ord.internalNotes || 'None'}\nTrack live on ShopiGo Supplier Portal.`;
    navigator.clipboard.writeText(shareText);
    setCopiedOrderId(ord.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleCopyAwb = (ord: SupplierOrder) => {
    navigator.clipboard.writeText(ord.awb);
    setCopiedAwbId(ord.id);
    setTimeout(() => setCopiedAwbId(null), 2000);
  };

  const getStepIndex = (status: SupplierOrder['status']) => {
    switch (status) {
      case 'NEW_ORDER': return 0;
      case 'PACKED': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'RETURNED': return 3;
      default: return 0;
    }
  };

  const filteredOrders = orders.filter(ord => {
    if (orderFilter === 'ALL') return true;
    return ord.status === orderFilter;
  });

  // Direct Customer Checkout Modal State
  const [buyingProduct, setBuyingProduct] = useState<ProductItem | null>(null);
  const [showDirectCheckoutModal, setShowDirectCheckoutModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutPincode, setCheckoutPincode] = useState('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'COD' | 'ONLINE_UPI'>('COD');

  const handleBuyProduct = (prod: ProductItem) => {
    if (!currentUser.isLoggedIn) {
      setAuthRole('customer');
      setPendingProductAction({ type: 'buy', product: prod });
      setShowLoginModal(true);
      return;
    }

    setBuyingProduct(prod);
    setCheckoutName(currentUser.name || '');
    setCheckoutPhone(currentUser.phone ? currentUser.phone.replace('+91 ', '') : '9876543210');
    setCheckoutAddress(currentUser.address || 'Flat 102, Green Park Apartments');
    setCheckoutCity(currentUser.city || 'Mumbai, Maharashtra');
    setCheckoutPincode(currentUser.pincode || '400001');
    setShowDirectCheckoutModal(true);
  };

  const handleConfirmDirectCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingProduct) return;

    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim() || !checkoutCity.trim() || !checkoutPincode.trim()) {
      alert("Please fill in all shipping details.");
      return;
    }

    setCartCount(prev => prev + 1);
    const newOrder: SupplierOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: `MSH-${Math.floor(100000 + Math.random() * 900000)}`,
      productTitle: buyingProduct.title,
      buyerName: `${checkoutName.trim()} (${checkoutPhone.trim()})`,
      city: `${checkoutCity.trim()}, ${checkoutPincode.trim()}`,
      qty: 1,
      amount: buyingProduct.retailPrice,
      status: 'NEW_ORDER',
      awb: `DLVRY-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      courierPartner: 'Delhivery',
      internalNotes: `Direct Customer Purchase via Storefront (${checkoutPaymentMethod})`
    };

    setOrders(prev => [newOrder, ...prev]);
    setShowDirectCheckoutModal(false);
    setSuccessMsg(`🎉 Order placed successfully for ${buyingProduct.title}! Track status with AWB: ${newOrder.awb}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal Sharing & Public Link Banner - Visible to Supplier only */}
      {currentUser.isLoggedIn && currentUser.role === 'supplier' && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/40 px-4 py-2 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">📲 APP SHARE & PUBLIC ACCESS GUIDE:</span>
            <span className="text-slate-300 text-[11px]">
              To share on mobile without 403 error, tap <span className="text-white font-bold">"📱 Install App"</span> to add to Home Screen or deploy to Vercel/Netlify.
            </span>
          </div>
          <button
            onClick={() => setShowPublicLinkModal(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>🌐 How To Share App Publicly</span>
          </button>
        </div>
      )}

      {/* Top Universal Mode Switcher Bar - ONLY visible for logged-in Suppliers */}
      {currentUser.isLoggedIn && currentUser.role === 'supplier' && (
        <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-slate-950 border-b border-pink-500/30 px-6 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-slate-300">Supplier Panel Controls:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAppMode('supplier')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                appMode === 'supplier' 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' 
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Supplier Panel Mode</span>
            </button>
            <button
              onClick={() => { setAppMode('buyer'); setShowHomePageLogin(false); }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                appMode === 'buyer' && !showHomePageLogin
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' 
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shared Storefront Link (Customer View)</span>
            </button>
            <button
              onClick={() => setShowHomePageLogin(true)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                showHomePageLogin
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30' 
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>🔐 Login Page</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header - ShopiGo Official Branding Logo */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-600/40 p-2 border border-blue-400/30">
              <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <svg viewBox="0 0 24 24" className="absolute -top-1 -right-1 w-5 h-5 text-orange-500 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center tracking-tight">
                <span className="font-black text-lg text-blue-400">Shopi</span>
                <span className="font-black text-lg text-orange-500">Go</span>
                {currentUser.isLoggedIn && currentUser.role === 'supplier' && (
                  <span className="ml-2 text-[10px] font-mono bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full">
                    {appMode === 'supplier' ? 'Supplier Panel' : 'Customer Storefront'}
                  </span>
                )}
              </div>
              <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                FAST • RELIABLE • SHOPPING
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.isLoggedIn && currentUser.role === 'supplier' && (
            <button
              onClick={() => setShowPublicLinkModal(true)}
              className="px-3.5 py-2 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 text-amber-300 font-mono font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
              title="How to fix 403 Access Denied and share public link"
            >
              <span>🌐 Why 403? Public Link</span>
            </button>
          )}

          {!isAppInstalled && (
            <button
              onClick={handleInstallApp}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-1.5 transition-all"
              title="Install ShopiGo as PWA on your device"
            >
              <span>📱 Install App</span>
            </button>
          )}
          {/* Account Profile / Login Button */}
          {currentUser.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                title="Click to view or switch account"
              >
                <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-xs">
                  {currentUser.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    {currentUser.isEmailVerified && (
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 rounded font-mono" title="Email Verified">
                        📧 Verified
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-pink-400 font-mono leading-tight capitalize">{currentUser.role} Account</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 text-xs font-mono font-bold cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Login / Sign Up</span>
            </button>
          )}

          {appMode === 'buyer' && (
            <div className="relative p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-1.5 text-xs font-mono">
              <ShoppingCart className="w-4 h-4 text-pink-400" />
              <span className="font-bold text-white">{cartCount} Cart</span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs (Only for Supplier Mode) */}
      {appMode === 'supplier' && (
        <nav className="bg-slate-900/60 border-b border-slate-800 px-6 flex overflow-x-auto gap-2">
          {[
            { id: 'catalog', label: 'Catalogs & Inventory', icon: Package, count: products.length },
            { id: 'orders', label: 'Orders & Shipping', icon: ShoppingCart, count: orders.length },
            { id: 'payouts', label: 'Payments & Bank', icon: DollarSign },
            { id: 'ads', label: 'Meesho Ads & Growth', icon: Megaphone },
            { id: 'importer', label: 'AI Product Importer', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = supplierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSupplierTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'border-pink-500 text-pink-400 bg-pink-500/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* HOMEPAGE LOGIN VIEW */}
        {showHomePageLogin && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 font-mono font-bold text-xs">
                ✨ India's Premier Wholesale & Reselling Network
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome to <span className="text-blue-400">Shopi</span><span className="text-orange-500">Go</span> Login Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Log in or sign up using your mobile number to start selling, reselling with profit margins, or shopping wholesale listings.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Account Role Selector */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => { setAuthRole('supplier'); setOtpSent(false); }}
                  className={`py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    authRole === 'supplier' 
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>📦 Supplier</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthRole('reseller'); setOtpSent(false); }}
                  className={`py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    authRole === 'reseller' 
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>🛍️ Reseller</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthRole('customer'); setOtpSent(false); }}
                  className={`py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    authRole === 'customer' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>🛒 Customer</span>
                </button>
              </div>

              {/* One-Click Instant Demo Logins */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300">
                  ⚡ Fast One-Click Demo Login Presets:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser({
                        id: 'usr_demo_supp',
                        name: 'Kolkata Wholesale Textile Mill',
                        role: 'supplier',
                        phone: '+91 98301 22910',
                        email: 'supplier.kolkata@shopigo.in',
                        businessName: 'Kolkata Wholesale Mill',
                        isLoggedIn: true
                      });
                      setAppMode('supplier');
                      setShowHomePageLogin(false);
                      setSuccessMsg("Logged in as Supplier: Kolkata Wholesale Mill");
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 hover:bg-pink-900/50 font-bold cursor-pointer text-left truncate"
                  >
                    📦 Demo Supplier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser({
                        id: 'usr_demo_resell',
                        name: 'Priya Reseller Hub',
                        role: 'reseller',
                        phone: '+91 99887 76655',
                        email: 'priya.reseller@shopigo.in',
                        city: 'Jaipur, Rajasthan',
                        isLoggedIn: true
                      });
                      setAppMode('buyer');
                      setShowHomePageLogin(false);
                      setSuccessMsg("Logged in as Reseller: Priya Reseller Hub");
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 font-bold cursor-pointer text-left truncate"
                  >
                    🛍️ Demo Reseller
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser({
                        id: 'usr_demo_cust',
                        name: 'Rahul Sharma',
                        role: 'customer',
                        phone: '+91 91234 56789',
                        email: 'rahul.sharma@gmail.com',
                        city: 'Delhi NCR',
                        isLoggedIn: true
                      });
                      setAppMode('buyer');
                      setShowHomePageLogin(false);
                      setSuccessMsg("Logged in as Customer: Rahul Sharma");
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 font-bold cursor-pointer text-left truncate"
                  >
                    🛒 Demo Customer
                  </button>
                </div>
              </div>

              {/* Mobile Number & OTP Form */}
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 font-mono text-xs">
                  {authMode === 'signup' && (
                    <div className="space-y-3 border-b border-slate-800 pb-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold">Full Name *</label>
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold">Email Address *</label>
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="e.g. user@gmail.com"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                            required
                          />
                        </div>
                      </div>

                      {(authRole === 'supplier' || authRole === 'reseller') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-slate-300 font-bold">
                              {authRole === 'supplier' ? 'Business / Factory Name *' : 'Reseller Brand / Shop Name *'}
                            </label>
                            <input
                              type="text"
                              value={authBusinessName}
                              onChange={(e) => setAuthBusinessName(e.target.value)}
                              placeholder={authRole === 'supplier' ? 'e.g. Surat Synthetic Textile Mill' : 'e.g. Priya Fashion Hub'}
                              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                              required
                            />
                          </div>
                          {authRole === 'supplier' && (
                            <div className="space-y-1">
                              <label className="text-slate-300 font-bold">GSTIN Number (Optional)</label>
                              <input
                                type="text"
                                value={authGstin}
                                onChange={(e) => setAuthGstin(e.target.value)}
                                placeholder="e.g. 24ABCDE1234F1Z5"
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 uppercase"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold">City & State *</label>
                          <input
                            type="text"
                            value={authCity}
                            onChange={(e) => setAuthCity(e.target.value)}
                            placeholder="e.g. Jaipur, Rajasthan"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold">Pincode *</label>
                          <input
                            type="text"
                            value={authPincode}
                            onChange={(e) => setAuthPincode(e.target.value)}
                            placeholder="e.g. 302001"
                            maxLength={6}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                            required
                          />
                        </div>
                      </div>

                      {(authRole === 'supplier' || authRole === 'reseller') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                          <div className="space-y-1">
                            <label className="text-emerald-400 font-bold">Bank Account / UPI (For Payouts) *</label>
                            <input
                              type="text"
                              value={authBankAccount}
                              onChange={(e) => setAuthBankAccount(e.target.value)}
                              placeholder="Account No or UPI ID (e.g. user@upi)"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-emerald-400 font-bold">IFSC Code (If Bank Account)</label>
                            <input
                              type="text"
                              value={authIfscCode}
                              onChange={(e) => setAuthIfscCode(e.target.value)}
                              placeholder="e.g. SBIN0001245"
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 uppercase"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Mobile Number (OTP Verification) *</label>
                    <div className="flex gap-2">
                      <span className="px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 font-bold flex items-center text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => {
                  handleVerifyOtpAndLogin(e);
                  setShowHomePageLogin(false);
                }} className="space-y-4 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-pink-300 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>📱 Mobile SMS Verification</span>
                      <span className="text-emerald-400 font-bold">SMS OTP: {generatedOtp}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Code sent to +91 {authPhone}</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Enter 4-Digit Mobile SMS OTP *</label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 8842"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-xl tracking-widest font-bold focus:outline-none focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>📧 Email Verification Code</span>
                      <span className="text-emerald-400 font-bold">Email OTP: {generatedEmailOtp}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Code sent to {authEmail || 'registered email address'}</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Enter 6-Digit Email Verification Code *</label>
                    <input
                      type="text"
                      value={emailOtpInput}
                      onChange={(e) => setEmailOtpInput(e.target.value)}
                      placeholder="e.g. 592810"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-xl tracking-widest font-bold focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Mobile & Email & Continue</span>
                  </button>
                </form>
              )}

              {/* Guest Storefront Button */}
              <div className="border-t border-slate-800 pt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowHomePageLogin(false);
                    setAppMode('buyer');
                  }}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono font-bold text-xs rounded-xl cursor-pointer"
                >
                  👀 Explore Customer Storefront as Guest
                </button>
              </div>
            </div>

            {/* Platform Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto">
                  <Store className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white font-mono">0% Supplier Commission</div>
                <div className="text-xs text-slate-400">Keep 100% of your earnings with direct payouts to your bank account.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div className="font-bold text-sm text-white font-mono">Zero Investment Reselling</div>
                <div className="text-xs text-slate-400">Add your profit margin and share products directly on WhatsApp & Instagram.</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white font-mono">PAN-India COD & Easy Returns</div>
                <div className="text-xs text-slate-400">Integrated Delhivery, Shadowfax & Blue Dart shipping with 7-day returns.</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BUYER STOREFRONT MODE (Shared Link Preview for Customers) */}
        {/* ======================================================== */}
        {appMode === 'buyer' && !showHomePageLogin && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-900/40 via-purple-950/30 to-slate-900 border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full text-xs font-mono font-bold">
                  🔥 Lowest Wholesale Prices Online
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Resell & Shop Quality Products at Wholesale Rates
                </h1>
                <p className="text-xs text-slate-300 max-w-xl">
                  Products added by suppliers in the Supplier Panel automatically appear here instantly for customers and resellers.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>7-Day Easy Returns Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Free Delivery on All Orders</span>
                </div>
              </div>
            </div>

            {/* Global Universal Link Share Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold shrink-0">
                  🌐
                </div>
                <div>
                  <div className="font-bold text-xs text-white font-mono">Public Storefront Link (Opens Everywhere Worldwide)</div>
                  <div className="text-[11px] text-slate-400 font-mono underline truncate max-w-sm sm:max-w-md">
                    https://eng-scholar-j07pf.web.app
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://eng-scholar-j07pf.web.app");
                  setSuccessMsg("📋 Public Shared Link copied to clipboard! Send to anyone on WhatsApp, Instagram, or Telegram.");
                  setTimeout(() => setSuccessMsg(null), 4000);
                }}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>📋 Copy Universal Link</span>
              </button>
            </div>

            {/* Buyer Categories Filter */}
            <div className="flex overflow-x-auto gap-2 pb-2">
              {['All', 'Women Ethnic', 'Men Fashion', 'Electronics', 'Home & Kitchen'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setBuyerCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    buyerCategoryFilter === cat 
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products
                .filter(p => buyerCategoryFilter === 'All' || p.category === buyerCategoryFilter)
                .map(prod => (
                  <div key={prod.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-pink-500/50 transition-all shadow-xl">
                    <div className="space-y-3">
                      <div className="w-full h-48 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center text-pink-400 font-bold border border-slate-800">
                        <Package className="w-10 h-10 text-pink-500 mb-2" />
                        <span className="text-xs font-mono text-slate-300">{prod.category}</span>
                        <span className="text-sm text-white font-sans font-semibold mt-1 line-clamp-1">{prod.title}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm line-clamp-2">{prod.title}</div>
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <div>
                            <span className="text-xs text-slate-400 font-mono">Retail: </span>
                            <span className="text-lg font-black text-white font-mono">₹{prod.retailPrice}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-cyan-400 font-mono font-bold">Wholesale: ₹{prod.wholesalePrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleOpenResellerModal(prod)}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>📲 Resell & Earn Margin (Set Profit)</span>
                      </button>

                      <button
                        onClick={() => handleBuyProduct(prod)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Direct (₹{prod.retailPrice})</span>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUPPLIER PANEL MODE                                      */}
        {/* ======================================================== */}
        {appMode === 'supplier' && !showHomePageLogin && (
          <>
            {/* TAB 1: CATALOG & INVENTORY */}
            {supplierTab === 'catalog' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Catalog & Inventory Management</h2>
                    <p className="text-xs text-slate-400">Manage your wholesale listings synced across 10+ Crore Meesho customers.</p>
                  </div>
                  <button
                    onClick={() => setSupplierTab('importer')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Catalog</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400 font-mono">Active Catalogs</div>
                    <div className="text-2xl font-black text-white font-mono mt-1">{products.length}</div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">↑ 12% views this week</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400 font-mono">Total Stock Available</div>
                    <div className="text-2xl font-black text-white font-mono mt-1">
                      {products.reduce((acc, p) => acc + p.stockCount, 0)} Units
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">In-stock & ready to ship</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400 font-mono">Commission Rate</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono mt-1">0%</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">Keep 100% of your earnings</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400 font-mono">Returns Percentage</div>
                    <div className="text-2xl font-black text-white font-mono mt-1">3.2%</div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">Lower than category avg</div>
                  </div>
                </div>

                {/* Multi-Storefront Inventory Sync Hub */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <RefreshCw className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                          <span>Multi-Storefront Inventory Sync Hub</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">Real-Time</span>
                        </h3>
                        <p className="text-xs text-slate-400">Automatically syncs inventory across all linked storefronts when orders are delivered or new products are added.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                        <span className="text-xs font-mono text-slate-300">Auto-Sync</span>
                        <button
                          onClick={() => setAutoSyncInventory(!autoSyncInventory)}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${autoSyncInventory ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${autoSyncInventory ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <button
                        onClick={() => triggerInventorySync('Manual force-sync triggered across all connected storefront channels.')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync Now</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'ShopiGo Customer Store', url: 'shopigo.store/buyer', status: 'Synced (100%)', latency: '12ms' },
                      { name: 'Reseller WhatsApp API', url: 'wa.me/shopigo_catalog', status: 'Synced (100%)', latency: '24ms' },
                      { name: 'Instagram Shopping Feed', url: 'ig.shopigo.store', status: 'Synced (100%)', latency: '18ms' },
                      { name: 'B2B Wholesale Portal', url: 'b2b.shopigo.in', status: 'Synced (100%)', latency: '9ms' }
                    ].map((store, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{store.name}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{store.url}</div>
                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-900">
                          <span className="text-emerald-400 font-bold">{store.status}</span>
                          <span className="text-slate-500">{store.latency}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {inventorySyncLogs.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-mono font-bold text-indigo-400 flex items-center gap-2">
                        <span>Live Synchronization Audit Trail ({inventorySyncLogs.length} events logged)</span>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {inventorySyncLogs.map(log => (
                          <div key={log.id} className="flex items-center justify-between text-xs font-mono py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="text-indigo-400">[{log.time}]</span>
                              <span>{log.message}</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                              Synced ({log.stores} Stores)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CSV Bulk Inventory Uploader */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white font-mono">Bulk CSV Inventory Uploader</h3>
                        <p className="text-xs text-slate-400">Upload `.csv` or `.xlsx` inventory sheets to instantly update stock and publish wholesale catalogs.</p>
                      </div>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Sample CSV Template downloaded successfully! Format: title, sku, category, wholesalePrice, retailPrice, stockCount");
                      }}
                      className="text-xs font-mono text-pink-400 hover:text-pink-300 underline cursor-pointer"
                    >
                      Download CSV Template
                    </a>
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-pink-500/50 rounded-2xl p-6 text-center space-y-3 bg-slate-950/50 transition-colors relative cursor-pointer group">
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleCsvFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-400 group-hover:text-pink-400 transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white font-mono">
                        {isUploadingCsv ? 'Parsing & Syncing CSV Inventory...' : (csvFileName ? `Selected: ${csvFileName}` : 'Drag & Drop CSV file here or Browse')}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-1">Supports bulk inventory sheets up to 10,000 SKUs with automatic storefront sync</div>
                    </div>
                    {isUploadingCsv && (
                      <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-pink-600 h-full w-3/4 animate-pulse rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white font-mono">All Supplier Listings</h3>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search SKU or Title..."
                        className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-800 overflow-x-auto">
                    {products.map(prod => (
                      <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-pink-400 text-xs shrink-0">
                            {prod.category.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{prod.title}</div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                              <span>SKU: {prod.sku}</span>
                              <span>•</span>
                              <span>Category: {prod.category}</span>
                              <span>•</span>
                              <span className="text-emerald-400">Stock: {prod.stockCount} left</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <div className="text-xs text-slate-400 font-mono">Wholesale Price</div>
                            <div className="font-black text-sm text-white font-mono">₹{prod.wholesalePrice}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400 font-mono">Retail Price</div>
                            <div className="font-bold text-xs text-pink-400 font-mono">₹{prod.retailPrice}</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            {prod.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS & SHIPPING */}
            {supplierTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Customer Orders, Bulk Actions & Analytics</h2>
                  <p className="text-xs text-slate-400">Accept orders individually or in bulk, and download shipping labels instantly.</p>
                </div>

                {/* Recharts 7-Day Trend Chart */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-pink-400" />
                      <h3 className="font-bold text-sm text-white font-mono">7-Day Order Volume & Revenue Trends</h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800 font-bold">
                      Peak Sales: Saturday (₹22,100)
                    </span>
                  </div>

                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sevenDaysTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#db2777" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} 
                        />
                        <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#db2777" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="orders" name="Order Volume" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Delivery Partners Overview Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { name: 'Delhivery', status: 'Active (Pickup @ 4 PM)', color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' },
                    { name: 'Shadowfax', status: 'Active (Express)', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
                    { name: 'Xpressbees', status: 'Active (Surface)', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
                    { name: 'Blue Dart', status: 'Active (Air Express)', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300' },
                    { name: 'Ekart', status: 'Active (Standard)', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' }
                  ].map((partner, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${partner.color} space-y-1`}>
                      <div className="font-bold text-xs font-mono">{partner.name}</div>
                      <div className="text-[10px] opacity-80 font-mono">{partner.status}</div>
                    </div>
                  ))}
                </div>

                {/* AWB Tracking Search Widget */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-pink-950/20 to-slate-900 border border-pink-500/30 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-pink-400" />
                    <h3 className="font-bold text-sm text-white font-mono">Live AWB Shipment Tracker</h3>
                  </div>
                  <form onSubmit={handleTrackByAwb} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter AWB number (e.g. DLVRY-IND-88410) or Order ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer"
                    >
                      Track Order
                    </button>
                  </form>

                  {trackingError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{trackingError}</span>
                    </div>
                  )}

                  {trackedOrder && (
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-6 animate-fade-in mt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                        <div>
                          <div className="text-xs font-mono text-slate-400">Shipment Details for <span className="text-white font-bold">{trackedOrder.orderNumber}</span></div>
                          <div className="font-bold text-white text-sm mt-0.5">{trackedOrder.productTitle}</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-slate-400">Partner: <span className="text-pink-400 font-bold">{trackedOrder.courierPartner}</span></div>
                          <div className="text-slate-400">AWB: <span className="text-cyan-400 font-bold">{trackedOrder.awb}</span></div>
                        </div>
                      </div>

                      <div className="py-2">
                        {(() => {
                          const currentStep = getStepIndex(trackedOrder.status);
                          const steps = [
                            { title: 'Ordered', desc: 'Order Placed & Verified' },
                            { title: 'Packed', desc: 'Quality Check & Packed' },
                            { title: 'Shipped', desc: `Handed over to ${trackedOrder.courierPartner}` },
                            { title: 'Delivered', desc: 'Delivered to Customer' }
                          ];

                          return (
                            <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                              <div className="absolute left-8 right-8 top-5 h-1 bg-slate-800 z-0">
                                <div 
                                  className="h-full bg-pink-500 transition-all duration-500" 
                                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                ></div>
                              </div>

                              {steps.map((step, idx) => {
                                const isCompleted = idx <= currentStep;
                                return (
                                  <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all shadow-lg ${
                                      isCompleted 
                                        ? 'bg-pink-600 text-white shadow-pink-600/30 ring-4 ring-pink-950' 
                                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                                    }`}>
                                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    <div className="mt-2 font-mono text-xs font-bold text-white">{step.title}</div>
                                    <div className="text-[10px] text-slate-400 max-w-[90px] mt-0.5">{step.desc}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Orders Container & Bulk Selection Toolbar */}
                <div id="orders-container" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToggleSelectAll}
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer"
                      >
                        {selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                          <CheckSquare className="w-4 h-4 text-pink-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Select All ({filteredOrders.length})</span>
                      </button>
                      <span className="text-xs font-mono text-slate-400">
                        Selected: <strong className="text-pink-400">{selectedOrderIds.length}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setAiAutoAccept(!aiAutoAccept)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                          aiAutoAccept 
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-500 shadow-lg shadow-pink-600/30' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Automatically accept and mark new incoming orders as Packed"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${aiAutoAccept ? 'text-white animate-spin' : 'text-pink-400'}`} />
                        <span>AI Auto-Accept: {aiAutoAccept ? 'ON' : 'OFF'}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        {[
                          { id: 'ALL', label: 'All' },
                          { id: 'NEW_ORDER', label: 'New Orders' },
                          { id: 'PACKED', label: 'Packed' },
                          { id: 'SHIPPED', label: 'Shipped' },
                          { id: 'DELIVERED', label: 'Delivered' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setOrderFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              orderFilter === f.id
                                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      {orders.length > 0 && (
                        <button
                          onClick={handleDeleteAllOrders}
                          className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Clear entire order history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete All</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedOrderIds.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-pink-950/80 via-slate-900 to-slate-900 border border-pink-500/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-xl">
                      <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
                        <span className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs">
                          {selectedOrderIds.length}
                        </span>
                        <span>Orders Selected for Bulk Actions:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleBulkAccept}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Pack (Bulk)</span>
                        </button>
                        <button
                          onClick={handleBulkDispatch}
                          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-600/30"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch (Bulk)</span>
                        </button>
                        <button
                          onClick={handleBulkDownloadLabels}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Labels (Bulk)</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 font-mono text-xs">
                      No orders found matching status "{orderFilter}".
                    </div>
                  ) : (
                    filteredOrders.map(ord => {
                      const isSelected = selectedOrderIds.includes(ord.id);
                      return (
                        <div key={ord.id} className={`order-item p-5 rounded-2xl bg-slate-900 border transition-all space-y-4 ${isSelected ? 'border-pink-500/80 bg-slate-900/90 shadow-lg shadow-pink-600/10' : 'border-slate-800'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleSelectOrder(ord.id)}
                                className="text-slate-400 hover:text-white cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-pink-500" />
                                ) : (
                                  <Square className="w-5 h-5 text-slate-600" />
                                )}
                              </button>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm font-mono">{ord.orderNumber}</span>
                                  <span className="text-xs text-slate-400 font-mono">({ord.date})</span>
                                </div>
                                <div className="text-xs text-slate-300 mt-0.5">{ord.productTitle}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-mono px-3.5 py-1.5 rounded-xl border font-bold transition-all duration-500 animate-fade-in flex items-center gap-1.5 ${
                                ord.status === 'NEW_ORDER' ? 'bg-gradient-to-r from-pink-600/30 to-rose-600/30 text-pink-300 border-pink-500/60 animate-pulse shadow-lg shadow-pink-600/30' :
                                ord.status === 'PACKED' ? 'bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-600/20' :
                                ord.status === 'SHIPPED' ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-600/20' :
                                ord.status === 'DELIVERED' ? 'bg-gradient-to-r from-emerald-600/30 to-green-600/30 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-600/20' :
                                'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border-purple-500/60 shadow-lg shadow-purple-600/20'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                  ord.status === 'NEW_ORDER' ? 'bg-pink-400 animate-ping' :
                                  ord.status === 'PACKED' ? 'bg-amber-400' :
                                  ord.status === 'SHIPPED' ? 'bg-cyan-400' :
                                  ord.status === 'DELIVERED' ? 'bg-emerald-400' : 'bg-purple-400'
                                }`}></span>
                                <span>{
                                  ord.status === 'NEW_ORDER' ? 'Processing (New)' :
                                  ord.status === 'PACKED' ? 'Packed' :
                                  ord.status === 'SHIPPED' ? 'Shipped' :
                                  ord.status === 'DELIVERED' ? 'Delivered' : 'Refunded / Cancelled'
                                }</span>
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                            <div className="space-y-1">
                              <div className="text-slate-400">Customer Details:</div>
                              <div className="text-white font-bold">{ord.buyerName}</div>
                              <div className="text-slate-400">{ord.city}</div>
                            </div>
                            
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Delivery Partner:</span>
                                <select
                                  value={ord.courierPartner}
                                  onChange={(e) => updateCourierPartner(ord.id, e.target.value as any)}
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-pink-300 font-bold focus:outline-none focus:border-pink-500"
                                >
                                  <option value="Delhivery">Delhivery</option>
                                  <option value="Shadowfax">Shadowfax</option>
                                  <option value="Xpressbees">Xpressbees</option>
                                  <option value="Blue Dart">Blue Dart</option>
                                  <option value="Ekart">Ekart</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-cyan-400 font-bold">AWB: {ord.awb}</span>
                                <button
                                  onClick={() => handleCopyAwb(ord)}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800"
                                  title="Copy AWB number to clipboard"
                                >
                                  {copiedAwbId === ord.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy AWB</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <button 
                                onClick={() => { setTrackingInput(ord.awb); setTrackedOrder(ord); }}
                                className="text-[11px] text-pink-400 underline hover:text-pink-300 cursor-pointer pt-0.5 block"
                              >
                                View Live Stepper ↗
                              </button>
                            </div>

                            <div className="space-y-1 sm:text-right">
                              <div className="text-slate-400">Payout Amount:</div>
                              <div className="text-emerald-400 font-black text-base">₹{ord.amount}</div>
                            </div>
                          </div>

                          <div className="space-y-1 pt-2 border-t border-slate-900">
                            <label className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1">
                              <span>🔒 Internal Notes (Private Supplier Notes)</span>
                            </label>
                            <textarea
                              value={ord.internalNotes || ''}
                              onChange={(e) => updateInternalNotes(ord.id, e.target.value)}
                              placeholder="Type private notes about customer, packaging, or special requests..."
                              rows={2}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500 resize-none"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'PACKED')}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                              >
                                📦 Mark Packed
                              </button>
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'SHIPPED')}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                              >
                                🚀 Dispatch
                              </button>
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'DELIVERED')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                              >
                                ✅ Delivered
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleShareOrder(ord)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer font-bold"
                                title="Copy order status and tracking info to clipboard"
                              >
                                {copiedOrderId === ord.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Share2 className="w-3.5 h-3.5 text-pink-400" />
                                    <span>Share Order Details</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(ord.id)}
                                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer font-bold"
                                title="Delete order from list"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                              <button className="px-3 py-1.5 bg-slate-950 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer">
                                <Download className="w-3.5 h-3.5" />
                                <span>Label</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PAYOUTS & BANK */}
            {supplierTab === 'payouts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Payments & Bank Account Settings</h2>
                  <p className="text-xs text-slate-400">Direct weekly bank settlements with zero commission deductions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <h3 className="font-bold text-sm text-white font-mono">Linked Bank Account for Payouts</h3>
                      <button
                        onClick={() => setIsEditingBank(!isEditingBank)}
                        className="text-xs font-mono text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
                      >
                        {isEditingBank ? 'Cancel' : 'Edit Bank Details'}
                      </button>
                    </div>

                    {isEditingBank ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Account Holder Name</label>
                          <input
                            type="text"
                            value={bankDetails.accountHolder}
                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-slate-400">Account Number</label>
                            <input
                              type="text"
                              value={bankDetails.accountNumber}
                              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-slate-400">IFSC Code</label>
                            <input
                              type="text"
                              value={bankDetails.ifsc}
                              onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsEditingBank(false);
                            setBankSavedMsg(true);
                            setTimeout(() => setBankSavedMsg(false), 3000);
                          }}
                          className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                        >
                          Save Bank Details
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 font-mono text-xs">
                        {bankSavedMsg && <div className="text-emerald-400 font-bold">Bank details successfully updated!</div>}
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Account Holder:</span>
                          <span className="text-white font-bold">{bankDetails.accountHolder}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Bank Name:</span>
                          <span className="text-white font-bold">{bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                          <span className="text-slate-400">Account Number:</span>
                          <span className="text-white font-bold">{bankDetails.accountNumber}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-400">IFSC Code:</span>
                          <span className="text-cyan-400 font-bold">{bankDetails.ifsc}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-900 border border-pink-500/30 space-y-4">
                    <div className="text-xs font-mono text-pink-400 uppercase font-bold">Next Payout Cycle</div>
                    <div className="text-3xl font-black text-white font-mono">₹12,450</div>
                    <p className="text-xs text-slate-400">Scheduled for direct credit to your bank account this upcoming Monday.</p>
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                      ✨ 0% Commission Policy: You receive 100% of your listed wholesale price without platform deductions.
                    </div>
                  </div>
                </div>

                {/* Payout History Table Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4">
                  <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white font-mono">Payout History</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Record of past weekly bank settlement transactions and pending payouts.</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-xl">
                      Total Settlements: {payoutRecords.length}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-4">Settlement Date</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {payoutRecords.map(pay => (
                          <tr key={pay.id} className="hover:bg-slate-850 transition-colors">
                            <td className="p-4 text-white font-bold">{pay.date}</td>
                            <td className="p-4 text-emerald-400 font-bold font-mono text-sm">₹{pay.amount.toLocaleString()}</td>
                            <td className="p-4 text-cyan-400">{pay.transactionId}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                pay.status === 'Paid' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                              }`}>
                                {pay.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHOPIGO ADS */}
            {supplierTab === 'ads' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">ShopiGo Ads & Product Boost</h2>
                  <p className="text-xs text-slate-400">Run sponsored ad campaigns to get 5x more visibility across ShopiGo network.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="text-xs text-slate-400 font-mono">Active Campaigns</div>
                    <div className="text-2xl font-black text-white font-mono">3 Catalogs Boosted</div>
                    <div className="text-xs text-emerald-400 font-mono">ROAS: 4.8x</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="text-xs text-slate-400 font-mono">Ad Wallet Balance</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">₹2,400</div>
                    <button className="text-xs font-mono text-pink-400 font-bold underline cursor-pointer">Recharge Wallet</button>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="text-xs text-slate-400 font-mono">Total Impressions</div>
                    <div className="text-2xl font-black text-white font-mono">48,290 Views</div>
                    <div className="text-xs text-slate-400 font-mono">Click rate: 6.2%</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: AI PRODUCT IMPORTER */}
            {supplierTab === 'importer' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">AI Product Importer & Catalog Creator</h2>
                  <p className="text-xs text-slate-400">Import products instantly from any supplier link or upload catalog details.</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                  <form onSubmit={handleImportFromLink} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-300 font-bold">Paste Product Link or Supplier URL *</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={importUrl}
                          onChange={(e) => setImportUrl(e.target.value)}
                          placeholder="https://www.meesho.com/s/p/..."
                          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                        />
                        <button
                          type="submit"
                          disabled={isImporting}
                          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isImporting ? 'Importing...' : '✨ AI Import'}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="border-t border-slate-800 pt-6">
                    <h3 className="font-bold text-sm text-white font-mono mb-4">Or Add Catalog Manually</h3>
                    <form onSubmit={handleAddCatalog} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Product Title *</label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Designer Heavy Embroidered Kurti"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Wholesale Price (₹)</label>
                          <input
                            type="number"
                            value={newWholesale}
                            onChange={(e) => setNewWholesale(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Suggested Retail Price (₹)</label>
                          <input
                            type="number"
                            value={newRetail}
                            onChange={(e) => setNewRetail(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Stock Count</label>
                          <input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Category</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-3, py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                          >
                            <option value="Women Ethnic">Women Ethnic</option>
                            <option value="Men Fashion">Men Fashion</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer"
                      >
                        🚀 Publish Catalog Live on Customer Storefront
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Login & Authentication Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-600/30">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {authMode === 'login' ? 'ShopiGo Multi-Role Login' : 'Create ShopiGo Account'}
                  </h3>
                  <p className="text-xs text-slate-400">Select account type & enter mobile details</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Account Role Selector */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => { setAuthRole('supplier'); setOtpSent(false); }}
                className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authRole === 'supplier' 
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>📦 Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthRole('reseller'); setOtpSent(false); }}
                className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authRole === 'reseller' 
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>🛍️ Reseller</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthRole('customer'); setOtpSent(false); }}
                className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  authRole === 'customer' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>🛒 Customer</span>
              </button>
            </div>

            {/* Quick Demo Login Preset Buttons */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center justify-between">
                <span>⚡ Instant One-Click Demo Logins:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({
                      id: 'usr_demo_supp',
                      name: 'Kolkata Wholesale Textile Mill',
                      role: 'supplier',
                      phone: '+91 98301 22910',
                      email: 'supplier.kolkata@shopigo.in',
                      businessName: 'Kolkata Wholesale Mill',
                      isLoggedIn: true
                    });
                    setAppMode('supplier');
                    setShowLoginModal(false);
                    setSuccessMsg("Logged in as Supplier: Kolkata Wholesale Mill");
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 hover:bg-pink-900/50 font-bold cursor-pointer text-left truncate"
                >
                  ⚡ Demo Supplier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({
                      id: 'usr_demo_resell',
                      name: 'Priya Reseller Hub',
                      role: 'reseller',
                      phone: '+91 99887 76655',
                      email: 'priya.reseller@shopigo.in',
                      city: 'Jaipur, Rajasthan',
                      isLoggedIn: true
                    });
                    setAppMode('buyer');
                    setShowLoginModal(false);
                    setSuccessMsg("Logged in as Reseller: Priya Reseller Hub");
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 font-bold cursor-pointer text-left truncate"
                >
                  ⚡ Demo Reseller
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({
                      id: 'usr_demo_cust',
                      name: 'Rahul Sharma',
                      role: 'customer',
                      phone: '+91 91234 56789',
                      email: 'rahul.sharma@gmail.com',
                      city: 'Delhi NCR',
                      isLoggedIn: true
                    });
                    setAppMode('buyer');
                    setShowLoginModal(false);
                    setSuccessMsg("Logged in as Customer: Rahul Sharma");
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }}
                  className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 font-bold cursor-pointer text-left truncate"
                >
                  ⚡ Demo Customer
                </button>
              </div>
            </div>

            {/* Mobile OTP Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 font-mono text-xs">
                {authMode === 'signup' && (
                  <div className="space-y-3 border-b border-slate-800 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Full Name *</label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Email Address *</label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. user@gmail.com"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                    </div>

                    {(authRole === 'supplier' || authRole === 'reseller') && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold">
                            {authRole === 'supplier' ? 'Business / Factory Name *' : 'Reseller Brand / Shop Name *'}
                          </label>
                          <input
                            type="text"
                            value={authBusinessName}
                            onChange={(e) => setAuthBusinessName(e.target.value)}
                            placeholder={authRole === 'supplier' ? 'e.g. Surat Synthetic Textile Mill' : 'e.g. Priya Fashion Hub'}
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                            required
                          />
                        </div>
                        {authRole === 'supplier' && (
                          <div className="space-y-1">
                            <label className="text-slate-300 font-bold">GSTIN Number (Optional)</label>
                            <input
                              type="text"
                              value={authGstin}
                              onChange={(e) => setAuthGstin(e.target.value)}
                              placeholder="e.g. 24ABCDE1234F1Z5"
                              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 uppercase"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">City & State *</label>
                        <input
                          type="text"
                          value={authCity}
                          onChange={(e) => setAuthCity(e.target.value)}
                          placeholder="e.g. Jaipur, Rajasthan"
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Pincode *</label>
                        <input
                          type="text"
                          value={authPincode}
                          onChange={(e) => setAuthPincode(e.target.value)}
                          placeholder="e.g. 302001"
                          maxLength={6}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                    </div>

                    {(authRole === 'supplier' || authRole === 'reseller') && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="space-y-1">
                          <label className="text-emerald-400 font-bold">Bank Account / UPI (For Payouts) *</label>
                          <input
                            type="text"
                            value={authBankAccount}
                            onChange={(e) => setAuthBankAccount(e.target.value)}
                            placeholder="Account No or UPI ID (e.g. user@upi)"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-emerald-400 font-bold">IFSC Code (If Bank Account)</label>
                          <input
                            type="text"
                            value={authIfscCode}
                            onChange={(e) => setAuthIfscCode(e.target.value)}
                            placeholder="e.g. SBIN0001245"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Mobile Number (OTP Verification) *</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 font-bold flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get OTP Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-pink-300 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>📱 Mobile SMS Verification</span>
                    <span className="text-emerald-400 font-bold">SMS OTP: {generatedOtp}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Code sent to +91 {authPhone}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Enter 4-Digit SMS OTP *</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="e.g. 8842"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-lg tracking-widest font-bold focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>📧 Email Verification Code</span>
                    <span className="text-emerald-400 font-bold">Email OTP: {generatedEmailOtp}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Code sent to {authEmail || 'registered email'}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Enter 6-Digit Email Verification Code *</label>
                  <input
                    type="text"
                    value={emailOtpInput}
                    onChange={(e) => setEmailOtpInput(e.target.value)}
                    placeholder="e.g. 592810"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center text-lg tracking-widest font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Email & Login</span>
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{authMode === 'login' ? "Don't have an account?" : "Already registered?"}</span>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-pink-400 font-bold underline hover:text-pink-300 cursor-pointer"
              >
                {authMode === 'login' ? 'Create New Account' : 'Login Existing Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reseller Share & Margin Order Modal */}
      {showResellerModal && resellingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-600/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Meesho Reseller Margin Calculator & Share</h3>
                  <p className="text-xs text-slate-400">Set your profit margin and share link or place order directly for customer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowResellerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white line-clamp-1">{resellingProduct.title}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {resellingProduct.sku} • {resellingProduct.category}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-mono">Wholesale Rate</div>
                <div className="font-black text-sm text-cyan-400 font-mono">₹{resellingProduct.wholesalePrice}</div>
              </div>
            </div>

            {/* Margin Slider / Calculator */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-pink-300">Set Your Profit Margin (₹):</span>
                <span className="text-emerald-400 text-sm">Your Profit: +₹{resellerMargin}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Wholesale Price</div>
                  <div className="font-mono font-bold text-xs text-white mt-1">₹{resellingProduct.wholesalePrice}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-pink-500/40">
                  <div className="text-[10px] text-pink-400 font-mono font-bold">Your Margin</div>
                  <input
                    type="number"
                    value={resellerMargin}
                    onChange={(e) => setResellerMargin(Number(e.target.value))}
                    className="w-full text-center bg-transparent font-mono font-black text-sm text-pink-400 focus:outline-none"
                    min={0}
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40">
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">Customer Price</div>
                  <div className="font-mono font-black text-sm text-emerald-400 mt-1">
                    ₹{resellingProduct.wholesalePrice + Number(resellerMargin)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleShareOnWhatsApp(resellingProduct, resellerMargin)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp with Margin</span>
                </button>
              </div>
            </div>

            {/* Direct COD Order Form for Customer */}
            <form onSubmit={handlePlaceResellerOrder} className="space-y-3 font-mono text-xs">
              <div className="font-bold text-white flex items-center gap-2 border-t border-slate-800 pt-3">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Place COD Order Directly for Your Customer:</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Customer Name *</label>
                  <input
                    type="text"
                    value={resellerCustomerName}
                    onChange={(e) => setResellerCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Customer Phone *</label>
                  <input
                    type="tel"
                    value={resellerCustomerPhone}
                    onChange={(e) => setResellerCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Delivery Address *</label>
                <input
                  type="text"
                  value={resellerCustomerAddress}
                  onChange={(e) => setResellerCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">City & State *</label>
                <input
                  type="text"
                  value={resellerCustomerCity}
                  onChange={(e) => setResellerCustomerCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📦 Confirm Reseller Order (Collect ₹{resellingProduct.wholesalePrice + Number(resellerMargin)} COD)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Direct Customer Checkout Modal */}
      {showDirectCheckoutModal && buyingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-600/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Direct Customer Checkout</h3>
                  <p className="text-xs text-slate-400">Complete delivery address & confirm your order</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDirectCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-white line-clamp-1">{buyingProduct.title}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Category: {buyingProduct.category} • SKU: {buyingProduct.sku}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-mono">Total Payable</div>
                <div className="font-black text-base text-pink-400 font-mono">₹{buyingProduct.retailPrice}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span>🚚 Free PAN-India Express Shipping</span>
              <span className="font-bold">7-Day Return Guarantee</span>
            </div>

            {/* Delivery Details Form */}
            <form onSubmit={handleConfirmDirectCheckout} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Full Name *</label>
                  <input
                    type="text"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Enter recipient full name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Mobile Number *</label>
                  <input
                    type="tel"
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">House / Flat / Street Address *</label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  placeholder="e.g. Flat 102, Green Park Apartments, MG Road"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">City & State *</label>
                  <input
                    type="text"
                    value={checkoutCity}
                    onChange={(e) => setCheckoutCity(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Pincode *</label>
                  <input
                    type="text"
                    value={checkoutPincode}
                    onChange={(e) => setCheckoutPincode(e.target.value)}
                    placeholder="e.g. 400001"
                    maxLength={6}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-slate-300 font-bold">Payment Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod('COD')}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      checkoutPaymentMethod === 'COD'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>💵 Cash on Delivery (COD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod('ONLINE_UPI')}
                    className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                      checkoutPaymentMethod === 'ONLINE_UPI'
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>⚡ Instant UPI / QR</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-pink-600/30 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Order (Pay ₹{buyingProduct.retailPrice} on Delivery)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 403 Explanation & Public App Sharing Modal */}
      {showPublicLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/30">
                  🌐
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Public App Access & 403 Solution</h3>
                  <p className="text-xs text-slate-400">How to share this app with anyone in the world</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPublicLinkModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-xs font-mono text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <span>⚠️ Why 403 "Access Denied" occurs on dev links:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Google AI Studio preview links (<code className="text-amber-400">ais-pre-*.run.app</code>) are protected by Google Cloud IAM security for your development session. They only open when logged into your owner Google account (<span className="text-white font-bold">pavanmehta99550@gmail.com</span>).
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="font-bold text-white">✅ 3 Ways to Share & Make it Public Worldwide:</div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>1. Install as Mobile App / PWA (Instant)</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">100% Working</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Click <span className="text-white font-bold">"📱 Install App"</span> in the top bar. Once added to home screen, it opens directly as a native app on any Android, iPhone, or Windows PC!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>2. Publish to Netlify / Vercel / Firebase (Free 1-Click)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Public Custom Domain</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Deploy to Vercel or Netlify with <code className="text-emerald-300">npm run build</code>. It gives you a public URL like <code className="text-white">shopigo.vercel.app</code> that opens everywhere without any Google account login!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-pink-400">3. Official Public Web URL (100% No 403 Error):</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-300 break-all">
                  https://eng-scholar-j07pf.web.app
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://eng-scholar-j07pf.web.app");
                    alert("📋 Public Web URL copied to clipboard! Share on WhatsApp, Instagram, Telegram without any 403 error.");
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  📋 Copy Public Web URL
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPublicLinkModal(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* PWA Install Guide Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/30">
                  SG
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Install ShopiGo App</h3>
                  <p className="text-xs text-slate-400">Add to your Mobile Home Screen / PC</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300">
              {/* Direct Install Button if supported */}
              <button
                onClick={async () => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      setIsAppInstalled(true);
                      setDeferredPrompt(null);
                      setShowInstallModal(false);
                      alert("🎉 ShopiGo App installed successfully on your device home screen!");
                    }
                  } else {
                    alert("📱 To install ShopiGo App on your home screen:\n\n1. Tap the browser menu (⋮ or Share ⎋)\n2. Tap 'Add to Home Screen' or 'Install App'");
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>⚡ Install ShopiGo App Directly</span>
              </button>

              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <div className="font-bold text-blue-300 flex items-center gap-2">
                  <span>📱 For Android (Google Chrome):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>Tap the browser menu (3 dots <span className="text-white font-bold">⋮</span>) at top-right.</li>
                  <li>Select <span className="text-white font-bold">"Add to Home screen"</span> or <span className="text-white font-bold">"Install app"</span>.</li>
                  <li>Tap <span className="text-white font-bold">Install</span> to confirm. ShopiGo will appear on your home screen!</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="font-bold text-purple-300 flex items-center gap-2">
                  <span>🍎 For iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>Tap the Share button <span className="text-white font-bold">⎋</span> at the bottom of Safari.</li>
                  <li>Scroll down and tap <span className="text-white font-bold">"Add to Home Screen"</span>.</li>
                  <li>Tap <span className="text-white font-bold">Add</span> at top right.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Direct App Link</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[220px]">https://eng-scholar-j07pf.web.app</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://eng-scholar-j07pf.web.app");
                    alert("ShopiGo App link copied to clipboard! Send to any phone to install.");
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[11px] cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
