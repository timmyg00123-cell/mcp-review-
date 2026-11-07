# Design Specification: Exam 2 Sympatholytics Module Benchmark Overhaul (`antihypertensives_2_mcp2`)

**Date:** 2026-11-07  
**Module ID:** `antihypertensives_2_mcp2`  
**Target Version:** `2.0.0`  
**Primary Source:** Dr. Rami A. Al-Horani's `4) Review for Antihypertensive Drugs II.pdf` (`scratch/exam_2_review_text/4) Review for Antihypertensive Drugs II.md`)  
**Design Authority:** 1:1 Review Page Alignment (Approach A) matching Dr. Al-Horani's 7-page review document.

---

## 1. Problem Statement & Audit Findings

The existing `src/data/exam2/sympatholyticsModuleData.ts` suffers from major discrepancies compared to the benchmark established in Exam 1 Respiratory and Exam 2 Diuretics:
1. **Compressed Page Structure**: It crams 7 distinct review pages into 3 synthetic pages.
2. **Synthetic / Non-Sequential Question Labels**: Questions carry global IDs (`Q401`, `Q402`... `Q443`) and non-page-sequential labels instead of `Question 1` through `Question N` resetting on every review page.
3. **Parenthetical Drug Name Spoilers**: Multiple-choice options and question stems disclose target names in parentheses (e.g. `Drug I (Propranolol)`, `Drug II (Metoprolol) and Drug III (Esmolol)`, `Drug IV (Carvedilol), due to its electron-rich carbazole ring system`).
4. **Lack of Drag-and-Drop Matching**: Complex multi-drug comparative classifications (e.g. Slide 2 Q8–Q16 landmark properties; Slide 7 Q43 3-way drug comparison) are rendered as plain multiple-choice questions instead of interactive Drag-and-Drop matching matrices (`type: 'matching'`).

---

## 2. Core Architectural Principles

1. **Strict 1:1 Review Page Alignment (7 Review Pages)**:
   - **Review Page 1**: $\beta$-Blockers Overview & SAR (Q1–Q7) — 7 questions.
   - **Review Page 2**: $\beta$-Blocker Landmark Properties Matching & Central $\alpha_2$-Agonists Intro (Q8–Q19) — 12 questions (with Q1 being an interactive Drag & Drop matching matrix covering Q8–Q16 landmark attributes, followed by Q10, Q11, Q17 SAR, Q18 True/False battery, and Q19 ortho-substituent SAR).
   - **Review Page 3**: Methyldopa Bioactivation Cascade & Central Sympatholytics (Q20–Q24) — 5 questions (Q20 Methyldopa kinetics, Q21 active metabolite structure, Q22 bioactivating enzymes multi-select, Q23 mechanism True/False, Q24 site of action True/False).
   - **Review Page 4**: Aryloxypropanolamine vs. Arylethanolamine SAR & Postganglionic Neuronal Blockers (Q25–Q27) — 3 questions (Q25 Molecule I vs II 8-statement battery, Q26 Sympatholytic I ISA/bronchospasm, Q27 Guanfacine vs Guanethidine 7-statement battery).
   - **Review Page 5**: Mixed $\alpha/\beta$-Antagonists (Carvedilol Domains) & Quinazoline $\alpha_1$-Antagonists Intro (Q28–Q33) — 6 questions (Q28 Carvedilol class, Q29 receptor-binding domain, Q30 subtype-specificity domain, Q31 PK domain, Q32 Quinazoline-piperazines class, Q33 Direct sympatholytics category).
   - **Review Page 6**: Quinazoline SAR, BPH Selectivity & Nebivolol CYP2D6 Pharmacogenomics (Q34–Q42) — 9 questions (Q34 Selective $\alpha_1$-antagonists, Q35 $\alpha_{1A}$ selectivity ranking, Q36 non-essential furan ring, Q37 HTN + BPH indication, Q38 uroselective Tamsulosin, Q39 non-subtype selective quinazolines, Q40 reflex tachycardia risk, Q41 CYP2D6 EM vs PM phenotypes, Q42 Nebivolol 8-statement True/False battery).
   - **Review Page 7**: Head-to-Head Comparative Matrix: Nebivolol vs. Carvedilol vs. Propranolol (Q43) — 1 question (Q1), an interactive 4-domain head-to-head matching/sub-statement battery (Cardioselectivity, Vasodilatory mechanism, CNS side effects, Membrane-stabilizing activity).

2. **Sequential Question Numbering**:
   - Every review page must have explicit `questionNumberLabel: 'Question N'` starting at `Question 1` and incrementing sequentially (`Question 1`, `Question 2`, ...).

3. **Zero Parenthetical Spoilers**:
   - Stems and options must refer to structures exclusively by Roman numerals (`Structure I`, `Structure II`, etc.) or code letters (`Drug N`, `Drug C`, `Drug P`).
   - No drug names may appear in parentheses within options for questions where structure identification is the core objective.

4. **Drag & Drop Matching Matrices**:
   - **Review Page 2, Question 1 (id: 408)**: Interactive Drag-and-Drop matching matrix mapping landmark $\beta$-blocker attributes to Structures I through VI:
     - `Fast Na+ channel blockade / Membrane-stabilizing activity (MSA)` $\rightarrow$ `Structure I` (Propranolol)
     - `Intrinsic sympathomimetic activity (ISA / partial agonist)` $\rightarrow$ `Structure V` (Pindolol)
     - `Ultrashort duration of action (RBC esterase hydrolysis; t1/2 ~9 min)` $\rightarrow$ `Structure III` (Esmolol)
     - `Electron-rich carbazole ring with antioxidant / free radical scavenging activity` $\rightarrow$ `Structure IV` (Carvedilol)
     - `Hydrophilic polar diol avoiding first-pass hepatic metabolism with longest t1/2 (~20-24 h)` $\rightarrow$ `Structure VI` (Nadolol)
     - `Cardioselective beta-1 blocker preferred in patients with reactive airway history` $\rightarrow$ `Structure II` (Metoprolol)

5. **Chemical Structures**:
   - Ensure all structures needed across Pages 1–7 are registered in `EXAM_2_STRUCTURES` and exported in `SYMPATHOLYTICS_STRUCTURES`, notably adding `nebivolol` with verified SMILES `C1CC2=C(COC1C(CNCC(C3CCC4=C(CO3)C=CC(=C4)F)O)O)C=CC(=C2)F`.

6. **Version Bump & Cache Invalidation**:
   - Bump module version to `'2.0.0'`.
   - Update `src/utils/moduleStorage.ts` to invalidate cached Sympatholytics modules having `version !== '2.0.0'` or `pages.length < 7`.
