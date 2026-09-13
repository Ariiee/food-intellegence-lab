export const ELEMENTS_MASTER = [
  { symbol: 'Pb', name: 'Lead', category: 'Toxic Heavy Metal' },
  { symbol: 'As', name: 'Arsenic', category: 'Toxic Heavy Metal' },
  { symbol: 'Cd', name: 'Cadmium', category: 'Toxic Heavy Metal' },
  { symbol: 'Cr', name: 'Chromium', category: 'Toxic Heavy Metal' },
  { symbol: 'Hg', name: 'Mercury', category: 'Toxic Heavy Metal' },
  { symbol: 'Ba', name: 'Barium', category: 'Toxic Heavy Metal' },
  { symbol: 'Ni', name: 'Nickel', category: 'Toxic Heavy Metal' },
  { symbol: 'Al', name: 'Aluminum', category: 'Toxic Heavy Metal' },
  { symbol: 'Co', name: 'Cobalt', category: 'Rare Trace Metal' },
  { symbol: 'Br', name: 'Bromine', category: 'Rare Trace Metal' },
  { symbol: 'Sr', name: 'Strontium', category: 'Rare Trace Metal' },
  { symbol: 'Rb', name: 'Rubidium', category: 'Rare Trace Metal' },
  { symbol: 'La', name: 'Lanthanum', category: 'Rare Trace Metal' },
  { symbol: 'Sm', name: 'Samarium', category: 'Rare Trace Metal' },
  { symbol: 'Sc', name: 'Scandium', category: 'Rare Trace Metal' },
  { symbol: 'Ca', name: 'Calcium', category: 'Essential Mineral' },
  { symbol: 'Fe', name: 'Iron', category: 'Essential Mineral' },
  { symbol: 'K', name: 'Potassium', category: 'Essential Mineral' },
  { symbol: 'Na', name: 'Sodium', category: 'Essential Mineral' },
  { symbol: 'Zn', name: 'Zinc', category: 'Essential Mineral' },
  { symbol: 'Mg', name: 'Magnesium', category: 'Essential Mineral' },
  { symbol: 'Cu', name: 'Copper', category: 'Essential Mineral' },
  { symbol: 'Mn', name: 'Manganese', category: 'Essential Mineral' },
  { symbol: 'Se', name: 'Selenium', category: 'Essential Mineral' }
];

export const CRM_VALIDATION_DATA = [
  { crmId: 'NIST-1568b', name: 'Rice Flour', element: 'As', certValue: 0.285, measuredAvg: 0.292, uExp: 0.014, recovery: 102.4, status: 'Passed' },
  { crmId: 'NIST-1568b', name: 'Rice Flour', element: 'Cd', certValue: 0.0224, measuredAvg: 0.0218, uExp: 0.0013, recovery: 97.3, status: 'Passed' },
  { crmId: 'GBW-10015', name: 'Spinach', element: 'Pb', certValue: 11.2, measuredAvg: 11.5, uExp: 0.8, recovery: 102.6, status: 'Passed' },
  { crmId: 'GBW-10015', name: 'Spinach', element: 'Cr', certValue: 2.3, measuredAvg: 2.2, uExp: 0.2, recovery: 95.6, status: 'Passed' }
];

export const STATS_COUNTER_DATA = [
  { value: 120, label: 'Samples Analyzed' },
  { value: 13, label: 'Trace Elements' },
  { value: 6, label: 'Food Varieties' },
  { value: 99.8, label: 'Accuracy %' }
];

