import { TargetAppTemplate } from '../types';

export const APP_TEMPLATES: TargetAppTemplate[] = [
  {
    id: 'crypto_stratum_mining',
    name: 'Multi-Coin Stratum Mining Bridge',
    category: 'blockchain',
    icon: 'Pickaxe',
    description: 'Autonomous Stratum protocol worker: connects to BTC/LTC/SOL mining pool, validates shares, manages difficulty, tracks yield & 5% admin fee logic.',
    suggestedPrompt: 'Stratum pool se connect karo, BTC aur LTC workers ki hashrate monitor karo, har 30 second me valid shares submit karo aur payouts calculate karte raho jab tak main STOP na bolu.',
    defaultMetrics: {
      primary: { label: 'Hashrate (BTC/LTC)', value: '184.5 TH/s' },
      secondary: { label: 'Accepted Shares', value: '1,420' },
      tertiary: { label: 'Accumulated Yield', value: '0.00842 BTC' }
    }
  },
  {
    id: 'crypto_arbitrage',
    name: 'Crypto Trading & Arbitrage Bot',
    category: 'finance',
    icon: 'TrendingUp',
    description: 'Monitors Binance, Uniswap and KuCoin orderbooks, detects price spread anomalies, executes mock arbitrage swaps autonomously.',
    suggestedPrompt: 'BTC/USDT aur SOL/USDT ka orderbook scan karo, agar 0.4% se zyada price difference mile to buy/sell execute karo aur continuously profit track karo.',
    defaultMetrics: {
      primary: { label: 'Scanned Pairs', value: '48 Pairs' },
      secondary: { label: 'Executed Orders', value: '14' },
      tertiary: { label: 'Net PnL', value: '+$342.50 USDT' }
    }
  },
  {
    id: 'social_growth_bot',
    name: 'Social Media & Community Auto-Pilot',
    category: 'social',
    icon: 'MessageSquareShare',
    description: 'Auto-scans mentions, drafts smart AI replies, schedules viral threads, and filters high-intent inbound DMs.',
    suggestedPrompt: 'Social feed me trending keywords monitor karo, relevant posts par helpful comment karo, aur naye followers ko welcome message bhejo.',
    defaultMetrics: {
      primary: { label: 'Feed Scans', value: '310 posts' },
      secondary: { label: 'Replies Sent', value: '47' },
      tertiary: { label: 'Engagement Rate', value: '+18.4%' }
    }
  },
  {
    id: 'web_scraper_extractor',
    name: 'Autonomous Web Scraper & Lead Harvester',
    category: 'custom',
    icon: 'Globe',
    description: 'Crawls product catalogs, extracts contact info, validates emails, and exports clean structured tables in real-time.',
    suggestedPrompt: 'Target website se leads aur contact emails extract karo, duplicates remove karo aur structured database me save karte raho.',
    defaultMetrics: {
      primary: { label: 'Pages Crawled', value: '86' },
      secondary: { label: 'Leads Harvested', value: '128 verified' },
      tertiary: { label: 'Success Rate', value: '99.2%' }
    }
  },
  {
    id: 'custom_any_app',
    name: 'Custom Application / Any Website',
    category: 'custom',
    icon: 'Cpu',
    description: 'Type the name of any app (e.g. Gmail, Notion, WhatsApp, Shopify, YouTube) and give your instructions.',
    suggestedPrompt: 'Aap jo bhi app chaho uska naam likho aur batao kya karwana hai!',
    defaultMetrics: {
      primary: { label: 'Autonomous Cycles', value: '0' },
      secondary: { label: 'Actions Executed', value: '0' },
      tertiary: { label: 'Status', value: 'Ready' }
    }
  }
];
