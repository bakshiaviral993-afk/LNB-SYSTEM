/**
 * SafeVault Banking Operations & Compliance Configuration
 * Status: VALIDATE WITH BANK COMPLIANCE
 * 
 * Statutory references updated to:
 * "RBI revised instructions on Safe Deposit Locker / Safe Custody Article Facility (Aug 2021, effective 1 Jan 2022)"
 */

export const COMPLIANCE_CONFIG = {
  bankName: 'SafeVault',
  brandMonogram: 'SV',
  contractPrefix: 'SV/LKR-AGR/',
  regulatoryFramework: 'RBI revised instructions on Safe Deposit Locker / Safe Custody Article Facility (Aug 2021, effective 1 Jan 2022)',
  
  liabilityRule: {
    multiplier: 100,
    text: 'Bank liability is statutory capped at 100 times the prevailing annual rent for events like fire, theft, burglary, dacoity, robbery, building collapse or employee fraud.',
    disclaimer: 'The Bank does not keep record of, nor insure, contents deposited in the locker.'
  },

  nominationRules: {
    maxNominees: 4,
    requiredTotalSharePercent: 100,
    formCodes: {
      registerSoleJoint: 'SL-1',
      registerWithMinor: 'SL-1A',
      cancelNomination: 'SL-2',
      varyNomination: 'SL-3',
      varyWithMinor: 'SL-3A'
    },
    formDescriptions: {
      'SL-1': 'Nomination Form SL-1 (Safe Deposit Locker - Major Nominee)',
      'SL-1A': 'Nomination Form SL-1A (Safe Deposit Locker - Minor Nominee with Guardian)',
      'SL-2': 'Cancellation Form SL-2 (Cancellation of Locker Nomination)',
      'SL-3': 'Variation Form SL-3 (Variation of Nomination for Safe Deposit Locker)',
      'SL-3A': 'Variation Form SL-3A (Variation of Nomination involving Minor)'
    }
  },

  keyClauses: [
    {
      id: 'clause-liability',
      title: 'Statutory Liability Cap (100x Rent)',
      shortText: 'Bank liability is capped at 100x annual rent for insurable events.',
      fullText: 'As per RBI master directions, the Bank’s maximum liability in cases of fire, theft, burglary, dacoity, robbery, building collapse or employee fraud shall be limited to an amount equivalent to 100 times the prevailing annual rent of the locker compartment. The Bank does not inspect, inventory or insure the contents.'
    },
    {
      id: 'clause-unfair',
      title: 'Prohibition of Unfair Contract Terms',
      shortText: 'Fair dealing covenants protecting customer rights and transparency.',
      fullText: 'The Bank covenants that the agreement contains no exculpatory or one-sided indemnity clauses. Clear notice must be served to the hirer prior to any operational intervention.'
    },
    {
      id: 'clause-alerts',
      title: 'Mandatory Real-Time Access Advisories',
      shortText: 'SMS and email notifications dispatched upon every physical strongroom entry.',
      fullText: 'Every access to the locker triggers automated cryptographic turnstile entry records and instantaneous SMS and email notifications to the hirer’s CBS-registered mobile number and email ID.'
    },
    {
      id: 'clause-breakopen',
      title: 'Break-Open Protocol (3 Years Default)',
      shortText: 'Bank right to break open compartment after 3 consecutive years of unpaid rent.',
      fullText: 'If annual rent remains overdue for a continuous period of three (3) consecutive years, the Bank is empowered to break open the locker after serving registered notices and publishing statutory press alerts. The break-open must occur in the presence of two independent witnesses and the branch manager.'
    },
    {
      id: 'clause-inactivity',
      title: 'Inactivity & Succession Transfer (7 Years)',
      shortText: 'Transfer to nominee/legal heir after 7 years inactivity with untraceable hirer.',
      fullText: 'If a locker remains inoperative for a period of seven (7) years and the hirer is untraceable, the Bank will issue notices to the registered nominee or legal heirs to claim the contents under due process of law.'
    },
    {
      id: 'clause-hazardous',
      title: 'Prohibited Articles & Hazardous Goods',
      shortText: 'Strict ban on firearms, contraband, perishable or explosive substances.',
      fullText: 'The hirer covenants not to deposit any illegal, narcotic, inflammable, explosive, radioactive, weaponized or perishable substances in the locker. Breach results in immediate forfeiture, criminal reporting and police custody.'
    },
    {
      id: 'clause-surrender-refund',
      title: 'Pro-Rata Rent Refund on Surrender',
      shortText: 'Advance rent collected is refunded pro-rata for unexpired calendar quarters.',
      fullText: 'Upon voluntary surrender of the locker, any advance rent paid by the customer for future unexpired quarters will be calculated pro-rata and refunded directly to the customer’s linked bank account along with security deposit release.'
    }
  ],

  escalationHierarchy: [
    {
      level: 1,
      role: 'Branch Operations Head',
      tat: '24-48 Hours',
      contact: 'branch.custodian@safevault.in'
    },
    {
      level: 2,
      role: 'Regional Nodal Officer',
      tat: '3-5 Working Days',
      contact: 'nodal.western@safevault.in'
    },
    {
      level: 3,
      role: 'Principal Nodal Officer / Bank Ombudsman',
      tat: '7 Working Days',
      contact: 'principal.ombudsman@safevault.in'
    },
    {
      level: 4,
      role: 'Reserve Bank of India (RBI) Integrated Ombudsman Scheme',
      tat: 'Statutory 30 Days',
      contact: 'https://cms.rbi.org.in'
    }
  ]
};