export const ELEMENT_DISEASES = {
  Pb: {
    disease: 'Lead Poisoning (Plumbism) & Encephalopathy',
    details: 'Causes severe neurodevelopmental impairment, chronic kidney disease, hypertension, anemia, and cognitive decline.',
    riskCategory: 'Critical Heavy Metal Toxicity'
  },
  As: {
    disease: 'Arsenicosis & Carcinogenesis',
    details: 'Linked to skin hyperkeratosis, peripheral neuropathy, bladder and lung cancer, and cardiovascular damage.',
    riskCategory: 'Carcinogenic Metal Poisoning'
  },
  Cd: {
    disease: 'Itai-Itai Disease & Renal Failure',
    details: 'Causes severe renal tubular dysfunction, osteomalacia (bone softening), lung tissue necrosis, and osteoporosis.',
    riskCategory: 'Renal & Skeletal Toxicity'
  },
  Cr: {
    disease: 'Chromium Toxicity & GI Mucosal Ulceration',
    details: 'Hexavalent chromium exposure leads to hepatic necrosis, acute tubular necrosis, mucosal ulcers, and lung cancer.',
    riskCategory: 'Organ Necrosis & Carcinogen'
  },
  Hg: {
    disease: 'Minamata Neurological Disease',
    details: 'Induces severe central nervous system degeneration, ataxia, sensory loss, tremors, and kidney failure.',
    riskCategory: 'Severe Neurotoxicity'
  },
  Ba: {
    disease: 'Hypokalemic Cardiac Arrhythmia',
    details: 'Causes profound muscle paralysis, severe hypokalemia, hypertension, and life-threatening cardiac conduction failure.',
    riskCategory: 'Cardiovascular Toxicity'
  },
  Ni: {
    disease: 'Nickel Nephropathy & Toxic Dermatitis',
    details: 'Triggers chronic asthma, respiratory tract inflammation, kidney inflammation, and allergic skin eruptions.',
    riskCategory: 'Nephro-Respiratory Toxicity'
  },
  Al: {
    disease: 'Neurotoxic Encephalopathy & Osteomalacia',
    details: 'Associated with progressive cognitive decline, Alzheimer-type neurodegeneration, and bone mineralization loss.',
    riskCategory: 'Neurodegenerative Risk'
  },
  Br: {
    disease: 'Chronic Bromism & CNS Depression',
    details: 'Causes delirium, ataxia, memory loss, psychomotor retardation, and bromoderma skin eruptions.',
    riskCategory: 'Central Nervous System Toxicity'
  },
  Co: {
    disease: 'Cobalt Cardiomyopathy & Polycythemia',
    details: 'Leads to congestive heart failure, thyroid enlargement, erythrocytosis, and nerve deafness.',
    riskCategory: 'Cardiomyopathy Risk'
  },
  Fe: {
    disease: 'Iron Overload (Hemochromatosis) & Cirrhosis',
    details: 'Causes liver fibrosis, cardiac failure, diabetes mellitus, and severe oxidative tissue necrosis.',
    riskCategory: 'Organ Iron Toxicity'
  },
  Cu: {
    disease: 'Copper Toxicosis & Acute Gastritis',
    details: 'Leads to hepatotoxicity, intravascular hemolysis, acute renal impairment, and severe stomach ulceration.',
    riskCategory: 'Hepatic Toxicity'
  },
  Zn: {
    disease: 'Secondary Copper Deficiency & Immunosuppression',
    details: 'Excess zinc inhibits copper absorption, causing microcytic anemia, neutropenia, and impaired immunity.',
    riskCategory: 'Nutritional Imbalance'
  },
  Se: {
    disease: 'Chronic Selenosis',
    details: 'Causes loss of hair and nails, skin lesions, peripheral motor neuropathy, and garlic-odor breath toxicity.',
    riskCategory: 'Dermatological & Nerve Damage'
  },
  Mn: {
    disease: 'Manganism (Parkinsonian Motor Syndrome)',
    details: 'Causes extrapyramidal motor dysfunction, gait disturbance, tremors, and psychiatric hallucinations.',
    riskCategory: 'Parkinsonian Motor Risk'
  },
  K: {
    disease: 'Hyperkalemia & Cardiac Arrest Hazard',
    details: 'Extreme potassium intake causes fatal cardiac arrhythmias, muscle weakness, and cardiac conduction block.',
    riskCategory: 'Electrolyte Cardiac Hazard'
  },
  Na: {
    disease: 'Hypernatremia & Vascular Hypertension',
    details: 'Promotes arterial hypertension, stroke risk, cellular dehydration, and fluid retention congestive overload.',
    riskCategory: 'Vascular Hazard'
  },
  Ca: {
    disease: 'Hypercalcemia & Nephrolithiasis (Kidney Stones)',
    details: 'Excessive calcium causes renal stone formation, tissue calcification, constipation, and renal failure.',
    riskCategory: 'Renal Calcification'
  },
  Mg: {
    disease: 'Hypermagnesemia & Neuromuscular Blockade',
    details: 'Triggers severe hypotension, respiratory depression, bradycardia, and loss of deep tendon reflexes.',
    riskCategory: 'Neuromuscular Depression'
  }
};

