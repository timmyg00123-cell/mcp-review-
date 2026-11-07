import assert from 'node:assert/strict';
import {
  getDefaultRespiratoryReviewModule,
  getRespiratoryReviewPages,
  RESPIRATORY_REVIEW_STRUCTURES,
  EPINEPHRINE_STRUCTURE,
  NOREPINEPHRINE_STRUCTURE,
  ISOPROTERENOL_STRUCTURE,
  DOBUTAMINE_STRUCTURE,
  ALBUTEROL_STRUCTURE,
  LEVALBUTEROL_STRUCTURE,
  PIRBUTEROL_STRUCTURE,
  SALMETEROL_STRUCTURE,
  FORMOTEROL_STRUCTURE,
  INDACATEROL_STRUCTURE,
  OLODATEROL_STRUCTURE,
  VILANTEROL_STRUCTURE,
  IPRATROPIUM_STRUCTURE,
  TIOTROPIUM_STRUCTURE,
  ACLIDINIUM_STRUCTURE,
  UMECLIDINIUM_STRUCTURE,
  GLYCOPYRROLATE_STRUCTURE,
  DARIFENACIN_STRUCTURE,
  TRIHEXYPHENIDYL_STRUCTURE,
  HYDROCORTISONE_STRUCTURE,
  CORTISONE_STRUCTURE,
  PREDNISOLONE_STRUCTURE,
  PREDNISONE_STRUCTURE,
  METHYLPREDNISOLONE_STRUCTURE,
  DEXAMETHASONE_STRUCTURE,
  ALDOSTERONE_STRUCTURE,
  TRIAMCINOLONE_ACETONIDE_STRUCTURE,
  BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
  FLUTICASONE_PROPIONATE_STRUCTURE,
  FLUTICASONE_FUROATE_STRUCTURE,
  MOMETASONE_FUROATE_STRUCTURE,
  CICLESONIDE_STRUCTURE,
  CLOBETASOL_PROPIONATE_STRUCTURE,
  HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE,
  HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE,
  THEOPHYLLINE_STRUCTURE,
  ROFLUMILAST_STRUCTURE,
  ENSIFENTRINE_STRUCTURE,
  ZILEUTON_STRUCTURE,
  MONTELUKAST_STRUCTURE,
  ZAFIRLUKAST_STRUCTURE,
} from '../src/data/respiratoryReviewModuleData';

console.log('Testing Respiratory Review Module (respiratoryReviewModuleData.ts)...');

// 1. Module Definition & Metadata
const mod = getDefaultRespiratoryReviewModule();
assert.equal(mod.id, 'respiratory_review_mcp2', 'Module ID must be respiratory_review_mcp2');
assert.equal(mod.title, 'Review for Respiratory Drugs', 'Title must be Review for Respiratory Drugs');
assert.equal(
  mod.subtitle,
  'Adrenergic SAR, Anticholinergics, Corticosteroids, PDE Inhibitors & Leukotriene Modulators',
  'Subtitle must match specification'
);
assert.equal(mod.course, 'Medicinal Chemistry (MCP II)', 'Course must be Medicinal Chemistry (MCP II)');
assert.equal(mod.semester, 'Fall 2026', 'Semester must be Fall 2026');
assert.equal(mod.code, 'Exam 1', 'Code must be Exam 1');
assert.equal(mod.examId, 'exam_1', 'Exam ID must be exam_1');
assert.equal(mod.examTitle, 'Exam 1: Renal & Respiratory Medicinal Chemistry');
assert.equal(mod.isBuiltIn, true, 'isBuiltIn must be true');

// 2. Pages structure
const pages = getRespiratoryReviewPages();
assert.equal(pages.length, 9, 'Module must have exactly 9 pages matching Slides 1-9 of the review PDF');
assert.equal(mod.pages.length, 9, 'getDefaultRespiratoryReviewModule() pages must match getRespiratoryReviewPages()');

