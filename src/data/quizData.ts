export interface SimilarQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations?: string[];
}

export interface QuizQuestion {
  id: number;
  category: string;
  caseText?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations: string[];
  similarQ: SimilarQuestion;
}

export const CATEGORIES = [
  'All Topics',
  'Physiology & Diagnostics',
  'Iron Deficiency & Oral Iron',
  'Parenteral Iron Therapy',
  'Macrocytic Anemias (B12 & Folate)',
  'Anemia of Inflammation & CKD',
  'Hemoglobinopathies & Gene Therapy',
] as const;

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    category: 'Physiology & Diagnostics',
    question: 'According to the World Health Organization, anemia in adult men is defined as a hemoglobin concentration below:',
    options: ['A. 11 g/dL', 'B. 12 g/dL', 'C. 13 g/dL', 'D. 14 g/dL'],
    correctIndex: 2,
    explanation: 'According to WHO criteria detailed in clinical practice guidelines, anemia is defined as Hemoglobin (Hb) less than 13 g/dL in men and less than 12 g/dL in non-pregnant women (and < 11 g/dL in pregnant women).',
    optionExplanations: [
      'Incorrect. 11 g/dL is the threshold used for pregnant women, not adult men.',
      'Incorrect. 12 g/dL is the WHO threshold for non-pregnant adult women.',
      'Correct. The WHO defines anemia in adult men as Hb < 13 g/dL (Hct < 39%).',
      'Incorrect. 14 g/dL is within the normal reference range for healthy adult males (typically 13.5–17.5 g/dL).'
    ],
    similarQ: {
      question: 'Based on WHO criteria, what is the hemoglobin threshold for defining anemia in non-pregnant adult women?',
      options: ['A. 10 g/dL', 'B. 11 g/dL', 'C. 12 g/dL', 'D. 13 g/dL'],
      correctIndex: 2,
      explanation: 'The WHO defines anemia in non-pregnant adult women as a hemoglobin concentration less than 12 g/dL.',
      optionExplanations: [
        'Incorrect. 10 g/dL is considered moderate anemia.',
        'Incorrect. 11 g/dL is the threshold for pregnant women in the 1st and 3rd trimesters.',
        'Correct. The WHO diagnostic cutoff for non-pregnant women is Hb < 12 g/dL.',
        'Incorrect. 13 g/dL is the diagnostic cutoff for adult men.'
      ]
    }
  },
  {
    id: 2,
    category: 'Physiology & Diagnostics',
    question: 'Which statement best describes the physiology of erythropoietin (EPO)?',
    options: [
      'A. It is produced primarily by the liver and stimulates iron absorption in the duodenum',
      'B. Approximately 90% is produced by the kidneys, and its primary mechanism is preventing apoptosis of erythroid precursor cells',
      'C. It is produced by the bone marrow and directly incorporates iron into heme',
      'D. It is released in response to elevated tissue oxygen tension'
    ],
    correctIndex: 1,
    explanation: 'Approximately 90% of Erythropoietin (EPO) is produced by renal peritubular interstitial fibroblasts (10% by liver). Its primary mechanism of action is preventing apoptosis (programmed cell death) of CFU-E erythroid precursor cells, enabling proliferation and differentiation. It is triggered by hypoxia (decreased tissue oxygen tension).',
    optionExplanations: [
      'Incorrect. Only ~10% is synthesized in the liver in adults, and it does not directly stimulate duodenal iron absorption.',
      'Correct. ~90% originates in the kidneys, saving erythroid progenitors from apoptosis to stimulate RBC generation.',
      'Incorrect. It acts on the bone marrow receptors (EpoR), but is synthesized in the kidney, not bone marrow.',
      'Incorrect. EPO is released in response to hypoxia (reduced tissue pO2), not elevated oxygen tension.'
    ],
    similarQ: {
      question: 'What is the primary physiological stimulus that signals the kidneys to increase production and release of erythropoietin (EPO)?',
      options: [
        'A. Elevated serum iron levels',
        'B. A decrease in tissue oxygen concentration (hypoxia)',
        'C. Elevated hepcidin levels',
        'D. Increased apoptosis of precursor cells'
      ],
      correctIndex: 1,
      explanation: 'A decrease in renal tissue oxygen tension (tissue hypoxia) stabilizes hypoxia-inducible factors (HIF-1α and HIF-2α), stimulating EPO transcription in renal interstitial fibroblasts.',
      optionExplanations: [
        'Incorrect. High iron levels do not stimulate EPO release.',
        'Correct. Tissue hypoxia is the primary physiologic trigger for EPO synthesis.',
        'Incorrect. Hepcidin blocks iron transport and does not stimulate EPO.',
        'Incorrect. Apoptosis is what EPO prevents, not what signals renal EPO release.'
      ]
    }
  },
  {
    id: 3,
    category: 'Physiology & Diagnostics',
    question: 'The normal survival time of a circulating erythrocyte is approximately:',
    options: ['A. 7 days', 'B. 30 days', 'C. 120 days', 'D. 365 days'],
    correctIndex: 2,
    explanation: 'The mature, circulating erythrocyte is a biconcave, non-nucleated cell with a normal physiologic lifespan of approximately 120 days before senescence and splenic macrophage clearance.',
    optionExplanations: [
      'Incorrect. 7 days corresponds to erythroid intramedullary maturation time from stem cell to reticulocyte.',
      'Incorrect. 30 days is markedly shortened, seen in severe hemolytic states.',
      'Correct. Circulating red blood cells maintain a mean lifespan of ~120 days (approx. 4 months).',
      'Incorrect. 365 days is far longer than RBC integrity can be maintained without a nucleus and protein synthesis machinery.'
    ],
    similarQ: {
      question: 'Approximately how long does the maturation process of a red blood cell take from a committed stem cell to a reticulocyte released into circulation?',
      options: ['A. 12 hours', 'B. 1 week (~7 days)', 'C. 30 days', 'D. 120 days'],
      correctIndex: 1,
      explanation: 'The maturation process in the bone marrow (proerythroblast through normoblast stages) takes about 7 days (1 week) before the reticulocyte enters circulation, where it completes maturation in 1–2 days.',
      optionExplanations: [
        'Incorrect. 12 hours is too brief for cellular condensation and hemoglobinization.',
        'Correct. The bone marrow erythropoiesis pathway takes approximately 1 week (7 days).',
        'Incorrect. 30 days is significantly longer than the normal marrow maturation interval.',
        'Incorrect. 120 days is the survival duration of mature circulating erythrocytes.'
      ]
    }
  },
  {
    id: 4,
    category: 'Physiology & Diagnostics',
    question: 'Which plasma protein delivers iron to the bone marrow for incorporation into the hemoglobin molecule?',
    options: ['A. Ferritin', 'B. Hepcidin', 'C. Transferrin', 'D. Ferroportin'],
    correctIndex: 2,
    explanation: 'Transferrin is the specific plasma beta-globulin transport glycoprotein that binds ferric (Fe3+) iron and delivers it to transferrin receptors (TfR1) on bone marrow erythroblasts for heme synthesis.',
    optionExplanations: [
      'Incorrect. Ferritin is the primary intracellular iron storage protein complex (predominantly in liver and reticuloendothelial macrophages).',
      'Incorrect. Hepcidin is the master systemic peptide hormone that downregulates ferroportin.',
      'Correct. Transferrin is the circulating carrier protein that delivers iron to the erythron.',
      'Incorrect. Ferroportin is the transmembrane exporter on enterocytes and macrophages that exports iron into circulation.'
    ],
    similarQ: {
      question: 'Which protein serves as the primary storage form of iron in the liver and heart?',
      options: ['A. Transferrin', 'B. Ferroportin', 'C. Ferritin', 'D. Hepcidin'],
      correctIndex: 2,
      explanation: 'Ferritin is the spherical hollow protein shell storing up to 4,500 iron atoms, primarily in hepatocytes and reticuloendothelial macrophages of the spleen and liver.',
      optionExplanations: [
        'Incorrect. Transferrin transports iron in circulation, but does not serve as major tissue storage.',
        'Incorrect. Ferroportin is the basolateral channel that exports iron into plasma.',
        'Correct. Ferritin represents the primary storage pool of bioavailable iron.',
        'Incorrect. Hepcidin is a regulatory hormone, not an iron storage repository.'
      ]
    }
  },
  {
    id: 5,
    category: 'Iron Deficiency & Oral Iron',
    caseText: 'Case: A 28-year-old woman with heavy menstrual periods presents with fatigue, exertional dyspnea, sensitivity to cold, and a craving for ice chips (pagophagia). She appears pale. CBC: Hb 9.2 g/dL, Hct 28%, MCV 68 µm³, MCHC 29 g/dL.',
    question: 'Which additional laboratory pattern would confirm the most likely diagnosis?',
    options: [
      'A. Low serum iron, low ferritin, high TIBC',
      'B. Low serum iron, high ferritin, low TIBC',
      'C. Normal serum iron, low folate, elevated homocysteine',
      'D. High serum iron, high transferrin saturation, low reticulocyte count'
    ],
    correctIndex: 0,
    explanation: 'The patient exhibits classic microcytic hypochromic anemia (low MCV 68, low MCHC) with pica/pagophagia secondary to chronic blood loss. The diagnostic biochemical triad of Iron Deficiency Anemia (IDA) is low serum iron, low serum ferritin (< 30 ng/mL, proving depleted stores), and elevated Total Iron-Binding Capacity (TIBC).',
    optionExplanations: [
      'Correct. IDA features low serum iron, depleted ferritin stores, and increased transferrin/TIBC.',
      'Incorrect. High ferritin and low TIBC is the hallmark of Anemia of Chronic Disease / Inflammation.',
      'Incorrect. This pattern reflects folate deficiency, which causes macrocytic (elevated MCV) anemia.',
      'Incorrect. High serum iron and transferrin saturation would suggest iron overload or hemochromatosis.'
    ],
    similarQ: {
      question: 'In the early stages of Iron-Deficiency Anemia, which red blood cell index is typically reduced BEFORE the hemoglobin concentration significantly falls?',
      options: ['A. MCV (Mean Corpuscular Volume)', 'B. Reticulocyte count', 'C. MCH (Mean Corpuscular Hemoglobin)', 'D. MCHC (Mean Corpuscular Hemoglobin Concentration)'],
      correctIndex: 0,
      explanation: 'Red cell indices such as MCV and MCH drop before frank clinical anemia (Hb decline) develops, following bone marrow iron store depletion.',
      optionExplanations: [
        'Correct. MCV decreases as early microcytic erythrocytes are released prior to severe drop in overall Hb.',
        'Incorrect. Reticulocyte count may remain normal or low-normal, not a specific early index drop.',
        'Incorrect. While MCH declines, MCV is the hallmark red cell volume index monitored.',
        'Incorrect. MCHC decreases later as hypochromia becomes fully established.'
      ]
    }
  },
  {
    id: 6,
    category: 'Iron Deficiency & Oral Iron',
    caseText: 'Case: A 28-year-old woman with heavy menstrual periods presents with fatigue, exertional dyspnea, sensitivity to cold, and craving for ice chips. CBC: Hb 9.2 g/dL. She is started on ferrous sulfate 325 mg PO three times daily.',
    question: 'How much elemental iron does each 325 mg ferrous sulfate tablet provide?',
    options: ['A. 38 mg (12%)', 'B. 65 mg (20%)', 'C. 66 mg (33%)', 'D. 210 mg (21%)'],
    correctIndex: 1,
    explanation: 'Ferrous sulfate contains approximately 20% elemental iron. Thus, 325 mg of ferrous sulfate delivers 65 mg of elemental iron (325 × 0.20 = 65 mg). In comparison, dried ferrous sulfate is ~30% (65 mg in 200 mg tablet), ferrous gluconate is 12% (~38 mg in 325 mg tablet), and ferrous fumarate is 33% (~106 mg in 325 mg tablet).',
    optionExplanations: [
      'Incorrect. 38 mg (12%) corresponds to ferrous gluconate 325 mg.',
      'Correct. Ferrous sulfate 325 mg contains 20% elemental iron = 65 mg.',
      'Incorrect. 33% elemental iron corresponds to ferrous fumarate (~106 mg per 325 mg).',
      'Incorrect. Ferrous sulfate does not contain 210 mg of elemental iron.'
    ],
    similarQ: {
      question: 'If the patient were prescribed ferrous gluconate 325 mg instead, how much elemental iron would each tablet provide?',
      options: ['A. 30 mg (9%)', 'B. 38 mg (12%)', 'C. 65 mg (20%)', 'D. 106 mg (33%)'],
      correctIndex: 1,
      explanation: 'Ferrous gluconate contains 12% elemental iron. A standard 325 mg tablet provides approximately 38 mg of elemental iron, offering gentler gastrointestinal tolerability at the cost of lower iron payload.',
      optionExplanations: [
        'Incorrect. 30 mg is lower than the actual 12% yield.',
        'Correct. Ferrous gluconate contains 12% elemental iron, yielding ~38 mg per 325 mg tablet.',
        'Incorrect. 65 mg corresponds to ferrous sulfate.',
        'Incorrect. 106 mg corresponds to ferrous fumarate (33%).'
      ]
    }
  },
  {
    id: 7,
    category: 'Iron Deficiency & Oral Iron',
    question: 'Current evidence supports once-daily or alternate-day oral iron dosing rather than three-times-daily dosing primarily because:',
    options: [
      'A. Higher doses saturate transferrin receptors permanently',
      'B. Repeated daily doses raise hepcidin levels, which reduces fractional absorption of subsequent doses',
      'C. Alternate-day dosing eliminates the risk of iron overload',
      'D. TID dosing induces vitamin C deficiency'
    ],
    correctIndex: 1,
    explanation: 'Ingesting oral iron triggers an acute surge in hepatic hepcidin secretion that persists for 24–48 hours. Elevated hepcidin internalizes and degrades ferroportin, dramatically reducing fractional absorption of subsequent iron doses. Alternate-day or once-daily dosing avoids sustained hepcidin elevation and doubles fractional iron absorption while markedly reducing GI adverse effects.',
    optionExplanations: [
      'Incorrect. Transferrin receptor saturation is not irreversible.',
      'Correct. Dosing increases serum hepcidin for 24+ hours, blocking ferroportin and impeding fractional absorption of subsequent doses.',
      'Incorrect. Iron overload is not the principal concern in simple dietary/menorrhagia IDA.',
      'Incorrect. Oral iron does not cause vitamin C depletion.'
    ],
    similarQ: {
      question: 'While taking iron with food decreases its overall absorption, why is this practice sometimes recommended in clinical practice?',
      options: [
        'A. To prevent iron from chelating with other dietary minerals',
        'B. To minimize gastrointestinal side effects like nausea and epigastric cramping to improve compliance',
        'C. To prevent the iron from staining the teeth',
        'D. To increase the half-life of the iron salt in the plasma'
      ],
      correctIndex: 1,
      explanation: 'Gastrointestinal adverse effects (nausea, constipation, epigastric pain) are the leading cause of non-adherence. Administering iron with small meals or light snacks blunts direct mucosal irritation and improves adherence, even if fractional absorption is reduced.',
      optionExplanations: [
        'Incorrect. Food actually increases chelation with phytates/calcium.',
        'Correct. Patient adherence is substantially higher when GI distress is mitigated.',
        'Incorrect. Tooth staining occurs with liquid formulations, prevented by using a straw or dropper.',
        'Incorrect. Food does not prolong elemental iron plasma half-life.'
      ]
    }
  },
  {
    id: 8,
    category: 'Iron Deficiency & Oral Iron',
    caseText: 'Case: A 61-year-old man taking omeprazole daily for GERD is prescribed oral iron for iron-deficiency anemia. At 8-week follow-up, his hemoglobin and ferritin have failed to improve.',
    question: 'The most likely pharmacokinetic explanation is that omeprazole:',
    options: [
      'A. Chelates with iron in the gut lumen',
      'B. Induces hepatic metabolism of iron salts',
      'C. Raises gastric pH, decreasing the acidity needed for iron dissolution and reduction',
      'D. Increases hepcidin production in the liver'
    ],
    correctIndex: 2,
    explanation: 'Dietary and medicinal ferric (Fe3+) iron requires gastric hydrochloric acid (low pH) for solubility and reduction to the absorbable ferrous (Fe2+) state by duodenal cytochrome b (Dcytb). PPIs like omeprazole profoundly suppress acid secretion, raising gastric pH and severely inhibiting iron absorption.',
    optionExplanations: [
      'Incorrect. Omeprazole does not chelate iron; polyvalent cations like calcium or drugs like tetracyclines chelate.',
      'Incorrect. Iron is not metabolized by CYP450 hepatic enzymes.',
      'Correct. Elevation of intragastric pH impairs solubilization and reduction of iron into absorbable Fe2+.',
      'Incorrect. PPIs do not stimulate hepatic hepcidin production.'
    ],
    similarQ: {
      question: 'Which of the following drug classes, often used over-the-counter for heartburn, can also decrease iron absorption through a similar mechanism?',
      options: ['A. Histamine-2 (H2) receptor antagonists (e.g. famotidine)', 'B. NSAIDs (e.g. ibuprofen)', 'C. Serotonin 5-HT3 antagonists', 'D. Bismuth subsalicylate'],
      correctIndex: 0,
      explanation: 'H2 receptor antagonists (like famotidine) decrease gastric acid output, raising gastric pH and thereby decreasing the dissolution and bio-absorption of oral iron.',
      optionExplanations: [
        'Correct. H2 blockers increase intragastric pH and diminish non-heme iron absorption.',
        'Incorrect. NSAIDs cause GI ulceration/bleeding, but do not pharmacokinetically inhibit iron absorption.',
        'Incorrect. 5-HT3 antagonists are antiemetics that do not alter gastric pH.',
        'Incorrect. Bismuth salts protect mucosa and turn stools black, but do not suppress acid.'
      ]
    }
  },
  {
    id: 9,
    category: 'Iron Deficiency & Oral Iron',
    question: 'Which of the following increases the absorption of oral iron when taken concurrently?',
    options: ['A. Tea (tannins)', 'B. Dairy products (calcium)', 'C. Bran cereal (phytates)', 'D. Ascorbic acid (vitamin C)'],
    correctIndex: 3,
    explanation: 'Ascorbic acid (vitamin C) acts as an electron donor that reduces ferric iron (Fe3+) to the soluble ferrous state (Fe2+) and forms a stable chelate in the duodenum, substantially increasing oral iron absorption. Tannins, calcium, and phytates all chelate and block iron absorption.',
    optionExplanations: [
      'Incorrect. Tannins in black and green tea bind iron into insoluble precipitates.',
      'Incorrect. Calcium competes directly with divalent metal transporter 1 (DMT1) and inhibits iron absorption.',
      'Incorrect. Phytates in whole grains bind iron irreversibly.',
      'Correct. Ascorbic acid reduces iron to Fe2+ and enhances enterocyte uptake.'
    ],
    similarQ: {
      question: 'Which dietary component is known to inhibit the absorption of oral iron by forming insoluble complexes?',
      options: ['A. Orange juice', 'B. Tea containing tannins', 'C. Beef liver', 'D. Cooked lentils with tomatoes'],
      correctIndex: 1,
      explanation: 'Tannins, polyphenols in tea and coffee, calcium in dairy, and phytates in bran strongly inhibit non-heme iron absorption.',
      optionExplanations: [
        'Incorrect. Orange juice is rich in ascorbic acid which increases absorption.',
        'Correct. Tannins bind iron and form insoluble chelates that cannot be absorbed.',
        'Incorrect. Beef liver contains bioavailable heme iron and amino acids.',
        'Incorrect. Tomatoes provide vitamin C which promotes plant iron uptake.'
      ]
    }
  },
  {
    id: 10,
    category: 'Iron Deficiency & Oral Iron',
    caseText: 'Case: A 47-year-old woman stabilized on levothyroxine 88 mcg daily for hypothyroidism is starting ferrous sulfate 325 mg for iron-deficiency anemia.',
    question: 'Which counseling point is most appropriate regarding drug administration?',
    options: [
      'A. Take both medications together with breakfast to improve adherence',
      'B. Separate iron and levothyroxine administration by at least 4 hours, because iron binds levothyroxine and impairs its absorption',
      'C. Discontinue levothyroxine while taking iron therapy',
      'D. Take both medications with a calcium carbonate supplement'
    ],
    correctIndex: 1,
    explanation: 'Ferrous iron binds (chelates) levothyroxine in the intestinal lumen to form an insoluble precipitate, dramatically lowering thyroxine bioavailability and causing recurrent hypothyroidism (elevated TSH). Doses must be separated by at least 4 hours.',
    optionExplanations: [
      'Incorrect. Taking them together causes severe chelation and loss of thyroid hormone absorption.',
      'Correct. They must be separated by at least 4 hours to prevent intestinal binding.',
      'Incorrect. Hypothyroidism must remain treated; stopping levothyroxine is contraindicated.',
      'Incorrect. Calcium carbonate binds both iron and levothyroxine, compounding malabsorption.'
    ],
    similarQ: {
      question: 'If a patient taking oral iron is prescribed a fluoroquinolone antibiotic (such as ciprofloxacin), what interaction must be managed?',
      options: [
        'A. Fluoroquinolones increase iron toxicity',
        'B. Iron forms an insoluble chelate with the fluoroquinolone, significantly decreasing the antibiotic absorption',
        'C. Iron accelerates the hepatic metabolism of fluoroquinolones',
        'D. No clinically meaningful interaction occurs'
      ],
      correctIndex: 1,
      explanation: 'Polyvalent iron cations chelate 4-quinolones in the gut, reducing fluoroquinolone bioavailability by up to 80-90% and risking therapeutic failure or sepsis. Administration must be staggered by at least 2 hours before or 6 hours after iron.',
      optionExplanations: [
        'Incorrect. Quinolones do not increase iron toxicity.',
        'Correct. Chelation binds the quinolone ring, destroying oral antibacterial bioavailability.',
        'Incorrect. The interaction occurs via luminal chelation, not CYP metabolism.',
        'Incorrect. This is a severe, high-risk drug interaction that frequently causes antibiotic failure.'
      ]
    }
  },
  {
    id: 11,
    category: 'Iron Deficiency & Oral Iron',
    question: 'A patient with iron-deficiency anemia has been on oral iron for 3 months and her hemoglobin has normalized to 13.5 g/dL. The most appropriate clinical plan is to:',
    options: [
      'A. Discontinue iron therapy immediately, since the Hb has normalized',
      'B. Continue iron therapy until serum ferritin returns to the normal range, typically requiring 3 to 6+ months of total therapy',
      'C. Switch immediately to IV iron to complete repletion',
      'D. Double the oral dose for 1 month, then stop'
    ],
    correctIndex: 1,
    explanation: 'While hemoglobin normalization is achieved within 6 to 8 weeks, total body iron stores (reflected by serum ferritin > 50–100 ng/mL) remain empty. Therapy must be continued for an additional 3 to 6 months to replete the ~500–1000 mg storage iron pool in the reticuloendothelial system.',
    optionExplanations: [
      'Incorrect. Premature cessation leaves bone marrow and liver stores empty, leading to rapid relapse.',
      'Correct. Continue therapy until ferritin normalization confirms replenishment of storage pools.',
      'Incorrect. IV iron is unwarranted when the patient is responding and tolerating oral iron well.',
      'Incorrect. Doubling the dose induces GI intolerance and stimulates hepcidin without therapeutic benefit.'
    ],
    similarQ: {
      question: 'When monitoring a patient initially placed on oral iron therapy for IDA, which early laboratory change indicates a positive bone marrow response within the first 1-2 weeks?',
      options: ['A. Complete normalization of serum ferritin', 'B. A brisk reticulocytosis (increase in reticulocytes)', 'C. Normalization of MCV to 90 µm³', 'D. Decrease in TIBC to below normal'],
      correctIndex: 1,
      explanation: 'The earliest objective confirmation of marrow response to iron is a reticulocyte peak between days 7 and 10 (reticulocytosis), signaling accelerated erythropoiesis.',
      optionExplanations: [
        'Incorrect. Ferritin normalizes last (months later), not in the first 2 weeks.',
        'Correct. Reticulocytosis occurs within 7–10 days as new red cells enter circulation.',
        'Incorrect. Normalization of MCV takes months as older microcytic cells are gradually turned over.',
        'Incorrect. TIBC normalization requires prolonged replenishment.'
      ]
    }
  },
  {
    id: 12,
    category: 'Parenteral Iron Therapy',
    caseText: 'Case: An 80-kg woman with inflammatory bowel disease cannot tolerate oral iron. Target Hb is 13 g/dL; actual Hb is 9 g/dL; assume iron depot stores of 500 mg.',
    question: 'Using the Ganzoni formula: Total iron deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Iron depot (mg), her total iron deficit is:',
    options: ['A. 768 mg', 'B. 1,130 mg', 'C. 1,268 mg', 'D. 1,500 mg'],
    correctIndex: 2,
    explanation: 'Calculation: Iron deficit = [80 kg × (13 − 9) × 2.4] + 500 = [80 × 4 × 2.4] + 500 = 768 + 500 = 1,268 mg. (Note: the 2.4 factor accounts for blood volume ~0.07 L/kg and iron content of Hb ~3.4 mg/g).',
    optionExplanations: [
      'Incorrect. 768 mg represents only the circulating hemoglobin deficit without adding the 500 mg iron stores.',
      'Incorrect. 1,130 mg would result from a 75-kg patient with a smaller deficit.',
      'Correct. (80 × 4 × 2.4) + 500 = 768 + 500 = 1,268 mg total iron deficit.',
      'Incorrect. 1,500 mg is an overestimation.'
    ],
    similarQ: {
      question: 'Calculate the total iron deficit for a 75-kg patient with a target Hb of 13 g/dL, an actual Hb of 9.5 g/dL, and desired iron stores of 500 mg.',
      options: ['A. 860 mg', 'B. 1,130 mg', 'C. 1,450 mg', 'D. 1,820 mg'],
      correctIndex: 1,
      explanation: 'Calculation: [75 kg × (13 − 9.5) × 2.4] + 500 = [75 × 3.5 × 2.4] + 500 = 630 + 500 = 1,130 mg.',
      optionExplanations: [
        'Incorrect. Calculation error.',
        'Correct. 75 × 3.5 × 2.4 + 500 = 630 + 500 = 1,130 mg.',
        'Incorrect. Overestimation.',
        'Incorrect. Far too high.'
      ]
    }
  },
  {
    id: 13,
    category: 'Parenteral Iron Therapy',
    question: 'Which parenteral iron product carries a boxed warning and requires an obligatory test dose before administration because of the risk of life-threatening anaphylactic reactions?',
    options: ['A. Iron sucrose (Venofer)', 'B. Ferric gluconate (Ferrlecit)', 'C. Iron dextran (INFeD)', 'D. Ferumoxytol (Feraheme)'],
    correctIndex: 2,
    explanation: 'Iron dextran (INFeD) contains high-molecular-weight or low-molecular-weight dextran polymers that can stimulate pre-existing anti-dextran IgG antibodies, triggering severe dextran-induced anaphylactic reactions. An intravenous test dose of 0.5 mL (25 mg) administered over at least 30 seconds with 1 hour of observation is mandatory prior to full therapeutic dosing.',
    optionExplanations: [
      'Incorrect. Iron sucrose does not contain dextran and does not require an FDA test dose.',
      'Incorrect. Ferric gluconate does not mandate an official test dose.',
      'Correct. Iron dextran strictly mandates a 25 mg IV test dose due to antibody-mediated anaphylaxis risks.',
      'Incorrect. Ferumoxytol does not require an official test dose, though it carries monitoring warnings for hypersensitivity.'
    ],
    similarQ: {
      question: 'Which of the following IV iron preparations is typically administered as 200 mg slow injections on 5 occasions within a 14-day period (max 1,000 mg cumulative) and can commonly induce dose-dependent hypotension?',
      options: ['A. Iron sucrose (Venofer)', 'B. Ferric carboxymaltose (Injectafer)', 'C. Iron dextran (INFeD)', 'D. Ferric derisomaltose (Monoferric)'],
      correctIndex: 0,
      explanation: 'Iron sucrose (Venofer) is formulated for multi-dose regimens (e.g. 200 mg IV on 5 occasions for non-dialysis CKD) and rapid push can cause hypotension due to labile free iron release.',
      optionExplanations: [
        'Correct. Iron sucrose is administered in 200 mg increments (up to 1,000 mg) and is associated with hypotension if infused too rapidly.',
        'Incorrect. Ferric carboxymaltose is dosed as 750 mg × 2 doses.',
        'Incorrect. Iron dextran can be given as a single total-dose infusion (TDI).',
        'Incorrect. Ferric derisomaltose is given as 1,000 mg single infusion.'
      ]
    }
  },
  {
    id: 14,
    category: 'Parenteral Iron Therapy',
    question: 'A patient scheduled for magnetic resonance imaging (MRI) should inform the radiologist about recent treatment with which parenteral iron product?',
    options: ['A. Ferumoxytol (Feraheme)', 'B. Iron sucrose (Venofer)', 'C. Ferric gluconate (Ferrlecit)', 'D. Ferric derisomaltose (Monoferric)'],
    correctIndex: 0,
    explanation: 'Ferumoxytol (Feraheme) is formulated as superparamagnetic iron oxide nanoparticles (SPIONs) coated with carbohydrate. Because of its magnetic properties, it alters T1 and T2 relaxation times and can produce extensive MRI artifacts or mimic vascular lesions for up to 3 months following administration.',
    optionExplanations: [
      'Correct. Ferumoxytol nanoparticles are superparamagnetic and distort MRI studies for up to 3 months.',
      'Incorrect. Iron sucrose does not have superparamagnetic properties.',
      'Incorrect. Ferric gluconate does not produce lasting MRI artifacts.',
      'Incorrect. Ferric derisomaltose does not interfere with magnetic resonance imaging.'
    ],
    similarQ: {
      question: 'For a hemodialysis patient receiving Ferumoxytol (Feraheme), when is the appropriate time to administer the intravenous injection?',
      options: ['A. Concurrently with the start of dialysis', 'B. During the first 15 minutes of hemodialysis', 'C. At least 1 hour after dialysis is complete', 'D. Only on non-dialysis days'],
      correctIndex: 2,
      explanation: 'In hemodialysis patients, Ferumoxytol should be administered at least 1 hour after the dialysis session has concluded and blood pressure has stabilized.',
      optionExplanations: [
        'Incorrect. Giving it during dialysis increases hypotension and filtration loss.',
        'Incorrect. Early administration during active flux can cause unstable hemodynamics.',
        'Correct. Administer at least 1 hour post-dialysis once vital signs are stabilized.',
        'Incorrect. It can be administered on dialysis clinic visit days provided sufficient post-dialysis delay is observed.'
      ]
    }
  },
  {
    id: 15,
    category: 'Parenteral Iron Therapy',
    question: 'For an adult patient weighing ≥ 50 kg who requires complete iron repletion (1,000 mg) in a single rapid clinic visit, which parenteral product is FDA-approved for single-dose 1,000 mg infusion?',
    options: [
      'A. Iron sucrose 200 mg on 5 occasions over 14 days',
      'B. Ferric derisomaltose (Monoferric) 1,000 mg as a single IV infusion',
      'C. Ferric gluconate 125 mg IV single push',
      'D. Ferric carboxymaltose 750 mg × 2 doses at least 7 days apart'
    ],
    correctIndex: 1,
    explanation: 'Ferric derisomaltose (Monoferric) has a strongly bound matrix that allows administration of up to 1,000 mg as a single intravenous infusion over 20 minutes in adults weighing 50 kg or greater, providing complete single-visit repletion.',
    optionExplanations: [
      'Incorrect. Iron sucrose requires multiple clinic visits over weeks.',
      'Correct. Ferric derisomaltose (Monoferric) is indicated as a single 1,000 mg IV infusion for patients ≥ 50 kg.',
      'Incorrect. Ferric gluconate 125 mg yields only partial repletion and requires 8 doses.',
      'Incorrect. Ferric carboxymaltose requires two separate visits separated by at least 7 days in the US (750 mg × 2).'
    ],
    similarQ: {
      question: 'What is the standard FDA-approved dosing regimen for Ferric carboxymaltose (Injectafer) in an adult patient weighing over 50 kg with IDA?',
      options: [
        'A. 1,000 mg as a single IV infusion',
        'B. 750 mg IV for 2 doses, separated by at least 7 days (maximum 1,500 mg course)',
        'C. 510 mg IV for 2 doses, separated by 3 to 8 days',
        'D. 200 mg IV on 5 occasions over 2 weeks'
      ],
      correctIndex: 1,
      explanation: 'In adults ≥ 50 kg, Ferric carboxymaltose (Injectafer) is dosed at 750 mg IV in 2 doses separated by at least 7 days, for a cumulative maximum of 1,500 mg per course.',
      optionExplanations: [
        'Incorrect. 1,000 mg single dose is Monoferric, not Injectafer in standard US labeling.',
        'Correct. Injectafer is dosed as 750 mg × 2 doses separated by ≥ 7 days.',
        'Incorrect. 510 mg × 2 doses is the dosing for ferumoxytol (Feraheme).',
        'Incorrect. 200 mg on 5 occasions corresponds to iron sucrose (Venofer).'
      ]
    }
  },
  {
    id: 16,
    category: 'Parenteral Iron Therapy',
    question: 'A patient receiving repeated therapeutic courses of ferric carboxymaltose (Injectafer) should be monitored for which characteristic electrolyte abnormality?',
    options: ['A. Hyperkalemia', 'B. Hypophosphatemia', 'C. Hypercalcemia', 'D. Hyponatremia'],
    correctIndex: 1,
    explanation: 'Ferric carboxymaltose stimulates the secretion and inhibits the cleavage of intact Fibroblast Growth Factor 23 (FGF23). Elevated intact FGF23 causes renal phosphate wasting, leading to symptomatic or persistent hypophosphatemia, osteomalacia, and bone pain. Serum phosphate should be monitored with repeated courses.',
    optionExplanations: [
      'Incorrect. Ferric carboxymaltose does not alter potassium excretion.',
      'Correct. FCM induces FGF23 elevation, causing renal phosphate wasting and severe hypophosphatemia.',
      'Incorrect. Calcium levels remain generally stable or mildly suppressed.',
      'Incorrect. Hyponatremia is not a documented mechanism of carboxymaltose.'
    ],
    similarQ: {
      question: 'Which of the following modern IV iron products has demonstrated significantly lower rates of FGF23-mediated hypophosphatemia compared to ferric carboxymaltose in randomized head-to-head clinical trials?',
      options: ['A. Iron dextran', 'B. Ferric derisomaltose (Monoferric)', 'C. Iron sucrose', 'D. Ferric gluconate'],
      correctIndex: 1,
      explanation: 'Ferric derisomaltose (Monoferric) does not induce substantial biologically active FGF23 surges and demonstrates significantly lower rates of hypophosphatemia (< 8% vs up to 50–70% with FCM).',
      optionExplanations: [
        'Incorrect. Iron dextran was not the comparator in modern FGF23 trials.',
        'Correct. Ferric derisomaltose has demonstrated significantly lower rates of hypophosphatemia than ferric carboxymaltose.',
        'Incorrect. While iron sucrose has low hypophosphatemia, it cannot deliver 1,000 mg in a single dose.',
        'Incorrect. Ferric gluconate requires multiple low-dose visits.'
      ]
    }
  },
  {
    id: 17,
    category: 'Macrocytic Anemias (B12 & Folate)',
    caseText: 'Case: A 72-year-old man of Scandinavian descent presents with fatigue, a smooth beefy tongue (atrophic glossitis), symmetric lower extremity paresthesias, sensory ataxia, and diminished vibratory and position sensation. Labs: Hb 10.1 g/dL, MCV 112 µm³, low serum vitamin B12, normal serum folate.',
    question: 'Which laboratory finding best distinguishes vitamin B12 deficiency from folate deficiency in ambiguous cases?',
    options: ['A. Elevated serum homocysteine', 'B. Elevated serum methylmalonic acid (MMA)', 'C. Elevated MCV (> 100 µm³)', 'D. Low reticulocyte count'],
    correctIndex: 1,
    explanation: 'Vitamin B12 is an essential cofactor for two enzymatic reactions: (1) methionine synthase (homocysteine → methionine, shared with folate), and (2) methylmalonyl-CoA mutase (methylmalonyl-CoA → succinyl-CoA, unique to B12). Therefore, elevated Methylmalonic Acid (MMA) occurs ONLY in Vitamin B12 deficiency. Serum homocysteine is elevated in both B12 and folate deficiencies.',
    optionExplanations: [
      'Incorrect. Homocysteine is elevated in BOTH folate and vitamin B12 deficiency.',
      'Correct. Methylmalonic acid (MMA) is elevated uniquely in B12 deficiency because methylmalonyl-CoA mutase requires cobalamin.',
      'Incorrect. Macrocytosis (MCV > 100) is present in both deficiencies due to impaired thymidylate DNA synthesis.',
      'Incorrect. Ineffective erythropoiesis causes low reticulocyte count in both.'
    ],
    similarQ: {
      question: 'Based on the case presentation, which clinical symptom is a classic hallmark of Vitamin B12 deficiency (subacute combined degeneration) that is typically ABSENT in isolated folate deficiency?',
      options: ['A. Extreme fatigue', 'B. Smooth beefy tongue (glossitis)', 'C. Symmetric paresthesias, diminished vibratory sensation, and ataxia', 'D. Anorexia and weight loss'],
      correctIndex: 2,
      explanation: 'Neurologic manifestations (subacute combined degeneration of the posterior and lateral columns of the spinal cord: paresthesias, loss of vibration/proprioception, ataxia) are characteristic of B12 deficiency and absent in pure folate deficiency. Giving folic acid alone to a B12-deficient patient may correct the anemia while allowing irreversible neurological degeneration to progress.',
      optionExplanations: [
        'Incorrect. Fatigue is common to all anemic states.',
        'Incorrect. Glossitis occurs in both megaloblastic processes.',
        'Correct. Neurologic deficits (SCD) occur specifically in B12 deficiency due to defective myelin maintenance.',
        'Incorrect. Constitutional symptoms occur in both.'
      ]
    }
  },
  {
    id: 18,
    category: 'Macrocytic Anemias (B12 & Folate)',
    caseText: 'Case: The 72-year-old man above is diagnosed with pernicious anemia (autoimmune destruction of gastric parietal cells and intrinsic factor deficiency).',
    question: 'Which initial and maintenance therapeutic regimen is most appropriate?',
    options: [
      'A. Folic acid 1 mg PO daily for 4 months',
      'B. Cyanocobalamin 1,000 mcg IM daily for 5–7 days, then weekly for 4 weeks, then 1,000 mcg IM monthly for life',
      'C. Ferrous sulfate 325 mg PO three times daily for 3 months',
      'D. Cyanocobalamin 25 mcg intranasally once as initial repletion therapy'
    ],
    correctIndex: 1,
    explanation: 'Pernicious anemia impairs intrinsic factor-mediated ileal absorption of cobalamin. Standard repletion entails intramuscular (IM) or deep subcutaneous cyanocobalamin (typically 1,000 mcg daily for 1 week to replete the ~2–5 mg hepatic store, then weekly for 1 month, followed by 1,000 mcg monthly for life). High-dose oral B12 (1,000–2,000 mcg daily) relies on 1% passive diffusion and is also effective in compliant patients.',
    optionExplanations: [
      'Incorrect. Folic acid without B12 corrects the megaloblastosis but allows irreversible neurologic damage ("folate trap").',
      'Correct. Intramuscular cyanocobalamin bypasses absent intrinsic factor and ensures rapid replenishment of hepatic reserves.',
      'Incorrect. Iron does not treat cobalamin deficiency.',
      'Incorrect. 25 mcg intranasally is insufficient for repletion in pernicious anemia.'
    ],
    similarQ: {
      question: 'Once a patient with B12 deficiency has achieved hematologic and neurological remission, which FDA-approved intranasal dosage form can be used for once-weekly maintenance therapy?',
      options: ['A. Nascobal (cyanocobalamin nasal spray) 500 mcg once weekly in one nostril', 'B. CaloMist 25 mcg once weekly', 'C. Subcutaneous depot injection every 6 months', 'D. Oral multivitamin with 6 mcg B12 daily'],
      correctIndex: 0,
      explanation: 'Nascobal is an FDA-approved intranasal cyanocobalamin gel/spray indicated for maintenance therapy in B12 deficiency (500 mcg administered into one nostril once weekly) after initial IM repletion.',
      optionExplanations: [
        'Correct. Nascobal 500 mcg intranasally once weekly is indicated for cobalamin maintenance.',
        'Incorrect. CaloMist was dosed daily, not 25 mcg weekly.',
        'Incorrect. Subcutaneous injections are not given 6-monthly.',
        'Incorrect. Standard 6 mcg multivitamin is completely inadequate for pernicious anemia.'
      ]
    }
  },
  {
    id: 19,
    category: 'Macrocytic Anemias (B12 & Folate)',
    question: 'Standard therapeutic replacement for confirmed nutritional folic acid deficiency anemia in a non-pregnant adult is:',
    options: ['A. Folic acid 1 mg PO daily for 4 months', 'B. Folic acid 400 mcg PO once weekly', 'C. Folinic acid (leucovorin) 5 mg IV once', 'D. Folic acid 5 mg PO daily indefinitely'],
    correctIndex: 0,
    explanation: 'The standard treatment for folic acid deficiency is oral folic acid 1 mg daily for approximately 4 months. Because whole-body folate stores in the liver last only 3 to 4 months (unlike B12 stores which last 3 to 5 years), 4 months of therapy allows complete tissue repletion and turnover of megaloblastic erythrocyte cohorts.',
    optionExplanations: [
      'Correct. Oral folic acid 1 mg daily for 4 months effectively replenishes tissue stores and resolves megaloblastosis.',
      'Incorrect. 400 mcg weekly is severely under-dosed; 400 mcg daily is standard dietary allowance for non-pregnant adults.',
      'Incorrect. Folinic acid (leucovorin) is reserved for rescue following methotrexate or dihydrofolate reductase inhibition.',
      'Incorrect. Indefinite high-dose therapy is unnecessary unless underlying malabsorption or uncorrectable etiology persists.'
    ],
    similarQ: {
      question: 'What is the recommended daily supplemental folic acid intake for pregnant women to support increased erythropoiesis and prevent neural tube defects?',
      options: ['A. 100 to 200 mcg daily', 'B. 400 mcg daily', 'C. 600 to 1,000 mcg (0.6 to 1 mg) daily', 'D. 15 mg daily'],
      correctIndex: 2,
      explanation: 'During pregnancy, folic acid requirements increase to support fetoplacental growth and maternal RBC expansion. Guidelines recommend 600 to 1,000 mcg daily (with 4,000 mcg/day for mothers with prior pregnancy affected by neural tube defects).',
      optionExplanations: [
        'Incorrect. 100-200 mcg is subtherapeutic during gestation.',
        'Incorrect. 400 mcg is standard baseline for all women of childbearing potential, but pregnancy guideline is 600–800+ mcg.',
        'Correct. 600–1,000 mcg daily is recommended during pregnancy.',
        'Incorrect. 15 mg daily is excessive and unindicated for routine prenatal care.'
      ]
    }
  },
  {
    id: 20,
    category: 'Macrocytic Anemias (B12 & Folate)',
    question: 'Which of the following anticonvulsant medications is a well-recognized pharmacologic cause of drug-induced megaloblastic anemia due to altered folate absorption and catabolism?',
    options: ['A. Phenytoin (Dilantin)', 'B. Metoprolol', 'C. Amoxicillin', 'D. Vitamin C'],
    correctIndex: 0,
    explanation: 'Phenytoin (along with phenobarbital and primidone) is a classic cause of drug-induced megaloblastic anemia. It impairs intestinal conjugase enzyme activity, decreases intestinal folate absorption, and induces hepatic microsomal enzymes that accelerate folate catabolism.',
    optionExplanations: [
      'Correct. Phenytoin induces folate deficiency by inhibiting folate conjugase and accelerating hepatic folate metabolism.',
      'Incorrect. Metoprolol is a beta-blocker with no effect on hematopoiesis.',
      'Incorrect. Amoxicillin is a penicillin antibiotic that does not cause megaloblastic anemia.',
      'Incorrect. Vitamin C enhances iron absorption and has no antimetabolite effect.'
    ],
    similarQ: {
      question: 'Which antineoplastic and sickle-cell agent is well known to cause drug-induced macrocytosis (elevated MCV) due to direct inhibition of ribonucleotide reductase?',
      options: ['A. Hydroxyurea', 'B. Doxorubicin', 'C. Cyclophosphamide', 'D. Paclitaxel'],
      correctIndex: 0,
      explanation: 'Hydroxyurea inhibits ribonucleotide reductase, impairing DNA synthesis in dividing erythroblasts while RNA synthesis continues, resulting in characteristic megaloblastic changes and an elevated MCV (often > 105–115 µm³), which serves as a clinical biomarker of patient adherence.',
      optionExplanations: [
        'Correct. Hydroxyurea inhibits ribonucleotide reductase and causes pronounced macrocytosis.',
        'Incorrect. Doxorubicin is an anthracycline topoisomerase II inhibitor.',
        'Incorrect. Cyclophosphamide is an alkylating agent.',
        'Incorrect. Paclitaxel is a microtubule stabilizer.'
      ]
    }
  },
  {
    id: 21,
    category: 'Anemia of Inflammation & CKD',
    question: 'In anemia of inflammation (anemia of chronic disease), pro-inflammatory cytokines such as IL-6 induce hepcidin synthesis, which causes iron-restricted erythropoiesis primarily by:',
    options: [
      'A. Directly lysing circulating erythrocytes in the spleen',
      'B. Binding, internalizing, and degrading ferroportin, thereby trapping iron within macrophages and enterocytes',
      'C. Inhibiting transferrin receptor (TfR1) expression in erythroid precursors',
      'D. Stimulating excessive and uncontrolled erythropoietin release'
    ],
    correctIndex: 1,
    explanation: 'Hepcidin is a 25-amino acid peptide hormone produced by the liver. Induced by IL-6 via the STAT3 pathway, hepcidin binds directly to the cellular iron exporter ferroportin-1, triggering its endocytosis, ubiquitination, and lysosomal degradation. This locks iron inside splenic/hepatic reticuloendothelial macrophages and prevents enterocyte absorption, starving the marrow of iron despite adequate or elevated total-body stores.',
    optionExplanations: [
      'Incorrect. Hepcidin does not mediate direct complement- or macrophage-driven hemolysis.',
      'Correct. Hepcidin degrades ferroportin, sequestering iron inside storage cells and blunting gut absorption.',
      'Incorrect. Hepcidin acts on ferroportin, not transferrin receptor.',
      'Incorrect. Pro-inflammatory cytokines actually suppress renal EPO transcription, not stimulate it.'
    ],
    similarQ: {
      question: 'In addition to hepcidin induction, how do inflammatory cytokines like IL-1 and TNF-alpha contribute to the pathogenesis of Anemia of Inflammation?',
      options: [
        'A. They increase renal urinary iron excretion',
        'B. They directly suppress erythropoietin (EPO) transcription in the kidney and blunt CFU-E colony response to EPO in bone marrow',
        'C. They stimulate excessive EPO receptor phosphorylation',
        'D. They directly rupture glomerular capillaries'
      ],
      correctIndex: 1,
      explanation: 'IL-1, TNF-alpha, and interferon-gamma inhibit hypoxia-induced EPO gene transcription in the kidney, shorten RBC lifespan, and directly suppress the proliferation and responsiveness of erythroid progenitor cells (BFU-E and CFU-E) in the bone marrow.',
      optionExplanations: [
        'Incorrect. Iron is not lost in urine in anemia of inflammation.',
        'Correct. Cytokines suppress both renal EPO production and bone marrow responsiveness to EPO.',
        'Incorrect. Cytokines downregulate or impair EpoR signaling, rather than activating it.',
        'Incorrect. Glomerular rupture is not part of this anemia pathway.'
      ]
    }
  },
  {
    id: 22,
    category: 'Anemia of Inflammation & CKD',
    caseText: 'Case: A 66-year-old woman with active rheumatoid arthritis has Hb 10.4 g/dL. Iron studies: serum iron 28 µg/dL (low), ferritin 420 ng/mL (high), TIBC 210 µg/dL (low), transferrin saturation 13% (low).',
    question: 'These clinical laboratory findings are most consistent with:',
    options: ['A. Pure iron-deficiency anemia', 'B. Anemia of inflammation (anemia of chronic disease)', 'C. Megaloblastic folate deficiency', 'D. Sickle cell anemia'],
    correctIndex: 1,
    explanation: 'The hallmark diagnostic differentiator between Iron Deficiency Anemia (IDA) and Anemia of Inflammation (ACD) is serum ferritin and TIBC. In ACD, inflammation (elevated ESR/CRP) elevates ferritin (an acute phase reactant, here 420 ng/mL) and downregulates transferrin/TIBC. In pure IDA, ferritin would be low (< 30 ng/mL) and TIBC would be elevated (> 400 µg/dL).',
    optionExplanations: [
      'Incorrect. In IDA, ferritin is depleted (< 30) and TIBC is elevated (> 400).',
      'Correct. Low serum iron with elevated ferritin and low/normal TIBC is the classic profile of Anemia of Chronic Disease/Inflammation.',
      'Incorrect. Folate deficiency causes macrocytic anemia with normal iron stores.',
      'Incorrect. Sickle cell anemia is a hereditary hemoglobinopathy with hemolytic features.'
    ],
    similarQ: {
      question: 'In a patient with pure Iron-Deficiency Anemia, what would you expect the Total Iron-Binding Capacity (TIBC) level to be compared to Anemia of Inflammation?',
      options: [
        'A. TIBC is elevated in IDA (> 400 µg/dL), but low or low-normal in Anemia of Inflammation',
        'B. TIBC is low in IDA, but elevated in Anemia of Inflammation',
        'C. TIBC is suppressed to undetectable levels in both conditions',
        'D. TIBC is elevated above 500 µg/dL in both conditions'
      ],
      correctIndex: 0,
      explanation: 'TIBC directly mirrors transferrin levels. In IDA, the liver synthesizes more transferrin to maximize iron scavenging (elevated TIBC). In Anemia of Inflammation, transferrin is a negative acute-phase reactant and is downregulated (low or low-normal TIBC).',
      optionExplanations: [
        'Correct. TIBC rises in IDA (starving for iron) and falls in inflammation (negative acute-phase protein).',
        'Incorrect. Opposite of true physiology.',
        'Incorrect. TIBC is not suppressed to zero.',
        'Incorrect. Inflammation decreases transferrin synthesis.'
      ]
    }
  },
  {
    id: 23,
    category: 'Anemia of Inflammation & CKD',
    caseText: 'Case: A 58-year-old man with end-stage renal disease on hemodialysis has Hb 9.4 g/dL with adequate iron stores (ferritin 380 ng/mL, TSAT 28%). His blood pressure today is 178/102 mm Hg despite triple-drug antihypertensive therapy.',
    question: 'Regarding erythropoiesis-stimulating agent (ESA) therapy in this patient, which clinical management statement is correct?',
    options: [
      'A. Immediately initiate epoetin alfa 100 units/kg IV and titrate to target a normal hemoglobin of 13–14 g/dL',
      'B. ESAs are contraindicated and should NOT be initiated or escalated while blood pressure remains uncontrolled',
      'C. ESAs are completely contraindicated in all hemodialysis patients',
      'D. Darbepoetin alfa requires three-times-weekly IV dosing in dialysis patients'
    ],
    correctIndex: 1,
    explanation: 'ESA therapies (epoetin alfa, darbepoetin alfa) are contraindicated in patients with uncontrolled hypertension. ESAs increase peripheral vascular resistance and blood viscosity, precipitating hypertensive encephalopathy, seizures, and acute stroke. Furthermore, KDIGO guidelines explicitly mandate targeting Hb between 10–11.5 g/dL and NEVER exceeding 11 g/dL due to FDA boxed warnings for stroke, MI, and mortality (CHOIR and CREATE trials).',
    optionExplanations: [
      'Incorrect. Targeting Hb > 11 g/dL increases mortality and stroke risk, and ESAs should not be started during hypertensive crisis.',
      'Correct. Uncontrolled hypertension is a boxed warning / contraindication to starting or escalating ESAs.',
      'Incorrect. ESAs are widely used in hemodialysis when iron stores and blood pressure are controlled.',
      'Incorrect. Darbepoetin alfa has an extended half-life and is dosed weekly or every 2 weeks, not three times weekly.'
    ],
    similarQ: {
      question: 'When utilizing ESAs in patients with Chronic Kidney Disease, what is the maximum recommended target hemoglobin ceiling recommended to avoid increased risks of cardiovascular events, stroke, and death?',
      options: ['A. 10 g/dL', 'B. 11 g/dL (do not target > 11 g/dL)', 'C. 13 g/dL', 'D. 14.5 g/dL'],
      correctIndex: 1,
      explanation: 'FDA Black Box Warnings and clinical guidelines specify that dosing ESAs to target hemoglobin levels greater than 11 g/dL significantly increases the risk of stroke, myocardial infarction, venous thromboembolism, and all-cause mortality.',
      optionExplanations: [
        'Incorrect. 10 g/dL is the typical threshold for initiating therapy in non-dialysis CKD.',
        'Correct. FDA boxed warning specifically advises against targeting Hb > 11 g/dL.',
        'Incorrect. Normalizing Hb to 13 g/dL was proven harmful in the CHOIR and TREAT trials.',
        'Incorrect. Far above the safe threshold.'
      ]
    }
  },
  {
    id: 24,
    category: 'Anemia of Inflammation & CKD',
    question: 'Vadadustat (Vafseo), an oral agent approved for anemia of CKD in adults on dialysis for at least 3 months, exerts its pharmacologic effect by:',
    options: [
      'A. Binding directly to and dimerizing the erythropoietin receptor on erythroblasts',
      'B. Inhibiting hypoxia-inducible factor prolyl hydroxylase (HIF-PH), stabilizing HIF-alpha and enhancing endogenous EPO production and iron mobilization',
      'C. Chelating excess systemic iron to prevent oxidative stress',
      'D. Directly blocking transcription of the hepcidin gene in hepatocytes via antisense oligonucleotides'
    ],
    correctIndex: 1,
    explanation: 'Vadadustat is a Hypoxia-Inducible Factor Prolyl Hydroxylase Inhibitor (HIF-PHI). Under normal oxygenation, prolyl hydroxylases hydroxylate HIF-alpha, targeting it for von Hippel-Lindau (VHL) ubiquitination and proteasomal degradation. By inhibiting HIF-PH enzymes, vadadustat stabilizes HIF-1α and HIF-2α, mimicking altitude hypoxia to stimulate endogenous EPO gene transcription and coordinate iron absorption and transport.',
    optionExplanations: [
      'Incorrect. Direct EpoR agonism describes recombinant ESAs, not HIF-PHIs.',
      'Correct. Inhibits HIF prolyl hydroxylase, stabilizing HIF to boost endogenous EPO synthesis.',
      'Incorrect. It is not an iron chelator.',
      'Incorrect. It does not use antisense oligonucleotide technology.'
    ],
    similarQ: {
      question: 'What is the significant Boxed Warning shared by oral HIF-PH inhibitors like Vadadustat (Vafseo)?',
      options: [
        'A. Increased risk of severe prolonged hypophosphatemia',
        'B. Risk of severe acute dextran-induced anaphylaxis',
        'C. Increased risk of thrombotic vascular events, including myocardial infarction, stroke, and vascular access thrombosis',
        'D. Risk of irreversible visual loss from retinal detachment'
      ],
      correctIndex: 2,
      explanation: 'Vadadustat carries an FDA Boxed Warning for an increased risk of thrombotic vascular events, including death, myocardial infarction, stroke, and hemodialysis vascular access thrombosis, particularly when hemoglobin targets are exceeded.',
      optionExplanations: [
        'Incorrect. Hypophosphatemia is associated with ferric carboxymaltose.',
        'Incorrect. Anaphylaxis is a boxed warning for iron dextran.',
        'Correct. HIF-PHIs carry boxed warnings for thrombotic events (stroke, MI, access thrombosis).',
        'Incorrect. Retinal detachment is not the primary boxed warning.'
      ]
    }
  },
  {
    id: 25,
    category: 'Hemoglobinopathies & Gene Therapy',
    caseText: 'Case: A 19-year-old male with severe sickle cell disease (HbSS) has suffered four severe vaso-occlusive crises and two acute chest syndrome episodes this year despite maximum tolerated hydroxyurea. He has no HLA-matched sibling donor and is evaluated for curative gene editing.',
    question: 'Which statement accurately describes the molecular mechanism of Casgevy (exagamglogene autotemcel)?',
    options: [
      'A. It is a humanized monoclonal antibody that selectively blocks P-selectin on activated vascular endothelial cells',
      'B. It is an autologous ex-vivo CRISPR/Cas9 gene-edited cellular therapy that disrupts the erythroid-specific enhancer of BCL11A to reactivate fetal hemoglobin (HbF)',
      'C. It inserts a modified anti-sickling beta-globin gene (HbA-T87Q) into stem cells using a lentiviral vector',
      'D. It requires an allogeneic matched sibling donor and lifelong calcineurin inhibitor immunosuppression'
    ],
    correctIndex: 1,
    explanation: 'Casgevy (exagamglogene autotemcel) is the first FDA-approved CRISPR/Cas9 gene-edited therapy. Patient autologous CD34+ hematopoietic stem and progenitor cells are collected and edited ex-vivo using CRISPR/Cas9 to disrupt the erythroid lineage-specific enhancer of the BCL11A transcription factor gene. Because BCL11A normally silences the gamma-globin gene postnatally, its disruption reactivates robust production of fetal hemoglobin (HbF, alpha2-gamma2), which dilutes HbS and prevents sickling.',
    optionExplanations: [
      'Incorrect. P-selectin inhibition describes crizanlizumab (Adakveo), a monoclonal antibody.',
      'Correct. CRISPR/Cas9 disrupts the BCL11A erythroid enhancer, reactivating gamma-globin and high-level HbF synthesis.',
      'Incorrect. Insertion of the modified beta-globin HbA-T87Q gene via a lentiviral vector describes Lyfgenia (lovotibeglogene autotemcel).',
      'Incorrect. Casgevy is autologous (patient\'s own cells), eliminating graft-versus-host disease and need for an allogeneic donor.'
    ],
    similarQ: {
      question: 'Which of the following describes the therapeutic gene transfer mechanism for Lyfgenia (lovotibeglogene autotemcel) in the treatment of Sickle Cell Disease?',
      options: [
        'A. It acts as an oral antioxidant by boosting intracellular glutamine stores',
        'B. It utilizes CRISPR/Cas9 to knock out the BCL11A enhancer',
        'C. It utilizes a lentiviral vector (BB305) to add a modified beta-globin gene producing anti-sickling hemoglobin (HbA-T87Q)',
        'D. It acts as a pyruvate kinase activator to increase ATP generation in red blood cells'
      ],
      correctIndex: 2,
      explanation: 'Lyfgenia is an autologous cell-based gene addition therapy that utilizes a self-inactivating lentiviral vector to insert a engineered beta-globin gene encoding HbA-T87Q, an anti-sickling hemoglobin variant that impedes HbS polymerization.',
      optionExplanations: [
        'Incorrect. Glutamine antioxidant therapy describes oral L-glutamine (Endari).',
        'Incorrect. CRISPR BCL11A enhancer disruption describes Casgevy.',
        'Correct. Lyfgenia uses a lentiviral vector to insert the anti-sickling HbA-T87Q gene.',
        'Incorrect. Pyruvate kinase activation describes mitapivat (Pyrukynd).'
      ]
    }
  }
];

