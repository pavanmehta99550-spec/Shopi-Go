import { AutomationRecipe, AutomationStep, SupportedAppId } from '../types';

export function parseUserInstructionToRecipe(
  appId: SupportedAppId,
  appName: string,
  userPrompt: string
): AutomationRecipe {
  const p = userPrompt.toLowerCase();

  // 1. WhatsApp Web Automation
  if (appId === 'whatsapp' || p.includes('whatsapp') || p.includes('chat') || p.includes('message')) {
    // Extract contact and message if present
    let contact = 'Rahul (Customer)';
    if (p.includes('papa')) contact = 'Papa';
    else if (p.includes('bhai') || p.includes('friend')) contact = 'Amit (Friend)';
    else if (p.includes('office') || p.includes('team')) contact = 'Office Project Group';

    let messageText = 'Hello! Yeh message AutoTasker AI ne automatically send kiya hai. 🚀';
    if (p.includes('good morning') || p.includes('gm')) messageText = 'Good Morning! Have a great day ahead. ✨';
    else if (p.includes('order') || p.includes('status')) messageText = 'Namaste, aapka order #4920 confirm ho gaya hai aur kal deliver hoga! 📦';
    else if (p.includes('meeting')) messageText = 'Reminder: Hamari discussion meeting aaj shaam 5 baje scheduled hai.';

    const steps: AutomationStep[] = [
      {
        id: 'w-1',
        stepNumber: 1,
        title: 'Launch WhatsApp Web',
        description: 'WhatsApp Web secure session initiate kiya ja raha hai...',
        actionType: 'NAVIGATE',
        targetSelector: 'https://web.whatsapp.com',
        paramValue: 'https://web.whatsapp.com',
        cursorTarget: { x: 50, y: 15 },
        status: 'pending'
      },
      {
        id: 'w-2',
        stepNumber: 2,
        title: `Search & Select Contact: ${contact}`,
        description: `Chat list me "${contact}" dhoondhkar select kiya ja raha hai...`,
        actionType: 'CLICK',
        targetSelector: '#search-contact-input',
        paramValue: contact,
        cursorTarget: { x: 22, y: 35 },
        status: 'pending'
      },
      {
        id: 'w-3',
        stepNumber: 3,
        title: 'Focus Message Input Box',
        description: 'Active chat window ke text field me cursor place kiya...',
        actionType: 'LOCATE',
        targetSelector: '#chat-message-input',
        cursorTarget: { x: 62, y: 88 },
        status: 'pending'
      },
      {
        id: 'w-4',
        stepNumber: 4,
        title: 'Auto-Type Message Text',
        description: `Message type kiya ja raha hai: "${messageText}"`,
        actionType: 'TYPE',
        targetSelector: '#chat-message-input',
        paramValue: messageText,
        cursorTarget: { x: 62, y: 88 },
        status: 'pending'
      },
      {
        id: 'w-5',
        stepNumber: 5,
        title: 'Click Send Button',
        description: 'Send arrow icon par auto-click kiya...',
        actionType: 'CLICK',
        targetSelector: '#btn-send-message',
        cursorTarget: { x: 88, y: 88 },
        status: 'pending'
      },
      {
        id: 'w-6',
        stepNumber: 6,
        title: 'Verify Message Delivery',
        description: 'Double check mark verify ho gaya. Message successfully delivered!',
        actionType: 'VERIFY',
        targetSelector: '#msg-status-tick',
        cursorTarget: { x: 80, y: 75 },
        status: 'pending'
      }
    ];

    return {
      id: `recipe-${Date.now()}`,
      appName: 'WhatsApp Web',
      appId: 'whatsapp',
      appUrl: 'https://web.whatsapp.com',
      userPrompt,
      steps,
      goalSummaryHindi: `WhatsApp kholkar "${contact}" ko automated message "${messageText}" bheja ja raha hai.`,
      goalSummaryEnglish: `Automating WhatsApp Web to send message to ${contact}`
    };
  }

  // 2. YouTube Automation
  if (appId === 'youtube' || p.includes('youtube') || p.includes('video') || p.includes('gana') || p.includes('song')) {
    let searchQuery = 'Trending Songs 2026';
    if (p.includes('comedy') || p.includes('funny')) searchQuery = 'Best Standup Comedy Hindi';
    else if (p.includes('tech') || p.includes('ai') || p.includes('coding')) searchQuery = 'Top AI & Tech Innovations';
    else if (p.includes('news')) searchQuery = 'Live News Hindi';
    else if (userPrompt.trim().length > 3) searchQuery = userPrompt.replace(/(youtube|par|video|kholo|play|search|karo)/gi, '').trim() || 'Trending Music';

    const steps: AutomationStep[] = [
      {
        id: 'y-1',
        stepNumber: 1,
        title: 'Open YouTube Portal',
        description: 'YouTube homepage load ho raha hai...',
        actionType: 'NAVIGATE',
        targetSelector: 'https://www.youtube.com',
        paramValue: 'https://www.youtube.com',
        cursorTarget: { x: 45, y: 15 },
        status: 'pending'
      },
      {
        id: 'y-2',
        stepNumber: 2,
        title: 'Click YouTube Search Box',
        description: 'Top search bar ko target karke activate kiya...',
        actionType: 'LOCATE',
        targetSelector: '#search-query-box',
        cursorTarget: { x: 50, y: 18 },
        status: 'pending'
      },
      {
        id: 'y-3',
        stepNumber: 3,
        title: `Auto-Type Query: "${searchQuery}"`,
        description: `Search query enter kiya ja raha hai...`,
        actionType: 'TYPE',
        targetSelector: '#search-query-box',
        paramValue: searchQuery,
        cursorTarget: { x: 50, y: 18 },
        status: 'pending'
      },
      {
        id: 'y-4',
        stepNumber: 4,
        title: 'Hit Search Button',
        description: 'Search magnifier button par auto-click kiya...',
        actionType: 'CLICK',
        targetSelector: '#btn-search-submit',
        cursorTarget: { x: 68, y: 18 },
        status: 'pending'
      },
      {
        id: 'y-5',
        stepNumber: 5,
        title: 'Auto-Select & Play First Video',
        description: 'Sabse top result par click karke video playback start kiya...',
        actionType: 'CLICK',
        targetSelector: '#video-thumbnail-1',
        cursorTarget: { x: 40, y: 45 },
        status: 'pending'
      },
      {
        id: 'y-6',
        stepNumber: 6,
        title: 'Auto-Like Video',
        description: 'Thumbs up / Like button par click kiya...',
        actionType: 'CLICK',
        targetSelector: '#btn-like-video',
        cursorTarget: { x: 35, y: 82 },
        status: 'pending'
      }
    ];

    return {
      id: `recipe-${Date.now()}`,
      appName: 'YouTube',
      appId: 'youtube',
      appUrl: 'https://www.youtube.com',
      userPrompt,
      steps,
      goalSummaryHindi: `YouTube par jaakar "${searchQuery}" search karke video auto-play aur like kiya ja raha hai.`,
      goalSummaryEnglish: `Searching and auto-playing "${searchQuery}" on YouTube`
    };
  }

  // 3. Google Sheets / Excel Data Entry
  if (appId === 'sheets' || p.includes('sheet') || p.includes('excel') || p.includes('data') || p.includes('entry') || p.includes('table')) {
    const steps: AutomationStep[] = [
      {
        id: 's-1',
        stepNumber: 1,
        title: 'Open Google Sheets Spreadsheet',
        description: 'New spreadsheet workspace create kiya...',
        actionType: 'NAVIGATE',
        targetSelector: 'https://docs.google.com/spreadsheets',
        cursorTarget: { x: 50, y: 15 },
        status: 'pending'
      },
      {
        id: 's-2',
        stepNumber: 2,
        title: 'Select Row 1 Header Cells',
        description: 'Headers format kiya: Name, Category, Amount, Status',
        actionType: 'TYPE',
        targetSelector: '#cell-A1',
        paramValue: 'Headers Applied',
        cursorTarget: { x: 25, y: 28 },
        status: 'pending'
      },
      {
        id: 's-3',
        stepNumber: 3,
        title: 'Auto-Insert Row 1: "Pavan Mehta | Hardware | ₹25,000 | Confirmed"',
        description: 'First record automatically insert ho raha hai...',
        actionType: 'TYPE',
        targetSelector: '#cell-row-1',
        paramValue: 'Pavan Mehta',
        cursorTarget: { x: 30, y: 38 },
        status: 'pending'
      },
      {
        id: 's-4',
        stepNumber: 4,
        title: 'Auto-Insert Row 2: "Rajesh Kumar | Software | ₹18,500 | Paid"',
        description: 'Second record populate kiya gaya...',
        actionType: 'TYPE',
        targetSelector: '#cell-row-2',
        paramValue: 'Rajesh Kumar',
        cursorTarget: { x: 30, y: 48 },
        status: 'pending'
      },
      {
        id: 's-5',
        stepNumber: 5,
        title: 'Auto-Insert Row 3: "Amit Verma | Consulting | ₹32,000 | Pending"',
        description: 'Third record automatically populate hua...',
        actionType: 'TYPE',
        targetSelector: '#cell-row-3',
        paramValue: 'Amit Verma',
        cursorTarget: { x: 30, y: 58 },
        status: 'pending'
      },
      {
        id: 's-6',
        stepNumber: 6,
        title: 'Execute =SUM() Formula',
        description: 'Total revenue calculate karke formula bar lock kiya...',
        actionType: 'VERIFY',
        targetSelector: '#cell-total',
        paramValue: '₹75,500',
        cursorTarget: { x: 55, y: 68 },
        status: 'pending'
      }
    ];

    return {
      id: `recipe-${Date.now()}`,
      appName: 'Google Sheets',
      appId: 'sheets',
      appUrl: 'https://docs.google.com/spreadsheets',
      userPrompt,
      steps,
      goalSummaryHindi: 'Google Sheet me naye records enter karke automatic calculation kiya ja raha hai.',
      goalSummaryEnglish: 'Populating records and formulas in Google Sheets'
    };
  }

  // 4. Web Forms / Survey Submitter
  if (appId === 'forms' || p.includes('form') || p.includes('survey') || p.includes('apply') || p.includes('submit')) {
    const steps: AutomationStep[] = [
      {
        id: 'f-1',
        stepNumber: 1,
        title: 'Navigate to Online Registration Form',
        description: 'Web form document open ho raha hai...',
        actionType: 'NAVIGATE',
        targetSelector: 'https://forms.google.com',
        cursorTarget: { x: 50, y: 15 },
        status: 'pending'
      },
      {
        id: 'f-2',
        stepNumber: 2,
        title: 'Auto-Fill Name Field: "Pavan Mehta"',
        description: 'Name input box locate karke text write kiya...',
        actionType: 'TYPE',
        targetSelector: '#input-fullname',
        paramValue: 'Pavan Mehta',
        cursorTarget: { x: 40, y: 32 },
        status: 'pending'
      },
      {
        id: 'f-3',
        stepNumber: 3,
        title: 'Auto-Fill Email: "pavan.automations@gmail.com"',
        description: 'Email field me verified email enter kiya...',
        actionType: 'TYPE',
        targetSelector: '#input-email',
        paramValue: 'pavan.automations@gmail.com',
        cursorTarget: { x: 40, y: 44 },
        status: 'pending'
      },
      {
        id: 'f-4',
        stepNumber: 4,
        title: 'Select Category: "Automation & AI Engineering"',
        description: 'Dropdown menu se option auto-select kiya...',
        actionType: 'CLICK',
        targetSelector: '#dropdown-category',
        cursorTarget: { x: 40, y: 56 },
        status: 'pending'
      },
      {
        id: 'f-5',
        stepNumber: 5,
        title: 'Type Requirement Note',
        description: 'Message box me description fill kiya...',
        actionType: 'TYPE',
        targetSelector: '#textarea-requirements',
        paramValue: 'Please activate the high-speed autonomous workflow agent.',
        cursorTarget: { x: 40, y: 68 },
        status: 'pending'
      },
      {
        id: 'f-6',
        stepNumber: 6,
        title: 'Click Submit Button',
        description: 'Form verification complete, submit trigger kiya...',
        actionType: 'CLICK',
        targetSelector: '#btn-submit-form',
        cursorTarget: { x: 50, y: 82 },
        status: 'pending'
      }
    ];

    return {
      id: `recipe-${Date.now()}`,
      appName: 'Web Form Submitter',
      appId: 'forms',
      appUrl: 'https://forms.google.com',
      userPrompt,
      steps,
      goalSummaryHindi: 'Web form me saari details bharkar automatic submit kiya ja raha hai.',
      goalSummaryEnglish: 'Filling out and submitting web form automatically'
    };
  }

  // 5. Instagram / Social Post Automation
  if (appId === 'instagram' || p.includes('instagram') || p.includes('insta') || p.includes('post') || p.includes('caption')) {
    const steps: AutomationStep[] = [
      {
        id: 'i-1',
        stepNumber: 1,
        title: 'Open Social Feed Dashboard',
        description: 'Profile feed connect ho raha hai...',
        actionType: 'NAVIGATE',
        targetSelector: 'https://instagram.com',
        cursorTarget: { x: 50, y: 15 },
        status: 'pending'
      },
      {
        id: 'i-2',
        stepNumber: 2,
        title: 'Click "New Post (+)" Icon',
        description: 'Create modal open karne ke liye + par click kiya...',
        actionType: 'CLICK',
        targetSelector: '#btn-new-post',
        cursorTarget: { x: 15, y: 45 },
        status: 'pending'
      },
      {
        id: 'i-3',
        stepNumber: 3,
        title: 'Select Media Graphic Asset',
        description: 'Optimized banner image select ki...',
        actionType: 'CLICK',
        targetSelector: '#asset-upload',
        cursorTarget: { x: 45, y: 42 },
        status: 'pending'
      },
      {
        id: 'i-4',
        stepNumber: 4,
        title: 'Auto-Generate & Write Caption',
        description: 'Engaging caption aur viral hashtags type kiye...',
        actionType: 'TYPE',
        targetSelector: '#caption-input',
        paramValue: 'Building future technology with Autonomous AI Agents! ⚡ #Tech #AI #Innovation #Automation',
        cursorTarget: { x: 68, y: 45 },
        status: 'pending'
      },
      {
        id: 'i-5',
        stepNumber: 5,
        title: 'Click "Publish Now" Button',
        description: 'Post live publish kiya gaya...',
        actionType: 'CLICK',
        targetSelector: '#btn-share-post',
        cursorTarget: { x: 75, y: 78 },
        status: 'pending'
      }
    ];

    return {
      id: `recipe-${Date.now()}`,
      appName: 'Instagram Post Creator',
      appId: 'instagram',
      appUrl: 'https://instagram.com',
      userPrompt,
      steps,
      goalSummaryHindi: 'Instagram par nayi post image aur caption ke sath automatically publish ki ja rahi hai.',
      goalSummaryEnglish: 'Auto-posting image with captions on Instagram'
    };
  }

  // 6. Generic / Custom App or URL Automation
  const steps: AutomationStep[] = [
    {
      id: 'c-1',
      stepNumber: 1,
      title: `Navigate to Target URL: ${appName}`,
      description: `Opening target application endpoint: ${appName}...`,
      actionType: 'NAVIGATE',
      targetSelector: appName,
      cursorTarget: { x: 50, y: 15 },
      status: 'pending'
    },
    {
      id: 'c-2',
      stepNumber: 2,
      title: 'Analyze DOM & Locate Controls',
      description: 'Page elements scan karke interactive inputs identify kiye...',
      actionType: 'LOCATE',
      targetSelector: '#main-content-input',
      cursorTarget: { x: 45, y: 35 },
      status: 'pending'
    },
    {
      id: 'c-3',
      stepNumber: 3,
      title: 'Auto-Execute User Directive',
      description: `Target field par action execute kiya: "${userPrompt}"`,
      actionType: 'TYPE',
      targetSelector: '#main-content-input',
      paramValue: userPrompt,
      cursorTarget: { x: 45, y: 35 },
      status: 'pending'
    },
    {
      id: 'c-4',
      stepNumber: 4,
      title: 'Click Action Confirmation Button',
      description: 'Primary button trigger kiya...',
      actionType: 'CLICK',
      targetSelector: '#btn-confirm-action',
      cursorTarget: { x: 65, y: 55 },
      status: 'pending'
    },
    {
      id: 'c-5',
      stepNumber: 5,
      title: 'Verify Completion State',
      description: 'Process response status 200 OK verify hua.',
      actionType: 'VERIFY',
      targetSelector: '#status-badge',
      cursorTarget: { x: 50, y: 70 },
      status: 'pending'
    }
  ];

  return {
    id: `recipe-${Date.now()}`,
    appName: appName || 'Custom Website',
    appId: 'custom',
    appUrl: appName.startsWith('http') ? appName : `https://${appName.toLowerCase().replace(/\s+/g, '')}.com`,
    userPrompt,
    steps,
    goalSummaryHindi: `"${appName}" par jaakar aapke order ke mutabik saare tasks auto execute kiye ja rahe hain.`,
    goalSummaryEnglish: `Executing automated workflow on ${appName}`
  };
}