// 3. Chemical Structure Audits (All 41 Landmark Structures)
const landmarkStructures = [
  EPINEPHRINE_STRUCTURE,
  NOREPINEPHRINE_STRUCTURE,
  ISOPROTERENOL_STRUCTURE,
  DOBUTAMINE_STRUCTURE,
  ALBUTEROL_STRUCTURE,
  LEVALBUTEROL_STRUCTURE,
  PIRBUTEROL_STRUCTURE,
  SALMETEROL_STRUCTURE,
  FORMOTEROL_STRUCTURE,
  INDACATEROL_STRUCTURE,
  OLODATEROL_STRUCTURE,
  VILANTEROL_STRUCTURE,
  IPRATROPIUM_STRUCTURE,
  TIOTROPIUM_STRUCTURE,
  ACLIDINIUM_STRUCTURE,
  UMECLIDINIUM_STRUCTURE,
  GLYCOPYRROLATE_STRUCTURE,
  DARIFENACIN_STRUCTURE,
  TRIHEXYPHENIDYL_STRUCTURE,
  HYDROCORTISONE_STRUCTURE,
  CORTISONE_STRUCTURE,
  PREDNISOLONE_STRUCTURE,
  PREDNISONE_STRUCTURE,
  METHYLPREDNISOLONE_STRUCTURE,
  DEXAMETHASONE_STRUCTURE,
  ALDOSTERONE_STRUCTURE,
  TRIAMCINOLONE_ACETONIDE_STRUCTURE,
  BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
  FLUTICASONE_PROPIONATE_STRUCTURE,
  FLUTICASONE_FUROATE_STRUCTURE,
  MOMETASONE_FUROATE_STRUCTURE,
  CICLESONIDE_STRUCTURE,
  CLOBETASOL_PROPIONATE_STRUCTURE,
  HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE,
  HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE,
  THEOPHYLLINE_STRUCTURE,
  ROFLUMILAST_STRUCTURE,
  ENSIFENTRINE_STRUCTURE,
  ZILEUTON_STRUCTURE,
  MONTELUKAST_STRUCTURE,
  ZAFIRLUKAST_STRUCTURE,
];

assert.equal(landmarkStructures.length, 41, 'Must have audited exactly 41 landmark structures');

landmarkStructures.forEach((struct) => {
  assert.ok(struct.id, `Structure must have id: ${struct.name}`);
  assert.ok(struct.name, 'Structure must have name');
  assert.ok(struct.chemicalClass, `Structure ${struct.name} must have chemicalClass`);
  assert.ok(struct.pharmacologicalClass, `Structure ${struct.name} must have pharmacologicalClass`);
  assert.ok(struct.smiles, `Structure ${struct.name} must have smiles`);
  assert.ok(struct.canonicalSmiles, `Structure ${struct.name} must have canonicalSmiles`);
  assert.ok(struct.cid && struct.cid > 0, `Structure ${struct.name} must have PubChem CID`);
  assert.ok(struct.mw && struct.mw > 0, `Structure ${struct.name} must have molecular weight`);
  assert.ok(typeof struct.logP === 'number', `Structure ${struct.name} must have logP`);
  assert.ok(struct.keyFunctionalGroups && struct.keyFunctionalGroups.length >= 2, `Structure ${struct.name} must have keyFunctionalGroups`);
  assert.ok(struct.pkPdHighlights, `Structure ${struct.name} must have pkPdHighlights`);
  assert.ok(struct.sarNotes && struct.sarNotes.length >= 20, `Structure ${struct.name} must have detailed sarNotes`);
  assert.ok(struct.moa_summary && struct.moa_summary.length >= 20, `Structure ${struct.name} must have moa_summary`);
  assert.ok(struct.pubchemUrl?.startsWith('https://pubchem.ncbi.nlm.nih.gov/compound/'), `Structure ${struct.name} must have pubchemUrl`);
  assert.ok(struct.pngUrl?.includes('PNG'), `Structure ${struct.name} must have pngUrl`);
});

