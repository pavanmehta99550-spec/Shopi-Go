import React, { useState } from 'react';
import { 
  Bot, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Play, 
  Code2, 
  FileCode,
  Zap,
  Globe
} from 'lucide-react';

export const AutomationScriptModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'playwright' | 'python' | 'webhook'>('playwright');
  const [copied, setCopied] = useState(false);

  const playwrightScript = `// automated-meesho-fulfiller.js
// Automated Meesho Headless Order Dispatcher using Playwright
const { chromium } = require('playwright');

async function forwardOrderToMeesho(orderPayload) {
  console.log('[DROPSHIP-BOT] Initiating automated fulfillment for Order:', orderPayload.orderNumber);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Open Meesho Supplier Product Direct URL
    await page.goto(orderPayload.productSourceUrl, { waitUntil: 'networkidle' });
    console.log('[BOT] Loaded product page:', orderPayload.productTitle);

    // 2. Select Customer Size & Variant
    if (orderPayload.selectedSize) {
      await page.click(\`button:has-text("\${orderPayload.selectedSize}")\`);
    }

    // 3. Click "Add to Cart" or "Buy Now"
    await page.click('button:has-text("Buy Now")');
    await page.waitForTimeout(1000);

    // 4. Inject Customer Delivery Address
    await page.fill('input[name="name"]', orderPayload.customer.fullName);
    await page.fill('input[name="phone"]', orderPayload.customer.phone);
    await page.fill('textarea[name="address"]', orderPayload.customer.address);
    await page.fill('input[name="pincode"]', orderPayload.customer.pincode);
    await page.fill('input[name="city"]', orderPayload.customer.city);
    await page.fill('input[name="state"]', orderPayload.customer.state);

    // 5. Select Cash on Delivery (or Reseller Balance)
    await page.click('text=Cash On Delivery');

    // 6. Set Reseller Margin Checkbox
    // Meesho asks: "Reselling the order? Yes"
    const isReseller = await page.$('text=Reselling the order?');
    if (isReseller) {
      await page.click('text=Yes');
      // Enter customer final collection price
      await page.fill('input[placeholder="Cash to collect"]', String(orderPayload.totalRetailAmount));
      console.log('[BOT] Injected Customer Reseller Collect Amount: ₹', orderPayload.totalRetailAmount);
    }

    // 7. Confirm Order Dispatch
    console.log('[BOT] Submitting order directly to supplier warehouse...');
    await page.click('button:has-text("Place Order")');
    
    console.log('[SUCCESS] Order confirmed on Meesho. Direct dispatch to customer address initiated!');
  } catch (err) {
    console.error('[BOT ERROR] Fulfillment failed:', err.message);
  } finally {
    await browser.close();
  }
}

module.exports = { forwardOrderToMeesho };
`;

  const pythonScript = `# meesho_auto_forwarder.py
# Python RPA Selenium / Playwright Script for Auto-Ordering
import time
from playwright.sync_api import sync_playwright

def fulfill_dropship_order(order):
    print(f"[AI-GATEWAY] Processing Order #{order['orderNumber']}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to Meesho product
        page.goto(order['sourceUrl'])
        time.sleep(2)
        
        # Select Variant and Buy
        page.click(f"text={order['size']}")
        page.click("text=Buy Now")
        
        # Address injection
        cust = order['customer']
        page.fill("input[name='name']", cust['name'])
        page.fill("input[name='phone']", cust['phone'])
        page.fill("textarea[name='address']", cust['address'])
        page.fill("input[name='pincode']", cust['pincode'])
        
        # Submit
        print(f"[DISPATCH] Order placed for {cust['name']}, Pincode: {cust['pincode']}")
        browser.close()
`;

  const webhookJson = `{
  "event": "order.created",
  "store": "Meesho AI Dropship Automator",
  "orderNumber": "ORD-94821",
  "timestamp": "2026-09-29T07:15:00Z",
  "customer": {
    "fullName": "Rahul Verma",
    "phone": "+91 9876543210",
    "address": "Flat 402, Sai Residency, Sector 62",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "pincode": "201309"
  },
  "financials": {
    "retailCollected": 449,
    "supplierCost": 249,
    "netProfitMargin": 200,
    "paymentMethod": "COD"
  },
  "fulfillment": {
    "targetSupplier": "Meesho",
    "autoForwardStatus": "SUCCESS",
    "meeshoReference": "MEESHO-SUB-8492011"
  }
}`;

  const currentCode = activeTab === 'playwright' 
    ? playwrightScript 
    : activeTab === 'python' 
    ? pythonScript 
    : webhookJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Meesho Automated Fulfillment RPA Code
              </h3>
              <p className="text-xs text-slate-400">
                Playwright and Headless scripts to automatically place customer orders on Meesho.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('playwright')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'playwright' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Playwright (Node.js)
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'python' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Python (Playwright / RPA)
            </button>
            <button
              onClick={() => setActiveTab('webhook')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'webhook' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Webhook JSON Payload
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-pink-200">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {currentCode}
          </pre>
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 flex items-center justify-between">
          <span>Run via standard background worker (e.g. BullMQ, Cron, or Webhook Server).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationScriptModal;