export const HIGH_YIELD_PEARLS: HighYieldPearl[] = [
  {
    topic: 'Anemia Diagnostic Criteria (WHO)',
    detail: 'Men: Hb < 13 g/dL (Hct < 39%). Non-pregnant Women: Hb < 12 g/dL (Hct < 36%). Pregnant Women: Hb < 11 g/dL. Normal RBC lifespan: 120 days (~4 months).',
  },
  {
    topic: 'Iron Deficiency vs Inflammation (ACD)',
    detail: 'IDA: Ferritin low (< 30 ng/mL), TIBC high (> 400 µg/dL), Serum Iron low. ACD: Ferritin high/normal (acute phase reactant, > 100–400 ng/mL), TIBC low/normal, Serum Iron low. Hepcidin is elevated in inflammation, degrading ferroportin.',
  },
  {
    topic: 'Oral Iron Salt Elemental Yields',
    detail: 'Ferrous sulfate: 20% elemental iron (325 mg tab = 65 mg Fe). Ferrous gluconate: 12% elemental iron (325 mg tab = 38 mg Fe). Ferrous fumarate: 33% elemental iron (325 mg tab = 106 mg Fe). Alternate-day dosing prevents hepcidin spikes.',
  },
  {
    topic: 'Drug & Nutrient Interactions with Iron',
    detail: 'Decreases absorption: PPIs/H2 blockers (increased gastric pH), Calcium, Tannins (tea), Phytates (bran). Increases absorption: Vitamin C (ascorbic acid, reduces Fe3+ to Fe2+). Luminal chelation binds Levothyroxine, Fluoroquinolones, Tetracyclines (separate by ≥ 2–4 hours).',
  },
  {
    topic: 'Ganzoni Iron Deficit Equation',
    detail: 'Total Iron Deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Iron Depot Stores (usually 500 mg). The 2.4 factor accounts for blood volume (0.07 L/kg) and Hb iron concentration (3.4 mg/g).',
  },
  {
    topic: 'Parenteral Iron Safety Pearls',
    detail: 'Iron Dextran: Requires mandatory 25 mg IV test dose due to dextran-antibody anaphylaxis risk. Ferumoxytol: Superparamagnetic nanoparticles cause MRI artifact for up to 3 months. Ferric Carboxymaltose: Induces FGF23 elevation causing renal phosphate wasting (hypophosphatemia). Monoferric: Approved for single 1,000 mg IV infusion in adults ≥ 50 kg.',
  },
  {
    topic: 'B12 vs Folate Megaloblastic Anemia',
    detail: 'Both cause macrocytosis (MCV > 100) and elevated Homocysteine. ONLY B12 deficiency causes elevated Methylmalonic Acid (MMA) and subacute combined degeneration (neurologic deficits). Folic acid alone in B12 deficiency can mask anemia while irreversible neurotoxicity progresses.',
  },
  {
    topic: 'ESA & CKD Safety Parameters',
    detail: 'ESAs (epoetin alfa, darbepoetin) are contraindicated in uncontrolled hypertension. FDA Boxed Warning: Never target Hb > 11 g/dL due to increased risks of stroke, myocardial infarction, thrombosis, and mortality. Vadadustat: Oral HIF-PHI that mimics hypoxia to boost endogenous EPO.',
  },
  {
    topic: 'Sickle Cell Disease Gene Therapies',
    detail: 'Casgevy (exagamglogene autotemcel): Autologous ex-vivo CRISPR/Cas9 editing of BCL11A erythroid enhancer, reactivating fetal hemoglobin (HbF). Lyfgenia (lovotibeglogene autotemcel): Lentiviral vector gene addition of anti-sickling HbA-T87Q.',
  },
];

