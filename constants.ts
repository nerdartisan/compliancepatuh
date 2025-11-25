import { ComplianceDocument, DocumentType, ChatMessage } from './types';

export const INITIAL_SUGGESTIONS = [
  "What are the cloud adoption requirements under RMBIT?",
  "Summarize the e-KYC requirements for digital onboarding.",
  "Identify conflicting instructions regarding outsourcing arrangements.",
  "Explain the capital adequacy framework for Islamic banks under BNM."
];

// Keeping the user's specific department list as requested in previous turns
export const DEPARTMENTS: string[] = [
  "Jabatan Saluran Fizikal", "Jabatan Saluran Digital", "Jabatan Pengurusan Produk & Pemasaran",
  "Jabatan Pengurusan Caruman", "Jabatan Pengurusan Transaksi", "Jabatan Pematuhan Operasi", "Cawangan KWSP",
  "Jabatan Perbendaharaan", "Strategic Investment Department", "Jabatan Ekuiti", "Jabatan Ekuiti Persendirian & Infrastruktur",
  "Jabatan Pasaran Modal", "Jabatan Pelaburan Hartanah", "Jabatan Strategi Pelaburan & Analitik",
  "Jabatan Pengurus Dana Luar", "Corporate Sustainability Department", "Jabatan Polisi & Strategi",
  "Jabatan Hal Ehwal Korporat", "Jabatan Digital Enterprise Solutions", "Jabatan Digital Core Solutions",
  "Jabatan Digital Security", "Jabatan Digital Infrastructure", "Jabatan Center of Excellence",
  "People Matters Department", "EPF Learning Campus", "Jabatan Undang-Undang",
  "Jabatan Pengurusan Perolehan Bekalan", "Jabatan Pengurusan Harta", "Jabatan Kewangan",
  "Jabatan Perkhidmatan Pelaburan", "Jabatan Pengurusan Risiko", "Jabatan Integriti & Tadbir Urus",
  "Jabatan Audit Dalaman"
];

export const POPULAR_SEARCHES = [
  "RMiT",
  "AML/CFT Policy",
  "FSA 2013",
  "e-KYC",
  "Outsourcing",
  "Cloud Technology"
];

export const POPULAR_COLLECTIONS = [
  "Technology Risk",
  "Financial Crime",
  "Governance (FSA)",
  "Consumer Protection",
  "Shariah Governance",
  "Payment Systems"
];

// MOCK_DOCUMENTS has been removed in favor of dynamic Firebase fetching.

export const MOCK_CHAT_HISTORY: { [date: string]: { id: string; title: string }[] } = {
  "Today": [
    { id: "chat-1", title: "RMiT cloud requirements" },
    { id: "chat-2", title: "e-KYC FAR limits" }
  ],
  "Yesterday": [
    { id: "chat-3", title: "Outsourcing approval process" }
  ],
  "5 Days Ago": [
    { id: "chat-4", title: "FSA 2013 Secrecy provisions" }
  ],
  "Tuesday, November 18, 2025": [
    { id: "chat-5", title: "AML/CFT retention period" },
    { id: "chat-6", title: "Cyber incident reporting timeline" }
  ],
  "Sunday, November 16, 2025": [
    { id: "chat-7", title: "Guideline on Data Management" }
  ]
};