// Specific PubChem CID Audits
assert.equal(EPINEPHRINE_STRUCTURE.cid, 5816);
assert.equal(NOREPINEPHRINE_STRUCTURE.cid, 439260);
assert.equal(ISOPROTERENOL_STRUCTURE.cid, 3779);
assert.equal(DOBUTAMINE_STRUCTURE.cid, 36811);
assert.equal(ALBUTEROL_STRUCTURE.cid, 2083);
assert.equal(LEVALBUTEROL_STRUCTURE.cid, 123600);
assert.equal(PIRBUTEROL_STRUCTURE.cid, 4845);
assert.equal(SALMETEROL_STRUCTURE.cid, 5152);
assert.equal(FORMOTEROL_STRUCTURE.cid, 3410);
assert.equal(INDACATEROL_STRUCTURE.cid, 6918554);
assert.equal(OLODATEROL_STRUCTURE.cid, 11504295);
assert.equal(VILANTEROL_STRUCTURE.cid, 10184665);
assert.equal(IPRATROPIUM_STRUCTURE.cid, 25897919);
assert.equal(TIOTROPIUM_STRUCTURE.cid, 5487427);
assert.equal(ACLIDINIUM_STRUCTURE.cid, 11434515);
assert.equal(UMECLIDINIUM_STRUCTURE.cid, 11519070);
assert.equal(GLYCOPYRROLATE_STRUCTURE.cid, 3494);
assert.equal(DARIFENACIN_STRUCTURE.cid, 444031);
assert.equal(TRIHEXYPHENIDYL_STRUCTURE.cid, 5572);
assert.equal(HYDROCORTISONE_STRUCTURE.cid, 5754);
assert.equal(CORTISONE_STRUCTURE.cid, 222786);
assert.equal(PREDNISOLONE_STRUCTURE.cid, 5755);
assert.equal(PREDNISONE_STRUCTURE.cid, 5865);
assert.equal(METHYLPREDNISOLONE_STRUCTURE.cid, 6741);
assert.equal(DEXAMETHASONE_STRUCTURE.cid, 5743);
assert.equal(ALDOSTERONE_STRUCTURE.cid, 5839);
assert.equal(TRIAMCINOLONE_ACETONIDE_STRUCTURE.cid, 6436);
assert.equal(BECLOMETHASONE_DIPROPIONATE_STRUCTURE.cid, 21700);
assert.equal(FLUTICASONE_PROPIONATE_STRUCTURE.cid, 444036);
assert.equal(FLUTICASONE_FUROATE_STRUCTURE.cid, 9854489);
assert.equal(MOMETASONE_FUROATE_STRUCTURE.cid, 441336);
assert.equal(CICLESONIDE_STRUCTURE.cid, 6918155);
assert.equal(CLOBETASOL_PROPIONATE_STRUCTURE.cid, 32798);
assert.equal(HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE.cid, 441407);
assert.equal(HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE.cid, 16623);
assert.equal(THEOPHYLLINE_STRUCTURE.cid, 2153);
assert.equal(ROFLUMILAST_STRUCTURE.cid, 449193);
assert.equal(ENSIFENTRINE_STRUCTURE.cid, 9934746);
assert.equal(ZILEUTON_STRUCTURE.cid, 60490);
assert.equal(MONTELUKAST_STRUCTURE.cid, 5281040);
assert.equal(ZAFIRLUKAST_STRUCTURE.cid, 5717);

// Structure registry map validation
assert.equal(Object.keys(RESPIRATORY_REVIEW_STRUCTURES).length, 41, 'Structure registry map must hold all 41 structures');

// 4. Slide 1 (Page 1): Combination Bronchodilators & Anti-inflammatory Regimens
const page1 = pages[0]!;
assert.equal(page1.pageNumber, 1, 'Page 1 must be pageNumber 1');
const p1Questions = page1.sections.flatMap((s) => s.questions);
assert.ok(p1Questions.length >= 3, 'Page 1 must have at least 3 comprehensive questions');
const qCombMatching = p1Questions.find((q) => q.type === 'matching');
assert.ok(qCombMatching, 'Page 1 must have a matching question for combination regimens');
const combLabels = qCombMatching!.matchingTargets!.map((t) => t.label.toLowerCase());
assert.ok(combLabels.some((l) => l.includes('anoro') || l.includes('umeclidinium')));
assert.ok(combLabels.some((l) => l.includes('breo') || l.includes('vilanterol')));
assert.ok(combLabels.some((l) => l.includes('stiolto') || l.includes('olodaterol')));
assert.ok(combLabels.some((l) => l.includes('trelegy')));
assert.ok(combLabels.some((l) => l.includes('enerzair')));

const p1SubStmts = p1Questions.flatMap((q) => q.subStatements || []);
assert.ok(p1SubStmts.length >= 4, 'Page 1 must have at least 4 sub-statements on mechanism synergy');
assert.ok(
  p1SubStmts.some((s) => s.text?.toLowerCase().includes('corticosteroid') && s.text?.toLowerCase().includes('upregulate')),
  'Must cover corticosteroid upregulation of beta2 receptors'
);

// 5. Slide 2 (Page 2): Adrenergic Agonists SAR (Structures I–VII)
const page2 = pages[1]!;
assert.equal(page2.pageNumber, 2, 'Page 2 must be pageNumber 2');
const p2Questions = page2.sections.flatMap((s) => s.questions);
assert.equal(p2Questions.length, 8, 'Page 2 must contain exactly 8 questions (Q1 to Q8)');

// Q1: Pharmacophore
const s2q1 = p2Questions.find((q) => q.id === 201 || q.questionStem?.toLowerCase().includes('pharmacophore'))!;
assert.ok(s2q1, 'Slide 2 must have Q1 for pharmacophore');
assert.ok(s2q1.explanation?.toLowerCase().includes('phenylethanolamine') || s2q1.overallExplanation?.toLowerCase().includes('phenylethanolamine'));