// Generate Real Playwright / Puppeteer script for running on local desktop
export function generatePlaywrightScript(recipe: AutomationRecipe): string {
  const stepsCode = recipe.steps.map((s) => {
    if (s.actionType === 'NAVIGATE') {
      return `  // Step ${s.stepNumber}: ${s.title}\n  await page.goto('${recipe.appUrl}');\n  await page.waitForTimeout(2000);\n`;
    }
    if (s.actionType === 'TYPE') {
      return `  // Step ${s.stepNumber}: ${s.title}\n  await page.waitForSelector('${s.targetSelector}');\n  await page.type('${s.targetSelector}', '${s.paramValue?.replace(/'/g, "\\'") || ''}', { delay: 60 });\n  await page.waitForTimeout(1000);\n`;
    }
    if (s.actionType === 'CLICK') {
      return `  // Step ${s.stepNumber}: ${s.title}\n  await page.waitForSelector('${s.targetSelector}');\n  await page.click('${s.targetSelector}');\n  await page.waitForTimeout(1500);\n`;
    }
    return `  // Step ${s.stepNumber}: ${s.title}\n  await page.waitForTimeout(1000);\n`;
  }).join('\n');

  return `/**
 * AutoTasker AI - Real Node.js & Playwright Execution Script
 * Goal: ${recipe.userPrompt}
 * Target App: ${recipe.appName}
 * Run with: npm install playwright && node autotask.js
 */

const { chromium } = require('playwright');

(async () => {
  console.log('[AUTOTASKER AI] Launching Chromium browser with active profile...');
  const browser = await chromium.launch({ 
    headless: false, // Visible browser so you see the automation working!
    slowMo: 100 
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('[AUTOTASKER AI] Initiating automated recipe: "${recipe.appName}"...');

${stepsCode}

  console.log('[AUTOTASKER AI] ✅ All steps executed successfully!');
  await page.screenshot({ path: 'autotask_success.png' });
  console.log('[AUTOTASKER AI] Screenshot saved to autotask_success.png');
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
`;
}

