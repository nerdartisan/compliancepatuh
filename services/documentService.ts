
import { ComplianceDocument, DocumentType } from "../types";

const PERSISTED_DOCS_KEY = 'i-patuh-user-uploads';

// Helper to save a document to LocalStorage
export const saveDocument = (doc: ComplianceDocument): void => {
    try {
        const existing = getPersistedDocuments();
        // We cannot store Blob URLs in localStorage as they expire.
        // For persistence, we remove the URL if it's a blob, or keep it if it's external.
        // The content/text is what matters for the AI.
        const docToSave = {
            ...doc,
            url: doc.url?.startsWith('blob:') ? '' : doc.url
        };
        
        const updated = [docToSave, ...existing];
        localStorage.setItem(PERSISTED_DOCS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Failed to save document to storage", error);
    }
};

// Helper to retrieve user uploads
export const getPersistedDocuments = (): ComplianceDocument[] => {
    try {
        const stored = localStorage.getItem(PERSISTED_DOCS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Failed to load persisted documents", error);
    }
    return [];
};

export const fetchDocuments = async (): Promise<ComplianceDocument[]> => {
    // Mock data based on Securities Commission Guidelines
    // Content includes [Page X] markers to simulate OCR/Text Extraction indexing
    const mockDocs: ComplianceDocument[] = [
        {
            id: "guidelines-on-cfds",
            title: "Guidelines On CFDs",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Derivatives",
            lastUpdated: "2024-01-01",
            tags: ["CFD", "Derivatives", "Capital Markets"],
            content: `[Page 1]
These guidelines set out the requirements for the offering of Contracts for Difference (CFDs) in Malaysia.
SECTION 1: INTRODUCTION
1.01 These guidelines apply to any person who carries on the business of dealing in derivatives.

[Page 2]
SECTION 3: LICENSING REQUIREMENTS
3.01 A CFD provider must hold a Capital Markets Services License (CMSL) for dealing in derivatives.
3.02 The CFD provider must maintain a minimum paid-up capital of RM10 million unimpaired by losses.

[Page 3]
SECTION 5: RISK DISCLOSURE
5.01 Prior to opening a CFD account, the provider must obtain a written declaration from the client.
5.02 The risk disclosure statement must explicitly state: "You may lose more than your initial deposit."
5.03 Leverage limits must be clearly explained to retail investors.

[Page 5]
SECTION 8: CLIENT MONEY
8.01 All client monies must be segregated from the provider's own funds.
8.02 Client trust accounts must be reconciled daily.`,
            summary: "Guidelines regulating the offering of Contracts for Difference (CFDs) to retail and sophisticated investors, ensuring fair treatment and adequate risk disclosure.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=6c498706-9e65-4550-934c-611953714652",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-digital-assets",
            title: "Guidelines On Digital Assets",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Digital Assets",
            lastUpdated: "2024-02-15",
            tags: ["Digital Assets", "Crypto", "Token Offering"],
            content: `[Page 1]
Introduction
1.01 These Guidelines regulate the offering of digital tokens and the operations of Initial Exchange Offering (IEO) operators.

[Page 4]
CHAPTER 4: REQUIREMENTS FOR IEO OPERATORS
4.01 An IEO operator must be a locally incorporated company.
4.02 The Board must have at least one independent director.

[Page 6]
CHAPTER 6: LIMITS ON INVESTMENT
6.01 Retail investors may only invest up to RM 2,000 per issuer.
6.02 Sophisticated investors have no investment limit.
6.03 Angel investors may invest up to RM 500,000 within a 12-month period.

[Page 12]
CHAPTER 10: DIGITAL ASSET CUSTODIANS (DAC)
10.01 A DAC must ensure that client digital assets are stored in a secured manner.
10.02 At least 90% of client assets must be stored in Cold Wallets.`,
            summary: "Regulatory framework for digital asset offerings and custody in Malaysia, including IEO platform registration.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=a6489354-206e-44d3-8208-86d77c443657",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-etfs",
            title: "Guidelines On ETFs",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Fund Management",
            lastUpdated: "2023-11-20",
            tags: ["ETF", "Funds", "Investment"],
            content: `[Page 1]
Introduction to Exchange Traded Funds
1.01 These guidelines govern the establishment of ETFs in Malaysia.

[Page 3]
Part B: Product Requirements
3.01 An ETF may be an equity ETF, fixed income ETF, or commodity ETF.
3.02 Leveraged and Inverse ETFs are permitted only for sophisticated investors.

[Page 7]
Tracking Error
7.01 The management company must ensure that the ETF's returns align closely with the benchmark index.
7.02 Any tracking error exceeding 2% must be reported immediately.`,
            summary: "Comprehensive guidelines for the establishment and listing of Exchange Traded Funds (ETFs).",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=9872c639-6617-4340-9844-4821804d0925",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-marketing-distribution-of-utfs",
            title: "Guidelines On Marketing & Distribution Of UTFs",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Market Conduct",
            lastUpdated: "2023-09-10",
            tags: ["Marketing", "Unit Trust", "Distribution"],
            content: `[Page 1]
Section 1: General Principles
1.01 All marketing materials must be clear, fair, and not misleading.

[Page 2]
Prohibited Statements
2.01 Distributors must not guarantee returns unless such returns are fully guaranteed by the government.
2.02 The use of the word "safe" or "risk-free" is strictly prohibited for non-guaranteed funds.

[Page 4]
Conduct of Agents
4.01 Agents must disclose all fees and charges upfront (sales charge, management fee).
4.02 Agents must conduct a suitability assessment before closing a sale.`,
            summary: "Rules governing the marketing materials and distribution channels for Unit Trust Funds to prevent misleading information.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=5e092147-1941-4322-9214-722108708516",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-online-transactions-ut",
            title: "Guidelines On Online Transactions & Activities In Relation To UTs",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Digital Innovation",
            lastUpdated: "2023-08-05",
            tags: ["Online Transactions", "FinTech", "Unit Trust"],
            content: `[Page 1]
Scope of Guidelines
1.01 These guidelines apply to FMCs and distributors operating online platforms.

[Page 5]
System Availability
5.01 The online platform must ensure 99% system availability during business hours.
5.02 Scheduled maintenance must be notified to users 48 hours in advance.

[Page 8]
e-KYC
8.01 Providers may use electronic Know-Your-Customer (e-KYC) technology to onboard clients.
8.02 Biometric verification is recommended for high-risk transactions.`,
            summary: "Operational requirements for online unit trust transactions and platforms, focusing on security and user capability.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=2b36440f-7634-4537-8890-4886676f6259",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-sri-funds",
            title: "Guidelines On SRI Funds",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Islamic Capital Market",
            lastUpdated: "2024-03-01",
            tags: ["SRI", "ESG", "Sustainable Finance"],
            content: `[Page 1]
Definition of SRI Fund
1.01 A fund may be denoted as an SRI fund if it adopts one or more sustainability strategies.

[Page 3]
Disclosure Requirements
3.01 The prospectus must clearly state the SRI strategies adopted (e.g., negative screening, impact investing).
3.02 Annual reports must disclose the sustainability performance of the fund.`,
            summary: "Guidelines for funds to qualify and be marketed as SRI funds, promoting sustainable investment in Malaysia.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=60683050-6421-4770-9882-623277028886",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-sales-practices-unlisted-products",
            title: "Guidelines On Sales Practices of Unlisted Capital Market Products",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Market Conduct",
            lastUpdated: "2023-12-12",
            tags: ["Sales Practices", "Unlisted Products", "Conduct"],
            content: `[Page 1]
Introduction
1.01 These guidelines apply to the sale of unlisted capital market products such as unlisted bonds and wholesale funds.

[Page 2]
Suitability Assessment
2.01 A product suitability assessment must be conducted for all retail clients.
2.02 If a product is deemed unsuitable, the distributor must not recommend it.`,
            summary: "Sales practice standards for unlisted capital market products to protect investors from mis-selling.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=12361717-3636-4122-8367-212644122111",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-unit-trust-funds-2022-1",
            title: "Guidelines On Unit Trust Funds (Rev 2022)",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Fund Management",
            lastUpdated: "2022-11-28",
            tags: ["Unit Trust", "Funds", "Regulation"],
            content: `[Page 1]
Chapter 1: Introduction
1.01 These guidelines supersede the previous guidelines issued in 2021.

[Page 10]
Chapter 3: The Management Company
3.01 The management company must exercise its powers for a proper purpose and in good faith.

[Page 25]
Chapter 6: Investments
6.01 A unit trust fund may invest in transferable securities, money market instruments, and deposits.
6.02 Limits on exposure to a single issuer are set at 10% of NAV.`,
            summary: "Primary guidelines for Unit Trust Funds in Malaysia (2022 Revision), detailing operational and structural requirements.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=80437435-5151-4552-4522-145415412122",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-on-unit-trust-funds-2022",
            title: "Guidelines On Unit Trust Funds",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Fund Management",
            lastUpdated: "2022-01-01",
            tags: ["Unit Trust", "Funds"],
            content: `[Page 1]
General
1.01 These guidelines set out the core framework for Unit Trusts.

[Page 5]
Valuation
5.01 Valuation of assets must be done at the close of every business day.
5.02 Incorrect valuation must be rectified and reimbursed if the error exceeds 0.5% of NAV.`,
            summary: "Foundational guidelines on Unit Trust Funds.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=77836363-2321-2312-3123-123123123123",
            pageReference: "Full Document"
        },
        {
            id: "guidelines-compliance-function-fmc",
            title: "Guidelines on Compliance Function for FMCs",
            source: "Securities Commission Malaysia",
            type: DocumentType.GUIDELINE,
            region: "Malaysia",
            department: "Intermediaries",
            lastUpdated: "2023-05-15",
            tags: ["Compliance", "FMC", "Fund Management"],
            content: `[Page 1]
Introduction
1.01 Compliance is the collective responsibility of the Board and Senior Management.

[Page 3]
Appointment of Compliance Officer
3.01 Every FMC must appoint a dedicated Compliance Officer.
3.02 The Compliance Officer must register with the SC.

[Page 4]
Independence
4.01 The Compliance Officer must not be involved in the performance of business lines (e.g., trading, marketing).
4.02 The Compliance Officer reports directly to the Board of Directors.`,
            summary: "Duties and responsibilities of the compliance function in FMCs to ensure internal controls and regulatory adherence.",
            url: "https://www.sc.com.my/api/documentms/download.ashx?id=52425252-2525-4242-2424-424242424242",
            pageReference: "Full Document"
        }
    ];

    // Fetch persisted user uploads
    const userDocs = getPersistedDocuments();

    // Simulate network delay for realistic UI behavior
    await new Promise(resolve => setTimeout(resolve, 800));

    // Merge and return
    return [...userDocs, ...mockDocs];
};