// Q2: Nonselective alpha/beta (VII Norepinephrine)
const s2q2 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('nonselective alpha and beta') || q.title?.toLowerCase().includes('nonselective alpha'));
assert.ok(s2q2, 'Slide 2 must have Q2 for nonselective alpha/beta');
assert.ok(
  s2q2.matchingTargets?.some((t) => t.acceptedStructureIds.includes('VII') || t.acceptedStructureIds.includes('norepinephrine')) ||
    s2q2.options?.some((o) => o.includes('VII') || o.includes('Norepinephrine')) ||
    s2q2.subStatements?.some((s) => s.text?.includes('VII') || s.text?.includes('Norepinephrine'))
);

// Q3: Nonselective beta1/beta2 (I Isoproterenol)
const s2q3 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('nonselective beta-1 and beta-2') || q.title?.toLowerCase().includes('nonselective beta1'));
assert.ok(s2q3, 'Slide 2 must have Q3 for nonselective beta1/beta2');

// Q4: Selective beta1 (II Dobutamine)
const s2q4 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('selective beta-1') || q.title?.toLowerCase().includes('selective beta1'));
assert.ok(s2q4, 'Slide 2 must have Q4 for selective beta1');

// Q5: Selective beta2 (III, IV, V, VI)
const s2q5 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('selective beta-2') || q.title?.toLowerCase().includes('selective beta2'));
assert.ok(s2q5, 'Slide 2 must have Q5 for selective beta2');

// Q6: SABA vs LABA vs ultra-LABA
const s2q6 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('saba') || q.title?.toLowerCase().includes('saba'));
assert.ok(s2q6, 'Slide 2 must have Q6 for SABA/LABA/ultra-LABA');

// Q7: Asthma/COPD vs shock/heart failure indications
const s2q7 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('indicated') || q.title?.toLowerCase().includes('indicated'));
assert.ok(s2q7, 'Slide 2 must have Q7 for indications');

// Q8: COMT & MAO metabolism
const s2q8 = p2Questions.find((q) => q.questionStem?.toLowerCase().includes('comt') || q.title?.toLowerCase().includes('comt'));
assert.ok(s2q8, 'Slide 2 must have Q8 for COMT & MAO metabolism');

// Slide 2 sequential numbering & spoiler audits
p2Questions.forEach((q, idx) => {
  assert.equal(
    q.questionNumberLabel,
    `Question ${idx + 1}`,
    `Slide 2 question ${q.id} must have questionNumberLabel "Question ${idx + 1}"`
  );
  if (q.options) {
    q.options.forEach((opt) => {
      assert.doesNotMatch(
        opt,
        /Structure\s+[IVXLCDM]+\s*\([A-Za-z]+\)/,
        `Slide 2 option must not contain drug name spoilers in parentheses: "${opt}"`
      );
    });
  }
});

// 6. Slide 3 (Page 3): Anticholinergics & Hydrocortisone Prototype
const page3 = pages[2]!;
assert.equal(page3.pageNumber, 3, 'Page 3 must be pageNumber 3');
const p3Questions = page3.sections.flatMap((s) => s.questions);

