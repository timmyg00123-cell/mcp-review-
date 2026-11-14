import type { TopDrugClinicalMonograph } from './types.js';

export const CAT21_23_GI_GU_ALLERGY: Record<string, TopDrugClinicalMonograph> = {
  Famotidine: {
    genericName: 'Famotidine',
    brandNames: ['Pepcid'],
    pharmacologicClass: 'Histamine H2 Antagonist',
    therapeuticClass: 'H2 Blocker',
    mechanismOfAction:
      'Competitively and reversibly inhibits histamine at H2 receptors located on the basolateral membrane of gastric parietal cells, significantly inhibiting both basal and nocturnal gastric acid secretion, as well as acid stimulated by food, betazole, and pentagastrin.',
    dosingRegimens: [
      'Active Duodenal Ulcer: 40 mg PO once daily at bedtime (or 20 mg PO twice daily) for 4 to 8 weeks',
      'GERD / Erosive Esophagitis: 20 to 40 mg PO twice daily for up to 12 weeks',
      'Heartburn / Acid Indigestion (OTC): 10 to 20 mg PO once or twice daily 15 to 60 minutes before meals (max 40 mg/day)',
      'Inpatient Acid Suppression: 20 mg IV every 12 hours (dose adjust if CrCl < 50 mL/min)',
    ],
    sideEffects: {
      common: ['Headache', 'Dizziness', 'Constipation', 'Diarrhea', 'Fatigue'],
      severe: ['Central nervous system toxicity (confusion, delirium, hallucinations, especially in elderly with renal impairment)', 'Prolonged QTc interval / arrhythmias (rare, with renal impairment)', 'Thrombocytopenia or agranulocytosis (very rare)'],
    },
    contraindications: [
      'Hypersensitivity to famotidine or other H2 receptor antagonists',
    ],
    drugInteractions: {
      major: ['pH-dependent anti-infectives (atazanavir, rilpivirine, ketoconazole, itraconazole - decreased gastric acidity severely reduces their absorption)'],
      common: ['Iron supplements (reduced gastric acidity may lower non-heme iron absorption)', 'Cefpodoxime, cefuroxime axetil (reduced bioavailability)', 'Antacids (may slightly reduce famotidine absorption)'],
    },
    monitoringParameters: [
      'Relief of gastrointestinal pain and reflux symptoms',
      'Renal function (BUN, serum creatinine, CrCl - reduce dose by 50% or extend interval to 36-48h if CrCl < 50 mL/min)',
      'Mental status monitoring in geriatric or renally compromised patients',
    ],
    dosageForms: ['Oral Tablet: 10 mg, 20 mg, 40 mg', 'Powder for Oral Suspension: 40 mg/5 mL (when reconstituted)', 'Intravenous Injection: 10 mg/mL (2 mL, 4 mL vials)', 'Premixed IV Bags in 0.9% NaCl: 20 mg/50 mL'],
    administrationAndCounseling: [
      'Take with or without food; for once-daily dosing, take at bedtime.',
      'For prevention of meal-induced heartburn, take 15 to 60 minutes before consuming foods or beverages expected to cause symptoms.',
      'Inform your doctor if heartburn symptoms persist beyond 14 days of continuous over-the-counter use.',
      'Avoid trigger foods such as caffeine, alcohol, chocolate, and spicy foods.',
    ],
  },

  Omeprazole: {
    genericName: 'Omeprazole',
    brandNames: ['Prilosec'],
    pharmacologicClass: 'Proton Pump Inhibitor (Substituted Benzimidazole)',
    therapeuticClass: 'Proton Pump Inhibitor',
    mechanismOfAction:
      'Substituted benzimidazole prodrug that concentrates in the acidic secretory canaliculi of gastric parietal cells where it is protonated to form an active sulfenamide that forms a covalent disulfide bond with cysteines of the H+/K+ ATPase enzyme system (proton pump), irreversibly suppressing the final step of acid production.',
    dosingRegimens: [
      'Active Duodenal Ulcer: 20 mg PO once daily before breakfast for 4 to 8 weeks',
      'GERD / Erosive Esophagitis: 20 mg PO once daily for 4 to 8 weeks (may increase to 40 mg once daily for severe erosive disease)',
      'H. pylori Eradication: 20 mg PO twice daily in triple- or quadruple-therapy antimicrobial regimens for 10 to 14 days',
      'Pathological Hypersecretory Conditions (Zollinger-Ellison): Initial 60 mg PO once daily, titrated up to 120 mg/day in divided doses',
    ],
    sideEffects: {
      common: ['Headache', 'Abdominal pain', 'Nausea', 'Diarrhea', 'Constipation', 'Flatulence', 'Acid rebound upon discontinuation'],
      severe: ['Clostridioides difficile-associated diarrhea', 'Hypomagnesemia (with prolonged use >= 1 year)', 'Osteoporotic bone fractures (hip, wrist, spine with long-term high-dose therapy)', 'Acute tubulointerstitial nephritis', 'Vitamin B12 deficiency (long-term therapy)', 'Subacute cutaneous lupus erythematosus'],
    },
    contraindications: [
      'Known hypersensitivity to omeprazole or any substituted benzimidazole proton pump inhibitor',
      'Concomitant use with rilpivirine-containing products',
    ],
    drugInteractions: {
      major: ['Clopidogrel (omeprazole competitively inhibits CYP2C19, decreasing clopidogrel active metabolite formation and antiplatelet efficacy; FDA safety warning recommends pantoprazole instead)', 'Rilpivirine (contraindicated due to marked reduction in rilpivirine plasma levels)', 'Methotrexate (PPIs inhibit renal BCRP transporter, elevating toxic methotrexate levels)'],
      common: ['Mycophenolate mofetil (decreased MPA exposure)', 'Iron salts, dasatinib, erlotinib, ketoconazole (reduced absorption due to elevated gastric pH)', 'Warfarin (monitoring of INR recommended)'],
    },
    monitoringParameters: [
      'Symptom resolution and clinical response of GERD or peptic ulcer disease',
      'Serum magnesium levels at baseline and periodically in patients receiving long-term treatment',
      'Serum vitamin B12 levels in patients on therapy for > 3 years',
      'Bone mineral density in patients at risk for osteoporosis',
      'Renal function for signs of acute interstitial nephritis',
    ],
    dosageForms: ['Oral Delayed-Release Capsule: 10 mg, 20 mg, 40 mg', 'Oral Delayed-Release Tablet: 20 mg', 'Oral Suspension Packets: 2.5 mg, 10 mg'],
    administrationAndCounseling: [
      'Take in the morning 30 to 60 minutes before breakfast; proton pumps must be stimulated by food for optimal irreversible inhibition.',
      'Swallow capsules whole; do not chew, crush, or open capsules.',
      'For patients with swallowing difficulties, capsule contents (intact enteric-coated pellets) may be opened and sprinkled onto 1 tablespoon of cool applesauce and swallowed immediately without chewing.',
      'Do not abruptly discontinue prolonged therapy; taper over several weeks to avoid severe rebound acid hypersecretion.',
    ],
  },

  Pantoprazole: {
    genericName: 'Pantoprazole',
    brandNames: ['Protonix'],
    pharmacologicClass: 'Proton Pump Inhibitor (Substituted Benzimidazole)',
    therapeuticClass: 'Proton Pump Inhibitor',
    mechanismOfAction:
      'Irreversibly binds to cysteine residues on the alpha subunit of the H+/K+ ATPase enzyme system in gastric parietal cells, blocking basal and stimulated gastric acid secretion with lower in vitro affinity for CYP2C19 compared to other proton pump inhibitors.',
    dosingRegimens: [
      'Erosive Esophagitis / GERD: 40 mg PO once daily in the morning for up to 8 weeks (may repeat for an additional 8 weeks)',
      'Maintenance of Healing of Erosive Esophagitis: 40 mg PO once daily',
      'Pathological Hypersecretory Conditions: 40 mg PO twice daily; titrate up to 240 mg/day if needed',
      'Upper Gastrointestinal Bleeding (IV): 80 mg IV bolus followed by continuous infusion of 8 mg/hour for 72 hours',
    ],
    sideEffects: {
      common: ['Headache', 'Diarrhea', 'Nausea', 'Abdominal pain', 'Flatulence', 'Dizziness', 'Arthralgia'],
      severe: ['Clostridioides difficile-associated diarrhea', 'Hypomagnesemia and hypocalcemia', 'Acute tubulointerstitial nephritis', 'Bone fracture risk (long-term use)', 'Fundic gland polyps'],
    },
    contraindications: [
      'Hypersensitivity to pantoprazole or substituted benzimidazoles',
      'Concurrent use with rilpivirine-containing regimens',
    ],
    drugInteractions: {
      major: ['Rilpivirine (significant decrease in rilpivirine bioavailability and virologic failure)', 'High-dose methotrexate (pantoprazole delays methotrexate clearance; withhold PPI during high-dose methotrexate)'],
      common: ['Clopidogrel (minimal clinically significant CYP2C19 inhibition; preferred PPI for patients on clopidogrel)', 'Iron salts, ketoconazole, atazanavir (decreased absorption)', 'Warfarin (monitor PT/INR)'],
    },
    monitoringParameters: [
      'Relief of heartburn and acid regurgitation symptoms',
      'Serum magnesium at baseline and periodically with therapy > 1 year',
      'Renal function (BUN, creatinine) to screen for interstitial nephritis',
      'Stool testing for C. difficile in patients developing watery diarrhea',
    ],
    dosageForms: ['Oral Delayed-Release Tablet: 20 mg, 40 mg', 'Oral Delayed-Release Granules for Suspension: 40 mg packet', 'Intravenous Injection Powder: 40 mg single-dose vial'],
    administrationAndCounseling: [
      'Take once daily approximately 30 minutes before breakfast.',
      'Swallow tablets whole; do not split, crush, or chew, as the enteric coating protects the acid-labile drug from stomach acid.',
      'Delayed-release granules should be administered mixed with applesauce or apple juice, swallowed without chewing, or flushed through an NG/G tube.',
      'Report any persistent watery diarrhea, cramping, fever, or joint pain to your physician.',
    ],
  },

  Esomeprazole: {
    genericName: 'Esomeprazole',
    brandNames: ['Nexium'],
    pharmacologicClass: 'Proton Pump Inhibitor (Substituted Benzimidazole)',
    therapeuticClass: 'Proton Pump Inhibitor',
    mechanismOfAction:
      'S-enantiomer of omeprazole that accumulates in the acidic environment of parietal cells and irreversibly inactivates H+/K+ ATPase via disulfide bond formation, demonstrating higher systemic bioavailability and greater, more prolonged acid suppression than racemic omeprazole.',
    dosingRegimens: [
      'GERD / Erosive Esophagitis: 20 to 40 mg PO once daily before a meal for 4 to 8 weeks',
      'NSAID-Associated Gastric Ulcer Risk Reduction: 20 to 40 mg PO once daily for up to 6 months',
      'H. pylori Eradication: 40 mg PO once daily with amoxicillin 1,000 mg and clarithromycin 500 mg twice daily for 10 to 14 days',
      'Zollinger-Ellison Syndrome: 40 mg PO twice daily, adjusted up to 240 mg/day',
    ],
    sideEffects: {
      common: ['Headache', 'Diarrhea', 'Nausea', 'Flatulence', 'Abdominal pain', 'Constipation', 'Dry mouth'],
      severe: ['Clostridioides difficile colitis', 'Severe hypomagnesemia / cardiac arrhythmias', 'Acute interstitial nephritis', 'Bone fractures with long-term therapy', 'Vitamin B12 deficiency'],
    },
    contraindications: [
      'Known hypersensitivity to esomeprazole or substituted benzimidazoles',
      'Concomitant use with rilpivirine-containing products',
    ],
    drugInteractions: {
      major: ['Clopidogrel (inhibits CYP2C19, decreasing clopidogrel active metabolite formation)', 'Rilpivirine (profoundly reduced antiviral exposure)', 'High-dose methotrexate (increased methotrexate toxicity)'],
      common: ['Digoxin (increased digoxin bioavailability due to reduced gastric acidity)', 'Diazepam (CYP2C19 inhibition increases diazepam half-life by 45%)', 'Tacrolimus (may elevate tacrolimus serum levels)'],
    },
    monitoringParameters: [
      'Clinical improvement in reflux and ulcer symptoms',
      'Serum magnesium at baseline and periodically with prolonged treatment',
      'Complete blood count and vitamin B12 levels in long-term therapy (> 3 years)',
      'Serum creatinine and urinalysis if acute renal dysfunction is suspected',
    ],
    dosageForms: ['Oral Delayed-Release Capsule: 20 mg, 40 mg', 'Oral Delayed-Release Packet for Suspension: 2.5 mg, 5 mg, 10 mg, 20 mg, 40 mg', 'Intravenous Injection Powder: 40 mg single-dose vial'],
    administrationAndCounseling: [
      'Take at least one hour before meals (ideally before breakfast).',
      'Swallow capsules whole; do not chew or crush.',
      'Capsules may be opened and the intact enteric-coated granules emptied onto applesauce and swallowed immediately without chewing.',
      'Report severe or persistent watery diarrhea immediately.',
    ],
  },

  'Polyethylene Glycol (PEG)': {
    genericName: 'Polyethylene Glycol (PEG)',
    brandNames: ['Golytely', 'MiraLAX'],
    pharmacologicClass: 'Osmotic Laxative',
    therapeuticClass: 'Laxative',
    mechanismOfAction:
      'High-molecular-weight non-absorbable polymer that exerts a powerful osmotic gradient in the gastrointestinal lumen, drawing and retaining water within the colon, softening stool, increasing intraluminal volume, and stimulating peristaltic motility.',
    dosingRegimens: [
      'Occasional Constipation (MiraLAX / PEG 3350 without electrolytes): 17 g (one heaping tablespoon or packet) dissolved in 4 to 8 ounces of beverage PO once daily as needed (up to 2 weeks for OTC use)',
      'Bowel Preparation for Colonoscopy (Golytely / PEG-electrolyte solution): Reconstitute with water to 4 liters; ingest 240 mL (8 oz) rapidly every 10 minutes until rectal effluent is clear (or split-dose: 2 to 3 liters evening prior, 1 to 2 liters morning of procedure)',
    ],
    sideEffects: {
      common: ['Nausea', 'Abdominal bloating / cramping', 'Flatulence', 'Diarrhea', 'Excessive fullness'],
      severe: ['Electrolyte disturbances (hypokalemia, hyponatremia with electrolyte-free PEG or large volumes)', 'Severe dehydration', 'Aspiration pneumonia during rapid ingestion', 'Anaphylaxis'],
    },
    contraindications: [
      'Gastrointestinal obstruction, toxic megacolon, or bowel perforation',
      'Paralytic ileus',
      'Severe inflammatory bowel disease flare (toxic colitis)',
      'Known hypersensitivity to polyethylene glycol',
    ],
    drugInteractions: {
      major: ['Oral medications administered within 1 hour of bowel preparation solutions (flushed out of gastrointestinal tract prior to absorption)'],
      common: ['Diuretics and ACE inhibitors (increased risk of fluid and electrolyte imbalance during aggressive colonoscopy bowel prep)'],
    },
    monitoringParameters: [
      'Stool frequency and consistency',
      'Hydration status and fluid intake',
      'Serum electrolytes (sodium, potassium, chloride, bicarbonate), BUN, and creatinine prior to and following large-volume bowel evacuation',
    ],
    dosageForms: ['Oral Powder for Solution (OTC / MiraLAX): 17 g per dose bottle or single-dose packets', 'Oral Powder for Solution with Electrolytes (Golytely, Colyte, Nulytely): Jugs for 4-liter reconstitution'],
    administrationAndCounseling: [
      'For occasional constipation: Dissolve 17 g powder (filled to line in measuring cap) in 4 to 8 ounces of cold, warm, or hot water, juice, soda, tea, or coffee; stir until fully dissolved and drink immediately.',
      'Usually produces a bowel movement in 1 to 3 days.',
      'For colonoscopy prep: Chilling the reconstituted solution in the refrigerator enhances palatability; do not add flavorings containing red or purple dyes.',
      'Maintain adequate fluid intake throughout therapy.',
    ],
  },

  Lactulose: {
    genericName: 'Lactulose',
    brandNames: ['Constulose', 'Generlac'],
    pharmacologicClass: 'Osmotic Laxative / Ammonium Detoxicant',
    therapeuticClass: 'Laxative',
    mechanismOfAction:
      'Synthetic disaccharide that reaches the colon intact where it is degraded by colonic bacterial flora (Lactobacillus) into lactic and acetic organic acids, lowering colonic pH and converting diffusable ammonia (NH3) into non-absorbable ammonium ions (NH4+) trapped for fecal excretion, while generating an osmotic laxative effect.',
    dosingRegimens: [
      'Constipation: 15 to 30 mL (10 to 20 g) PO once daily; may increase to 60 mL daily if needed',
      'Hepatic Encephalopathy (Acute Episodes): 30 to 45 mL PO every 1 to 2 hours until laxation achieved (at least 2-3 loose stools), then titrate to maintenance 30 to 45 mL PO 3 to 4 times daily to produce 2 to 3 soft stools per day',
      'Hepatic Encephalopathy (Retention Enema): 300 mL lactulose diluted with 700 mL water or normal saline, retained for 30 to 60 minutes via rectal balloon catheter every 4 to 6 hours',
    ],
    sideEffects: {
      common: ['Flatulence and gas', 'Abdominal distension and cramping', 'Belching', 'Nausea', 'Diarrhea'],
      severe: ['Severe dehydration and hypovolemia', 'Hypernatremia and hypokalemia (due to profound watery diarrhea)', 'Lactic acidosis (rare)'],
    },
    contraindications: [
      'Patients who require a low-galactose diet (galactosemia)',
      'Gastrointestinal obstruction',
      'Hypersensitivity to lactulose',
    ],
    drugInteractions: {
      major: ['Other oral laxatives (concurrent use during hepatic encephalopathy titration causes excessive diarrhea and misleads dosage adjustment)'],
      common: ['Oral anti-infectives (neomycin, broad-spectrum antibiotics may eliminate colonic acid-producing bacteria required for lactulose activation)', 'Antacids (may attenuate pH lowering in the colon)'],
    },
    monitoringParameters: [
      'Number and consistency of bowel movements (target 2 to 3 soft-formed stools per day in hepatic encephalopathy)',
      'Mental status, asterixis (flapping tremor), and cognitive orientation in liver failure',
      'Serum electrolytes (sodium, potassium) and hydration status during intensive therapy',
      'Blood glucose monitoring in diabetic patients (contains small amounts of free lactose and galactose)',
    ],
    dosageForms: ['Oral Solution: 10 g/15 mL (bottles of 237 mL, 473 mL, 946 mL, 1892 mL)', 'Oral Crystal Packets for Solution: 10 g, 20 g'],
    administrationAndCounseling: [
      'Take with water, fruit juice, or milk to mask the intensely sweet taste.',
      'For constipation, 24 to 48 hours may be required before normal bowel movements occur.',
      'In liver disease, strictly adhere to prescribed doses to ensure 2 to 3 soft bowel movements daily; do not stop taking the medication when mental status improves.',
      'Report severe or persistent watery diarrhea, dizziness, or intense thirst to your healthcare provider.',
    ],
  },

  Dicyclomine: {
    genericName: 'Dicyclomine',
    brandNames: ['Bentyl'],
    pharmacologicClass: 'Gastrointestinal Anticholinergic',
    therapeuticClass: 'Antispasmodic',
    mechanismOfAction:
      'Synthetic tertiary amine antimuscarinic agent that competitively blocks acetylcholine at postganglionic muscarinic receptors in gastrointestinal smooth muscle, and directly relaxes smooth muscle through non-neurotransmitter-dependent musculotropic spasmolytic mechanisms.',
    dosingRegimens: [
      'Irritable Bowel Syndrome (IBS): Initial 20 mg PO 4 times daily before meals; titrate after 1 week to maintenance 40 mg PO 4 times daily (discontinue if efficacy not achieved after 2 weeks)',
      'Intramuscular Injection (for acute severe spasm): 20 mg IM 4 times daily; do NOT administer intravenously',
    ],
    sideEffects: {
      common: ['Dry mouth (xerostomia)', 'Dizziness', 'Blurred vision', 'Nausea', 'Somnolence', 'Weakness', 'Nervousness', 'Constipation'],
      severe: ['Anhidrosis and severe heat stroke / hyperthermia', 'Anticholinergic psychosis, delirium, and confusion', 'Precipitation of acute angle-closure glaucoma', 'Severe urinary retention', 'Paralytic ileus'],
    },
    contraindications: [
      'Infants under 6 months of age (severe respiratory collapse, seizures, and death reported)',
      'Obstructive uropathy and severe prostatic hypertrophy',
      'Glaucoma (angle-closure)',
      'Severe ulcerative colitis or toxic megacolon',
      'Myasthenia gravis',
      'Intravenous administration (causes immediate thrombosis and severe cardiovascular collapse)',
    ],
    drugInteractions: {
      major: ['Other anticholinergic agents (amantadine, tricyclic antidepressants, phenothiazines, disopyramide - additive antimuscarinic toxicity)', 'Potassium chloride solid oral formulations (delayed gastric emptying increases severe GI ulceration risk)'],
      common: ['Metoclopramide and prokinetic agents (dicyclomine antagonizes gastrointestinal prokinetic motility)', 'Antacids (separate administration by at least 2 hours as antacids decrease dicyclomine absorption)'],
    },
    monitoringParameters: [
      'Reduction in abdominal cramping and pain associated with IBS',
      'Intraocular pressure monitoring in patients at risk for glaucoma',
      'Urinary output and voiding patterns',
      'Mental status and cognitive alertness in elderly patients',
    ],
    dosageForms: ['Oral Capsule: 10 mg', 'Oral Tablet: 20 mg', 'Oral Syrup: 10 mg/5 mL', 'Intramuscular Injection: 10 mg/mL (2 mL vials)'],
    administrationAndCounseling: [
      'Take 30 to 60 minutes before meals and at bedtime.',
      'Never administer intravenously; injection must be given intramuscularly only.',
      'Avoid strenuous exercise or high temperatures; dicyclomine reduces sweating and can cause heat stroke.',
      'Suck on hard sugarless candies or chew sugarless gum to relieve dry mouth.',
      'Avoid driving or hazardous tasks if dizziness or blurred vision occurs.',
    ],
  },

  Docusate: {
    genericName: 'Docusate',
    brandNames: ['Colace'],
    pharmacologicClass: 'Surfactant Laxative / Stool Softener',
    therapeuticClass: 'Stool Softener',
    mechanismOfAction:
      'Anionic surfactant that reduces the surface tension of the oil-water interface of fecal material, facilitating the penetration of water and lipids into the intestinal stool mass to soften stool and prevent painful straining during defecation.',
    dosingRegimens: [
      'Stool Softening / Prevention of Straining (Adults): 50 to 300 mg PO daily in single or divided doses (typically 100 mg PO twice daily)',
      'Docusate Calcium: 240 mg PO once daily',
      'Rectal Enema: 283 mg / 5 mL enema inserted rectally once as needed',
    ],
    sideEffects: {
      common: ['Mild abdominal cramping', 'Bitter taste (oral liquid)', 'Throat irritation', 'Nausea', 'Diarrhea'],
      severe: ['Severe intestinal mucosal damage when taken with mineral oil', 'Hypersensitivity reactions / angioedema (rare)'],
    },
    contraindications: [
      'Concomitant administration with mineral oil (docusate dramatically increases systemic absorption of mineral oil, leading to lipid granulomas in mesenteric lymph nodes and liver)',
      'Symptoms of appendicitis, acute abdominal pain, or intestinal obstruction',
      'Known hypersensitivity to docusate salts',
    ],
    drugInteractions: {
      major: ['Mineral oil (docusate enhances systemic absorption and toxicity of mineral oil; absolute contraindication)'],
      common: ['Anthraquinone laxatives (senna, bisacodyl - docusate may enhance their absorption; frequently co-formulated safely as Peri-Colace / Senna-S)'],
    },
    monitoringParameters: [
      'Relief of straining during defecation',
      'Stool frequency and consistency',
      'Gastrointestinal symptoms (abdominal pain, cramping)',
    ],
    dosageForms: ['Oral Capsule (Docusate Sodium): 50 mg, 100 mg, 250 mg', 'Oral Capsule (Docusate Calcium): 240 mg', 'Oral Liquid / Syrup: 50 mg/15 mL, 10 mg/mL', 'Rectal Enema: 283 mg/5 mL'],
    administrationAndCounseling: [
      'Take with a full 8-ounce glass of water; increasing daily fluid intake is essential to maximize stool softening efficacy.',
      'Usually produces a soft stool within 12 to 72 hours of initial administration.',
      'Docusate is a stool softener used to prevent hard stools and straining; it is not a stimulant laxative.',
      'Do not take mineral oil while taking docusate.',
    ],
  },

  'Diphenoxylate / Atropine': {
    genericName: 'Diphenoxylate / Atropine',
    brandNames: ['Lomotil'],
    pharmacologicClass: 'Opioid Antidiarrheal / Anticholinergic Combination',
    therapeuticClass: 'Antidiarrheal',
    mechanismOfAction:
      'Diphenoxylate is a synthetic ethyl ester opioid that acts locally and centrally on intestinal circular and longitudinal smooth muscle mu-opioid receptors, slowing mucosal motility, prolonging transit time, and increasing intestinal fluid absorption; subtherapeutic atropine sulfate is added to discourage deliberate abuse by precipitating unpleasant anticholinergic effects at excessive doses.',
    dosingRegimens: [
      'Acute Diarrhea (Adjunctive Therapy): Initial 2 tablets (5 mg diphenoxylate / 0.05 mg atropine) PO 4 times daily (max 20 mg/day of diphenoxylate); reduce dose once symptom control is achieved (typically 5 mg once daily)',
    ],
    sideEffects: {
      common: ['Drowsiness', 'Dizziness', 'Dry mouth', 'Nausea', 'Vomiting', 'Headache', 'Abdominal discomfort', 'Restlessness'],
      severe: ['Toxic megacolon (in inflammatory bowel disease)', 'Respiratory depression and coma (especially in overdose or young children)', 'Paralytic ileus', 'Anticholinergic toxicity / atropine poisoning', 'Dependence and addiction (DEA Schedule V)'],
    },
    contraindications: [
      'Infectious diarrhea caused by toxin-producing organisms (Clostridioides difficile, toxigenic E. coli, Salmonella, Shigella)',
      'Pseudomembranous enterocolitis',
      'Obstructive jaundice',
      'Children under 2 years of age (severe respiratory depression risk)',
      'Known hypersensitivity to diphenoxylate or atropine',
    ],
    drugInteractions: {
      major: ['Monoamine oxidase inhibitors (MAOIs - risk of severe hypertensive crisis)', 'CNS depressants and opioids (additive sedation, respiratory depression, and mental clouding)', 'Sodium oxybate (extreme respiratory depression)'],
      common: ['Anticholinergic drugs (additive dry mouth, urinary retention, and tachycardia from atropine component)', 'Alcohol'],
    },
    monitoringParameters: [
      'Number and consistency of bowel movements (discontinue if clinical improvement is not seen within 48 hours)',
      'Abdominal girth and signs of abdominal distension or toxic megacolon',
      'Respiratory rate, sedation level, and vital signs',
      'Hydration status and electrolyte balance',
    ],
    dosageForms: ['Oral Tablet: 2.5 mg diphenoxylate hydrochloride / 0.025 mg atropine sulfate', 'Oral Liquid: 2.5 mg diphenoxylate / 0.025 mg atropine per 5 mL'],
    administrationAndCounseling: [
      'Take with or without food as prescribed; do not exceed the recommended maximum dosage.',
      'Maintain adequate fluid and electrolyte intake (oral rehydration solution or broths) during diarrhea episodes.',
      'Do not take this medication if you have a high fever or bloody stools, as treating infectious diarrhea with antispasmodics can cause severe complications.',
      'Avoid alcohol and sedating medications while taking this drug.',
    ],
  },

  Lubiprostone: {
    genericName: 'Lubiprostone',
    brandNames: ['Amitiza'],
    pharmacologicClass: 'Chloride Channel Activator',
    therapeuticClass: 'Chloride Channel Activator',
    mechanismOfAction:
      'Locally acting bicyclic fatty acid derived from prostaglandin E1 that selectively activates type-2 chloride channels (ClC-2) on the apical membrane of the gastrointestinal epithelium, stimulating chloride-rich fluid secretion into the intestinal lumen, accelerating bowel transit, and facilitating bowel evacuation.',
    dosingRegimens: [
      'Chronic Idiopathic Constipation (CIC): 24 mcg PO twice daily with food and water',
      'Opioid-Induced Constipation (OIC) in Chronic Non-Cancer Pain: 24 mcg PO twice daily with food and water',
      'Irritable Bowel Syndrome with Constipation (IBS-C) in Women: 8 mcg PO twice daily with food and water',
    ],
    sideEffects: {
      common: ['Nausea (dose-dependent, very common)', 'Diarrhea', 'Abdominal pain', 'Flatulence', 'Headache', 'Dizziness', 'Abdominal distension'],
      severe: ['Dyspnea and acute chest tightness (onset within 30-60 minutes after first dose, resolves within 3 hours)', 'Severe hypotension and syncope', 'Severe watery diarrhea with electrolyte imbalance'],
    },
    contraindications: [
      'Known or suspected mechanical gastrointestinal obstruction',
      'History of hypersensitivity to lubiprostone',
    ],
    drugInteractions: {
      major: ['Diphenylheptane opioids (methadone - in vitro data suggest methadone may dose-dependently inhibit ClC-2 activation and attenuate lubiprostone efficacy)'],
      common: ['Other antidiarrheals or laxatives (additive laxative effects)'],
    },
    monitoringParameters: [
      'Stool frequency and consistency',
      'Gastrointestinal tolerability (especially persistent nausea or severe diarrhea)',
      'Episodes of sudden acute dyspnea or chest tightness following administration',
      'Pregnancy status prior to initiation in women of childbearing potential',
    ],
    dosageForms: ['Oral Gelatin Capsule: 8 mcg (pink), 24 mcg (orange)'],
    administrationAndCounseling: [
      'Take twice daily with food and water; taking with meals substantially reduces the incidence of nausea.',
      'Swallow capsules whole; do not break, open, or chew.',
      'Some patients experience a sensation of shortness of breath or chest tightness within an hour after taking a dose; this usually resolves within 3 hours but inform your doctor if it recurs.',
      'Discontinue medication and call your doctor if you experience severe watery diarrhea.',
    ],
  },

  Sildenafil: {
    genericName: 'Sildenafil',
    brandNames: ['Viagra', 'Revatio'],
    pharmacologicClass: 'Phosphodiesterase-5 (PDE-5) Inhibitor',
    therapeuticClass: 'PDE-5 Inhibitor',
    mechanismOfAction:
      'Potent, selective inhibitor of cyclic guanosine monophosphate (cGMP)-specific phosphodiesterase type-5 (PDE-5), preventing cGMP degradation in vascular smooth muscle; in the corpus cavernosum, nitric oxide release during sexual stimulation elevates cGMP, causing smooth muscle relaxation, arterial inflow, and penile erection; in pulmonary vasculature, it causes selective pulmonary vasodilation.',
    dosingRegimens: [
      'Erectile Dysfunction (Viagra): Initial 50 mg PO taken approximately 1 hour before sexual activity (range 25 to 100 mg; max once daily; reduce to 25 mg if age > 65 or taking CYP3A4 inhibitors)',
      'Pulmonary Arterial Hypertension (PAH / Revatio): 20 mg PO 3 times daily (taken 4 to 6 hours apart), or 10 mg IV bolus 3 times daily',
    ],
    sideEffects: {
      common: ['Headache', 'Flushing', 'Dyspepsia', 'Nasal congestion', 'Abnormal vision (blue-tinted vision, photophobia)', 'Dizziness', 'Back pain', 'Myalgia'],
      severe: ['Sudden refractory hypotension and cardiovascular collapse (with nitrates)', 'Non-arteritic anterior ischemic optic neuropathy (NAION) and sudden vision loss', 'Sudden sensorineural hearing loss', 'Priapism (painful erection lasting > 4 hours)', 'Myocardial infarction and ventricular arrhythmias'],
    },
    contraindications: [
      'Concomitant administration with any form of organic nitrates (nitroglycerin, isosorbide mononitrate/dinitrate, amyl nitrite "poppers") or soluble guanylyl cyclase stimulators (riociguat) due to severe fatal hypotension',
      'Known hypersensitivity to sildenafil',
    ],
    drugInteractions: {
      major: ['Organic nitrates and nitrites (life-threatening refractory hypotension; absolute contraindication)', 'Soluble guanylyl cyclase stimulators (riociguat)', 'Strong CYP3A4 inhibitors (ritonavir, ketoconazole, itraconazole, clarithromycin - dramatically elevate sildenafil levels; limit sildenafil to max 25 mg every 48 hours)'],
      common: ['Alpha-1 blockers (tamsulosin, doxazosin - additive vasodilation and symptomatic orthostatic hypotension; ensure patient is stable on alpha-blocker first)', 'Antihypertensives (minor additive blood pressure reduction)'],
    },
    monitoringParameters: [
      'Blood pressure and heart rate (standing and sitting)',
      'Efficacy in achieving and maintaining penile erection, or exercise capacity and WHO functional class in PAH',
      'Immediate ophthalmologic evaluation if sudden visual disturbance or loss occurs',
      'Auditory function if hearing loss develops',
    ],
    dosageForms: ['Oral Tablet (Viagra): 25 mg, 50 mg, 100 mg', 'Oral Tablet (Revatio): 20 mg', 'Oral Suspension (Revatio): 10 mg/mL', 'Intravenous Injection (Revatio): 10 mg/12.5 mL'],
    administrationAndCounseling: [
      'For erectile dysfunction: Take approximately 30 to 60 minutes before sexual intercourse; sexual stimulation is required for an erection to occur.',
      'High-fat meals can delay drug absorption and postpone onset of action by an hour or more.',
      'NEVER take sildenafil with nitroglycerin or any nitrate medication; combining them can cause a fatal drop in blood pressure.',
      'Seek emergency medical attention immediately if an erection lasts longer than 4 hours (priapism) to prevent permanent tissue damage.',
      'Stop taking sildenafil and call your doctor right away if you experience sudden loss of vision or sudden hearing loss.',
    ],
  },

  Tadalafil: {
    genericName: 'Tadalafil',
    brandNames: ['Cialis', 'Adcirca'],
    pharmacologicClass: 'Phosphodiesterase-5 (PDE-5) Inhibitor',
    therapeuticClass: 'PDE-5 Inhibitor',
    mechanismOfAction:
      'Long-acting selective inhibitor of phosphodiesterase type-5 (PDE-5) with a terminal half-life of 17.5 hours, prolonging cGMP action in vascular smooth muscle to enhance nitric oxide-mediated penile erection, relax smooth muscle in the prostate and bladder neck, and reduce pulmonary vascular resistance.',
    dosingRegimens: [
      'Erectile Dysfunction (PRN dosing): Initial 10 mg PO taken at least 30 minutes prior to anticipated sexual activity (range 5 to 20 mg; effective up to 36 hours post-dose; max once daily)',
      'Erectile Dysfunction (Daily dosing): 2.5 to 5 mg PO once daily at the same time each day without regard to timing of sexual activity',
      'Benign Prostatic Hyperplasia (BPH) or BPH + ED: 5 mg PO once daily at the same time each day',
      'Pulmonary Arterial Hypertension (Adcirca): 40 mg PO once daily in the morning',
    ],
    sideEffects: {
      common: ['Headache', 'Dyspepsia', 'Back pain', 'Myalgia', 'Nasal congestion', 'Flushing', 'Pain in limb'],
      severe: ['Severe hypotension and shock with nitrates', 'Non-arteritic anterior ischemic optic neuropathy (NAION)', 'Sudden sensorineural hearing loss', 'Priapism (erections lasting > 4 hours)', 'Cardiovascular events and angina'],
    },
    contraindications: [
      'Concomitant administration with any form of nitrates (nitroglycerin, isosorbide) or riociguat',
      'Known hypersensitivity to tadalafil',
    ],
    drugInteractions: {
      major: ['Organic nitrates (nitroglycerin, isosorbide dinitrate/mononitrate - extreme synergistic hypotension; avoid nitrates for at least 48 hours following tadalafil)', 'Guanylate cyclase stimulators (riociguat)', 'Strong CYP3A4 inhibitors (ketoconazole, ritonavir - limit tadalafil PRN dose to max 10 mg every 72 hours)'],
      common: ['Alpha-1 blockers (doxazosin, tamsulosin - risk of symptomatic hypotension; ensure stable alpha-blocker therapy before starting)', 'CYP3A4 inducers (rifampin, carbamazepine - significantly reduce tadalafil exposure)'],
    },
    monitoringParameters: [
      'Blood pressure and heart rate',
      'BPH symptom improvement (International Prostate Symptom Score / IPSS)',
      'Ophthalmologic evaluation in patients experiencing visual changes',
      'Renal function (dose adjustments required if CrCl < 50 mL/min)',
    ],
    dosageForms: ['Oral Tablet (Cialis): 2.5 mg, 5 mg, 10 mg, 20 mg', 'Oral Tablet (Adcirca): 20 mg'],
    administrationAndCounseling: [
      'May be taken with or without food; unlike sildenafil, high-fat meals do not alter tadalafil absorption.',
      'For daily use: Take once daily at approximately the same time every day.',
      'For as-needed use: Take at least 30 minutes prior to sexual activity; the medication remains active in your system for up to 36 hours.',
      'Never take with nitroglycerin or any nitrate drug for chest pain within 48 hours.',
      'Seek emergency medical care if an erection persists for longer than 4 hours.',
    ],
  },

  Oxybutynin: {
    genericName: 'Oxybutynin',
    brandNames: ['Ditropan XL', 'Gelnique', 'Oxytrol'],
    pharmacologicClass: 'Anticholinergic / Muscarinic Antagonist',
    therapeuticClass: 'Urinary Antispasmodic',
    mechanismOfAction:
      'Synthetic tertiary amine antimuscarinic agent that competitively antagonizes muscarinic M1, M2, and M3 receptors on the bladder detrusor muscle, inhibiting acetylcholine-induced involuntary detrusor contractions and increasing bladder capacity.',
    dosingRegimens: [
      'Overactive Bladder (Immediate-Release): 5 mg PO 2 to 3 times daily (max 20 mg/day)',
      'Overactive Bladder (Extended-Release Ditropan XL): Initial 5 to 10 mg PO once daily in the morning; titrate in 5 mg increments weekly to max 30 mg once daily',
      'Transdermal Patch (Oxytrol): Apply 1 patch (3.9 mg/day) twice weekly (every 3 to 4 days) to clean, dry skin of abdomen, hip, or buttock',
      'Topical Gel (Gelnique 10%): Apply contents of 1 packet (100 mg/g) once daily to dry, intact skin of abdomen, upper arms, or thighs',
    ],
    sideEffects: {
      common: ['Dry mouth (xerostomia; significantly less with transdermal/XL)', 'Constipation', 'Somnolence', 'Dizziness', 'Blurred vision', 'Dry eyes', 'Urinary hesitation'],
      severe: ['Severe urinary retention', 'Precipitation of acute angle-closure glaucoma', 'Central anticholinergic cognitive impairment / delirium', 'Anhidrosis and heat stroke', 'Angioedema'],
    },
    contraindications: [
      'Urinary retention',
      'Gastric retention or severe gastrointestinal motility disorders',
      'Uncontrolled angle-closure glaucoma',
      'Known hypersensitivity to oxybutynin',
    ],
    drugInteractions: {
      major: ['Potent anticholinergic agents (tricyclic antidepressants, first-generation antihistamines, phenothiazines - additive antimuscarinic toxicity)', 'Solid potassium chloride tablets (delayed GI transit increases severe ulceration risk)'],
      common: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - increase oxybutynin plasma levels)', 'Acetylcholinesterase inhibitors (donepezil, rivastigmine - pharmacodynamic antagonism)', 'Alcohol and sedatives'],
    },
    monitoringParameters: [
      'Urinary urgency, frequency, and urge incontinence episodes',
      'Post-void residual (PVR) volume to rule out urinary retention',
      'Cognitive function and mental status in elderly patients',
      'Intraocular pressure monitoring in patients with glaucoma',
    ],
    dosageForms: [
      'Oral Immediate-Release Tablet: 5 mg',
      'Oral Extended-Release Tablet (Ditropan XL): 5 mg, 10 mg, 15 mg',
      'Oral Syrup: 5 mg/5 mL',
      'Transdermal Patch (Oxytrol): 3.9 mg/day (system of 36 mg)',
      'Topical Gel (Gelnique): 10% (1 g sachet delivering 100 mg)',
    ],
    administrationAndCounseling: [
      'Swallow extended-release tablets whole with liquids; do not chew, crush, or divide. The non-absorbable tablet shell may pass in the stool.',
      'For transdermal patches: Apply to clean, dry, hairless skin of the abdomen, hip, or buttock; rotate application sites twice weekly.',
      'Suck on sugarless hard candy or chew sugarless gum to relieve dry mouth.',
      'Drink plenty of fluids and avoid excessive heat exposure, as reduced sweating increases heat stroke risk.',
    ],
  },

  Finasteride: {
    genericName: 'Finasteride',
    brandNames: ['Proscar', 'Propecia'],
    pharmacologicClass: '5-Alpha-Reductase Inhibitor (Type II)',
    therapeuticClass: '5-Alpha-Reductase Inhibitor',
    mechanismOfAction:
      'Competitive and specific inhibitor of human type II 5-alpha-reductase, blocking peripheral conversion of testosterone into 5-alpha-dihydrotestosterone (DHT) in the prostate gland, liver, and scalp hair follicles, shrinking prostatic epithelial tissue and reversing androgenetic alopecia.',
    dosingRegimens: [
      'Benign Prostatic Hyperplasia (BPH / Proscar): 5 mg PO once daily with or without food (as monotherapy or in combination with doxazosin)',
      'Male Pattern Androgenetic Alopecia (Propecia): 1 mg PO once daily with or without food (continuous use for >= 3 months required to assess benefit)',
    ],
    sideEffects: {
      common: ['Erectile dysfunction', 'Decreased libido', 'Ejaculatory disorder (decreased ejaculate volume)', 'Gynecomastia / breast tenderness', 'Dizziness'],
      severe: ['High-grade prostate cancer risk (slight increase in Gleason score 8-10 prostate tumors)', 'Teratogenicity (developmental abnormalities of external male genitalia in fetuses)', 'Post-finasteride syndrome (persistent sexual and psychological dysfunction)', 'Male breast cancer (rare)'],
    },
    contraindications: [
      'Pregnancy and women of childbearing potential (category X teratogen; must not touch crushed or broken tablets due to potential transdermal absorption and teratogenic risk to male fetus)',
      'Known hypersensitivity to finasteride or other 5-alpha-reductase inhibitors',
      'Pediatric patients',
    ],
    drugInteractions: {
      major: ['No major cytochrome P450 interactions of clinical significance'],
      common: ['Saw palmetto (concomitant use may have additive 5-alpha reductase inhibition; not recommended)'],
    },
    monitoringParameters: [
      'Serum Prostate-Specific Antigen (PSA): Finasteride decreases baseline serum PSA levels by approximately 50% in patients with BPH; establish a new post-treatment baseline after 6 months and multiply PSA values by 2 when evaluating for prostate cancer',
      'Digital rectal exam (DRE) prior to therapy and periodically',
      'Improvement in urinary symptoms (IPSS score, peak urinary flow rate, post-void residual)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 1 mg (Propecia), 5 mg (Proscar)'],
    administrationAndCounseling: [
      'Take once daily with or without food at the same time each day.',
      'Women who are pregnant or may become pregnant must NOT handle crushed or broken finasteride tablets due to risk of birth defects in a male baby.',
      'Therapy must be continued for at least 6 months to achieve significant prostate shrinkage and urinary symptom relief.',
      'Finasteride lowers PSA test results by about half; always inform any healthcare provider checking your prostate that you take this medication.',
      'Report any breast lumps, pain, or nipple discharge to your doctor.',
    ],
  },

  Dutasteride: {
    genericName: 'Dutasteride',
    brandNames: ['Avodart'],
    pharmacologicClass: '5-Alpha-Reductase Inhibitor (Type I & II)',
    therapeuticClass: '5-Alpha-Reductase Inhibitor',
    mechanismOfAction:
      'Synthetic 4-azasteroid compound that is a dual, competitive, irreversible inhibitor of both type I and type II isoforms of 5-alpha-reductase, suppressing circulating dihydrotestosterone (DHT) levels by greater than 90% to induce apoptosis in prostate epithelial cells and reduce prostate volume.',
    dosingRegimens: [
      'Benign Prostatic Hyperplasia (BPH): 0.5 mg PO once daily as monotherapy or in combination with the alpha-blocker tamsulosin (0.4 mg once daily)',
    ],
    sideEffects: {
      common: ['Erectile dysfunction', 'Decreased libido', 'Ejaculation disorders', 'Gynecomastia and breast enlargement/tenderness', 'Dizziness'],
      severe: ['Increased risk of high-grade prostate cancer (Gleason 8-10)', 'Severe teratogenicity in male fetuses', 'Angioedema and serious cutaneous allergic reactions'],
    },
    contraindications: [
      'Pregnancy and women of childbearing potential (must not handle leaking capsules)',
      'Pediatric patients',
      'Known severe hypersensitivity to dutasteride or other 5-alpha-reductase inhibitors',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ritonavir, ketoconazole, itraconazole, clarithromycin - increase dutasteride plasma concentrations; use caution in chronic coadministration)'],
      common: ['Moderate CYP3A4 inhibitors (diltiazem, verapamil, ciprofloxacin - slightly elevate dutasteride levels)'],
    },
    monitoringParameters: [
      'Serum Prostate-Specific Antigen (PSA): Dutasteride reduces total serum PSA by approximately 50% after 3 to 6 months of therapy; double any measured PSA value when comparing to normal ranges',
      'Digital rectal exam (DRE) before initiating and periodically',
      'Urinary flow rate, post-void residual, and BPH symptom scores (IPSS)',
    ],
    dosageForms: ['Oral Soft Gelatin Capsule: 0.5 mg'],
    administrationAndCounseling: [
      'Swallow capsules whole; do not chew, crush, or open capsules as the contents irritate the oropharyngeal mucosa.',
      'Pregnant women or women who may become pregnant must not touch or handle leaking capsules because the medication is absorbed through the skin and causes birth defects in male fetuses.',
      'Do not donate blood until at least 6 months after your last dose of dutasteride to prevent pregnant transfusion recipients from receiving drug.',
      'It may take 3 to 6 months of continuous therapy before a noticeable improvement in urinary symptoms occurs.',
    ],
  },

  Solifenacin: {
    genericName: 'Solifenacin',
    brandNames: ['Vesicare'],
    pharmacologicClass: 'Anticholinergic / Muscarinic M3 Antagonist',
    therapeuticClass: 'Urinary Antispasmodic',
    mechanismOfAction:
      'Competitive muscarinic receptor antagonist that exhibits relative selectivity for the M3 receptor subtype over M1 and M2 receptors, inhibiting acetylcholine-mediated detrusor smooth muscle contraction in the urinary bladder to improve overactive bladder symptoms.',
    dosingRegimens: [
      'Overactive Bladder (OAB): Initial 5 mg PO once daily; may increase to 10 mg PO once daily if well tolerated (max 5 mg daily with strong CYP3A4 inhibitors or severe renal/moderate hepatic impairment)',
    ],
    sideEffects: {
      common: ['Dry mouth (xerostomia)', 'Constipation', 'Blurred vision', 'Dyspepsia', 'Nausea', 'Urinary tract infection', 'Dizziness', 'Dry eyes'],
      severe: ['Severe urinary retention', 'Precipitation of acute angle-closure glaucoma', 'Dose-dependent QTc interval prolongation (at 30 mg supra-therapeutic doses)', 'Severe gastrointestinal hypomotility / intestinal obstruction', 'Angioedema / anaphylaxis'],
    },
    contraindications: [
      'Urinary retention',
      'Gastric retention or severe decreased gastrointestinal motility',
      'Uncontrolled narrow-angle glaucoma',
      'Severe hypersensitivity to solifenacin',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - significantly increase solifenacin AUC; do NOT exceed 5 mg once daily)'],
      common: ['Other anticholinergic medications (additive antimuscarinic side effects)', 'Cholinesterase inhibitors (pharmacodynamic antagonism)', 'QTc-prolonging drugs'],
    },
    monitoringParameters: [
      'Urinary urgency, frequency, and number of daily incontinence episodes',
      'Post-void residual volume to detect developing urinary retention',
      'Bowel habits for severe or worsening constipation',
      'Electrocardiogram (ECG) for QTc prolongation in high-risk patients',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 5 mg, 10 mg', 'Oral Suspension: 1 mg/mL'],
    administrationAndCounseling: [
      'Take once daily with water or other liquids, with or without food.',
      'Swallow tablets whole; do not chew or crush.',
      'Do not exceed 5 mg daily if taking strong antifungal or antibiotic medications (ketoconazole, clarithromycin).',
      'Stay well hydrated and maintain a high-fiber diet to prevent constipation.',
      'Avoid high temperatures and prolonged exercise in hot weather as solifenacin can reduce sweating.',
    ],
  },

  Tamsulosin: {
    genericName: 'Tamsulosin',
    brandNames: ['Flomax'],
    pharmacologicClass: 'Uroselective Alpha-1A Blocker',
    therapeuticClass: 'Alpha-1 Blocker',
    mechanismOfAction:
      'Selectively and competitively antagonizes postsynaptic alpha-1A adrenergic receptors concentrated in the human prostate, prostatic capsule, prostatic urethra, and bladder neck, relaxing smooth muscle and improving urinary flow without substantially lowering systemic arterial blood pressure.',
    dosingRegimens: [
      'Benign Prostatic Hyperplasia (BPH): 0.4 mg PO once daily approximately 30 minutes following the same meal each day; may increase to 0.8 mg PO once daily after 2 to 4 weeks if response is inadequate',
      'Ureteral Calculus Expulsion (Off-label): 0.4 mg PO once daily until stone passes (up to 4 weeks)',
    ],
    sideEffects: {
      common: ['Abnormal ejaculation (retrograde ejaculation or failure of ejaculation)', 'Dizziness', 'Headache', 'Rhinitis / nasal congestion', 'Asthenia', 'Infection', 'Somnolence'],
      severe: ['Intraoperative Floppy Iris Syndrome (IFIS during cataract or glaucoma surgery)', 'Orthostatic hypotension and first-dose syncope', 'Priapism (sustained painful erection)', 'Severe cutaneous reactions (Stevens-Johnson syndrome)'],
    },
    contraindications: [
      'Known severe hypersensitivity to tamsulosin hydrochloride (including angioedema)',
      'Concurrent administration with potent CYP3A4 inhibitors (ketoconazole)',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - dramatically elevate tamsulosin levels; coadministration contraindicated)', 'Strong CYP2D6 inhibitors (paroxetine - increases tamsulosin AUC by ~30%)', 'Other alpha-adrenergic antagonists (doxazosin, terazosin - additive vasodilation)'],
      common: ['PDE-5 inhibitors (sildenafil, tadalafil - additive vasodilation; ensure stable alpha-blocker therapy prior to initiating PDE-5 inhibitor)', 'Antihypertensives (monitor blood pressure)'],
    },
    monitoringParameters: [
      'Improvement in BPH symptoms (IPSS symptom score, urinary hesitancy, stream strength, nocturia)',
      'Blood pressure (sitting and standing) to rule out postural hypotension upon initiation or dose escalation',
      'Prior ophthalmologic history; ensure eye surgeons are notified prior to any cataract surgery',
    ],
    dosageForms: ['Oral Capsule: 0.4 mg'],
    administrationAndCounseling: [
      'Take once daily approximately 30 minutes following the same meal each day (e.g., 30 minutes after dinner).',
      'Swallow capsules whole; do not crush, chew, or open capsules.',
      'Inform your eye surgeon before undergoing cataract or glaucoma surgery that you are taking or have ever taken tamsulosin (to prevent Floppy Iris Syndrome).',
      'Rise slowly from sitting or lying positions to prevent dizziness or fainting.',
      'Retrograde ejaculation (ejaculation into the bladder) is a common, harmless side effect that resolves when the drug is stopped.',
    ],
  },

  Cetirizine: {
    genericName: 'Cetirizine',
    brandNames: ['Zyrtec'],
    pharmacologicClass: 'Second-Generation H1 Antagonist (Piperazine Derivative)',
    therapeuticClass: 'Second-Generation Antihistamine',
    mechanismOfAction:
      'Potent, selective second-generation histamine H1 receptor inverse agonist that binds peripherally to H1 receptors, suppressing histamine-mediated capillary permeability, wheal and flare formation, pruritus, and allergic rhinitis symptoms with minimal penetration across the blood-brain barrier.',
    dosingRegimens: [
      'Allergic Rhinitis / Chronic Urticaria (Adults and Children >= 6 years): 5 to 10 mg PO once daily (5 mg daily initial dose recommended in elderly or CrCl < 50 mL/min)',
    ],
    sideEffects: {
      common: ['Drowsiness / somnolence (higher incidence than loratadine or fexofenadine)', 'Fatigue', 'Dry mouth', 'Pharyngitis', 'Dizziness', 'Headache'],
      severe: ['Severe central nervous system depression (with alcohol or sedatives)', 'Anaphylaxis / severe hypersensitivity reactions (rare)'],
    },
    contraindications: [
      'Hypersensitivity to cetirizine, hydroxyzine, or levocetirizine',
      'Severe renal impairment (CrCl < 10 mL/min) or end-stage renal disease on hemodialysis',
    ],
    drugInteractions: {
      major: ['Central nervous system depressants and alcohol (additive sedation, psychomotor impairment)'],
      common: ['Theophylline (minor decrease in cetirizine clearance)', 'Anticholinergic drugs (minor additive dry mouth)'],
    },
    monitoringParameters: [
      'Relief of allergic rhinitis symptoms (sneezing, rhinorrhea, nasal pruritus, watery eyes) or urticaria',
      'Daytime alertness and degree of sedation',
      'Renal function (dose adjustment required for CrCl < 50 mL/min)',
    ],
    dosageForms: [
      'Oral Tablet: 5 mg, 10 mg',
      'Oral Chewable Tablet: 5 mg, 10 mg',
      'Orally Disintegrating Tablet: 10 mg',
      'Oral Solution / Syrup: 5 mg/5 mL (1 mg/mL)',
      'Oral Softgel Capsule: 10 mg',
    ],
    administrationAndCounseling: [
      'Take once daily with or without food; taking in the evening may be preferable if mild drowsiness occurs.',
      'Exercise caution when driving or performing hazardous tasks until you know how this medication affects your alertness.',
      'Avoid drinking alcohol while taking cetirizine.',
      'Safe for daily use throughout seasonal allergy periods.',
    ],
  },

  Loratadine: {
    genericName: 'Loratadine',
    brandNames: ['Claritin'],
    pharmacologicClass: 'Second-Generation H1 Antagonist (Piperidine Derivative)',
    therapeuticClass: 'Second-Generation Antihistamine',
    mechanismOfAction:
      'Long-acting tricyclic second-generation histamine H1 antagonist with selective peripheral H1 receptor blocking activity, devoid of significant central nervous system sedative or anticholinergic effects at recommended therapeutic doses due to low lipophilicity and P-glycoprotein efflux.',
    dosingRegimens: [
      'Allergic Rhinitis / Chronic Urticaria (Adults and Children >= 6 years): 10 mg PO once daily (or 10 mg orally disintegrating tablet / chewable once daily); extend interval to 10 mg every other day in severe renal or hepatic impairment',
    ],
    sideEffects: {
      common: ['Headache', 'Somnolence (rare at recommended 10 mg dose)', 'Fatigue', 'Dry mouth', 'Gastrointestinal upset'],
      severe: ['Severe hypersensitivity reactions / angioedema', 'Tachycardia and palpitations (rare)', 'Hepatic dysfunction / jaundice (rare)'],
    },
    contraindications: [
      'Known hypersensitivity to loratadine or desloratadine',
    ],
    drugInteractions: {
      major: ['No life-threatening cytochrome P450 interactions reported'],
      common: ['Strong CYP3A4 and CYP2D6 inhibitors (ketoconazole, erythromycin, cimetidine - increase loratadine plasma concentrations without significant change in ECG or adverse events)', 'Alcohol (does not potently potentiate alcohol effects compared to first-generation antihistamines)'],
    },
    monitoringParameters: [
      'Reduction in allergic symptoms (rhinorrhea, sneezing, itchy/watery eyes, nasal itching, hives)',
      'Liver function tests in patients with pre-existing severe hepatic impairment',
    ],
    dosageForms: [
      'Oral Tablet: 10 mg',
      'Orally Disintegrating Tablet (RediTabs): 10 mg',
      'Oral Chewable Tablet: 5 mg, 10 mg',
      'Oral Solution / Syrup: 5 mg/5 mL',
      'Oral Liquid-Filled Softgel Capsule: 10 mg',
    ],
    administrationAndCounseling: [
      'Take once daily with or without food.',
      'For orally disintegrating tablets (RediTabs): Place on tongue and allow to dissolve; may be swallowed with or without water.',
      'Non-drowsy formulation at the recommended 10 mg daily dose.',
      'Discontinue antihistamines at least 48 to 72 hours prior to allergy skin testing to prevent false-negative skin test results.',
    ],
  },
};
