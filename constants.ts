import { ComplianceDocument, DocumentType, ChatSession, ChatMessage } from './types';

export const INITIAL_SUGGESTIONS = [
  "What are the retention requirements for transaction logs in the EU?",
  "Compare our internal AML policy against the latest FATF guidelines.",
  "Identify conflicting instructions regarding third-party risk assessment.",
  "Explain the capital buffer requirements under Basel III for our Asia specifics."
];

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


// Mock Corpus - In a real app, this would be in a Vector DB
export const MOCK_DOCUMENTS: ComplianceDocument[] = [
  {
    id: "doc-001",
    title: "Global Anti-Money Laundering Policy v4.2",
    source: "Internal Risk Committee",
    type: DocumentType.INTERNAL_POLICY,
    region: "Global",
    department: "Jabatan Pengurusan Risiko",
    lastUpdated: "2024-01-15",
    tags: ["AML", "Financial Crime", "KYC"],
    summary: "Sets forth the global standards for preventing money laundering and terrorist financing.",
    content: `
      SECTION 4: CUSTOMER DUE DILIGENCE (CDD)
      4.1 Standard Due Diligence: All new customers must undergo identity verification before account activation. Acceptable IDs include government-issued passports and national identity cards.
      4.2 Enhanced Due Diligence (EDD): Required for Politically Exposed Persons (PEPs) and customers from High-Risk Jurisdictions. EDD must include Source of Wealth (SoW) verification.
      
      SECTION 7: DATA RETENTION
      7.1 Transaction Records: All transaction data, including SWIFT messages and internal transfers, must be retained for a minimum of 7 years from the date of the transaction.
      7.2 KYC Documents: Identification documents must be retained for 5 years after the business relationship has ended.
      
      SECTION 9: REPORTING
      9.1 Suspicious Activity Reports (SARs): Employees must file a SAR within 24 hours of identifying suspicious behavior. Failure to report is a gross misconduct offense.
    `
  },
  {
    id: "doc-002",
    title: "GDPR Regulation (EU) 2016/679 - Article 5 & 17",
    source: "European Parliament",
    type: DocumentType.REGULATION,
    region: "EU",
    department: "Jabatan Undang-Undang",
    lastUpdated: "2018-05-25",
    tags: ["Privacy", "Data Protection", "Compliance"],
    summary: "General Data Protection Regulation principles regarding data minimization and right to erasure.",
    content: `
      Article 5: Principles relating to processing of personal data
      1. Personal data shall be:
      (c) adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed ('data minimization');
      (e) kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.

      Article 17: Right to erasure ('right to be forgotten')
      1. The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay...
      3. Paragraphs 1 and 2 shall not apply to the extent that processing is necessary:
      (b) for compliance with a legal obligation which requires processing by Union or Member State law...
    `
  },
  {
    id: "doc-003",
    title: "US Bank Secrecy Act (BSA) - Recordkeeping",
    source: "US Treasury / FinCEN",
    type: DocumentType.REGULATION,
    region: "USA",
    department: "Jabatan Pematuhan Operasi",
    lastUpdated: "2023-11-01",
    tags: ["AML", "Recordkeeping", "Regulatory"],
    summary: "Establishes recordkeeping and reporting requirements for national banks.",
    content: `
      Subpart C - Reports Required To Be Made
      (1) A bank shall file a Suspicious Activity Report (SAR) with FinCEN regarding any suspicious transaction relevant to a possible violation of law or regulation.
      
      Subpart D - Records Required To Be Maintained
      (a) Retention period. All records that are required to be retained by this part shall be retained for a period of five years. All such records shall be filed or stored in such a way as to be accessible within a reasonable period of time.
      (b) Nature of records. This includes checks, drafts, and money orders drawn on the bank or issued and payable by it.
    `
  },
  {
    id: "doc-004",
    title: "APAC Region Operational Risk Guidelines",
    source: "APAC Operations Head",
    type: DocumentType.GUIDELINE,
    region: "APAC",
    department: "Jabatan Audit Dalaman",
    lastUpdated: "2023-09-20",
    tags: ["Operational Risk", "Audit", "APAC"],
    summary: "Operational guidelines specific to the Asia-Pacific subsidiaries.",
    content: `
      3.1 Digital Archiving
      For all operational logs generated in Singapore and Hong Kong, dual-site redundancy is required.
      
      3.2 Retention Conflicts
      Where local regulation exceeds Group Policy, local regulation prevails. For example, Hong Kong requirements for 7-year retention on securities trading override the global 5-year baseline.
      
      3.3 Audit Trails
      Audit trails for manual overrides must be preserved indefinitely until a platform decommissioning review is conducted.
    `
  }
];

export const MOCK_CHAT_HISTORY: { [date: string]: { id: string; title: string }[] } = {
  "Today": [
    { id: "chat-1", title: "what is ijma'" },
    { id: "chat-2", title: "what is mudarabah" }
  ],
  "Yesterday": [
    { id: "chat-3", title: "What does the ayah Let there be..." }
  ],
  "5 Days Ago": [
    { id: "chat-4", title: "ijma' sahabah to compile Al-Qur'an" }
  ],
  "Tuesday, November 18, 2025": [
    { id: "chat-5", title: "how many types of ijma" },
    { id: "chat-6", title: "آخر من رآه له عهد عند الله" }
  ],
  "Sunday, November 16, 2025": [
    { id: "chat-7", title: "mudarabah from jurisct views" }
  ]
};