// Slide 3 Q304 spoiler check
const s3q4 = p3Questions.find((q) => q.id === 304)!;
assert.ok(s3q4, 'Slide 3 must have Q304');
s3q4.options?.forEach((opt) => {
  assert.doesNotMatch(
    opt,
    /Structure\s+[IVXLCDM]+\s*\([A-Za-z\s’']+\)/i,
    `Slide 3 Q304 option must not spoil drug name in parentheses: "${opt}"`
  );
});
assert.ok(p3Questions.length >= 8, 'Page 3 must contain at least 8 questions across Anticholinergics and Hydrocortisone');

// Anticholinergics: Quaternary ammonium lung localization
assert.ok(
  p3Questions.some((q) =>
    (q.questionStem + (q.explanation || '')).toLowerCase().includes('quaternary ammonium') &&
    (q.questionStem + (q.explanation || '')).toLowerCase().includes('blood-brain barrier')
  ),
  'Slide 3 must cover quaternary ammonium preventing BBB penetration and systemic absorption'
);

// Hydrocortisone prototype: C1-C21 carbon numbering & 11-keto vs 11beta-OH
assert.ok(
  p3Questions.some((q) =>
    (q.questionStem + (q.explanation || '')).toLowerCase().includes('11-beta') &&
    (q.questionStem + (q.explanation || '')).toLowerCase().includes('11-keto')
  ),
  'Slide 3 must cover 11beta-OH activity vs 11-keto prodrug'
);

// 7. Slide 4 (Page 4): Hydrocortisone Biosynthesis & Glucocorticoid Receptor (GR)
const page4 = pages[3]!;
assert.equal(page4.pageNumber, 4, 'Page 4 must be pageNumber 4');
const p4Questions = page4.sections.flatMap((s) => s.questions);
assert.ok(p4Questions.length >= 2, 'Page 4 must have questions for Biosynthesis and GR activation');

// Biosynthesis enzymes: CYP11A1, CYP17A1, 3beta-HSD, CYP21A2, CYP11B1
assert.ok(
  p4Questions.some((q) =>
    (q.questionStem + (q.overallExplanation || '')).includes('CYP11A1') &&
    (q.questionStem + (q.overallExplanation || '')).includes('CYP11B1') &&
    (q.questionStem + (q.overallExplanation || '')).includes('CYP21A2')
  ),
  'Slide 4 must cover key cytochrome P450 enzymes in cortisol biosynthesis'
);

// GR: LBD (XX), DBD (YY), HSP90 (AA), GRE (CC), Processes 1-6
assert.ok(
  p4Questions.some((q) =>
    (q.questionStem + (q.overallExplanation || '')).includes('HSP90') &&
    (q.questionStem + (q.overallExplanation || '')).includes('GRE') &&
    (q.questionStem + (q.overallExplanation || '')).toLowerCase().includes('transrepression')
  ),
  'Slide 4 must cover GR receptor architecture and activation processes'
);

// 8. Slide 5 (Page 5): Hydrocortisone Metabolism & Potency Ranking
const page5 = pages[4]!;
assert.equal(page5.pageNumber, 5, 'Page 5 must be pageNumber 5');
const p5Questions = page5.sections.flatMap((s) => s.questions);

// Metabolism pathways: 11beta-HSD2 inactivation in kidney, ring-A 5-reduction, 17-ketosteroids
assert.ok(
  p5Questions.some((q) =>
    (q.questionStem + (q.overallExplanation || '')).toLowerCase().includes('11-beta-hsd2') ||
    (q.questionStem + (q.overallExplanation || '')).toLowerCase().includes('tetrahydrocortisol')
  ),
  'Slide 5 must cover 11beta-HSD2 and ring-A reduction pathways'
);

// Potency ranking question
const qPotency = p5Questions.find((q) =>
  q.type === 'ranking' ||
  q.questionStem?.toLowerCase().includes('potency') ||
  q.title?.toLowerCase().includes('potency')
);
assert.ok(qPotency, 'Slide 5 must include glucocorticoid potency ranking');
if (qPotency.rankingItems) {
  const dexa = qPotency.rankingItems.find((r) => r.label.toLowerCase().includes('dexamethasone'));
  const cortisone = qPotency.rankingItems.find((r) => r.label.toLowerCase().includes('cortisone'));
  assert.ok(dexa && cortisone, 'Ranking must include Dexamethasone and Cortisone');
  assert.ok(dexa.correctRank < cortisone.correctRank, 'Dexamethasone must rank higher in anti-inflammatory potency than Cortisone');
}

// 9. Slide 6 (Page 6): Glucocorticoid Prodrugs, Soft Steroids & SAR
const page6 = pages[5]!;
assert.equal(page6.pageNumber, 6, 'Page 6 must be pageNumber 6');
const p6Questions = page6.sections.flatMap((s) => s.questions);
const p6SubStmts = p6Questions.flatMap((q) => q.subStatements || []);
assert.ok(p6SubStmts.length >= 4, 'Slide 6 must have at least 4 True/False sub-statements');

// 4 explicit sub-statements from Slide 6:
const stmtDual = p6SubStmts.find((s) => (s.text || '').toLowerCase().includes('hydrocortisone') && (s.text || '').toLowerCase().includes('mineralocorticoid'));
assert.ok(stmtDual, 'Slide 6 must test hydrocortisone, cortisone, prednisone, prednisolone have both glucocorticoid and mineralocorticoid activities');
assert.equal(stmtDual.isCorrect, true);

const stmtSkeleton = p6SubStmts.find((s) => (s.text || '').toLowerCase().includes('all-trans') || (s.text || '').toLowerCase().includes('ene-one'));
assert.ok(stmtSkeleton, 'Slide 6 must test steroid skeleton, all-trans backbone, ring A ene-one, C-17 required for anti-inflammatory');
assert.equal(stmtSkeleton.isCorrect, true);

const stmtC21Lipophilic = p6SubStmts.find((s) => (s.text || '').toLowerCase().includes('c21-lipophilic'));
assert.ok(stmtC21Lipophilic, 'Slide 6 must test C21-lipophilic esters prodrug properties');
assert.equal(stmtC21Lipophilic.isCorrect, true);

const stmt1Dehydro = p6SubStmts.find((s) => (s.text || '').toLowerCase().includes('1-dehydro'));
assert.ok(stmt1Dehydro, 'Slide 6 must test 1-dehydro modification increases anti-inflammatory activity and limits metabolism');
assert.equal(stmt1Dehydro.isCorrect, true);

// Slide 6 Matching target spoiler audit
const s6Matching = p6Questions.find((q) => q.type === 'matching')!;
assert.ok(s6Matching, 'Slide 6 must have matching question');
s6Matching.matchingTargets!.forEach((t) => {
  assert.doesNotMatch(
    t.label,
    /^Structure\s+[IVXLCDM]+\s*\([A-Za-z\s]+\):/i,
    `Slide 6 target label must not spoil structure: "${t.label}"`
  );
});

// 10. Slide 7 (Page 7): Glucocorticoid SAR Items, Biotransformations & Theophylline vs Roflumilast
const page7 = pages[6]!;
assert.equal(page7.pageNumber, 7, 'Page 7 must be pageNumber 7');
const p7Questions = page7.sections.flatMap((s) => s.questions);
const p7SubStmts = p7Questions.flatMap((q) => q.subStatements || []);

// 3 explicit T/F items:
const p7Stmt1 = p7SubStmts.find((s) => (s.text || '').toLowerCase().includes('16,17-acetal') && (s.text || '').toLowerCase().includes('salt'));
assert.ok(p7Stmt1, 'Slide 7 must include 16,17-acetal decreases salt retention');
assert.equal(p7Stmt1.isCorrect, true);

const p7Stmt2 = p7SubStmts.find((s) => (s.text || '').toLowerCase().includes('9a-f') || (s.text || '').toLowerCase().includes('9-alpha-fluoro decreases'));
assert.ok(p7Stmt2, 'Slide 7 must include 9a-F decreases mineralocorticoid activity (False)');
assert.equal(p7Stmt2.isCorrect, false);

const p7Stmt3 = p7SubStmts.find((s) => (s.text || '').toLowerCase().includes('triamcinolone') && (s.text || '').toLowerCase().includes('methylprednisolone'));
assert.ok(p7Stmt3, 'Slide 7 must include triamcinolone and methylprednisolone have little mineralocorticoid activity');
assert.equal(p7Stmt3.isCorrect, true);

// Biotransformations:
assert.ok(
  p7Questions.some((q) =>
    (q.questionStem + (q.overallExplanation || '')).includes('Beclomethasone 17-monopropionate') ||
    (q.questionStem + (q.overallExplanation || '')).includes('17-BMP')
  ),
  'Slide 7 must cover Beclomethasone dipropionate -> Beclomethasone 17-monopropionate bioactivation'
);

// Theophylline vs Roflumilast comparison
const qTheoRof = p7Questions.find((q) => q.id === 703 || (q.title?.toLowerCase().includes('theophylline') && q.title?.toLowerCase().includes('roflumilast')));
assert.ok(qTheoRof, 'Slide 7 must include Drug A (Theophylline) vs Drug B (Roflumilast) comparison');
assert.ok(qTheoRof.subStatements && qTheoRof.subStatements.length === 5, 'Q703 must have 5 True/False sub-statements');
const theoStmt1 = qTheoRof.subStatements.find((s) => (s.text ?? '').toLowerCase().includes('methylxanthine') && (s.text ?? '').toLowerCase().includes('dichloropyridine'));
assert.ok(theoStmt1 && theoStmt1.isCorrect === true);
const theoStmt2 = qTheoRof.subStatements.find((s) => (s.text ?? '').toLowerCase().includes('bronchodilators'));
assert.ok(theoStmt2 && theoStmt2.isCorrect === false);
const theoStmt3 = qTheoRof.subStatements.find((s) => (s.text ?? '').toLowerCase().includes('antimuscarinic'));
assert.ok(theoStmt3 && theoStmt3.isCorrect === false);
const theoStmt4 = qTheoRof.subStatements.find((s) => (s.text ?? '').toLowerCase().includes('asthma'));
assert.ok(theoStmt4 && theoStmt4.isCorrect === false);
const theoStmt5 = qTheoRof.subStatements.find((s) => (s.text ?? '').toLowerCase().includes('cyp1a2'));
assert.ok(theoStmt5 && theoStmt5.isCorrect === false);

// 11. Slide 8 (Page 8): Theophylline vs Roflumilast (cont.), Mechanism Matching & Beclomethasone vs Hydrocortisone Succinate
const page8 = pages[7]!;
assert.equal(page8.pageNumber, 8, 'Page 8 must be pageNumber 8');
const p8Questions = page8.sections.flatMap((s) => s.questions);

// Slide 8 question numbering
p8Questions.forEach((q, idx) => {
  assert.equal(
    q.questionNumberLabel,
    `Question ${idx + 1}`,
    `Slide 8 question ${q.id} must have questionNumberLabel "Question ${idx + 1}"`
  );
});

// Mechanism Matching
const qMechMatching = p8Questions.find((q) => q.type === 'matching' && q.matchingTargets?.some((t) => t.label.includes('5-Lipoxygenase') || t.label.includes('CysLT1')));
assert.ok(qMechMatching, 'Slide 8 must include 7-drug mechanism matching');
assert.equal(qMechMatching.questionNumberLabel, 'Question 1', 'Slide 8 matching must have questionNumberLabel "Question 1"');
const targets = qMechMatching.matchingTargets!;
assert.equal(targets.length, 7, 'Slide 8 mechanism matching must have exactly 7 targets (A to G)');

targets.forEach((t) => {
  assert.doesNotMatch(
    t.label,
    /\(Structure\s+[IVXLCDM]+:\s*[A-Za-z]+\)/i,
    `Slide 8 matching target label must not contain spoiler: "${t.label}"`
  );
});

// Verify target mapping:
// I: Aclidinium -> M3 antagonist
// II: Methylprednisolone -> PLA2 inhibitor via Annexin A1
// III: Ensifentrine -> Dual PDE3/PDE4 inhibitor
// IV: Montelukast -> CysLT1 antagonist
// V: Zileuton -> 5-LOX inhibitor
// VI: Olodaterol -> Beta2 agonist
// VII: Theophylline -> Nonselective PDE inhibitor
const m3Target = targets.find((t) => t.label.toLowerCase().includes('muscarinic') || t.label.toLowerCase().includes('m3'))!;
assert.ok(m3Target.acceptedStructureIds.includes('I') || m3Target.acceptedStructureIds.includes('aclidinium'));

const pla2Target = targets.find((t) => t.label.toLowerCase().includes('phospholipase a2') || t.label.toLowerCase().includes('annexin'))!;
assert.ok(pla2Target.acceptedStructureIds.includes('II') || pla2Target.acceptedStructureIds.includes('methylprednisolone'));

const dualPdeTarget = targets.find((t) => t.label.toLowerCase().includes('dual') || (t.label.includes('PDE3') && t.label.includes('PDE4')))!;
assert.ok(dualPdeTarget.acceptedStructureIds.includes('III') || dualPdeTarget.acceptedStructureIds.includes('ensifentrine'));

const cyslt1Target = targets.find((t) => t.label.toLowerCase().includes('cyslt1') || t.label.toLowerCase().includes('leukotriene receptor'))!;
assert.ok(cyslt1Target.acceptedStructureIds.includes('IV') || cyslt1Target.acceptedStructureIds.includes('montelukast'));

const lox5Target = targets.find((t) => t.label.toLowerCase().includes('5-lipoxygenase') || t.label.toLowerCase().includes('5-lox'))!;
assert.ok(lox5Target.acceptedStructureIds.includes('V') || lox5Target.acceptedStructureIds.includes('zileuton'));

const beta2Target = targets.find((t) => t.label.toLowerCase().includes('beta2') || t.label.toLowerCase().includes('beta-2'))!;
assert.ok(beta2Target.acceptedStructureIds.includes('VI') || beta2Target.acceptedStructureIds.includes('olodaterol'));

const pdeTarget = targets.find((t) => (t.label.includes('PDE') || t.label.includes('Phosphodiesterase')) && !t.label.toLowerCase().includes('dual'))!;
assert.ok(pdeTarget.acceptedStructureIds.includes('VII') || pdeTarget.acceptedStructureIds.includes('theophylline'));

// 12. Slide 9 (Page 9): Beclomethasone dipropionate vs Hydrocortisone succinate (10 T/F items) & Tiotropium vs Pirbuterol (5 T/F items)
const page9 = pages[8]!;
assert.equal(page9.pageNumber, 9, 'Page 9 must be pageNumber 9');
const p9Questions = page9.sections.flatMap((s) => s.questions);

// Beclomethasone vs Hydrocortisone sodium succinate (10 T/F items)
const qBecloHydro = p9Questions.find((q) =>
  q.subStatements &&
  q.subStatements.length === 10 &&
  (q.title?.toLowerCase().includes('beclomethasone') || q.questionStem?.toLowerCase().includes('beclomethasone'))
);
assert.ok(qBecloHydro, 'Slide 9 must contain the 10-statement True/False battery comparing Beclomethasone dipropionate vs Hydrocortisone sodium succinate');
assert.equal(qBecloHydro.subStatements!.length, 10, 'Must have exactly 10 sub-statements');
const bdpSubStmts = qBecloHydro.subStatements!;
const bdpStmt1 = bdpSubStmts.find((s) => (s.text ?? '').includes('Drug A is a glucocorticoid whereas Drug B is a mineralocorticoid.'));
assert.ok(bdpStmt1 && bdpStmt1.isCorrect === false, 'Q901 statement 1 must be False');
const bdpStmt2 = bdpSubStmts.find((s) => (s.text ?? '').includes('The two drugs are adrenocorticoids.'));
assert.ok(bdpStmt2 && bdpStmt2.isCorrect === true, 'Q901 statement 2 must be True');
const bdpStmt10 = bdpSubStmts.find((s) => (s.text ?? '').includes('Drug A is a diester, lipophilic prodrug whereas Drug B is a locally acting, soft steroid.'));
assert.ok(bdpStmt10 && bdpStmt10.isCorrect === false, 'Q901 statement 10 must be False');

// Tiotropium vs Pirbuterol (5 T/F items)
const qTioPir = p9Questions.find((q) =>
  q.subStatements &&
  q.subStatements.length === 5 &&
  (q.title?.toLowerCase().includes('tiotropium') || q.questionStem?.toLowerCase().includes('tiotropium') || q.title?.toLowerCase().includes('pirbuterol'))
);
assert.ok(qTioPir, 'Slide 9 must contain the 5-statement True/False battery comparing Tiotropium (Drug A) vs Pirbuterol (Drug B)');
assert.equal(qTioPir.subStatements!.length, 5, 'Must have exactly 5 sub-statements');
const tioSubStmts = qTioPir.subStatements!;
const tioStmt1 = tioSubStmts.find((s) => (s.text ?? '').includes('Drug A is amino-ester whereas Drug B is a phenyl-ethanol amine.'));
assert.ok(tioStmt1 && tioStmt1.isCorrect === true, 'Q902 statement 1 must be True');
const tioStmt2 = tioSubStmts.find((s) => (s.text ?? '').includes('Drug A is a bronchodilator whereas Drug B is a glucocorticoid agonist.'));
assert.ok(tioStmt2 && tioStmt2.isCorrect === false, 'Q902 statement 2 must be False');
const tioStmt5 = tioSubStmts.find((s) => (s.text ?? '').includes('The two drugs are used via oral inhalation and metabolized extensively by hepatic enzymes.'));
assert.ok(tioStmt5 && tioStmt5.isCorrect === false, 'Q902 statement 5 must be False');

// 13. Comprehensive Sub-statement Quality & Completeness across all 9 pages
const allQuestions = pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
const questionsWithSubStmts = allQuestions.filter((q) => q.subStatements && q.subStatements.length > 0);

assert.ok(questionsWithSubStmts.length >= 8, 'Module must have at least 8 questions with interactive sub-statements');

let totalSubStatements = 0;
questionsWithSubStmts.forEach((q) => {
  q.subStatements!.forEach((stmt) => {
    totalSubStatements++;
    const text = stmt.text || stmt.statement;
    assert.ok(text && text.trim().length >= 10, `Question ${q.id} sub-statement ${stmt.id} text must be substantial`);
    assert.equal(typeof stmt.isCorrect, 'boolean', `Question ${q.id} sub-statement ${stmt.id} isCorrect must be boolean`);
    const expl = stmt.explanation || stmt.rationale;
    assert.ok(expl && expl.trim().length >= 15, `Question ${q.id} sub-statement ${stmt.id} explanation must be detailed`);
  });
});

assert.ok(totalSubStatements >= 35, `Module must contain at least 35 sub-statements across all slides (found ${totalSubStatements})`);

console.log(`All Respiratory Review Module tests passed successfully! (${totalSubStatements} sub-statements verified across 9 slides)`);
