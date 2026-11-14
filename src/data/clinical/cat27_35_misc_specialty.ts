import type { TopDrugClinicalMonograph } from './types.js';

export const CAT27_35_MISC_SPECIALTY: Record<string, TopDrugClinicalMonograph> = {
  Memantine: {
    genericName: 'Memantine',
    brandNames: ['Namenda', 'Namenda XR'],
    pharmacologicClass: 'N-Methyl-D-Aspartate (NMDA) Receptor Antagonist',
    therapeuticClass: 'NMDA Receptor Antagonist',
    mechanismOfAction:
      'Low- to moderate-affinity, uncompetitive, open-channel NMDA receptor antagonist that binds preferentially to NMDA receptor-operated cation channels, blocking pathological tonic levels of glutamate-mediated neurotoxicity and calcium influx without interfering with physiological neurotransmission required for memory formation.',
    dosingRegimens: [
      'Moderate to Severe Alzheimer Disease (Immediate-Release): Initial 5 mg PO once daily; titrate weekly by 5 mg/day increments to target maintenance 10 mg PO twice daily (20 mg/day; dose reduce to 5 mg twice daily if CrCl 5-29 mL/min)',
      'Alzheimer Disease (Extended-Release XR): Initial 7 mg PO once daily in morning; titrate weekly by 7 mg/day to target 28 mg PO once daily (dose reduce to 14 mg daily if severe renal impairment)',
    ],
    sideEffects: {
      common: ['Dizziness', 'Headache', 'Confusion', 'Constipation', 'Hypertension', 'Somnolence', 'Cough', 'Back pain'],
      severe: ['Seizures (rare)', 'Psychosis, delusions, and hallucinations', 'Congestive heart failure exacerbation', 'Stevens-Johnson syndrome (rare)'],
    },
    contraindications: [
      'Known hypersensitivity to memantine hydrochloride or formulation components',
    ],
    drugInteractions: {
      major: ['Other NMDA antagonists (amantadine, ketamine, dextromethorphan - additive toxicity and psychotic symptoms; avoid combination)'],
      common: ['Urinary alkalinizers (sodium bicarbonate, potassium citrate, carbonic anhydrase inhibitors - reduce renal memantine excretion, increasing plasma levels)', 'Cholinesterase inhibitors (donepezil - beneficial complementary combination, commonly co-prescribed as Namzaric)'],
    },
    monitoringParameters: [
      'Cognitive performance and functional status (MMSE, ADAS-cog)',
      'Renal function (BUN, serum creatinine, CrCl - dosage adjustment required if CrCl < 30 mL/min)',
      'Blood pressure periodically',
      'Emergence of behavioral changes or psychosis',
    ],
    dosageForms: ['Oral Tablet (Immediate-Release): 5 mg, 10 mg', 'Oral Extended-Release Capsule (XR): 7 mg, 14 mg, 21 mg, 28 mg', 'Oral Solution: 2 mg/mL'],
    administrationAndCounseling: [
      'Take with or without food.',
      'Swallow extended-release capsules whole; do not chew, crush, or divide. Capsules may be opened and the pellets sprinkled onto applesauce and swallowed immediately without chewing.',
      'Follow the weekly titration schedule strictly to reduce dizziness and confusion.',
      'Maintain adequate fluid intake.',
    ],
  },

  Donepezil: {
    genericName: 'Donepezil',
    brandNames: ['Aricept'],
    pharmacologicClass: 'Reversible Acetylcholinesterase Inhibitor',
    therapeuticClass: 'Cholinesterase Inhibitor',
    mechanismOfAction:
      'Piperidine-based reversible, noncompetitive inhibitor of acetylcholinesterase (AChE) that selectively inhibits acetylcholine hydrolysis in central cholinergic synapses, increasing acetylcholine bioavailability in the cerebral cortex and hippocampus to temporarily alleviate cognitive symptoms in dementia.',
    dosingRegimens: [
      'Mild to Moderate Alzheimer Disease: Initial 5 mg PO once daily at bedtime; after 4 to 6 weeks, may increase to 10 mg PO once daily at bedtime',
      'Moderate to Severe Alzheimer Disease: 10 mg PO once daily at bedtime for at least 3 months; may increase to 23 mg PO once daily at bedtime',
    ],
    sideEffects: {
      common: ['Nausea and vomiting', 'Diarrhea', 'Anorexia and weight loss', 'Insomnia and abnormal dreams', 'Fatigue', 'Muscle cramps', 'Dizziness'],
      severe: ['Symptomatic bradycardia and syncope / heart block (vagotonic effect)', 'Gastrointestinal bleeding and peptic ulceration (increased gastric acid secretion)', 'Neuroleptic Malignant Syndrome-like reactions', 'Rhabdomyolysis', 'Seizures'],
    },
    contraindications: [
      'Known hypersensitivity to donepezil hydrochloride or piperidine derivatives',
    ],
    drugInteractions: {
      major: ['Anticholinergic medications (benztropine, oxybutynin, diphenhydramine, TCAs - pharmacodynamic antagonism of donepezil cognitive benefits)', 'Succinylcholine and neuromuscular blockers (donepezil prolongs muscle relaxation during anesthesia)'],
      common: ['Beta-blockers and bradycardic drugs (additive bradycardia and syncope)', 'NSAIDs (increased risk of peptic ulcer and gastrointestinal hemorrhage)', 'CYP3A4 and CYP2D6 inducers/inhibitors'],
    },
    monitoringParameters: [
      'Cognitive assessment and global functioning (MMSE, MoCA) periodically',
      'Heart rate (resting pulse) and ECG in patients with pre-existing conduction disorders or syncope',
      'Body weight regularly to detect anorexia-induced weight loss',
      'Signs and symptoms of active or occult gastrointestinal bleeding',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 5 mg, 10 mg, 23 mg', 'Orally Disintegrating Tablet (ODT): 5 mg, 10 mg'],
    administrationAndCounseling: [
      'Take once daily in the evening immediately prior to going to sleep, with or without food.',
      'If significant sleep disturbance or vivid dreams occur, discuss switching to morning administration with your physician.',
      'For orally disintegrating tablets: Allow tablet to dissolve on the tongue and follow with a glass of water.',
      'Take with food if gastrointestinal upset or nausea occurs.',
      'Inform your anesthesiologist and surgeon prior to elective surgery that you take donepezil.',
    ],
  },

  Hydroxychloroquine: {
    genericName: 'Hydroxychloroquine',
    brandNames: ['Plaquenil'],
    pharmacologicClass: '4-Aminoquinoline (Antimalarial / DMARD)',
    therapeuticClass: 'Aminoquinoline',
    mechanismOfAction:
      'Weak diprotic base that diffuses across membranes and concentrates within acidic intracellular organelles (lysosomes, endosomes), increasing intravesicular pH, inhibiting antigen processing and MHC class II presentation, suppressing toll-like receptor (TLR-7, TLR-9) activation, and dampening production of inflammatory cytokines (IFN-alpha, TNF-alpha).',
    dosingRegimens: [
      'Systemic Lupus Erythematosus (SLE): 200 to 400 mg PO once daily or divided twice daily (guidelines recommend <= 5 mg/kg actual body weight/day to prevent retinal toxicity)',
      'Rheumatoid Arthritis: Initial 400 to 600 mg PO daily; maintenance 200 to 400 mg PO daily in single or divided doses',
      'Malaria Prophylaxis: 400 mg (310 mg base) PO once weekly on the same day each week, starting 2 weeks before travel and continuing for 4 weeks after leaving endemic area',
    ],
    sideEffects: {
      common: ['Nausea and vomiting', 'Abdominal cramps', 'Diarrhea', 'Anorexia', 'Headache', 'Dizziness', 'Skin hyperpigmentation (blue-gray discoloration)', 'Pruritus'],
      severe: ['Irreversible toxic retinopathy (maculopathy, bull\'s-eye macula, central visual field loss)', 'QTc interval prolongation and Torsades de Pointes', 'Cardiomyopathy and heart failure (restrictive/conduction cardiomyopathy)', 'Proximal myopathy and neuropathy', 'Severe hypoglycemia', 'Aplastic anemia and agranulocytosis'],
    },
    contraindications: [
      'Pre-existing maculopathy or retinal disease',
      'Known hypersensitivity to 4-aminoquinolines',
    ],
    drugInteractions: {
      major: ['QT-prolonging drugs (amiodarone, moxifloxacin, azithromycin, citalopram, haloperidol - additive risk of ventricular arrhythmias)', 'Digoxin (hydroxychloroquine increases digoxin blood levels; reduce digoxin dose)'],
      common: ['Antidiabetic medications (insulin, sulfonylureas - synergistic hypoglycemia; monitor blood glucose)', 'Antacids (magnesium/aluminum antacids decrease absorption; separate by 4 hours)'],
    },
    monitoringParameters: [
      'Comprehensive baseline ophthalmologic exam (fundus exam, automated visual field 10-2, spectral-domain OCT) within first year, then annually after 5 years (or annually from baseline if high risk)',
      'Complete blood count (CBC) with differential periodically',
      'Blood glucose in diabetic patients',
      'Baseline ECG and periodic QTc monitoring if co-prescribed with QT-prolonging drugs',
      'Muscle strength and deep tendon reflexes',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 200 mg (equivalent to 155 mg base), 100 mg, 300 mg, 400 mg'],
    administrationAndCounseling: [
      'Take with food or a glass of milk to minimize stomach upset.',
      'Adhere strictly to scheduled annual eye exams to detect retinal toxicity early before vision loss becomes irreversible.',
      'Therapeutic response in lupus and rheumatoid arthritis develops slowly over 2 to 6 months of daily therapy.',
      'Report any vision changes (difficulty reading, blurred vision, loss of color vision, blind spots) or unexplained muscle weakness immediately.',
    ],
  },

  'Potassium Chloride': {
    genericName: 'Potassium Chloride',
    brandNames: ['Klor-Con', 'K-Sol', 'K-Tab', 'Micro-K'],
    pharmacologicClass: 'Electrolyte Supplement',
    therapeuticClass: 'Electrolyte',
    mechanismOfAction:
      'Major intracellular monovalent cation necessary for the maintenance of intracellular tonicity, the transmission of nerve impulses, the contraction of cardiac, skeletal, and smooth muscle, and the maintenance of normal renal function and acid-base balance.',
    dosingRegimens: [
      'Hypokalemia Prevention (with Diuretic Therapy): 20 mEq PO once daily (or divided twice daily)',
      'Hypokalemia Treatment: 40 to 100 mEq PO daily divided into 2 to 4 doses (maximum single oral dose should not exceed 20 to 40 mEq to prevent gastric irritation)',
      'Severe Hypokalemia (IV Infusion): 10 to 20 mEq/hour via peripheral line (max 10 mEq/h peripheral; up to 40 mEq/h via central line with continuous ECG telemetry)',
    ],
    sideEffects: {
      common: ['Nausea and vomiting', 'Abdominal discomfort / cramping', 'Diarrhea', 'Flatulence'],
      severe: ['Severe hyperkalemia with fatal cardiac arrest and arrhythmias (peaked T waves, heart block, ventricular fibrillation)', 'Gastrointestinal ulceration, stenosis, bleeding, and intestinal perforation (solid dosage forms)', 'Severe phlebitis / tissue extravasation (IV infusion)'],
    },
    contraindications: [
      'Severe hyperkalemia (serum potassium > 5.0 mEq/L)',
      'Severe chronic kidney disease or acute anuria/oliguria',
      'Structural gastrointestinal motility delay, esophageal compression, or intestinal stricture (for solid oral wax-matrix forms)',
      'Untreated Addison disease',
      'Concomitant potassium-sparing diuretics in renal impairment',
    ],
    drugInteractions: {
      major: ['Potassium-sparing diuretics (spironolactone, triamterene, amiloride - life-threatening hyperkalemia hazard)', 'ACE inhibitors and ARBs (lisinopril, losartan - impair potassium excretion, precipitating severe hyperkalemia)'],
      common: ['Anticholinergic agents (delay GI motility, increasing contact time and mucosal ulceration from solid potassium tablets)', 'NSAIDs (decrease renal blood flow and potassium excretion)', 'Digoxin (hyperkalemia produces heart block; hypokalemia causes digitalis toxicity)'],
    },
    monitoringParameters: [
      'Serum potassium levels (target 3.5 to 5.0 mEq/L; 4.0 to 4.5 mEq/L in cardiac arrhythmia / heart failure patients)',
      'Renal function (BUN, serum creatinine, eGFR)',
      'Acid-base balance (serum bicarbonate, blood pH)',
      'Continuous ECG monitoring during high-dose or rapid IV infusion',
    ],
    dosageForms: [
      'Oral Extended-Release Tablet (Wax-Matrix / Microencapsulated): 8 mEq (600 mg), 10 mEq (750 mg), 15 mEq (1,125 mg), 20 mEq (1,500 mg)',
      'Oral Extended-Release Capsule (Micro-K): 8 mEq, 10 mEq',
      'Oral Powder for Solution: 20 mEq, 25 mEq packets',
      'Oral Solution: 20 mEq/15 mL (10%), 40 mEq/15 mL (20%)',
      'Intravenous Injection for Infusion: 2 mEq/mL (concentrate must be diluted prior to IV use)',
    ],
    administrationAndCounseling: [
      'Take with meals and a full 8-ounce glass of water or other liquid to reduce stomach irritation.',
      'Do not chew, crush, or suck on extended-release tablets; swallow whole.',
      'Microencapsulated tablets (Klor-Con M) may be halved or dissolved in 4 ounces of water before drinking.',
      'Wax-matrix tablets may leave an empty ghost tablet shell in the stool; this is harmless as the medication has been fully absorbed.',
      'Never take potassium supplements without regular blood monitoring ordered by your physician.',
    ],
  },

  Cinacalcet: {
    genericName: 'Cinacalcet',
    brandNames: ['Sensipar'],
    pharmacologicClass: 'Calcium-Sensing Receptor Agonist (Calcimimetic)',
    therapeuticClass: 'Calcimimetic',
    mechanismOfAction:
      'Type II calcimimetic that directly increases the sensitivity of the calcium-sensing receptor (CaSR) on chief cells of the parathyroid gland to extracellular calcium, decreasing parathyroid hormone (PTH) secretion, which consecutively lowers serum calcium and phosphorus concentrations.',
    dosingRegimens: [
      'Secondary Hyperparathyroidism in CKD on Dialysis: Initial 30 mg PO once daily with food; titrate every 2 to 4 weeks through doses of 60, 90, 120, and 180 mg PO once daily to achieve target intact PTH (iPTH) levels',
      'Parathyroid Carcinoma / Primary Hyperparathyroidism: Initial 30 mg PO twice daily with food; titrate every 2 to 4 weeks up to 90 mg 3 or 4 times daily',
    ],
    sideEffects: {
      common: ['Nausea and vomiting (very common at initiation)', 'Diarrhea', 'Myalgia', 'Dizziness', 'Dyspnea', 'Headache', 'Hypotension'],
      severe: ['Severe hypocalcemia (serum calcium < 7.5 mg/dL; causes paresthesias, tetany, muscle spasms, seizures, QTc prolongation)', 'Adynamic bone disease (if PTH suppressed below target range)', 'Upper gastrointestinal bleeding', 'Worsening congestive heart failure / hypotension'],
    },
    contraindications: [
      'Hypocalcemia (do not initiate if corrected serum calcium is below the lower limit of normal, typically < 8.4 mg/dL)',
      'Known hypersensitivity to cinacalcet',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - double cinacalcet plasma levels; close titration required)', 'Drugs metabolized by CYP2D6 (cinacalcet is a potent CYP2D6 inhibitor; increases levels of carvedilol, metoprolol, tricyclic antidepressants)'],
      common: ['Calcium supplements and vitamin D sterols (may be needed to manage cinacalcet-induced hypocalcemia)', 'Phosphate binders'],
    },
    monitoringParameters: [
      'Corrected serum calcium levels: Measure within 1 week of initiation or dose change, then at least monthly once maintenance dose established (withhold if calcium < 7.5 mg/dL or symptomatic)',
      'Intact Parathyroid Hormone (iPTH): Measure 1 to 4 weeks following initiation or dose adjustment, then every 1 to 3 months',
      'Serum phosphorus levels monthly',
      'Screening for symptoms of hypocalcemia (paresthesias, perioral numbness, carpopedal spasm, seizures)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 30 mg, 60 mg, 90 mg'],
    administrationAndCounseling: [
      'Take with food or shortly after a meal; food substantially increases bioavailability and minimizes nausea.',
      'Swallow tablets whole; do not split, crush, or chew.',
      'Report any tingling around your mouth, numbness in fingers or toes, muscle cramping, or tremors immediately (signs of low blood calcium).',
      'Ensure you attend all scheduled laboratory appointments for blood calcium and parathyroid tests.',
    ],
  },

  'Ferrous Sulfate': {
    genericName: 'Ferrous Sulfate',
    brandNames: ['Feosol'],
    pharmacologicClass: 'Oral Iron Supplement',
    therapeuticClass: 'Iron Preparation',
    mechanismOfAction:
      'Provides elemental iron (20% by weight for hydrated salt, 30% for dried salt) essential for the synthesis of hemoglobin, myoglobin, and heme-containing enzymes (cytochromes), correcting microcytic hypochromic iron-deficiency anemia and replenishing depleted hepatic and reticuloendothelial ferritin stores.',
    dosingRegimens: [
      'Iron Deficiency Anemia (Adults): 325 mg (65 mg elemental iron) PO 1 to 3 times daily (modern evidence often favors alternate-day dosing [325 mg every other day] to maximize fractional iron absorption and reduce hepcidin elevation)',
      'Prophylaxis / Pregnancy Supplementation: 325 mg PO once daily',
    ],
    sideEffects: {
      common: ['Dark green or black tarry stools', 'Constipation', 'Nausea', 'Epigastric distress', 'Abdominal cramping', 'Heartburn', 'Teeth staining (oral liquid)'],
      severe: ['Severe acute iron toxicity / overdose (especially in children: hemorrhagic gastroenteritis, metabolic acidosis, hepatic necrosis, circulatory collapse)', 'Gastrointestinal ulceration and stricture', 'Iron overload / hemochromatosis in non-iron deficiency anemia'],
    },
    contraindications: [
      'Hemochromatosis, hemosiderosis, or other iron storage diseases',
      'Anemias not caused by iron deficiency (hemolytic anemia, thalassemia, sideroblastic anemia)',
      'Known hypersensitivity to iron salts',
    ],
    drugInteractions: {
      major: ['Tetracyclines, fluoroquinolones, and bisphosphonates (divalent iron forms insoluble chelation complexes, drastically reducing absorption of both drugs; separate by at least 2 to 4 hours)'],
      common: ['Levothyroxine and methyldopa (iron chelates and prevents absorption; separate by 4 hours)', 'Antacids, proton pump inhibitors, and H2 blockers (reduced gastric acidity impairs non-heme iron absorption)', 'Vitamin C / Ascorbic acid (enhances intestinal iron absorption by reducing Fe3+ to soluble Fe2+)'],
    },
    monitoringParameters: [
      'Hemoglobin and hematocrit (expect ~1 g/dL rise in Hb every 2 to 3 weeks until normal)',
      'Reticulocyte count (peaks 7 to 10 days after starting therapy)',
      'Serum ferritin, serum iron, and total iron-binding capacity (TIBC) / transferrin saturation',
      'Adherence and gastrointestinal tolerability',
    ],
    dosageForms: ['Oral Tablet: 325 mg (65 mg elemental iron), 200 mg (dried, 65 mg elemental iron)', 'Oral Solution / Drops: 220 mg/5 mL (44 mg elemental iron), 75 mg/mL (15 mg elemental iron)'],
    administrationAndCounseling: [
      'Best absorbed on an empty stomach with a glass of water or citrus juice (vitamin C improves absorption) 1 hour before or 2 hours after meals.',
      'If significant stomach upset occurs, it may be taken with food (avoid taking with milk, tea, coffee, eggs, or whole-grain cereals which bind iron).',
      'Stools will turn a dark green or black color; this is completely harmless and expected.',
      'Dilute oral drops in water or juice and drink through a straw to prevent temporary dark staining of teeth.',
      'CRITICAL: Keep out of reach of children; accidental iron overdose is a leading cause of fatal poisoning in young children.',
    ],
  },

  Sevelamer: {
    genericName: 'Sevelamer',
    brandNames: ['Renvela', 'Renagel'],
    pharmacologicClass: 'Non-Absorbed Phosphate Binder',
    therapeuticClass: 'Phosphate Binder',
    mechanismOfAction:
      'Non-absorbed, calcium-free, aluminum-free polymeric amine that swells and binds dietary phosphate in the gastrointestinal lumen through ion exchange and hydrogen bonding, preventing phosphate absorption into the systemic circulation and facilitating fecal excretion, lowering serum phosphorus in chronic kidney disease.',
    dosingRegimens: [
      'Hyperphosphatemia in CKD on Dialysis (Carbonate / Renvela): Initial 800 to 1,600 mg PO 3 times daily with meals based on serum phosphorus (> 5.5 to < 7.5 mg/dL: 800 mg TID; >= 7.5 mg/dL: 1,600 mg TID); titrate by 800 mg per meal every 2 weeks to target serum phosphorus',
    ],
    sideEffects: {
      common: ['Nausea and vomiting', 'Diarrhea', 'Dyspepsia', 'Abdominal pain', 'Flatulence', 'Constipation'],
      severe: ['Gastrointestinal obstruction, ileus, and bowel perforation', 'Fecal impaction', 'Severe metabolic acidosis (more frequent with sevelamer hydrochloride than carbonate)', 'Decreased absorption of fat-soluble vitamins (A, D, E, K)'],
    },
    contraindications: [
      'Bowel obstruction / mechanical gastrointestinal obstruction',
      'Known hypersensitivity to sevelamer carbonate or sevelamer hydrochloride',
    ],
    drugInteractions: {
      major: ['Ciprofloxacin, mycophenolate mofetil, and levothyroxine (sevelamer binds these medications in the gut, reducing their bioavailability; administer these drugs at least 1 hour before or 3 hours after sevelamer)'],
      common: ['Antiarrhythmic and anticonvulsant medications (take at least 1 hour before or 3 hours after sevelamer)', 'Fat-soluble vitamin supplements (take vitamins at least 1 hour prior to sevelamer)'],
    },
    monitoringParameters: [
      'Serum phosphorus levels every 2 to 3 weeks until target range (3.5 to 5.5 mg/dL) achieved, then monthly',
      'Serum bicarbonate and chloride levels (monitor for worsening metabolic acidosis)',
      'Serum calcium and intact PTH (iPTH) levels',
      'Gastrointestinal symptoms (severe constipation or abdominal distension)',
    ],
    dosageForms: ['Oral Tablet (Sevelamer Carbonate / Renvela): 800 mg', 'Oral Powder for Suspension (Renvela): 0.8 g, 2.4 g packets', 'Oral Tablet (Sevelamer HCl / Renagel): 800 mg'],
    administrationAndCounseling: [
      'Take with meals; sevelamer must be present in the gastrointestinal tract with food to bind dietary phosphate.',
      'Swallow tablets whole; do not chew, crush, or break tablets as they expand rapidly with water.',
      'For oral powder: Empty packet contents into a cup, mix with 2 to 4 ounces of water, stir vigorously (it does not dissolve completely), and drink immediately within 30 minutes.',
      'Take other prescribed medications at least 1 hour before or 3 hours after sevelamer doses as directed.',
      'Maintain dietary phosphate restrictions as advised by your renal dietitian.',
    ],
  },

  Cyanocobalamin: {
    genericName: 'Cyanocobalamin',
    brandNames: ['Nascobal', 'B-12'],
    pharmacologicClass: 'Water-Soluble Vitamin (Vitamin B12)',
    therapeuticClass: 'Vitamin',
    mechanismOfAction:
      'Synthetic cobalt-containing coordination complex converted in vivo to active coenzymes methylcobalamin (required for methionine synthase and homocysteine remethylation) and adenosylcobalamin (required for methylmalonyl-CoA mutase to form succinyl-CoA), essential for normal erythropoiesis, nucleoprotein synthesis, and nervous system myelin maintenance.',
    dosingRegimens: [
      'Pernicious Anemia / Severe Deficiency (Intramuscular / Deep SC): 1,000 mcg daily for 1 to 2 weeks, then 1,000 mcg once weekly for 4 to 8 weeks, followed by maintenance 1,000 mcg IM once monthly for life',
      'Oral Maintenance Therapy (High-Dose): 1,000 to 2,000 mcg PO once daily (1-2% absorbed by passive diffusion independent of intrinsic factor)',
      'Intranasal Gel / Spray (Nascobal): 500 mcg intranasally into one nostril once weekly',
    ],
    sideEffects: {
      common: ['Transient diarrhea', 'Mild pain or swelling at injection site', 'Feeling of swelling of entire body', 'Pruritus / urticaria'],
      severe: ['Severe hypokalemia and sudden cardiac death during intense initial anemia response (erythrocytosis consumes potassium)', 'Polycythemia vera unmasking', 'Peripheral vascular thrombosis', 'Anaphylactoid reactions'],
    },
    contraindications: [
      'Known hypersensitivity to cyanocobalamin or cobalt',
      'Early Leber hereditary optic neuropathy (cyanocobalamin can accelerate severe, permanent optic nerve atrophy)',
    ],
    drugInteractions: {
      major: ['Chloramphenicol (antagonizes hematopoietic response to vitamin B12 therapy)'],
      common: ['Proton pump inhibitors and H2 blockers (reduce food-bound vitamin B12 release from proteins)', 'Metformin (decreases ileal B12 absorption; monitor B12 levels annually)', 'Colchicine (impairs B12 absorption)'],
    },
    monitoringParameters: [
      'Serum potassium levels closely during the first 48 hours of intense parenteral treatment of severe megaloblastic anemia',
      'Reticulocyte count, hematocrit, and hemoglobin (reticulocytosis peaks in 5 to 8 days)',
      'Serum vitamin B12 and methylmalonic acid (MMA) / homocysteine levels',
      'Platelets and white blood cells (correct cytopenias)',
    ],
    dosageForms: ['Intramuscular / Subcutaneous Injection: 1,000 mcg/mL vials', 'Oral Tablet: 100 mcg, 250 mcg, 500 mcg, 1,000 mcg, 2,500 mcg', 'Sublingual Tablet / Liquid: 1,000 mcg, 2,500 mcg, 5,000 mcg', 'Nasal Spray (Nascobal): 500 mcg/spray (0.1 mL)'],
    administrationAndCounseling: [
      'Administer intramuscular or deep subcutaneous injections as prescribed; do not administer intravenously.',
      'Patients with pernicious anemia lack intrinsic factor and require life-long maintenance therapy to prevent irreversible neurologic damage.',
      'High-dose oral vitamin B12 (1,000 to 2,000 mcg daily) is effective in most patients via passive intestinal absorption.',
      'Eat a balanced diet containing animal proteins, fish, dairy, and fortified cereals.',
    ],
  },

  'Folic Acid': {
    genericName: 'Folic Acid',
    brandNames: ['FA-8'],
    pharmacologicClass: 'Water-Soluble Vitamin (Vitamin B9)',
    therapeuticClass: 'Vitamin',
    mechanismOfAction:
      'Exogenous synthetic folate converted by dihydrofolate reductase into tetrahydrofolate (THF), a crucial one-carbon donor required for de novo purine and pyrimidine nucleotide biosynthesis, DNA methylation, and amino acid conversion (homocysteine to methionine), vital for erythropoiesis and fetal neural tube closure.',
    dosingRegimens: [
      'Megaloblastic Anemia: 1 mg PO once daily until hematologic recovery (up to 5 mg daily in malabsorptive states)',
      'Neural Tube Defect Prophylaxis (Women of Childbearing Potential): 0.4 mg (400 mcg) PO once daily starting at least 1 month before conception and through first trimester',
      'High-Risk Neural Tube Defect Prevention (Prior Affected Child): 4 mg PO once daily starting 1 to 3 months preconception',
      'Methotrexate Toxicity Reduction (Rheumatoid Arthritis / Psoriasis): 1 mg PO once daily',
    ],
    sideEffects: {
      common: ['Bitter taste', 'Nausea', 'Flatulence', 'Bloating', 'Sleep disturbances'],
      severe: ['Masking of pernicious anemia (corrects megaloblastic anemia while irreversible subacute combined degeneration of the spinal cord progresses)', 'Anaphylactoid reactions (rare)', 'Seizure frequency exacerbation in epileptic patients'],
    },
    contraindications: [
      'Treatment of pernicious anemia or other megaloblastic anemias secondary to vitamin B12 deficiency (corrects hematology but allows irreversible paralysis and spinal cord degeneration to occur)',
      'Known hypersensitivity to folic acid',
    ],
    drugInteractions: {
      major: ['Anticonvulsants (phenytoin, fosphenytoin, phenobarbital - high-dose folic acid reduces anticonvulsant serum concentrations and lowers seizure threshold)'],
      common: ['Methotrexate (folic acid reverses low-dose methotrexate adverse effects; must avoid with high-dose oncology methotrexate)', 'Trimethoprim / Pyrimethamine (antifolate antibiotics interfere with folate metabolism)', 'Sulfasalazine (decreases intestinal folate absorption)'],
    },
    monitoringParameters: [
      'Serum vitamin B12 level MANDATORY prior to initiating high-dose folic acid to rule out concurrent B12 deficiency',
      'Complete blood count (CBC) with reticulocyte count, hemoglobin, and hematocrit',
      'Anticonvulsant drug concentrations in patients with seizure disorders',
    ],
    dosageForms: ['Oral Tablet: 0.4 mg (400 mcg), 0.8 mg (800 mcg), 1 mg', 'Intramuscular / Subcutaneous / Intravenous Injection: 5 mg/mL vial'],
    administrationAndCounseling: [
      'Take once daily with or without food.',
      'All women capable of becoming pregnant should consume 400 mcg of folic acid daily from fortified foods or supplements to prevent neural tube birth defects (spina bifida).',
      'If taking with methotrexate for arthritis, take folic acid daily as instructed by your rheumatologist.',
      'Ensure your doctor has checked your vitamin B12 level before taking high-dose prescription folic acid.',
    ],
  },

  Ibandronate: {
    genericName: 'Ibandronate',
    brandNames: ['Boniva'],
    pharmacologicClass: 'Nitrogen-Containing Bisphosphonate',
    therapeuticClass: 'Bisphosphonate',
    mechanismOfAction:
      'Third-generation nitrogenous bisphosphonate that binds avidly to hydroxyapatite crystals in mineralized bone matrix; internalized by osteoclasts during bone resorption, it selectively inhibits farnesyl pyrophosphate (FPP) synthase in the mevalonate pathway, preventing protein prenylation, disrupting the osteoclast cytoskeleton, and inducing osteoclast apoptosis.',
    dosingRegimens: [
      'Postmenopausal Osteoporosis Treatment and Prevention (Oral): 150 mg PO ONCE MONTHLY on the exact same date each month',
      'Postmenopausal Osteoporosis (Intravenous Injection): 3 mg IV bolus administered over 15 to 30 seconds once every 3 months by a healthcare provider',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Diarrhea', 'Nausea', 'Arthralgia', 'Myalgia', 'Headache', 'Acute phase flu-like symptoms (with IV injection)'],
      severe: ['Severe esophageal adverse reactions (esophagitis, esophageal ulcers, erosions, bleeding, and stricture)', 'Osteonecrosis of the jaw (ONJ)', 'Atypical subtrochanteric and diaphyseal femoral fractures', 'Severe, incapacitating bone, joint, and muscle pain', 'Severe hypocalcemia'],
    },
    contraindications: [
      'Abnormalities of the esophagus that delay esophageal emptying (stricture, achalasia)',
      'Inability to stand or sit upright for at least 60 minutes',
      'Uncorrected hypocalcemia',
      'Severe renal impairment (serum creatinine > 2.3 mg/dL or CrCl < 30 mL/min)',
      'Known hypersensitivity to ibandronate',
    ],
    drugInteractions: {
      major: ['Oral calcium, iron, magnesium, aluminum antacids, and mineral supplements (divalent cations drastically chelate ibandronate, eliminating absorption; take at least 60 minutes after oral dose)'],
      common: ['Aspirin and NSAIDs (increased risk of gastric and upper gastrointestinal mucosal ulceration)'],
    },
    monitoringParameters: [
      'Serum calcium, phosphorus, and magnesium levels before each dose',
      'Renal function (BUN, serum creatinine, CrCl prior to each IV injection)',
      'Bone mineral density (DEXA scan) at baseline and every 1 to 2 years',
      'Oral health and dental examination prior to initiation',
      'Evaluation of new thigh or groin pain (screen for atypical femur fractures)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 150 mg', 'Intravenous Injection Solution: 3 mg/3 mL prefilled syringe'],
    administrationAndCounseling: [
      'CRITICAL: Take once monthly in the morning upon first arising with a full 6 to 8 ounce glass of plain tap water only (no mineral water, juice, coffee, or tea).',
      'Do NOT lie down; remain completely upright (standing, walking, or sitting upright) for at least 60 minutes after taking to prevent severe esophageal ulceration.',
      'Wait at least 60 minutes before eating breakfast or drinking any beverage other than plain water.',
      'Do not chew, suck, or crush the tablet; swallow whole.',
      'Stop taking and notify your doctor immediately if you develop difficulty or pain when swallowing, retrosternal chest pain, or new heartburn.',
    ],
  },

  'Zoledronic Acid': {
    genericName: 'Zoledronic Acid',
    brandNames: ['Reclast', 'Zometa'],
    pharmacologicClass: 'Nitrogen-Containing Bisphosphonate',
    therapeuticClass: 'Bisphosphonate',
    mechanismOfAction:
      'Highly potent nitrogen-containing heterocyclic bisphosphonate with two nitrogen atoms that exhibits extreme affinity for hydroxyapatite in resorbing bone, potently inhibiting farnesyl pyrophosphate (FPP) synthase to block osteoclast-mediated bone breakdown and lower hypercalcemia of malignancy.',
    dosingRegimens: [
      'Postmenopausal Osteoporosis / Male Osteoporosis Treatment (Reclast): 5 mg IV infusion administered over not less than 15 minutes once every 12 months (once yearly)',
      'Osteoporosis Prevention (Reclast): 5 mg IV infusion once every 2 years',
      'Paget Disease of Bone (Reclast): 5 mg IV single infusion',
      'Hypercalcemia of Malignancy (Zometa): 4 mg IV infusion over at least 15 minutes as a single dose (may re-treat after 7 days if needed)',
      'Multiple Myeloma / Bone Metastases (Zometa): 4 mg IV infusion over at least 15 minutes once every 3 to 4 weeks (dose adjust for baseline CrCl 30-60 mL/min)',
    ],
    sideEffects: {
      common: ['Acute phase reaction (fever, chills, myalgias, arthralgias, bone pain, headache within 3 days post-infusion)', 'Nausea', 'Fatigue', 'Vomiting', 'Anemia'],
      severe: ['Severe acute renal impairment and acute tubular necrosis / renal failure', 'Severe hypocalcemia and hypophosphatemia', 'Osteonecrosis of the jaw (ONJ; prominent in oncology dosing)', 'Atypical subtrochanteric and diaphyseal femur fractures', 'Atrial fibrillation (reported in trials)'],
    },
    contraindications: [
      'Severe renal impairment (CrCl < 35 mL/min for Reclast; serum creatinine >= 3.0 mg/dL or severe impairment for Zometa)',
      'Uncorrected hypocalcemia',
      'Pregnancy and nursing mothers',
      'Known hypersensitivity to zoledronic acid or other bisphosphonates',
    ],
    drugInteractions: {
      major: ['Nephrotoxic medications (aminoglycosides, loop diuretics, vancomycin, NSAIDs, cisplatin - dramatically elevated risk of acute renal failure)', 'Loop diuretics (additive profound hypocalcemia)'],
      common: ['Thalidomide / Lenalidomide (increased renal dysfunction in multiple myeloma patients)', 'Angiogenesis inhibitors (sunitinib, bevacizumab - increased ONJ risk)'],
    },
    monitoringParameters: [
      'Serum creatinine and calculated CrCl prior to EACH infusion (withhold dose if renal deterioration occurs)',
      'Serum calcium, electrolytes, phosphate, and magnesium prior to infusion',
      'Hydration status: Ensure patients are vigorously hydrated with fluids before and after infusion',
      'Routine dental exam and preventive dentistry prior to starting cancer doses',
      'Bone mineral density (DEXA scan) periodically',
    ],
    dosageForms: ['Intravenous Infusion Solution (Reclast): 5 mg/100 mL ready-to-infuse bottle', 'Intravenous Infusion Solution / Concentrate (Zometa): 4 mg/100 mL premixed bag, 4 mg/5 mL vial'],
    administrationAndCounseling: [
      'Must be administered as an intravenous infusion over NOT LESS than 15 minutes using a constant-rate infusion pump; never give as a rapid bolus.',
      'Drink at least 2 glasses of water before and after the infusion to ensure proper hydration.',
      'Acetaminophen or ibuprofen taken shortly after the infusion helps prevent or lessen the flu-like symptoms (fever, chills, muscle aches) that often occur during the first 3 days.',
      'Take daily calcium (1,200 mg/day) and vitamin D (800 to 1,000 IU/day) supplements.',
      'Maintain good dental hygiene and complete necessary dental work prior to infusion.',
    ],
  },

  Risedronate: {
    genericName: 'Risedronate',
    brandNames: ['Actonel'],
    pharmacologicClass: 'Nitrogen-Containing Bisphosphonate',
    therapeuticClass: 'Bisphosphonate',
    mechanismOfAction:
      'Pyridinyl nitrogen-containing bisphosphonate that binds to hydroxyapatite crystals in bone, inhibiting farnesyl pyrophosphate (FPP) synthase within osteoclasts to block osteoclast ruffle border formation, cell adhesion, and resorptive acid secretion, thereby increasing bone mineral density and reducing vertebral and non-vertebral fracture rates.',
    dosingRegimens: [
      'Postmenopausal Osteoporosis Treatment and Prevention: 5 mg PO once daily, OR 35 mg PO ONCE WEEKLY, OR 150 mg PO ONCE MONTHLY',
      'Male Osteoporosis / Glucocorticoid-Induced Osteoporosis: 5 mg PO once daily or 35 mg PO once weekly',
      'Paget Disease: 30 mg PO once daily for 2 months',
      'Delayed-Release Formulation (Atelvia): 35 mg PO once weekly taken immediately AFTER breakfast',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Nausea', 'Diarrhea', 'Constipation', 'Arthralgia', 'Back pain', 'Headache'],
      severe: ['Severe esophageal ulceration, esophagitis, and stricture', 'Osteonecrosis of the jaw (ONJ)', 'Atypical femoral fractures', 'Severe hypocalcemia', 'Severe musculoskeletal pain'],
    },
    contraindications: [
      'Esophageal abnormalities delaying emptying (stricture, achalasia)',
      'Inability to stand or sit upright for at least 30 minutes',
      'Hypocalcemia',
      'Severe renal impairment (CrCl < 30 mL/min)',
      'Hypersensitivity to risedronate',
    ],
    drugInteractions: {
      major: ['Calcium, iron, antacids, and mineral supplements (chelate risedronate; separate by at least 30 to 60 minutes)'],
      common: ['NSAIDs and aspirin (additive gastrointestinal mucosal irritation)', 'H2 blockers and proton pump inhibitors (may alter Atelvia delayed-release dissolution)'],
    },
    monitoringParameters: [
      'Serum calcium and 25-hydroxyvitamin D prior to starting therapy',
      'Renal function (BUN, serum creatinine, CrCl)',
      'Bone mineral density (DEXA scan) every 1 to 2 years',
      'Screening for new dysphagia, retrosternal chest pain, or severe heartburn',
    ],
    dosageForms: ['Oral Film-Coated Tablet (Actonel): 5 mg, 30 mg, 35 mg, 150 mg', 'Oral Delayed-Release Tablet (Atelvia): 35 mg'],
    administrationAndCounseling: [
      'For immediate-release (Actonel): Take in the morning upon arising with a full glass (6 to 8 oz) of plain water at least 30 minutes before any food, beverage, or other medication.',
      'Stay completely upright (do not lie down) for at least 30 minutes after taking Actonel.',
      'For delayed-release (Atelvia): Take once weekly in the morning immediately AFTER breakfast with 4 oz of plain water, remaining upright for 30 minutes.',
      'Swallow tablets whole; do not chew or suck on tablets.',
      'Report any pain or difficulty swallowing, chest pain, or thigh/groin pain immediately.',
    ],
  },

  Alendronate: {
    genericName: 'Alendronate',
    brandNames: ['Fosamax', 'Binosto'],
    pharmacologicClass: 'Nitrogen-Containing Bisphosphonate',
    therapeuticClass: 'Bisphosphonate',
    mechanismOfAction:
      'Aminobisphosphonate that selectively localizes to sites of active bone resorption where it is endocytosed by osteoclasts; potently inhibits farnesyl pyrophosphate (FPP) synthase in the cholesterol mevalonate pathway, preventing geranylgeranylation of small GTPases (Rho, Rac, Rab), causing loss of osteoclast ruffled border structure and inducing apoptosis.',
    dosingRegimens: [
      'Postmenopausal Osteoporosis Treatment: 70 mg PO ONCE WEEKLY (or 10 mg PO once daily in morning)',
      'Postmenopausal Osteoporosis Prevention: 35 mg PO ONCE WEEKLY (or 5 mg PO once daily)',
      'Male Osteoporosis Treatment: 70 mg PO once weekly (or 10 mg PO once daily)',
      'Glucocorticoid-Induced Osteoporosis: 5 mg PO once daily (10 mg daily in postmenopausal women not on estrogen)',
      'Paget Disease of Bone: 40 mg PO once daily for 6 months',
    ],
    sideEffects: {
      common: ['Abdominal pain', 'Dyspepsia', 'Acid regurgitation', 'Constipation', 'Diarrhea', 'Flatulence', 'Musculoskeletal pain', 'Headache'],
      severe: ['Severe esophageal injury (erosive esophagitis, esophageal ulcers, strictures, perforation, bleeding)', 'Osteonecrosis of the jaw (ONJ)', 'Atypical subtrochanteric and diaphyseal femur fractures', 'Hypocalcemia', 'Severe incapacitating bone, joint, and muscle pain'],
    },
    contraindications: [
      'Abnormalities of the esophagus that delay emptying, such as stricture or achalasia',
      'Inability to stand or sit upright for at least 30 minutes',
      'Uncorrected hypocalcemia',
      'Severe renal impairment (CrCl < 35 mL/min)',
      'Known hypersensitivity to alendronate',
    ],
    drugInteractions: {
      major: ['Oral calcium, iron, antacids, and multivalent cations (completely abolish alendronate absorption; separate by at least 30 minutes)'],
      common: ['Aspirin and NSAIDs (increased risk of upper gastrointestinal adverse events / peptic ulcers)', 'Ranitidine and PPIs (increase alendronate bioavailability twofold)'],
    },
    monitoringParameters: [
      'Serum calcium and vitamin D levels prior to initiating treatment (correct hypocalcemia first)',
      'Bone mineral density (DEXA scan of lumbar spine and hip) at baseline and every 1 to 2 years',
      'Renal function (BUN, serum creatinine, CrCl)',
      'Clinical symptoms of esophageal irritation (dysphagia, retrosternal pain, new/worsening heartburn)',
      'Oral health and dental history',
    ],
    dosageForms: ['Oral Tablet: 5 mg, 10 mg, 35 mg, 40 mg, 70 mg', 'Oral Effervescent Tablet (Binosto): 70 mg', 'Oral Solution: 70 mg/75 mL'],
    administrationAndCounseling: [
      'CRITICAL: Take upon waking with a full 6 to 8 ounce glass of plain tap water only (no mineral water, juice, milk, or coffee).',
      'Remain completely upright (sitting, standing, or walking) for at least 30 minutes after taking; do NOT lie down until after eating breakfast.',
      'Wait at least 30 minutes before eating breakfast or drinking any beverage other than water.',
      'Swallow tablets whole; do not chew, crush, or suck on tablets as mouth ulcers will occur.',
      'For effervescent tablet (Binosto): Dissolve tablet in 4 oz room-temperature plain water; wait 5 minutes until bubbling stops, stir for 10 seconds, and drink.',
      'Stop taking alendronate and contact your doctor immediately if you develop difficulty or pain upon swallowing, chest pain, or new heartburn.',
    ],
  },

  Varenicline: {
    genericName: 'Varenicline',
    brandNames: ['Chantix'],
    pharmacologicClass: 'Alpha-4 Beta-2 Nicotinic Receptor Partial Agonist',
    therapeuticClass: 'Nicotinic Receptor Partial Agonist',
    mechanismOfAction:
      'High-affinity partial agonist at alpha-4 beta-2 neuronal nicotinic acetylcholine receptors in the mesolimbic dopamine pathway; its partial agonist activity stimulates low-level dopamine release to relieve nicotine cravings and withdrawal symptoms, while simultaneously blocking the binding of inhaled nicotine to blunt the rewarding euphoric effects of smoking.',
    dosingRegimens: [
      'Smoking Cessation: Days 1 to 3: 0.5 mg PO once daily in morning; Days 4 to 7: 0.5 mg PO twice daily; Day 8 onwards: 1 mg PO twice daily for 12 weeks (patient sets quit date 1 to 2 weeks after starting; may treat for additional 12 weeks if successful)',
    ],
    sideEffects: {
      common: ['Nausea (very common, ~30%, dose-dependent)', 'Abnormal, vivid, or unusual dreams', 'Insomnia', 'Headache', 'Flatulence', 'Dyspepsia', 'Vomiting', 'Constipation'],
      severe: ['Serious neuropsychiatric events (depression, suicidal ideation, suicide attempt, agitation, psychosis)', 'Cardiovascular events (angina, myocardial infarction, stroke in patients with pre-existing CVD)', 'Somnambulism / sleepwalking and complex behaviors', 'Seizures', 'Severe cutaneous reactions (Stevens-Johnson syndrome, erythema multiforme)'],
    },
    contraindications: [
      'Known hypersensitivity or history of serious skin reactions to varenicline',
    ],
    drugInteractions: {
      major: ['Alcohol (varenicline may increase the intoxicating effects of alcohol, causing unusual aggression and amnesia; limit alcohol consumption)'],
      common: ['Nicotine replacement therapy (NRT - coadministration produces higher rates of nausea, headache, vomiting, and dizziness; not routinely recommended)', 'Cimetidine (reduces renal clearance of varenicline by 24%)', 'Theophylline, warfarin, insulin (smoking cessation itself induces physiological changes altering their clearance)'],
    },
    monitoringParameters: [
      'Neuropsychiatric symptoms (mood swings, agitation, depression, suicidal thoughts) at every visit',
      'Cardiovascular symptoms in patients with established cardiovascular disease',
      'Smoking status and quit success',
      'Renal function (dosage reduction to 0.5 mg twice daily if CrCl < 30 mL/min)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 0.5 mg (white), 1 mg (light blue)', 'Starting Month Pack (Dose-Pack): Eleven 0.5 mg tablets and forty-two 1 mg tablets'],
    administrationAndCounseling: [
      'Take after eating with a full 8-ounce glass of water to minimize nausea.',
      'Set a quit date 1 to 2 weeks after starting the medication; you may continue smoking during the first week of therapy as drug levels build.',
      'Take the evening dose with dinner rather than right at bedtime to reduce vivid dreams and insomnia.',
      'Stop taking varenicline and call your doctor immediately if you experience agitation, hostility, depressed mood, or thoughts of self-harm.',
      'Use caution when driving or operating machinery until you know how this medication affects you.',
    ],
  },

  Eszopiclone: {
    genericName: 'Eszopiclone',
    brandNames: ['Lunesta'],
    pharmacologicClass: 'GABA-A Receptor Positive Allosteric Modulator (Cyclopyrrolone)',
    therapeuticClass: 'Non-Benzodiazepine Hypnotic',
    mechanismOfAction:
      'S-enantiomer of zopiclone; a non-benzodiazepine cyclopyrrolone hypnotic that binds selectively to allosteric sites on pentameric GABA-A receptor complexes close to or coupled with the benzodiazepine receptor, enhancing GABA inhibitory activity to promote sleep maintenance and reduce sleep latency.',
    dosingRegimens: [
      'Insomnia: Initial 1 mg PO once daily immediately before bedtime (may increase to 2 to 3 mg at bedtime if clinically indicated; max 2 mg in elderly or severe hepatic/renal impairment)',
    ],
    sideEffects: {
      common: ['Dysgeusia (unpleasant metallic or bitter taste, very common)', 'Headache', 'Somnolence', 'Dizziness', 'Dry mouth', 'Nausea', 'Dyspepsia'],
      severe: ['Complex sleep behaviors (sleepwalking, sleep-driving, preparing food, making phone calls while not fully awake with subsequent amnesia)', 'Central nervous system depression and next-day psychomotor impairment', 'Abuse, misuse, and physical dependence (DEA Schedule IV)', 'Severe anaphylaxis and angioedema', 'Worsening depression and suicidal ideation'],
    },
    contraindications: [
      'History of complex sleep behaviors after taking eszopiclone or other non-benzodiazepine hypnotics',
      'Known hypersensitivity to eszopiclone',
    ],
    drugInteractions: {
      major: ['CNS depressants and opioids (profound sedation, respiratory depression, coma, and death)', 'Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - significantly increase eszopiclone exposure; initial dose should not exceed 1 mg)', 'Strong CYP3A4 inducers (rifampin, carbamazepine, St. John\'s wort - dramatically reduce efficacy)'],
      common: ['Alcohol (substantially amplifies psychomotor impairment and amnesia; do not drink alcohol with eszopiclone)'],
    },
    monitoringParameters: [
      'Sleep latency, nocturnal awakenings, and total sleep duration',
      'Next-day daytime alertness, motor coordination, and cognitive performance',
      'Emergence of complex sleep behaviors or memory blackouts',
      'Assessment of misuse, dependence, and depression/suicidality',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 1 mg, 2 mg, 3 mg'],
    blackBoxWarning:
      'WARNING: COMPLEX SLEEP BEHAVIORS: Complex sleep behaviors including sleepwalking, sleep-driving, and engaging in other activities while not fully awake may occur following use of eszopiclone. Some of these events may result in serious injuries, including death. Discontinue eszopiclone immediately if a patient experiences a complex sleep behavior.',
    administrationAndCounseling: [
      'Take immediately before getting into bed, only when you have at least 7 to 8 hours dedicated to sleeping before needing to be active.',
      'Do not take with or immediately after a high-fat or heavy meal, as this delays absorption and reduces efficacy.',
      'Never consume alcohol or take sedating medications while using eszopiclone.',
      'A temporary bitter or metallic taste in the mouth is very common.',
      'Stop taking eszopiclone immediately and contact your doctor if you find out you engaged in activities (walking, driving, eating) while asleep.',
    ],
  },

  Zolpidem: {
    genericName: 'Zolpidem',
    brandNames: ['Ambien', 'Ambien CR', 'Edluar', 'Intermezzo', 'Zolpimist'],
    pharmacologicClass: 'GABA-A Receptor Positive Allosteric Modulator (Imidazopyridine)',
    therapeuticClass: 'Non-Benzodiazepine Hypnotic',
    mechanismOfAction:
      'Imidazopyridine hypnotic that binds selectively with high affinity to the alpha-1 subunit-containing GABA-A receptor subtype (omega-1 receptor) in the brain, facilitating GABA-mediated chloride conductance, hyperpolarizing neuronal membranes, and rapidly inducing sleep with minimal anxiolytic or muscle-relaxing effects.',
    dosingRegimens: [
      'Insomnia (Immediate-Release Ambien): Initial 5 mg PO for women and 5 to 10 mg PO for men once daily immediately before bedtime (max 10 mg at bedtime; 5 mg in elderly/hepatic impairment)',
      'Insomnia (Extended-Release Ambien CR): Initial 6.25 mg for women and 6.25 to 12.5 mg for men PO once daily immediately before bedtime',
      'Middle-of-the-Night Awakening (Intermezzo Sublingual): 1.75 mg for women, 3.5 mg for men sublingually; only if at least 4 hours of bedtime remain',
    ],
    sideEffects: {
      common: ['Drowsiness / daytime somnolence', 'Dizziness', 'Headache', 'Diarrhea', 'Nausea', 'Grogginess / lethargy', 'Ataxia'],
      severe: ['Complex sleep behaviors (sleep-driving, sleep-eating, sleepwalking without memory of event)', 'Severe respiratory depression (especially when coadministered with opioids or in sleep apnea)', 'Next-morning driving impairment', 'Abuse, addiction, and physical dependence (Schedule IV)', 'Severe rebound insomnia upon abrupt withdrawal', 'Depression and suicidal thoughts'],
    },
    contraindications: [
      'History of complex sleep behaviors after taking zolpidem or other sedative-hypnotics',
      'Known hypersensitivity to zolpidem',
    ],
    drugInteractions: {
      major: ['Opioids and CNS depressants (black box warning for profound sedation, respiratory depression, coma, and death)', 'Strong CYP3A4 inducers (rifampin, St. John\'s wort - dramatically reduce zolpidem concentrations)'],
      common: ['Strong CYP3A4 inhibitors (ketoconazole - increase zolpidem levels)', 'Alcohol (extreme psychomotor impairment, anterograde amnesia, and dangerous sleep behaviors; avoid completely)', 'SSRIs (sertraline, fluoxetine - can increase hallucination risk)'],
    },
    monitoringParameters: [
      'Sleep induction latency and sleep maintenance',
      'Inquiry regarding complex sleep behaviors at each visit',
      'Next-day residual impairment, alertness, and driving safety',
      'Signs of misuse, dose escalation, or psychological dependence',
    ],
    dosageForms: [
      'Oral Tablet (Ambien): 5 mg, 10 mg',
      'Oral Extended-Release Tablet (Ambien CR): 6.25 mg, 12.5 mg',
      'Sublingual Tablet (Edluar): 5 mg, 10 mg',
      'Sublingual Tablet for Middle-of-Night (Intermezzo): 1.75 mg, 3.5 mg',
      'Oral Spray (Zolpimist): 5 mg/metered actuation',
    ],
    blackBoxWarning:
      'WARNING: COMPLEX SLEEP BEHAVIORS: Complex sleep behaviors including sleepwalking, sleep-driving, and engaging in other activities while not fully awake may occur following use of zolpidem. Some of these events may result in serious injuries, including death. Discontinue zolpidem immediately if a patient experiences a complex sleep behavior.',
    administrationAndCounseling: [
      'Take immediately before getting into bed on an empty stomach; taking with food delays the onset of sleep.',
      'Dedicate at least 7 to 8 hours to uninterrupted sleep before taking (at least 4 hours for low-dose Intermezzo).',
      'Swallow extended-release tablets whole; do not chew, crush, or divide.',
      'NEVER drink alcohol or take narcotic medications while taking zolpidem.',
      'Stop taking zolpidem immediately and call your doctor if you ever perform any activities while asleep (such as driving, making calls, cooking, or walking).',
    ],
  },

  Sumatriptan: {
    genericName: 'Sumatriptan',
    brandNames: ['Imitrex', 'Imitrex Statdose', 'Alsuma'],
    pharmacologicClass: 'Serotonin 5-HT1B/1D Receptor Agonist',
    therapeuticClass: 'Triptan',
    mechanismOfAction:
      'Selective agonist for vascular serotonin 5-HT1B and neuronal 5-HT1D receptors on intracranial blood vessels and trigeminal sensory nerve endings, causing selective vasoconstriction of painfully dilated meningeal and dural arteries and inhibiting the release of pro-inflammatory calcitonin gene-related peptide (CGRP) and neurogenic dural inflammation.',
    dosingRegimens: [
      'Acute Migraine (Oral): 25 mg, 50 mg, or 100 mg PO single dose at migraine onset; if migraine returns or only partially relieves, may repeat once after 2 hours (max 200 mg in 24 hours)',
      'Acute Migraine (Subcutaneous Injection): 4 to 6 mg SC single dose; if needed, may repeat once after at least 1 hour (max 12 mg in 24 hours)',
      'Cluster Headache (Subcutaneous): 6 mg SC single dose',
      'Acute Migraine (Nasal Spray / Powder): 5, 10, or 20 mg intranasally into one nostril; may repeat after 2 hours (max 40 mg/day)',
    ],
    sideEffects: {
      common: ['Triptan sensations (chest, jaw, or neck tightness / pressure / tingling)', 'Dizziness', 'Flushing', 'Warm or hot sensation', 'Paresthesia', 'Nausea', 'Injection site pain'],
      severe: ['Coronary artery vasospasm, acute myocardial infarction, and cardiac arrest', 'Life-threatening ventricular arrhythmias', 'Cerebrovascular accident (ischemic stroke) and intracranial hemorrhage', 'Peripheral vascular ischemia and colonic ischemia', 'Serotonin syndrome (with SSRIs/SNRIs)', 'Medication overuse headache (with frequent use >= 10 days/month)'],
    },
    contraindications: [
      'Ischemic coronary artery disease (CAD, prior MI, angina pectoris)',
      'Coronary artery vasospasm (Prinzmetal angina)',
      'History of stroke, transient ischemic attack (TIA), or hemiplegic/basilar migraine',
      'Peripheral vascular disease or ischemic bowel disease',
      'Uncontrolled hypertension',
      'Concomitant use of ergot-containing medications or another triptan within 24 hours',
      'Concurrent administration of monoamine oxidase A (MAO-A) inhibitors or within 2 weeks of discontinuation',
      'Severe hepatic impairment',
    ],
    drugInteractions: {
      major: ['Ergot alkaloids (dihydroergotamine, ergotamine - additive prolonged vasospasm; separate by at least 24 hours)', 'MAO-A inhibitors (phenelzine, tranylcypromine - significantly reduce sumatriptan clearance; contraindicated within 2 weeks)', 'Other triptans (separate by 24 hours)'],
      common: ['SSRIs and SNRIs (risk of serotonin syndrome; monitor for hyperreflexia, tremor, clonus, autonomic instability)'],
    },
    monitoringParameters: [
      'Frequency, severity, and duration of migraine attacks',
      'Blood pressure and cardiovascular assessment (consider initial dose under medical supervision with ECG in patients with cardiovascular risk factors)',
      'Signs of serotonin syndrome',
      'Frequency of sumatriptan use (screen for medication-overuse headache)',
    ],
    dosageForms: [
      'Oral Film-Coated Tablet: 25 mg, 50 mg, 100 mg',
      'Subcutaneous Injection Autoinjector / Syringe (Statdose): 4 mg/0.5 mL, 6 mg/0.5 mL',
      'Nasal Spray: 5 mg, 20 mg/actuation',
      'Nasal Powder Breath-Powered System (Onzetra Xsail): 11 mg per nosepiece',
    ],
    administrationAndCounseling: [
      'Take at the first onset of migraine pain; sumatriptan is an acute migraine treatment, NOT a daily preventive medication.',
      'If migraine pain returns, a second oral dose may be taken after at least 2 hours (or after 1 hour for injections).',
      'A feeling of tightness, tingling, heaviness, or pressure in the chest, throat, or neck is common and usually benign, but seek emergency care if pain is severe or spreads down the left arm.',
      'Do not use for more than 10 days per month to avoid rebound "medication overuse headaches."',
      'Never take within 24 hours of other triptans or ergotamine medications.',
    ],
  },

  Eletriptan: {
    genericName: 'Eletriptan',
    brandNames: ['Relpax'],
    pharmacologicClass: 'Serotonin 5-HT1B/1D Receptor Agonist',
    therapeuticClass: 'Triptan',
    mechanismOfAction:
      'High-affinity selective agonist at human serotonin 5-HT1B and 5-HT1D receptors on cerebral and dural blood vessels, inducing vasoconstriction of engorged cranial vessels and activating presynaptic trigeminal 5-HT1D receptors to block neurogenic calcitonin gene-related peptide (CGRP) exocytosis.',
    dosingRegimens: [
      'Acute Migraine with or without Aura: 20 mg or 40 mg PO single dose at onset; if headache returns, may repeat dose after >= 2 hours (max single dose 40 mg; max daily dose 80 mg in 24 hours)',
    ],
    sideEffects: {
      common: ['Dizziness', 'Somnolence', 'Nausea', 'Paresthesia', 'Asthenia', 'Chest/throat/jaw tightness or pressure', 'Dry mouth'],
      severe: ['Coronary vasospasm, myocardial infarction, and ventricular arrhythmias', 'Ischemic stroke and cerebral hemorrhage', 'Peripheral vascular and mesenteric ischemia', 'Hypertensive crisis', 'Serotonin syndrome', 'Medication-overuse headache'],
    },
    contraindications: [
      'Ischemic heart disease, coronary artery vasospasm, or history of MI',
      'History of stroke, TIA, or hemiplegic/basilar migraine',
      'Peripheral vascular disease',
      'Uncontrolled hypertension',
      'Concomitant administration of potent CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin) or within 72 hours of treatment',
      'Use of ergot derivatives or other triptans within 24 hours',
    ],
    drugInteractions: {
      major: ['Potent CYP3A4 inhibitors (ketoconazole, clarithromycin, ritonavir - increase eletriptan AUC by ~3-fold; do not use eletriptan within 72 hours of strong CYP3A4 inhibitors)', 'Ergot-containing medications (separate by 24 hours)', 'Other 5-HT1 agonists (separate by 24 hours)'],
      common: ['SSRIs and SNRIs (risk of serotonin syndrome)'],
    },
    monitoringParameters: [
      'Migraine frequency, response rate, and pain relief',
      'Cardiovascular evaluation and blood pressure',
      'Screening for overuse and monthly consumption (> 10 days/month)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 20 mg, 40 mg'],
    administrationAndCounseling: [
      'Take with liquids at the first sign of migraine headache; may be taken with or without food.',
      'If headache returns after initial relief, a second tablet may be taken after at least 2 hours; do not exceed 80 mg in 24 hours.',
      'DO NOT take if you have taken ketoconazole, itraconazole, clarithromycin, or ritonavir within the last 72 hours.',
      'Do not use on more than 10 days per month.',
      'Seek emergency medical care if you experience chest heaviness radiating to the neck or arm.',
    ],
  },

  Rizatriptan: {
    genericName: 'Rizatriptan',
    brandNames: ['Maxalt'],
    pharmacologicClass: 'Serotonin 5-HT1B/1D Receptor Agonist',
    therapeuticClass: 'Triptan',
    mechanismOfAction:
      'Selective agonist with high affinity for 5-HT1B and 5-HT1D receptors in cranial blood vessels and trigeminal nerve terminals, causing constriction of dilated extracerebral intracranial arteries and inhibiting pro-inflammatory neuropeptide release to terminate acute migraine pathophysiology.',
    dosingRegimens: [
      'Acute Migraine (Adults): 5 mg or 10 mg PO single dose at onset; may repeat once after at least 2 hours if headache recurs (max 30 mg in 24 hours; max 15 mg in 24 hours if taking propranolol, using 5 mg single doses)',
      'Acute Migraine (Pediatric 6 to 17 years): Weight < 40 kg: 5 mg PO single dose; weight >= 40 kg: 10 mg PO single dose (do not exceed 1 dose in 24 hours in pediatrics)',
    ],
    sideEffects: {
      common: ['Dizziness', 'Somnolence', 'Fatigue', 'Paresthesia', 'Nausea', 'Dry mouth', 'Chest or throat pressure / tightness'],
      severe: ['Coronary vasospasm, myocardial infarction, and cardiac arrest', 'Stroke and intracranial hemorrhage', 'Severe gastrointestinal / splenic ischemia', 'Serotonin syndrome', 'Hypertensive crisis'],
    },
    contraindications: [
      'Ischemic heart disease, coronary vasospasm, or prior myocardial infarction',
      'History of stroke, TIA, or hemiplegic migraine',
      'Peripheral vascular disease',
      'Uncontrolled hypertension',
      'Concurrent administration of MAO-A inhibitors or within 2 weeks of discontinuation',
      'Use of ergotamines or another triptan within 24 hours',
    ],
    drugInteractions: {
      major: ['Propranolol (propranolol inhibits rizatriptan metabolism, increasing rizatriptan AUC by 70%; limit single rizatriptan dose to 5 mg, max 15 mg/day)', 'MAO-A inhibitors (contraindicated within 14 days due to dramatic increase in rizatriptan levels)', 'Ergotamine derivatives (separate by 24 hours)'],
      common: ['SSRIs and SNRIs (risk of serotonin syndrome)'],
    },
    monitoringParameters: [
      'Migraine frequency, intensity, and response to therapy',
      'Blood pressure and cardiovascular screening in patients with risk factors',
      'Frequency of triptan consumption per month',
      'Signs of serotonin toxicity',
    ],
    dosageForms: ['Oral Tablet: 5 mg, 10 mg', 'Orally Disintegrating Tablet (Maxalt-MLT): 5 mg, 10 mg (contains aspartame / phenylalanine)'],
    administrationAndCounseling: [
      'Take at the first onset of migraine pain with or without food.',
      'For orally disintegrating tablets (Maxalt-MLT): Open blister pack with dry hands, place tablet on tongue, allow to dissolve, and swallow with saliva; no liquid is necessary.',
      'Maxalt-MLT contains aspartame and should not be used by patients with phenylketonuria (PKU).',
      'If you take propranolol, tell your doctor; your rizatriptan dose must be lowered to 5 mg.',
      'Do not exceed 30 mg (or 15 mg if on propranolol) in any 24-hour period.',
    ],
  },

  'Triamcinolone Topical': {
    genericName: 'Triamcinolone Topical',
    brandNames: ['Kenalog', 'Aristocort'],
    pharmacologicClass: 'Medium-to-High Potency Topical Corticosteroid',
    therapeuticClass: 'Topical Corticosteroid',
    mechanismOfAction:
      'Fluorinated synthetic corticosteroid that binds to cytoplasmic glucocorticoid receptors, inhibiting phospholipase A2 via lipocortin induction, blocking arachidonic acid liberation, and suppressing transcription of inflammatory cytokines to deliver local anti-inflammatory, antipruritic, and vasoconstrictive effects on dermatologic lesions.',
    dosingRegimens: [
      'Inflammatory and Pruritic Dermatoses: Apply a thin film to the affected skin areas 2 to 4 times daily (typically twice daily); rub in gently',
      'Dental Paste (Oral Mucosal Lesions / Aphthous Ulcers): Apply a small dab to oral lesion at bedtime (or 2-3 times daily after meals) without rubbing until a smooth film forms',
    ],
    sideEffects: {
      common: ['Local skin burning / stinging', 'Pruritus', 'Dry skin', 'Irritation', 'Folliculitis'],
      severe: ['Cutaneous atrophy (skin thinning), telangiectasias, and striae (stretch marks)', 'Systemic absorption leading to HPA axis suppression and Cushing syndrome (with high-potency occlusive use)', 'Secondary cutaneous bacterial/fungal infections', 'Allergic contact dermatitis', 'Ocular hypertension and glaucoma (if applied near eyes)'],
    },
    contraindications: [
      'Known hypersensitivity to triamcinolone acetonide or formulation vehicles',
      'Primary untreated cutaneous viral (herpes simplex, varicella), fungal, or bacterial infections',
    ],
    drugInteractions: {
      major: ['No significant cytochrome P450 drug interactions with proper topical application'],
      common: ['Other topical corticosteroids (additive systemic absorption and cutaneous atrophy)'],
    },
    monitoringParameters: [
      'Improvement in erythema, induration, scaling, and pruritus',
      'Inspection of treated skin for cutaneous atrophy, striae, and hypopigmentation',
      'HPA axis suppression (morning cortisol, cosyntropin stimulation test) if used over large body surface areas or under occlusion in children',
    ],
    dosageForms: ['Topical Cream: 0.025%, 0.1%, 0.5%', 'Topical Ointment: 0.025%, 0.1%, 0.5%', 'Topical Lotion: 0.025%, 0.1%', 'Topical Aerosol Spray: 0.147 mg/g (Kenalog spray)', 'Oral Dental Paste: 0.1%'],
    administrationAndCounseling: [
      'Apply sparingly in a thin film only to the affected skin areas; wash hands thoroughly after application unless treating hands.',
      'Do NOT bandage, wrap, or cover the treated area with an occlusive dressing unless explicitly directed by your physician.',
      'Do not use on the face, groin, or axillae (underarms) for more than a few days due to increased risk of permanent skin thinning.',
      'For dental paste: Dab a small amount onto the mouth sore until it forms a smooth film; do NOT rub in, as rubbing makes it crumble.',
      'Avoid getting in or near the eyes.',
    ],
  },

  'Hydrocortisone Topical': {
    genericName: 'Hydrocortisone Topical',
    brandNames: ['Westcort', 'Locoid', 'Ala-Cort'],
    pharmacologicClass: 'Low Potency Topical Corticosteroid',
    therapeuticClass: 'Topical Corticosteroid',
    mechanismOfAction:
      'Naturally occurring low-potency (Class 7) glucocorticoid that binds to glucocorticoid receptors in epidermal and dermal cells, suppressing leukocyte migration, reversing capillary permeability, and inhibiting synthesis of prostaglandins and leukotrienes to soothe cutaneous inflammation, eczema, and pruritus.',
    dosingRegimens: [
      'Dermatitis, Eczema, Insect Bites, Pruritus: Apply sparingly to affected skin areas 2 to 4 times daily as needed; rub in gently (OTC: up to 1% strength; prescription: up to 2.5% strength)',
      'Rectal / Hemorrhoidal Inflammation (Suppository / Cream): Apply cream topically or insert 1 suppository (25-30 mg) rectally twice daily (morning and evening)',
    ],
    sideEffects: {
      common: ['Mild local burning or stinging', 'Dry skin', 'Pruritus', 'Erythema'],
      severe: ['Cutaneous atrophy and striae (rare with low-potency, but possible with chronic use)', 'Systemic absorption leading to HPA axis suppression (especially in infants and young children)', 'Secondary skin infection'],
    },
    contraindications: [
      'Hypersensitivity to hydrocortisone or vehicle excipients',
      'Untreated fungal, tubercular, or viral skin lesions',
    ],
    drugInteractions: {
      major: ['No significant pharmacokinetic interactions with topical low-potency use'],
      common: ['Concomitant topical agents'],
    },
    monitoringParameters: [
      'Resolution of dermatitis, erythema, and itch',
      'Skin integrity and signs of secondary infection',
      'Duration of therapy (reevaluate if no improvement after 7 days of OTC use)',
    ],
    dosageForms: ['Topical Cream: 0.5%, 1%, 2.5%', 'Topical Ointment: 0.5%, 1%, 2.5%', 'Topical Lotion: 1%, 2.5%', 'Rectal Suppository: 25 mg, 30 mg'],
    administrationAndCounseling: [
      'Apply a small amount to clean, affected skin and gently rub in until absorbed.',
      'Suitable for short-term use on delicate skin areas such as the face, neck, and skin folds.',
      'Do not apply occlusive plastic wraps or tight diapers over treated skin.',
      'If symptoms do not improve within 7 days of over-the-counter use, discontinue and consult a healthcare provider.',
      'Avoid contact with the eyes.',
    ],
  },

  Isotretinoin: {
    genericName: 'Isotretinoin',
    brandNames: ['Absorica', 'Accutane', 'Amnesteem', 'Claravis', 'Myorisan'],
    pharmacologicClass: 'Systemic Retinoic Acid Derivative',
    therapeuticClass: 'Retinoid',
    mechanismOfAction:
      'Synthetic 13-cis-retinoic acid isomer that downregulates sebaceous gland size and suppresses sebaceous gland activity by up to 90%, inhibiting sebum production, altering sebum lipid composition, preventing follicular keratinocyte hypercornification, and reducing Propionibacterium acnes colonization and dermal inflammation.',
    dosingRegimens: [
      'Severe Recalcitrant Nodular Acne: Initial 0.5 mg/kg/day PO in 2 divided doses with meals for 1 month; titrate up to 1 mg/kg/day as tolerated until a cumulative total dose of 120 to 150 mg/kg is reached (typically a 15- to 20-week course)',
    ],
    sideEffects: {
      common: ['Cheilitis (chapped lips, occurs in ~90% of patients)', 'Dry skin (xerosis) and mucous membranes', 'Epistaxis (nosebleeds)', 'Dry eyes / blepharitis', 'Arthralgias and myalgias', 'Elevated serum triglycerides', 'Elevated hepatic transaminases', 'Mild alopecia'],
      severe: ['Severe life-threatening teratogenicity and major congenital malformations (craniofacial, cardiac, thymus, CNS defects)', 'Spontaneous abortion and fetal death', 'Pseudotumor cerebri (benign intracranial hypertension, especially with tetracyclines)', 'Severe psychiatric disorders (depression, psychosis, suicidal ideation and suicide attempts)', 'Severe pancreatitis (associated with extreme hypertriglyceridemia)', 'Inflammatory bowel disease (Crohn disease, ulcerative colitis)', 'Decreased night vision (nyctalopia)'],
    },
    contraindications: [
      'Pregnancy and females who may become pregnant (extremely high risk of major, severe congenital deformities and miscarriage)',
      'Known hypersensitivity to isotretinoin or parabens (preservative)',
      'Breastfeeding',
    ],
    drugInteractions: {
      major: ['Tetracyclines (doxycycline, minocycline - synergistic risk of pseudotumor cerebri / intracranial hypertension; absolute contraindication)', 'Vitamin A supplements (additive hypervitaminosis A toxicity; avoid high-dose vitamin A)', 'St. John\'s wort (diminishes oral contraceptive steroid levels, compromising pregnancy prevention)'],
      common: ['Progestin-only oral contraceptives (micro-dosed "minipill" may be inadequate contraception; not acceptable under iPLEDGE)'],
    },
    monitoringParameters: [
      'iPLEDGE REMS compliance: Mandatory two negative pregnancy tests prior to starting therapy, and monthly negative pregnancy tests before every refill for females of reproductive potential',
      'Fasting lipid panel (triglycerides, cholesterol) at baseline and monthly until stable',
      'Liver function tests (AST, ALT, alkaline phosphatase, bilirubin) at baseline and monthly',
      'Complete blood count (CBC) at baseline and periodically',
      'Psychiatric screening for depressive symptoms, mood alterations, and suicidal ideation at every monthly visit',
    ],
    dosageForms: ['Oral Soft Gelatin Capsule: 10 mg, 20 mg, 25 mg, 30 mg, 35 mg, 40 mg'],
    blackBoxWarning:
      'WARNING: SEVERE BIRTH DEFECTS (TERATOGENICITY): Isotretinoin must not be used by female patients who are or may become pregnant. There is an extremely high risk that severe birth defects will result if pregnancy occurs while taking isotretinoin in any amount, even for short periods. Potentially any exposed fetus can be affected. There are no accurate means of determining whether an exposed fetus has been affected. Because of its teratogenicity, isotretinoin is available only through a restricted distribution program called iPLEDGE. Two forms of effective contraception must be used simultaneously for at least 1 month before, during, and for 1 month after discontinuing therapy.',
    administrationAndCounseling: [
      'Take with meals containing dietary fat to ensure proper absorption (Absorica formulation may be taken without regard to meals).',
      'Swallow capsules whole with a full glass of water; do not suck, chew, or open capsules to avoid esophageal irritation.',
      'Strictly comply with the iPLEDGE program: Females of reproductive potential must use 2 separate effective methods of birth control simultaneously.',
      'Never donate blood during therapy and for at least 1 month after your final dose.',
      'Use liberal lip balms and moisturizers for dry skin and lips, and avoid laser skin resurfacing and waxing for at least 6 months post-treatment.',
      'Stop taking immediately and contact your doctor if you experience severe headaches, blurred vision, or depressive thoughts.',
    ],
  },

  Adapalene: {
    genericName: 'Adapalene',
    brandNames: ['Differin'],
    pharmacologicClass: 'Third-Generation Topical Retinoid',
    therapeuticClass: 'Retinoid',
    mechanismOfAction:
      'Chemically stable third-generation naphthoic acid derivative that selectively binds to nuclear retinoic acid receptor-beta (RAR-beta) and retinoic acid receptor-gamma (RAR-gamma) subtypes, modulating cellular differentiation, normalizing follicular epithelial desquamation, and reducing microcomedone formation and inflammatory acne lesions.',
    dosingRegimens: [
      'Acne Vulgaris (Adults and Children >= 12 years): Apply a thin film to the entire affected areas of the face and/or trunk once daily at bedtime after washing gently',
    ],
    sideEffects: {
      common: ['Erythema', 'Scaling / peeling', 'Dry skin', 'Stinging or burning sensation', 'Pruritus', 'Temporary acne flare during initial 2-3 weeks'],
      severe: ['Severe contact dermatitis', 'Severe photosensitivity / phototoxic sunburn', 'Hypersensitivity reactions / facial edema'],
    },
    contraindications: [
      'Known hypersensitivity to adapalene or vehicle formulation',
    ],
    drugInteractions: {
      major: ['No significant systemic pharmacokinetic interactions'],
      common: ['Topical drying agents (salicylic acid, sulfur, resorcinol, astringents, abrasive soaps - additive cutaneous irritation and excessive peeling)'],
    },
    monitoringParameters: [
      'Reduction in non-inflammatory comedones and inflammatory papules/pustules',
      'Cutaneous tolerability (erythema, dryness, desquamation)',
    ],
    dosageForms: ['Topical Gel: 0.1% (OTC and Rx), 0.3% (Rx)', 'Topical Cream: 0.1%', 'Topical Lotion: 0.1%'],
    administrationAndCounseling: [
      'Wash face gently with a mild, non-soap cleanser and pat skin completely dry before applying.',
      'Apply a pea-sized amount to cover the entire face once daily at bedtime; avoid eyes, lips, corners of nose, and mucous membranes.',
      'Apply a non-comedogenic daily facial moisturizer to alleviate dryness and peeling.',
      'Acne may appear to worsen during the first 2 to 3 weeks before significant improvement is seen after 8 to 12 weeks of consistent use.',
      'Use daily broad-spectrum sunscreen (SPF 30+) and wear protective clothing; adapalene increases sun sensitivity.',
    ],
  },

  Colchicine: {
    genericName: 'Colchicine',
    brandNames: ['Colcrys', 'Mitigare'],
    pharmacologicClass: 'Microtubule Assembly Inhibitor',
    therapeuticClass: 'Anti-Gout Agent',
    mechanismOfAction:
      'Binds to soluble tubulin heterodimers to prevent microtubule polymer assembly, arresting microtubule-dependent leukocyte chemotaxis, phagocytosis of monosodium urate crystals, and cleaving of pro-caspase-1 by the NLRP3 inflammasome, dampening interleukin-1-beta (IL-1b) activation and acute gouty joint inflammation.',
    dosingRegimens: [
      'Acute Gout Flare: 1.2 mg PO at first sign of flare, followed by 0.6 mg PO 1 hour later (total 1.8 mg over 1 hour); do not repeat acute flare treatment for at least 3 days',
      'Gout Flare Prophylaxis: 0.6 mg PO once or twice daily (max 1.2 mg/day); continue during urate-lowering therapy initiation',
      'Familial Mediterranean Fever (FMF): 1.2 to 2.4 mg PO daily in 1 or 2 divided doses',
    ],
    sideEffects: {
      common: ['Diarrhea (very common, early sign of toxicity)', 'Nausea', 'Vomiting', 'Abdominal pain and cramping', 'Pharyngolaryngeal pain'],
      severe: ['Fatal colchicine toxicity / multi-organ failure', 'Severe myelosuppression (leukopenia, granulocytopenia, thrombocytopenia, pancytopenia)', 'Neuromyopathy and rhabdomyolysis (especially with statins or renal impairment)', 'Azoospermia (reversible)'],
    },
    contraindications: [
      'Concomitant use of a P-glycoprotein (P-gp) or strong CYP3A4 inhibitor in patients with renal or hepatic impairment (fatal toxicity reported)',
      'Severe renal impairment (CrCl < 10 mL/min) or severe hepatic impairment in patients taking P-gp/CYP3A4 inhibitors',
      'Known hypersensitivity to colchicine',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (clarithromycin, ketoconazole, itraconazole, ritonavir - dramatically increase colchicine blood levels; contraindication in renal/hepatic impairment; strict dose reduction in normal organ function)', 'P-glycoprotein inhibitors (cyclosporine, verapamil - increase colchicine toxicity)', 'HMG-CoA reductase inhibitors / Statins (additive myopathy and rhabdomyolysis risk)'],
      common: ['Grapefruit juice (increases colchicine concentrations)'],
    },
    monitoringParameters: [
      'Complete blood count (CBC) with differential periodically during chronic use',
      'Renal function (serum creatinine, CrCl) and liver enzymes',
      'Serum creatine kinase (CK) in patients presenting with muscle weakness or pain',
      'Monitoring for gastrointestinal symptoms (severe diarrhea is an indicator of toxicity)',
    ],
    dosageForms: ['Oral Tablet: 0.6 mg', 'Oral Capsule: 0.6 mg', 'Oral Solution: 0.6 mg/5 mL (Gloperba)'],
    administrationAndCounseling: [
      'For acute gout flares: Take 2 tablets (1.2 mg) immediately at the earliest sign of the attack, then take 1 tablet (0.6 mg) 1 hour later. Do NOT take more tablets for the attack; excessive doses cause severe toxicity without additional benefit.',
      'Take with or without food.',
      'Avoid grapefruit and grapefruit juice while taking colchicine.',
      'Stop taking and notify your doctor immediately if you develop severe diarrhea, nausea, vomiting, or muscle weakness.',
    ],
  },

  Allopurinol: {
    genericName: 'Allopurinol',
    brandNames: ['Aloprim', 'Zyloprim'],
    pharmacologicClass: 'Purine Analog Xanthine Oxidase Inhibitor',
    therapeuticClass: 'Xanthine Oxidase Inhibitor',
    mechanismOfAction:
      'Purine analog that is converted by xanthine oxidase into its primary active metabolite oxypurinol (alloxanthine); both allopurinol and oxypurinol inhibit xanthine oxidase, blocking the sequential oxidation of hypoxanthine to xanthine and xanthine to uric acid, reducing circulating serum and urinary uric acid levels without disrupting vital purine salvage.',
    dosingRegimens: [
      'Gout (Mild / Intermittent): Initial 100 mg PO once daily; titrate weekly by 100 mg/day until serum uric acid < 6 mg/dL (typical maintenance 200 to 300 mg daily; severe tophaceous gout up to 800 mg daily; reduce dose if CrCl < 60 mL/min)',
      'Tumor Lysis Syndrome / Hyperuricemia of Malignancy: 600 to 800 mg PO daily in divided doses starting 1 to 2 days prior to chemotherapy, or 200 to 400 mg/m2/day IV infusion',
    ],
    sideEffects: {
      common: ['Maculopapular rash / pruritus', 'Acute gout flares (upon initiation due to crystal mobilization)', 'Nausea and vomiting', 'Diarrhea', 'Elevated liver transaminases'],
      severe: ['Allopurinol Hypersensitivity Syndrome (AHS: triad of severe cutaneous reaction [toxic epidermal necrolysis/SJS], systemic eosinophilia, and multiorgan failure; high mortality rate)', 'Severe hepatotoxicity / acute hepatitis', 'Bone marrow suppression (leukopenia, thrombocytopenia)', 'Renal failure / interstitial nephritis'],
    },
    contraindications: [
      'Known severe hypersensitivity to allopurinol or history of serious allopurinol skin reaction',
    ],
    drugInteractions: {
      major: ['Thiopurines (azathioprine and 6-mercaptopurine - allopurinol inhibits their xanthine oxidase metabolism, causing massive 4-fold elevation in thiopurine levels and fatal myelosuppression; reduce azathioprine dose by 75%)', 'Didanosine (allopurinol increases didanosine levels; avoid combination)'],
      common: ['Warfarin (allopurinol prolongs warfarin half-life; monitor INR)', 'Ampicillin and amoxicillin (substantially increased incidence of skin rash)', 'Thiazide diuretics (increased risk of allopurinol hypersensitivity syndrome)'],
    },
    monitoringParameters: [
      'HLA-B*58:01 allele screening prior to initiation in high-risk populations (patients of Han Chinese, Korean, Thai ancestry, or African Americans with CKD) due to high risk of fatal AHS',
      'Serum uric acid levels: Check every 2 to 4 weeks during titration (target < 6 mg/dL; < 5 mg/dL in severe tophaceous gout), then every 6 months',
      'Renal function (serum creatinine, BUN, CrCl - dosage titration based on renal function)',
      'Liver function tests (AST, ALT, bilirubin) and complete blood count (CBC)',
      'Inspect for skin rash at every visit',
    ],
    dosageForms: ['Oral Tablet: 100 mg, 300 mg', 'Intravenous Injection Powder: 500 mg single-dose vial'],
    administrationAndCounseling: [
      'Take once daily immediately after meals to reduce stomach irritation; doses > 300 mg daily should be divided into twice-daily administration.',
      'Maintain adequate daily fluid intake (drink at least 2 liters of water daily) to promote uric acid excretion and prevent xanthine stone formation.',
      'Co-prescribe anti-inflammatory flare prophylaxis (colchicine or NSAID) for the first 3 to 6 months of therapy to prevent acute gout attacks triggered by dissolving uric acid crystals.',
      'CRITICAL: Stop taking allopurinol and call your doctor immediately at the very first sign of ANY skin rash, hives, or mouth sores.',
    ],
  },

  Febuxostat: {
    genericName: 'Febuxostat',
    brandNames: ['Uloric'],
    pharmacologicClass: 'Non-Purine Selective Xanthine Oxidase Inhibitor',
    therapeuticClass: 'Xanthine Oxidase Inhibitor',
    mechanismOfAction:
      'Potent, non-purine selective inhibitor of xanthine oxidase that achieves potent inhibition by binding to both the oxidized and reduced forms of the molybdenum-pterin active site of the enzyme, blocking uric acid synthesis without inhibiting other enzymes involved in purine or pyrimidine metabolism.',
    dosingRegimens: [
      'Chronic Hyperuricemia in Gout: Initial 40 mg PO once daily; if serum uric acid is not < 6 mg/dL after 2 weeks, increase to 80 mg PO once daily (reserve for patients who have an inadequate response or intolerance to allopurinol)',
    ],
    sideEffects: {
      common: ['Liver function abnormalities (elevated AST/ALT)', 'Nausea', 'Arthralgia', 'Rash', 'Acute gout flares'],
      severe: ['Cardiovascular death (increased risk of cardiovascular death compared to allopurinol in the CARES trial)', 'Severe cutaneous adverse reactions (toxic epidermal necrolysis, SJS, DRESS)', 'Severe hepatic failure and jaundice', 'Myocardial infarction and stroke'],
    },
    contraindications: [
      'Concurrent administration with azathioprine or 6-mercaptopurine (severe thiopurine toxicity)',
      'Known hypersensitivity to febuxostat',
    ],
    drugInteractions: {
      major: ['Azathioprine and 6-mercaptopurine (febuxostat blocks their metabolism, causing severe, life-threatening bone marrow suppression; absolute contraindication)'],
      common: ['Warfarin (minor or no significant effect on INR, but monitoring recommended)', 'Theophylline (monitoring required)'],
    },
    monitoringParameters: [
      'Serum uric acid levels at 2 to 4 weeks after initiation and periodically (target < 6 mg/dL)',
      'Cardiovascular assessment: Monitor for signs of myocardial infarction, stroke, or heart failure',
      'Liver function tests at baseline and periodically',
      'Dermatologic examination for progressive rash or systemic allergic reactions',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 40 mg, 80 mg'],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR DEATH: A postmarket cardiovascular safety trial (CARES) found a higher rate of cardiovascular death in patients with gout and established cardiovascular disease treated with febuxostat compared with patients treated with allopurinol. Consider the risks and benefits of febuxostat when deciding to prescribe or continue patients on febuxostat. Febuxostat should only be used in patients who have an inadequate response to a maximally titrated dose of allopurinol, who are intolerant to allopurinol, or for whom treatment with allopurinol is not advisable.',
    administrationAndCounseling: [
      'Take once daily with or without food at any time of day.',
      'Gout flare prophylaxis with colchicine or an NSAID is recommended when starting febuxostat.',
      'Do not stop taking febuxostat if you experience a gout flare; continue taking your dose and treat the flare as directed by your physician.',
      'Seek immediate emergency medical attention if you experience chest pain, shortness of breath, slurred speech, or weakness on one side of your body.',
      'Stop taking and report immediately if a skin rash or yellowing of the skin/eyes occurs.',
    ],
  },
};
