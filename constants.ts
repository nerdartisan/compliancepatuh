
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

// Mock Corpus - BNM Guidelines Data
export const MOCK_DOCUMENTS: ComplianceDocument[] = [
  {
    id: "BNM-RMiT-2020",
    title: "Risk Management in Technology (RMiT)",
    source: "Bank Negara Malaysia",
    type: DocumentType.REGULATION,
    region: "Malaysia",
    department: "Jabatan Pengurusan Risiko",
    lastUpdated: "2020-06-19",
    pageReference: "Page 42, Para 10.5",
    tags: ["Technology Risk", "Cybersecurity", "Governance"],
    summary: "Sets out the requirements for financial institutions to maintain cyber resilience and manage technology risk.",
    content: `
      PART B: TECHNOLOGY RISK MANAGEMENT FRAMEWORK
      10.1 Governance: The Board generally designates a board-level committee (e.g. BRMC) to support the Board in the oversight of technology-related matters.
      
      10.5 Cloud Services: Financial institutions must ensure that the adoption of cloud services does not compromise the security and confidentiality of customer information. 
      (a) A risk assessment must be performed prior to cloud adoption.
      (b) Multi-factor authentication (MFA) is mandatory for all privileged access to cloud infrastructure.
      
      APPENDIX 3: CYBER RESILIENCE
      Financial institutions must establish a Cyber Incident Response Plan (CIRP) that is tested at least annually.
    `
  },
  {
    id: "BNM-AML-CFT-2024",
    title: "Anti-Money Laundering (AML/CFT) - Banking & DTIs",
    source: "Bank Negara Malaysia",
    type: DocumentType.REGULATION,
    region: "Malaysia",
    department: "Jabatan Pematuhan Operasi",
    lastUpdated: "2024-02-05",
    pageReference: "Section 14, pg. 89",
    tags: ["AML", "CFT", "Compliance"],
    summary: "Requirements for the identification and verification of customers and beneficial owners.",
    content: `
      SECTION 14: CUSTOMER DUE DILIGENCE (CDD)
      14.1 Reporting Institutions must conduct CDD on customers when:
      (a) establishing a business relationship;
      (b) carrying out a cash transaction exceeding RM25,000;
      (c) there is a suspicion of money laundering.
      
      SECTION 27: POLITICALLY EXPOSED PERSONS (PEPs)
      27.2 Enhanced Due Diligence (EDD) is required for all foreign PEPs and high-risk domestic PEPs. Approval from Senior Management is required to establish the relationship.
    `
  },
  {
    id: "BNM-eKYC-2020",
    title: "Electronic Know-Your-Customer (e-KYC)",
    source: "Bank Negara Malaysia",
    type: DocumentType.GUIDELINE,
    region: "Malaysia",
    department: "Jabatan Digital Security",
    lastUpdated: "2020-06-30",
    pageReference: "Para 8.1",
    tags: ["Digital Onboarding", "Identity", "Technology"],
    summary: "Enables digital onboarding of customers via mobile and web channels using biometrics.",
    content: `
      paragraph 8: FALSE ACCEPTANCE RATE (FAR)
      8.1 Financial institutions must ensure that the e-KYC solution has a False Acceptance Rate (FAR) of no more than 5%.
      
      paragraph 12: LIVENESS DETECTION
      12.3 The solution must detect and prevent presentation attacks (e.g. photos of photos, video replays, or deepfakes).
      
      paragraph 15: AUDIT TRAIL
      15.1 All images, videos, and data captured during the e-KYC process must be audit-logged and retained for a minimum of 7 years.
    `
  },
  {
    id: "FSA-2013",
    title: "Financial Services Act 2013 (FSA)",
    source: "Parliament of Malaysia",
    type: DocumentType.REGULATION,
    region: "Malaysia",
    department: "Jabatan Undang-Undang",
    lastUpdated: "2013-06-30",
    pageReference: "Part IV, Section 123",
    tags: ["Legislation", "Governance", "Licensing"],
    summary: "The primary legislation governing the conduct and supervision of financial institutions in Malaysia.",
    content: `
      PART IV: CONDUCT OF BUSINESS
      Section 123: Prohibited Business Conduct
      (1) No person shall engage in conduct that is misleading, deceptive, or unfair in relation to the provision of a financial service.
      
      Section 133: Secrecy
      (1) No director or officer of a financial institution shall disclose any information or document relating to the affairs or account of any customer.
    `
  },
  {
    id: "BNM-OUTSOURCING",
    title: "Outsourcing Policy Document",
    source: "Bank Negara Malaysia",
    type: DocumentType.INTERNAL_POLICY,
    region: "Malaysia",
    department: "Jabatan Integriti & Tadbir Urus",
    lastUpdated: "2023-12-28",
    pageReference: "Para 8.1 - 10.2",
    tags: ["Outsourcing", "Vendor Management", "Risk"],
    summary: "Guidelines on managing risks associated with material outsourcing arrangements.",
    content: `
      8.1 MATERIAL OUTSOURCING
      Financial institutions must obtain BNM's written approval before entering into a new material outsourcing arrangement or significantly modifying an existing one.
      
      10.2 SERVICE LEVEL AGREEMENTS (SLA)
      SLAs must clearly define the performance standards, security requirements, and the right to audit the service provider.
    `
  }
];

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