export interface DifferentialMatrixRow {
  condition: string;
  values: string[];
  keyPearl: string;
  badge?: string;
  firstLineTest?: string;
  goldStandard?: string;
  nextBestStep?: string;
  boardTrap?: string;
}

export interface DifferentialMatrix {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  columns: string[];
  rows: DifferentialMatrixRow[];
}

export interface ComparisonItem {
  label: string;
  subtext?: string;
  highlight: string;
  detail?: string;
  warning?: string;
  badge?: string;
}

export interface ComparisonSection {
  title: string;
  badge?: string;
  color?: string;
  items: ComparisonItem[];
  footerNote?: string;
}

export interface HighYieldPearl {
  topic: string;
  detail: string;
}

export interface HighYieldData {
  differentialMatrix: DifferentialMatrix;
  additionalMatrices?: DifferentialMatrix[];
  comparisonSections: ComparisonSection[];
  highYieldPearls: HighYieldPearl[];
}

export const defaultHighYieldData: HighYieldData = {
  differentialMatrix: {
    id: 'matrix_core_iron',
    title: 'Iron Studies Differential Diagnosis Matrix',
    subtitle: 'Classic board comparison: Serum Iron, Ferritin, TIBC, % TSAT, and Hepcidin',
    category: 'Diagnostic Laboratory Differential',
    columns: ['Condition', 'Serum Iron', 'Ferritin', 'TIBC / Transferrin', '% TSAT', 'Hepcidin', 'Key Distinguishing Clinical Pearl'],
    rows: [
      {
        condition: 'Iron Deficiency Anemia (IDA)',
        values: ['Low (↓)', 'Low (< 30 ng/mL)', 'High (> 400 µg/dL)', 'Low (< 15-20%)', 'Suppressed (↓)'],
        firstLineTest: 'Serum Ferritin & Complete Blood Count (CBC)',
        goldStandard: 'Bone Marrow Biopsy Prussian Blue stain (rarely needed)',
        nextBestStep: 'Investigate source of occult blood loss (Colonoscopy / EGD)',
        boardTrap: 'Ferritin can falsely normalize into 50-100 ng/mL range during coexisting acute inflammation/infection.',
        keyPearl: 'Microcytic hypochromic, pagophagia (ice craving), koilonychia (spoon nails). Ferritin < 30 ng/mL is diagnostic.',
        badge: 'IDA',
      },
      {
        condition: 'Anemia of Chronic Disease (ACD)',
        values: ['Low (↓)', 'Normal to High (> 100 ng/mL)', 'Low to Normal', 'Low to Normal', 'Elevated (↑)'],
        firstLineTest: 'Ferritin, CRP/ESR, and Soluble Transferrin Receptor (sTfR)',
        goldStandard: 'Elevated marrow hemosiderin with absent sideroblasts',
        nextBestStep: 'Optimize management of underlying inflammatory, autoimmune, or malignant condition',
        boardTrap: 'Serum iron is low in BOTH IDA and ACD; TIBC and Ferritin differentiate them.',
        keyPearl: 'Cytokines (IL-6) induce hepcidin, which degrades ferroportin, trapping iron in reticuloendothelial macrophages.',
        badge: 'ACD',
      },
      {
        condition: 'Thalassemia Minor / Trait',
        values: ['Normal', 'Normal to High', 'Normal', 'Normal', 'Normal'],
        firstLineTest: 'CBC with Mentzer Index calculation (MCV / RBC count < 13)',
        goldStandard: 'Hemoglobin Electrophoresis (elevated HbA2 in β-thalassemia)',
        nextBestStep: 'Genetic counseling; avoid inappropriate empiric iron supplementation',
        boardTrap: 'Administering empiric iron therapy to a microcytic patient with thalassemia trait induces iatrogenic iron overload.',
        keyPearl: 'Mentzer index < 13. Marked microcytosis (MCV 60-70) out of proportion to very mild anemia and high RBC count.',
        badge: 'Thal',
      },
      {
        condition: 'Hemochromatosis / Iron Overload',
        values: ['High (↑↑)', 'Markedly High (> 500-1000)', 'Low to Normal', 'High (> 45-50%)', 'Low (HFE mutation)'],
        firstLineTest: 'Transferrin Saturation (% TSAT > 45%) & Ferritin',
        goldStandard: 'HFE gene mutation testing (C282Y homozygosity) / MRI T2* liver iron',
        nextBestStep: 'Therapeutic phlebotomy (target ferritin 50-100 ng/mL); screen first-degree relatives',
        boardTrap: 'Pseudogout (calcium pyrophosphate dihydrate) in 2nd/3rd MCP joints is a high-yield diagnostic clue for hemochromatosis.',
        keyPearl: 'Bronze diabetes (hyperpigmentation + diabetes), cirrhosis, restrictive cardiomyopathy, hypogonadism.',
        badge: 'HFE',
      },
      {
        condition: 'Sideroblastic Anemia',
        values: ['High (↑)', 'High (> 300 ng/mL)', 'Normal to Low', 'High (↑)', 'Normal'],
        firstLineTest: 'Peripheral smear (dimorphic RBCs, Pappenheimer bodies) & Lead level',
        goldStandard: 'Bone Marrow Aspirate showing ≥ 15% Ringed Sideroblasts with Prussian Blue',
        nextBestStep: 'Trial of Pyridoxine (Vitamin B6) for congenital/isoniazid forms; remove offending toxin (lead, alcohol)',
        boardTrap: 'Isoniazid (INH) inhibits pyridoxal kinase, precipitating acquired sideroblastic anemia; always co-prescribe Vitamin B6.',
        keyPearl: 'Defective protoporphyrin synthesis results in iron accumulation around mitochondria circling erythroblast nuclei.',
        badge: 'Sidero',
      },
    ],
  },
  additionalMatrices: [
    {
      id: 'matrix_core_classification',
      title: 'MCV-Based Anemia Classification & Peripheral Smear Matrix',
      subtitle: 'Algorithmic approach based on Mean Corpuscular Volume (MCV) and Reticulocyte Production',
      category: 'Diagnostic Algorithms & Morphology',
      columns: ['Etiology / Category', 'MCV Range', 'Peripheral Smear Hallmark', 'Reticulocyte Count', 'First-Line Diagnostic Workup', 'High-Yield Board Exam Pearl'],
      rows: [
        {
          condition: 'Microcytic Anemias (TAILS)',
          values: ['< 80 fL', 'Target cells (Thal), Hypochromic rings (IDA), Basophilic stippling (Lead)', 'Low (< 2% effective)'],
          firstLineTest: 'Iron panel (Ferritin, Iron, TIBC) + Mentzer Index (MCV/RBC)',
          goldStandard: 'Hb Electrophoresis / Prussian blue marrow stain',
          nextBestStep: 'Distinguish IDA from Thalassemia using Ferritin (< 30) and Mentzer Index (< 13)',
          boardTrap: 'Basophilic stippling is seen in Lead Poisoning and Sideroblastic anemia, whereas Howell-Jolly bodies indicate functional asplenia.',
          keyPearl: 'Mnemonic TAILS: Thalassemia, Anemia of chronic disease, Iron deficiency, Lead poisoning, Sideroblastic anemia.',
          badge: 'MCV < 80',
        },
        {
          condition: 'Normocytic Non-Hemolytic Anemias',
          values: ['80 – 100 fL', 'Normal morphology; normochromic, normocytic', 'Low (Reticulocyte index < 2%)'],
          firstLineTest: 'Serum Creatinine/eGFR, Ferritin, Thyroid panel (TSH)',
          goldStandard: 'Bone marrow biopsy for aplastic anemia or pure red cell aplasia',
          nextBestStep: 'Check renal function (CKD causes decreased erythropoietin synthesis from renal fibroblasts)',
          boardTrap: 'Early Iron Deficiency can present as normocytic before progressing to microcytic hypochromic.',
          keyPearl: 'Low reticulocyte index (< 2%) confirms hypo-proliferation (bone marrow failure, low EPO in CKD, or systemic inflammation).',
          badge: 'MCV 80-100',
        },
        {
          condition: 'Normocytic Hemolytic Anemias',
          values: ['80 – 100 fL', 'Spherocytes, Schistocytes (helmet cells), Bite cells, Sickled cells', 'High (Reticulocytes > 2-3%)'],
          firstLineTest: 'Direct Antiglobulin Test (Coombs), Haptoglobin (low), LDH (high), Total/Indirect Bilirubin',
          goldStandard: 'Peripheral blood smear examination by hematopathologist',
          nextBestStep: 'Examine peripheral blood smear to rapidly distinguish microangiopathy (schistocytes in TTP/HUS) from immune hemolysis',
          boardTrap: 'High reticulocytosis can falsely elevate MCV toward the macrocytic range because reticulocytes are larger than mature erythrocytes.',
          keyPearl: 'Classic hemolytic tetrad: Low Haptoglobin, High LDH, High Indirect (unconjugated) Bilirubin, and Reticulocytosis.',
          badge: 'Hemolytic',
        },
        {
          condition: 'Macrocytic Megaloblastic (B12 / Folate)',
          values: ['> 100 fL (often > 115)', 'Hypersegmented Neutrophils (≥ 5 lobes on > 5% of PMNs), Oval macrocytes', 'Low (ineffective erythropoiesis)'],
          firstLineTest: 'Serum B12, Serum Folate, Methylmalonic Acid (MMA), Homocysteine',
          goldStandard: 'MMA elevation (elevated ONLY in B12; normal in folate deficiency)',
          nextBestStep: 'Administer B12 before or with folate to prevent precipitating irreversible subacute combined degeneration',
          boardTrap: 'Administering Folic Acid alone in B12 deficiency corrects the anemia and smear, but permits irreversible neurologic paralysis to advance.',
          keyPearl: 'B12 deficiency causes Dorsal and Lateral column demyelination (loss of vibration, proprioception, ataxia, spasticity).',
          badge: 'MCV > 100',
        },
        {
          condition: 'Macrocytic Non-Megaloblastic',
          values: ['100 – 110 fL', 'Round macrocytes, Target cells, Stomatocytes; NO hypersegmented PMNs', 'Variable'],
          firstLineTest: 'Liver Function Tests (AST, ALT, GGT), TSH, Alcohol history, Medications',
          goldStandard: 'Bone marrow biopsy if Myelodysplastic Syndrome (MDS) suspected',
          nextBestStep: 'Discontinue offending drugs (hydroxyurea, zidovudine, methotrexate) and address liver/thyroid etiology',
          boardTrap: 'Hypothyroidism and Alcohol use disorder cause round macrocytosis without PMN hypersegmentation or elevated MMA.',
          keyPearl: 'MDS in elderly patients presents with refractory macrocytic cytopenias with Pelger-Huët anomaly (bilobed dumbbell neutrophils).',
          badge: 'Non-Megaloblastic',
        },
      ],
    },
    {
      id: 'matrix_core_hemolytic',
      title: 'Hemolytic Anemia Diagnostic Workup & Mechanism Matrix',
      subtitle: 'Differential diagnosis across immune, microangiopathic, enzymatic, and membrane RBC defects',
      category: 'Diagnostic Workup & Pathology',
      columns: ['Disorder', 'Primary Smear Finding', 'Coombs (DAT)', 'Key Biomarker', 'First-Line Therapy', 'High-Yield Board Pearl'],
      rows: [
        {
          condition: 'Warm Autoimmune Hemolytic Anemia (wAIHA)',
          values: ['Microspherocytes (macrophage splenic partial phagocytosis)', 'Positive for IgG (± C3d) at 37°C', 'Low Haptoglobin, High LDH'],
          firstLineTest: 'Direct Antiglobulin Test (DAT/Coombs) using anti-IgG and anti-C3 reagents',
          goldStandard: 'Direct Coombs test demonstrating polyclonal IgG autoantibodies',
          nextBestStep: 'High-dose systemic Corticosteroids (Prednisone 1 mg/kg/day); add Rituximab if refractory',
          boardTrap: 'Blood bank crossmatching will show all donor units "incompatible" due to pan-reactive warm autoantibodies; do not delay urgent transfusion if hemodynamically unstable.',
          keyPearl: 'Extravascular hemolysis in the spleen. Most common AIHA form; associated with SLE, CLL, and drugs (penicillins, cephalosporins).',
          badge: 'Warm IgG',
        },
        {
          condition: 'Cold Agglutinin Disease (CAD)',
          values: ['RBC Agglutination / Clumping (grape-like clusters on room temp smear)', 'Positive for C3d ONLY (IgM detaches at 37°C)', 'High Cold Agglutinin titer (≥ 1:64)'],
          firstLineTest: 'Direct Coombs test for C3d; peripheral smear collected in pre-warmed tube',
          goldStandard: 'Cold agglutinin antibody titer (IgM monoclonal or polyclonal)',
          nextBestStep: 'Keep patient strictly warm; avoid cold exposure; Rituximab or Sutimlimab (C1s inhibitor)',
          boardTrap: 'Corticosteroids and splenectomy are INEFFECTIVE in CAD because hemolysis occurs in the liver via C3b opsonization.',
          keyPearl: 'Triggered by Mycoplasma pneumoniae infection, Epstein-Barr virus (mononucleosis), or B-cell lymphoproliferative disorders.',
          badge: 'Cold IgM',
        },
        {
          condition: 'Hereditary Spherocytosis',
          values: ['Dense spherocytes lacking central pallor; elevated MCHC (> 36 g/dL)', 'Negative Direct Coombs (non-immune)', 'MCHC > 36 g/dL, RDW elevated'],
          firstLineTest: 'CBC with MCHC & Eosin-5-maleimide (EMA) binding test by flow cytometry',
          goldStandard: 'EMA binding flow cytometry test / Acidified Glycerol Lysis / Osmotic Fragility',
          nextBestStep: 'Daily folic acid supplementation; consider Splenectomy if severe recurrent hemolysis (vaccinate against encapsulated organisms beforehand!)',
          boardTrap: 'Pigment gallstones (calcium bilirubinate) and aplastic crisis triggered by Parvovirus B19 are classic complications.',
          keyPearl: 'Autosomal dominant defect in RBC membrane cytoskeleton proteins (spectrin, ankyrin, band 3, protein 4.2).',
          badge: 'Membrane Defect',
        },
        {
          condition: 'G6PD Deficiency',
          values: ['Heinz bodies (crystal violet stain) and "Bite cells" / Degmacytes', 'Negative Direct Coombs', 'G6PD enzyme activity assay'],
          firstLineTest: 'Peripheral smear review; G6PD quantitative enzyme assay',
          goldStandard: 'Quantitative spectrophotometric G6PD enzyme assay (timed correctly!)',
          nextBestStep: 'Discontinue offending oxidative medication immediately; supportive care and hydration',
          boardTrap: 'Testing G6PD enzyme levels DURING an acute hemolytic episode can yield a false-normal result because older, enzyme-depleted RBCs have already hemolyzed and reticulocytes have high enzyme levels! Retest 2-3 months after episode resolution.',
          keyPearl: 'X-linked recessive. Oxidative triggers: Fava beans, Nitrofurantoin, Dapsone, Primaquine, Rasburicase, Sulfonamides.',
          badge: 'Enzymopathy',
        },
        {
          condition: 'Thrombotic Thrombocytopenic Purpura (TTP)',
          values: ['Abundant Schistocytes (helmet cells, fragmented RBCs > 2-3 per HPF)', 'Negative Direct Coombs', 'ADAMTS13 activity < 10%'],
          firstLineTest: 'Peripheral smear for schistocytes, Platelet count, PT/aPTT (normal in TTP, unlike DIC)',
          goldStandard: 'Severe deficiency of ADAMTS13 protease activity (< 10%) with presence of inhibitor',
          nextBestStep: 'Emergency Therapeutic Plasma Exchange (PEX) + Corticosteroids + Caplacizumab (anti-vWF nanobody)',
          boardTrap: 'Platelet transfusion is CONTRAINDICATED in TTP because infusing platelets fuels widespread microvascular thrombosis ("adding fuel to the fire").',
          keyPearl: 'Classic Pentad (FAT RN): Fever, microangiopathic Anemia, Thrombocytopenia, Renal impairment, Neurologic symptoms. PT and PTT are completely NORMAL.',
          badge: 'Microangiopathy',
        },
        {
          condition: 'Paroxysmal Nocturnal Hemoglobinuria (PNH)',
          values: ['Normocytic to macrocytic anemia; mild polychromasia', 'Negative Direct Coombs', 'Absence of CD55 and CD59 on flow cytometry'],
          firstLineTest: 'Flow cytometry of peripheral blood granulocytes and erythrocytes for GPI-anchored proteins (CD55, CD59, FLAER)',
          goldStandard: 'Multi-parameter flow cytometry utilizing FLAER (fluorescent aerolysin)',
          nextBestStep: 'Terminal complement C5 inhibitor therapy (Eculizumab or Ravulizumab); prophylactic anticoagulation',
          boardTrap: 'Venous thrombosis in unusual sites (hepatic vein / Budd-Chiari syndrome, mesenteric, dermal, sagittal sinus) is the leading cause of mortality in PNH.',
          keyPearl: 'Acquired somatic mutation in PIGA gene causing loss of GPI anchors that tether complement defense proteins CD55 (DAF) and CD59 (MAC-inhibitory protein).',
          badge: 'PNH',
        },
      ],
    },
    {
      id: 'matrix_core_pharma',
      title: 'Pharmacotherapy Dosing, Guideline Thresholds & Safety Matrix',
      subtitle: 'Clinical pharmacology, elemental yields, black box warnings, and clinical thresholds',
      category: 'Pharmacotherapy & Clinical Pharmacology',
      columns: ['Agent / Class', 'Mechanism / Profile', 'Clinical Dosing Protocol', 'Key Monitoring Metric', 'Boxed Warning / Clinical Contraindication', 'Board Examination Pearl'],
      rows: [
        {
          condition: 'Oral Ferrous Salts (Sulfate, Gluconate, Fumarate)',
          values: ['Elemental yields: Sulfate 20% (65 mg), Gluconate 12% (38 mg), Fumarate 33% (106 mg)', 'Alternate-day morning dosing (e.g. 65 mg Fe every other day)', 'Reticulocytosis peak at 7-10 days; Hb rises ~1-2 g/dL by 3-4 weeks'],
          firstLineTest: 'Baseline CBC and Iron saturation prior to therapy',
          goldStandard: 'Normalized Ferritin (> 50-100 ng/mL) and resolved anemia after 3-6 months maintenance',
          nextBestStep: 'Take on empty stomach with water or Vitamin C; separate from calcium, antacids, PPIs, tea, and levothyroxine by ≥ 2-4 hours',
          boardTrap: 'Prescribing TID dosing increases serum hepcidin for 24-48 hours, blocking absorption of subsequent doses while doubling GI toxicity; alternate-day dosing is superior.',
          keyPearl: 'Continue oral iron for 3 to 6 months AFTER hemoglobin normalizes to fully replenish bone marrow iron depot stores (500-1000 mg).',
          badge: 'Oral Iron',
        },
        {
          condition: 'Parenteral Iron (Dextran, FCM, Monoferric)',
          values: ['Rapid intravenous replenishment of Ganzoni deficit; bypasses GI tract and hepcidin block', 'Iron Dextran: 25 mg test dose mandatory; FCM: 750 mg × 2; Monoferric: 1000 mg single dose', 'Serum iron parameters checked ≥ 4-8 weeks after infusion'],
          firstLineTest: 'Indicated for oral iron intolerance, IBD flares, celiac disease, CKD on dialysis, or heavy uterine bleeding',
          goldStandard: 'Calculation of Ganzoni iron deficit: Weight (kg) × (Target Hb - Actual Hb) × 2.4 + 500 mg',
          nextBestStep: 'Ensure resuscitation medications (epinephrine, antihistamines) are available for Iron Dextran infusions',
          boardTrap: 'Ferric Carboxymaltose (FCM) causes FGF23 elevation leading to severe renal phosphate wasting and symptomatic hypophosphatemia.',
          keyPearl: 'Superparamagnetic nanoparticles in Ferumoxytol (Feraheme) cause diagnostic MRI artifact distortions for up to 3 months.',
          badge: 'IV Iron',
        },
        {
          condition: 'Erythropoiesis-Stimulating Agents (ESAs)',
          values: ['Recombinant human EPO (Epoetin alfa) & hyperglycosylated analogue (Darbepoetin alfa)', 'Initiate ONLY when Hb < 10 g/dL in CKD; reduce or interrupt dose if Hb approaches 11 g/dL', 'Hemoglobin monitored weekly until stable, then monthly'],
          firstLineTest: 'Ensure adequate iron stores (% TSAT ≥ 20% and Ferritin ≥ 100-200 ng/mL) before starting ESA',
          goldStandard: 'Restoration of target Hb 10-11 g/dL without blood transfusions',
          nextBestStep: 'Replete iron stores prior to or concurrently with ESA; without iron, functional iron deficiency impedes EPO response',
          boardTrap: 'FDA Boxed Warning: Never target Hb > 11 g/dL (increases risks of stroke, myocardial infarction, venous thromboembolism, and death). Contraindicated in uncontrolled hypertension.',
          keyPearl: 'Pure Red Cell Aplasia (PRCA) can rarely occur due to anti-erythropoietin neutralizing antibodies.',
          badge: 'ESAs',
        },
        {
          condition: 'Cyanocobalamin & Hydroxocobalamin (B12)',
          values: ['Co-factor for methionine synthase (homocysteine to methionine) & methylmalonyl-CoA mutase', '1,000 mcg IM daily × 1 week, then weekly × 1 month, then monthly for life (or 1,000-2,000 mcg oral daily)', 'Serum potassium in first 48 hours; Reticulocyte spike at 5-7 days'],
          firstLineTest: 'Serum B12 & Methylmalonic acid level',
          goldStandard: 'Pernicious anemia confirmed by Anti-Intrinsic Factor or Anti-Parietal Cell antibodies',
          nextBestStep: 'Monitor for severe Hypokalemia during initial rapid reticulocyte surge as massive new erythroblasts consume potassium',
          boardTrap: 'High-dose oral B12 (1,000–2,000 mcg/day) is effective even in pernicious anemia via 1-2% passive paracellular duodenal absorption!',
          keyPearl: 'Hydroxocobalamin is also the FDA-approved first-line antidote for Cyanide poisoning (binds CN to form cyanocobalamin).',
          badge: 'Vitamin B12',
        },
      ],
    },
  ],
  comparisonSections: [
    {
      title: 'Oral Iron Salts: Elemental Iron Comparison',
      badge: 'Oral Pharmacotherapy',
      color: 'indigo',
      items: [
        {
          label: 'Ferrous Sulfate (Standard)',
          subtext: '325 mg tablet',
          highlight: '65 mg (20% elemental Fe)',
          detail: 'Standard initial therapeutic salt; take on empty stomach or alternate days.',
        },
        {
          label: 'Dried Ferrous Sulfate (Slow-Fe)',
          subtext: '200 mg tablet (enteric-coated)',
          highlight: '65 mg (30% elemental Fe)',
          detail: 'Delayed dissolution distal to the duodenum can lower fractional absorption.',
        },
        {
          label: 'Ferrous Gluconate (Gentler on GI)',
          subtext: '325 mg tablet',
          highlight: '38 mg (12% elemental Fe)',
          detail: 'Lower elemental iron content yields reduced gastrointestinal distress and improved adherence.',
        },
        {
          label: 'Ferrous Fumarate (High Yield)',
          subtext: '325 mg tablet',
          highlight: '106 mg (33% elemental Fe)',
          detail: 'Highest percentage elemental yield per tablet.',
        },
      ],
      footerNote: 'Clinical Dosing Pearls: Alternate-day dosing (e.g. 65 mg Fe every other morning) is preferred over TID dosing to prevent hepcidin elevation and enhance fractional absorption while cutting GI side effects in half.',
    },
    {
      title: 'Parenteral (IV) Iron Formulations Safety & Dosing',
      badge: 'IV Formulations',
      color: 'emerald',
      items: [
        {
          label: 'Iron Dextran (INFeD)',
          subtext: 'Boxed Warning',
          highlight: 'Mandatory 25 mg Test Dose',
          detail: 'Requires mandatory 25 mg (0.5 mL) IV test dose with 1-hr observation before full dose due to antibody-mediated anaphylaxis risk.',
          warning: 'Boxed warning for fatal anaphylaxis',
          badge: 'High Risk',
        },
        {
          label: 'Iron Sucrose (Venofer)',
          subtext: 'Multi-dose Regimen',
          highlight: '200 mg IV on 5 sessions',
          detail: 'Dosed as 200 mg slow push (max 1,000 mg over 14 days). Rapid push can induce dose-dependent hypotension.',
        },
        {
          label: 'Ferric Carboxymaltose (Injectafer)',
          subtext: 'Two-dose Repletion',
          highlight: '750 mg IV × 2 doses (≥ 7 days apart)',
          detail: 'Causes intact FGF23 elevation and renal phosphate wasting; monitor serum phosphate in repeat courses.',
          warning: 'Hypophosphatemia risk',
        },
        {
          label: 'Ferric Derisomaltose (Monoferric)',
          subtext: 'Single Rapid Infusion',
          highlight: '1,000 mg IV in 20 minutes',
          detail: 'FDA-approved for complete 1,000 mg single-visit infusion in adults ≥ 50 kg with significantly lower hypophosphatemia rates.',
        },
        {
          label: 'Ferumoxytol (Feraheme)',
          subtext: 'Superparamagnetic Nanoparticles',
          highlight: '510 mg IV × 2 doses (3-8 days apart)',
          detail: 'Nanoparticles alter T1/T2 MRI scans for up to 3 months; warn radiologists before imaging.',
          warning: 'MRI artifact distortion',
        },
      ],
    },
    {
      title: 'Macrocytic Megaloblastic Anemia: B12 vs Folate',
      badge: 'Differential Pearls',
      color: 'purple',
      items: [
        {
          label: 'Diagnostic Biomarkers',
          highlight: 'MMA elevated ONLY in B12',
          detail: 'Homocysteine is elevated in BOTH B12 & Folate. Methylmalonic acid (MMA) is elevated ONLY in B12 deficiency (normal in folate). MCV > 100 in both.',
        },
        {
          label: 'Neurologic Consequences',
          highlight: 'Subacute Combined Degeneration',
          detail: 'Loss of vibration/proprioception, paresthesias, sensory ataxia in B12 deficiency. Giving folate alone corrects anemia while allowing irreversible spinal cord damage to progress!',
          warning: 'Folate trap danger',
        },
        {
          label: 'Therapeutic Replacement & Reserves',
          highlight: 'B12 stores: 3-5 yrs | Folate: 3-4 mos',
          detail: 'Pernicious anemia requires IM cyanocobalamin 1,000 mcg monthly for life (or Nascobal 500 mcg weekly nasal spray). Folate deficiency: Folic acid 1 mg PO daily for 4 months.',
        },
      ],
    },
  ],
  highYieldPearls: [
    {
      topic: 'Anemia Diagnostic Criteria (WHO)',
      detail: 'Men: Hb < 13 g/dL (Hct < 39%). Non-pregnant Women: Hb < 12 g/dL (Hct < 36%). Pregnant Women: Hb < 11 g/dL. Normal RBC lifespan: 120 days (~4 months).',
    },
    {
      topic: 'Iron Deficiency vs Inflammation (ACD)',
      detail: 'IDA: Ferritin low (< 30 ng/mL), TIBC high (> 400 µg/dL), Serum Iron low. ACD: Ferritin high/normal (acute phase reactant, > 100–400 ng/mL), TIBC low/normal, Serum Iron low. Hepcidin is elevated in inflammation, degrading ferroportin.',
    },
    {
      topic: 'Oral Iron Salt Elemental Yields',
      detail: 'Ferrous sulfate: 20% elemental iron (325 mg tab = 65 mg Fe). Ferrous gluconate: 12% elemental iron (325 mg tab = 38 mg Fe). Ferrous fumarate: 33% elemental iron (325 mg tab = 106 mg Fe). Alternate-day dosing prevents hepcidin spikes.',
    },
    {
      topic: 'Drug & Nutrient Interactions with Iron',
      detail: 'Decreases absorption: PPIs/H2 blockers (increased gastric pH), Calcium, Tannins (tea), Phytates (bran). Increases absorption: Vitamin C (ascorbic acid, reduces Fe3+ to Fe2+). Luminal chelation binds Levothyroxine, Fluoroquinolones, Tetracyclines (separate by ≥ 2–4 hours).',
    },
    {
      topic: 'Ganzoni Iron Deficit Equation',
      detail: 'Total Iron Deficit (mg) = [Weight (kg) × (Target Hb − Actual Hb) × 2.4] + Iron Depot Stores (usually 500 mg). The 2.4 factor accounts for blood volume (0.07 L/kg) and Hb iron concentration (3.4 mg/g).',
    },
    {
      topic: 'Parenteral Iron Safety Pearls',
      detail: 'Iron Dextran: Requires mandatory 25 mg IV test dose due to dextran-antibody anaphylaxis risk. Ferumoxytol: Superparamagnetic nanoparticles cause MRI artifact for up to 3 months. Ferric Carboxymaltose: Induces FGF23 elevation causing renal phosphate wasting (hypophosphatemia). Monoferric: Approved for single 1,000 mg IV infusion in adults ≥ 50 kg.',
    },
    {
      topic: 'B12 vs Folate Megaloblastic Anemia',
      detail: 'Both cause macrocytosis (MCV > 100) and elevated Homocysteine. ONLY B12 deficiency causes elevated Methylmalonic Acid (MMA) and subacute combined degeneration (neurologic deficits). Folic acid alone in B12 deficiency can mask anemia while irreversible neurotoxicity progresses.',
    },
    {
      topic: 'ESA & CKD Safety Parameters',
      detail: 'ESAs (epoetin alfa, darbepoetin) are contraindicated in uncontrolled hypertension. FDA Boxed Warning: Never target Hb > 11 g/dL due to increased risks of stroke, myocardial infarction, thrombosis, and mortality. Vadadustat: Oral HIF-PHI that mimics hypoxia to boost endogenous EPO.',
    },
    {
      topic: 'Sickle Cell Disease Gene Therapies',
      detail: 'Casgevy (exagamglogene autotemcel): Autologous ex-vivo CRISPR/Cas9 editing of BCL11A erythroid enhancer, reactivating fetal hemoglobin (HbF). Lyfgenia (lovotibeglogene autotemcel): Lentiviral vector gene addition of anti-sickling HbA-T87Q.',
    },
  ],
};

