import { ComplianceDocument, DocumentType, ChatMessage } from './types';

export const INITIAL_SUGGESTIONS = [
  "What are the requirements for Digital Asset Exchanges?",
  "Summarize the marketing restrictions for Unit Trust Funds.",
  "Explain the compliance duties for Fund Management Companies.",
  "What are the sales practices for unlisted capital market products?"
];

// Updated to reflect Securities Commission / Capital Market focus
export const DEPARTMENTS: string[] = [
  "Fund Management",
  "Digital Assets",
  "Market Conduct",
  "Product Regulation",
  "Islamic Capital Market",
  "Intermediaries",
  "Enforcement",
  "Authorization & Licensing",
  "Corporate Governance",
  "Investment Management",
  "Derivatives",
  "Consumer & Investor Office"
];

export const POPULAR_SEARCHES = [
  "Digital Assets",
  "Unit Trust Funds",
  "ETF Guidelines",
  "Wholesale Funds",
  "Compliance Officer Duties",
  "Marketing & Distribution"
];

export const POPULAR_COLLECTIONS = [
  "Digital Innovation",
  "Fund Management",
  "Sales Practices",
  "Shariah Compliant Funds",
  "Market Intermediaries",
  "Online Transactions"
];

export const MOCK_CHAT_HISTORY: { [date: string]: { id: string; title: string }[] } = {
  "Today": [
    { id: "chat-1", title: "Digital Asset Custody" },
    { id: "chat-2", title: "ETF Market Makers" }
  ],
  "Yesterday": [
    { id: "chat-3", title: "FMC Compliance Resources" }
  ],
  "5 Days Ago": [
    { id: "chat-4", title: "UTF Cooling-off Right" }
  ],
  "Tuesday, November 18, 2025": [
    { id: "chat-5", title: "Wholesale Fund Lodgement" },
    { id: "chat-6", title: "SRI Fund Tax Incentives" }
  ],
  "Sunday, November 16, 2025": [
    { id: "chat-7", title: "Online Unit Trust Transactions" }
  ]
};