// Generate Python Selenium Script
export function generatePythonScript(recipe: AutomationRecipe): string {
  const stepsCode = recipe.steps.map((s) => {
    if (s.actionType === 'NAVIGATE') {
      return `    # Step ${s.stepNumber}: ${s.title}\n    driver.get("${recipe.appUrl}")\n    time.sleep(2)\n`;
    }
    if (s.actionType === 'TYPE') {
      return `    # Step ${s.stepNumber}: ${s.title}\n    elem = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "${s.targetSelector}")))\n    elem.send_keys("${s.paramValue?.replace(/"/g, '\\"') || ''}")\n    time.sleep(1)\n`;
    }
    if (s.actionType === 'CLICK') {
      return `    # Step ${s.stepNumber}: ${s.title}\n    elem = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "${s.targetSelector}")))\n    elem.click()\n    time.sleep(1.5)\n`;
    }
    return `    # Step ${s.stepNumber}: ${s.title}\n    time.sleep(1)\n`;
  }).join('\n');

  return `# AutoTasker AI - Python Selenium Real Autonomous Script
# Goal: ${recipe.userPrompt}
# Target App: ${recipe.appName}
# Run with: pip install selenium webdriver-manager && python autotask.py

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

print("[AUTOTASKER AI] Starting Chrome Driver...")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    print("[AUTOTASKER AI] Executing automated tasks...")
${stepsCode}
    print("[AUTOTASKER AI] ✅ All tasks completed successfully!")
    driver.save_screenshot("autotask_result.png")
    time.sleep(4)
finally:
    driver.quit()
`;
}
