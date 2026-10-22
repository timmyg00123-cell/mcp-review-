import {
  AntiplateletQuestion,
  ChemicalStructure,
  SubStatement,
  MatchingTarget,
  RankingItem,
} from '../types/reviewModule';

export type RationaleDepth = 'short' | 'medium' | 'long';

export interface RationaleDepthPresetConfig {
  id: RationaleDepth;
  label: string;
  badge: string;
  description: string;
  targetLength: string;
}

export const RATIONALE_DEPTH_PRESETS: Record<RationaleDepth, RationaleDepthPresetConfig> = {
  short: {
    id: 'short',
    label: 'Short Explanation',
    badge: 'High-Yield / 1-Sentence',
    description:
      'Concise, high-yield rationales focusing strictly on the critical warhead, active functional group, or key clinical takeaway.',
    targetLength: '~1-2 concise sentences',
  },
  medium: {
    id: 'medium',
    label: 'Medium Explanation',
    badge: 'Standard Review Depth (Current)',
    description:
      'The current baseline medicinal chemistry depth: mechanism of action + pharmacophore role + clinical impact.',
    targetLength: '~2-3 balanced sentences',
  },
  long: {
    id: 'long',
    label: 'Long Explanation',
    badge: 'Deep-Dive / Board-Exam',
    description:
      'Comprehensive graduate & board-level explanations detailing specific receptor binding residues (e.g. Ser529, Arg120, Cys17/Cys270), enzymatic bioactivation pathways (CYP2C19, CYP3A4, hCE1), and kinetic contrasts.',
    targetLength: '~4-6 detailed sentences with residues & kinetics',
  },
};

/**
 * Client-side fast adaptation of rationale text between Short, Medium, and Long.
 */
export function adaptTextToDepth(text: string | undefined, targetDepth: RationaleDepth): string {
  if (!text || text.trim().length === 0) return '';
  const clean = text.trim();

  if (targetDepth === 'short') {
    // Extract primary sentence or truncate secondary commentary
    const sentences = clean.split(/(?<=[.?!])\s+/);
    if (sentences.length > 0) {
      const first = sentences[0].trim();
      // If first sentence is too short (e.g. "True."), grab first two
      if (first.length < 35 && sentences.length > 1) {
        return `${first} ${sentences[1]}`.trim();
      }
      return first;
    }
    return clean;
  }

  if (targetDepth === 'long') {
    // If text is already extensive, return as-is
    if (clean.length > 260) return clean;
    // Add mechanistic and pharmacophoric framing if concise
    return `${clean} In medicinal chemistry, this SAR interaction is governed by stereospecific alignment within the target binding pocket, dictating receptor occupancy kinetics, metabolic stability, and biological half-life.`;
  }

  // Medium: default balanced text
  return clean;
}

/**
 * Batch updates all rationales across a list of questions to the target depth preset.
 */
export function applyDepthPresetToQuestions(
  questions: AntiplateletQuestion[],
  targetDepth: RationaleDepth
): AntiplateletQuestion[] {
  return questions.map((q) => {
    const updated: AntiplateletQuestion = {
      ...q,
      overallExplanation: adaptTextToDepth(q.overallExplanation, targetDepth),
      highYieldPearl: adaptTextToDepth(q.highYieldPearl, targetDepth),
    };

    if (updated.subStatements) {
      updated.subStatements = updated.subStatements.map((stmt) => ({
        ...stmt,
        rationale: adaptTextToDepth(stmt.rationale, targetDepth),
      }));
    }

    if (updated.matchingTargets) {
      updated.matchingTargets = updated.matchingTargets.map((target) => ({
        ...target,
        rationale: target.rationale ? adaptTextToDepth(target.rationale, targetDepth) : undefined,
      }));
    }

    if (updated.rankingItems) {
      updated.rankingItems = updated.rankingItems.map((item) => ({
        ...item,
        rationale: item.rationale ? adaptTextToDepth(item.rationale, targetDepth) : undefined,
      }));
    }

    if (updated.optionExplanations) {
      updated.optionExplanations = updated.optionExplanations.map((exp) =>
        adaptTextToDepth(exp, targetDepth)
      );
    }

    return updated;
  });
}

/**
 * Calls backend API to perform deep AI rationale recalibration across questions via Gemini
 */
export async function recalibrateRationalesWithAI(
  questions: AntiplateletQuestion[],
  targetDepth: RationaleDepth
): Promise<AntiplateletQuestion[]> {
  try {
    const response = await fetch('/api/gemini/adjust-rationale-depth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions,
        targetDepth,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    if (!Array.isArray(result.questions) || result.questions.length === 0) {
      throw new Error('Invalid response received from AI model.');
    }

    return result.questions;
  } catch (err: any) {
    console.warn('AI rationale recalibration failed, falling back to client-side transformer:', err);
    return applyDepthPresetToQuestions(questions, targetDepth);
  }
}

/**
 * Generates structured replacement questions offline using the provided chemical structures.
 * Guarantees that ranking (by onset/potency/duration), classification (prodrug vs active drug, chemical class),
 * and sub-statements are always available even if network/Gemini is unreachable.
 */
export function synthesizeOfflineAlternativeQuestions(
  structures: ChemicalStructure[],
  competencies: string[],
  rationaleDepth: RationaleDepth,
  count: number = 4
): AntiplateletQuestion[] {
  const generated: AntiplateletQuestion[] = [];
  const baseTime = Date.now();

  const strList = structures.length > 0 ? structures : [
    {
      id: 'I',
      name: 'Tirofiban',
      chemicalClass: 'N-sulfonyl tyrosine-based peptidomimetic',
      pharmacologicalClass: 'GPIIb/IIIa inhibitor',
      target: 'GPIIb/IIIa',
      reversibility: 'Reversible',
      route: 'IV Infusion',
      keyFunctionalGroups: ['Carboxylic acid', 'Piperidine basic amine', 'Butyl sulfonamide'],
      pkPdHighlights: { onset: 'Immediate IV', duration: 'Short (~4-8 hrs post-infusion)', halfLife: '2 hours' },
    },
    {
      id: 'II',
      name: 'Ticagrelor',
      chemicalClass: 'Triazolopyrimidine nucleoside-like',
      pharmacologicalClass: 'P2Y12 receptor antagonist',
      target: 'P2Y12',
      reversibility: 'Reversible',
      route: 'Oral',
      keyFunctionalGroups: ['Cyclopentyl-triol', 'Triazolopyrimidine core', 'Propylthio ether'],
      pkPdHighlights: { onset: '~30 minutes', duration: '~3-5 days', halfLife: '7-9 hours' },
    },
    {
      id: 'III',
      name: 'Cangrelor',
      chemicalClass: 'ATP analogue (non-hydrolyzable)',
      pharmacologicalClass: 'P2Y12 receptor antagonist',
      target: 'P2Y12',
      reversibility: 'Reversible',
      route: 'IV Infusion',
      keyFunctionalGroups: ['Dichloromethylene phosphonate', 'Purine core', 'Thioether chain'],
      pkPdHighlights: { onset: 'Immediate (~2 minutes)', duration: 'Ultra-short (1-2 hours)', halfLife: '3-6 minutes' },
    },
    {
      id: 'IV',
      name: 'Prasugrel',
      chemicalClass: 'Thienopyridine',
      pharmacologicalClass: 'P2Y12 receptor antagonist',
      target: 'P2Y12',
      reversibility: 'Irreversible',
      route: 'Oral',
      keyFunctionalGroups: ['Thienopyridine core', 'Ketone ester precursor', 'Fluorophenyl ring'],
      pkPdHighlights: { onset: '~30 minutes', duration: '7-10 days', halfLife: '7 hours' },
    },
  ];

  // 1. RANKING QUESTION: Onset of Action & Duration of Platelet Inhibition
  if (competencies.includes('ranking') || generated.length < count) {
    const rankingItems: RankingItem[] = [
      {
        id: 'r_cangrelor',
        label: `Structure with Immediate IV Onset (${strList.find((s) => s.name.toLowerCase().includes('cangrelor') || s.route.toLowerCase().includes('iv'))?.name || strList[0].name})`,
        correctRank: 1,
        rationale: adaptTextToDepth(
          'IV infusion achieves immediate receptor saturation and >90% platelet inhibition within 2 minutes without requiring metabolic activation.',
          rationaleDepth
        ),
      },
      {
        id: 'r_ticagrelor',
        label: `Directly Active Oral Agent (${strList.find((s) => s.name.toLowerCase().includes('ticagrelor'))?.name || (strList[1] ? strList[1].name : strList[0].name)})`,
        correctRank: 2,
        rationale: adaptTextToDepth(
          'Rapid oral absorption achieves clinical antiplatelet inhibition within ~30 minutes because hepatic bioactivation is unnecessary.',
          rationaleDepth
        ),
      },
      {
        id: 'r_prasugrel',
        label: `Rapid Single-Step CYP Prodrug (${strList.find((s) => s.name.toLowerCase().includes('prasugrel'))?.name || (strList[2] ? strList[2].name : strList[0].name)})`,
        correctRank: 3,
        rationale: adaptTextToDepth(
          'Requires rapid esterase hydrolysis followed by single CYP step (CYP3A4/2B6), yielding effective inhibition in 30-60 minutes.',
          rationaleDepth
        ),
      },
      {
        id: 'r_clopidogrel',
        label: `Two-Step Sequential CYP Prodrug (${strList.find((s) => s.name.toLowerCase().includes('clopidogrel') || s.name.toLowerCase().includes('ticlopidine'))?.name || (strList[3] ? strList[3].name : strList[0].name)})`,
        correctRank: 4,
        rationale: adaptTextToDepth(
          'Slowest onset (~2-4 hours) because ~85% of oral dose is inactivated by human carboxylesterase 1 (hCE1), and the remaining 15% requires two consecutive CYP oxidation steps.',
          rationaleDepth
        ),
      },
    ];

    generated.push({
      id: baseTime + 1,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Pharmacokinetics & Ranking',
      questionStem:
        'Rank the chemical structures below according to their SPEED OF ONSET of platelet aggregation inhibition (from 1 = Fastest Onset to 4 = Slowest Onset):',
      type: 'ranking',
      rankingPrompt: 'Order from fastest antiplatelet onset (1) to slowest onset (4):',
      rankingItems,
      overallExplanation: adaptTextToDepth(
        'Onset speed is governed strictly by delivery route and hepatic bioactivation requirements: direct IV agents act immediately (~2 min), orally active direct inhibitors act in ~30 min, single-step esterase prodrugs act in ~30-60 min, and two-step CYP prodrugs take ~2-4 hours.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Cangrelor onset: 2 min (direct IV); Prasugrel: 30 min (rapid 1 CYP step); Clopidogrel: 2-4 hrs (rate-limited by CYP2C19 & 85% esterase waste).',
        rationaleDepth
      ),
      sourceReference: 'NAPLEX / USMLE Medicinal Chemistry Examination Review',
    });
  }

  // 2. CLASSIFICATION & GROUPING QUESTION: Prodrug vs Directly Active Drug & Chemical Scaffold
  if (competencies.includes('classifying') || generated.length < count) {
    const matchingTargets: MatchingTarget[] = [
      {
        id: 'target_prodrug',
        label: 'Prodrug requiring enzymatic bioactivation to generate the active thiol inhibitor',
        acceptedStructureIds: strList
          .filter(
            (s) =>
              s.name.toLowerCase().includes('clopidogrel') ||
              s.name.toLowerCase().includes('prasugrel') ||
              s.name.toLowerCase().includes('ticlopidine') ||
              (s.chemicalClass && s.chemicalClass.toLowerCase().includes('thieno'))
          )
          .map((s) => s.id),
        rationale: adaptTextToDepth(
          'Thienopyridines are prodrugs that must undergo oxidative opening of the thiophene ring to release an active thiol warhead.',
          rationaleDepth
        ),
      },
      {
        id: 'target_active',
        label: 'Directly active agent that binds target receptors without hepatic bioactivation',
        acceptedStructureIds: strList
          .filter(
            (s) =>
              s.name.toLowerCase().includes('ticagrelor') ||
              s.name.toLowerCase().includes('cangrelor') ||
              s.name.toLowerCase().includes('tirofiban') ||
              s.name.toLowerCase().includes('aspirin') ||
              s.name.toLowerCase().includes('eptifibatide')
          )
          .map((s) => s.id),
        rationale: adaptTextToDepth(
          'Direct antagonists (e.g. Ticagrelor, Cangrelor, Tirofiban, Aspirin) possess intact receptor-binding pharmacophores directly within their original structure.',
          rationaleDepth
        ),
      },
    ];

    generated.push({
      id: baseTime + 2,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Classification & Pharmacologic Grouping',
      questionStem:
        'Classify each chemical structure shown above according to whether it is a PRODRUG requiring in vivo metabolic bioactivation or a DIRECTLY ACTIVE AGENT:',
      type: 'matching',
      matchingTargets,
      overallExplanation: adaptTextToDepth(
        'Distinguishing prodrugs from active parent compounds is fundamental: prodrugs suffer from pharmacokinetic delays and genetic polymorphisms (e.g., CYP2C19 loss-of-function *2/*3 alleles), whereas directly active agents provide predictable concentration-dependent platelet inhibition.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Prodrugs = Clopidogrel & Prasugrel (thienopyridine thiol warhead). Directly active = Ticagrelor (cyclopentyltriazolopyrimidine) & Cangrelor (ATP analogue).',
        rationaleDepth
      ),
      sourceReference: 'Medicinal Chemistry Classification Framework',
    });
  }

  // 3. SAR & PHARMACOPHORE MATCHING QUESTION
  if (competencies.includes('matching') || generated.length < count) {
    const matchingTargets: MatchingTarget[] = strList.slice(0, 3).map((s) => ({
      id: `sar_${s.id}`,
      label: `Structure containing: ${(s.keyFunctionalGroups || ['distinctive warhead'])[0]} and belonging to ${s.chemicalClass || s.pharmacologicalClass}`,
      acceptedStructureIds: [s.id],
      rationale: adaptTextToDepth(
        `Structure ${s.id} (${s.name}) features ${(s.keyFunctionalGroups || []).join(', ')}, defining its ${s.target} selectivity.`,
        rationaleDepth
      ),
    }));

    generated.push({
      id: baseTime + 3,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'SAR & Pharmacophore Identification',
      questionStem:
        'Match the structural pharmacophore descriptions below to the corresponding Roman numeral chemical structure above:',
      type: 'matching',
      matchingTargets,
      overallExplanation: adaptTextToDepth(
        'Each antiplatelet scaffold possesses a distinct pharmacophore tailored to its target receptor pocket: peptides/peptidomimetics carry basic amine and carboxylate termini mimicking RGD, whereas purinergic antagonists exploit modified bicyclic bases and nucleotide bridges.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'SAR matching is based on the receptor pocket distance and ionic anchoring residues.',
        rationaleDepth
      ),
      sourceReference: 'SAR Pharmacophore Atlas',
    });
  }

  // 4. SUB-STATEMENTS (TRUE / FALSE SAR)
  if (competencies.includes('subStatements') || generated.length < count) {
    const subStatements: SubStatement[] = [
      {
        id: 'a',
        statement:
          'Cangrelor contains a non-hydrolyzable dichloromethylene phosphonate bridge that prevents plasma nucleotide phosphatase dephosphorylation.',
        isCorrect: true,
        rationale: adaptTextToDepth(
          'True: The CCl2 bridge between alpha and beta/gamma phosphorus atoms replaces the labile phosphoanhydride bond, conferring chemical stability against ectonucleotidases.',
          rationaleDepth
        ),
      },
      {
        id: 'b',
        statement:
          'Prasugrel bioactivation is initiated by CYP2C19 oxidation before any esterase hydrolysis takes place.',
        isCorrect: false,
        rationale: adaptTextToDepth(
          'False: Prasugrel is first rapidly hydrolyzed by intestinal/hepatic carboxylesterases (hCE2) to an thiolactone intermediate, which is then oxidized by CYP3A4 and CYP2B6.',
          rationaleDepth
        ),
      },
      {
        id: 'c',
        statement:
          'Ticagrelor binds allosterically to the P2Y12 receptor and does not require free thiol formation for antiplatelet activity.',
        isCorrect: true,
        rationale: adaptTextToDepth(
          'True: Ticagrelor is a reversible, allosteric non-competitive antagonist; it acts intact and does not form a covalent disulfide bond with Cys17/Cys270.',
          rationaleDepth
        ),
      },
      {
        id: 'd',
        statement:
          'Aspirin produces reversible platelet inhibition that can be displaced by elevated levels of circulating arachidonic acid.',
        isCorrect: false,
        rationale: adaptTextToDepth(
          'False: Aspirin causes irreversible, covalent trans-acetylation of Ser529 in COX-1, permanently disabling thromboxane A2 production for the 7-10 day lifespan of the anucleate platelet.',
          rationaleDepth
        ),
      },
    ];

    generated.push({
      id: baseTime + 4,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Structure-Activity Relationship (SAR)',
      questionStem:
        'Evaluate each of the following statements regarding the pharmacophores, receptor binding kinetics, and metabolic activation of the structures above:',
      type: 'sub-statements',
      subStatements,
      overallExplanation: adaptTextToDepth(
        'Comprehensive evaluation of P2Y12 antagonists and COX-1 inhibitors highlights crucial differences between covalent irreversible binding (Aspirin, Clopidogrel, Prasugrel) versus reversible allosteric antagonism (Ticagrelor, Cangrelor).',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Covalent irreversible inhibition permanently persists for platelet lifespan (~7-10 days); reversible inhibitors wash out rapidly upon drug clearance.',
        rationaleDepth
      ),
      sourceReference: 'Board Review High-Yield SAR Questions',
    });
  }

  // 5. RANKING: Duration of Platelet Inhibition After Discontinuation
  if (generated.length < count) {
    generated.push({
      id: baseTime + 5,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Pharmacodynamics & Duration Ranking',
      questionStem:
        'Rank the antiplatelets below according to the DURATION of their antiplatelet effect following drug discontinuation (from 1 = Shortest Duration to 4 = Longest Duration):',
      type: 'ranking',
      rankingPrompt: 'Order from shortest duration post-cessation (1) to longest duration (4):',
      rankingItems: [
        {
          id: 'dur_1',
          label: 'Cangrelor (Direct IV ATP analogue)',
          correctRank: 1,
          rationale: adaptTextToDepth(
            'Platelet function returns to normal within 1-2 hours after stopping IV infusion due to rapid plasma clearance (t1/2 ≈ 3-6 min).',
            rationaleDepth
          ),
        },
        {
          id: 'dur_2',
          label: 'Tirofiban (Reversible GPIIb/IIIa antagonist)',
          correctRank: 2,
          rationale: adaptTextToDepth(
            'Platelet aggregation recovers to >50% within 4-8 hours post IV cessation.',
            rationaleDepth
          ),
        },
        {
          id: 'dur_3',
          label: 'Ticagrelor (Reversible oral P2Y12 antagonist)',
          correctRank: 3,
          rationale: adaptTextToDepth(
            'Reversible binding allows platelet aggregation recovery over ~3 to 5 days as drug washes out.',
            rationaleDepth
          ),
        },
        {
          id: 'dur_4',
          label: 'Clopidogrel / Prasugrel (Irreversible covalent P2Y12 inhibitors)',
          correctRank: 4,
          rationale: adaptTextToDepth(
            'Covalent disulfide bonding to Cys17/Cys270 permanently disables the receptor, requiring 7-10 days for new platelet generation.',
            rationaleDepth
          ),
        },
      ],
      overallExplanation: adaptTextToDepth(
        'Duration of antiplatelet effect is strictly determined by receptor reversibility: reversible inhibitors wear off as free drug is cleared, whereas irreversible covalent inhibitors require de novo thrombopoiesis.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Shortest to longest duration: Cangrelor (~1-2 hr) < Tirofiban (~4-8 hr) < Ticagrelor (~3-5 d) < Clopidogrel (~7-10 d).',
        rationaleDepth
      ),
      sourceReference: 'Clinical Pharmacology & Pharmacokinetics Atlas',
    });
  }

  // 6. CLASSIFICATION: Receptor Subtype & Binding Site
  if (generated.length < count) {
    generated.push({
      id: baseTime + 6,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Molecular Targets & Binding Site Classification',
      questionStem:
        'Classify each chemical structure shown above according to its primary biochemical target receptor and binding mode:',
      type: 'matching',
      matchingTargets: [
        {
          id: 'site_p2y12_covalent',
          label: 'P2Y12 ADP receptor (irreversible covalent disulfide bond with Cys17/Cys270)',
          acceptedStructureIds: strList
            .filter((s) => s.reversibility?.toLowerCase().includes('irrev') || s.chemicalClass?.toLowerCase().includes('thieno'))
            .map((s) => s.id),
          rationale: adaptTextToDepth(
            'Thienopyridines form an irreversible covalent disulfide bridge with active site cysteines of P2Y12.',
            rationaleDepth
          ),
        },
        {
          id: 'site_p2y12_reversible',
          label: 'P2Y12 ADP receptor (reversible allosteric or competitive non-covalent binding)',
          acceptedStructureIds: strList
            .filter((s) => s.reversibility?.toLowerCase().includes('rev') && s.target?.toLowerCase().includes('p2y12'))
            .map((s) => s.id),
          rationale: adaptTextToDepth(
            'Ticagrelor (allosteric) and Cangrelor (competitive) reversibly block ADP-induced signal transduction without covalent bond formation.',
            rationaleDepth
          ),
        },
        {
          id: 'site_gpiib_iiia',
          label: 'Glycoprotein IIb/IIIa integrin (RGD-mimicking fibrinogen cross-linking blockade)',
          acceptedStructureIds: strList
            .filter((s) => s.target?.toLowerCase().includes('gpiib') || s.pharmacologicalClass?.toLowerCase().includes('iib'))
            .map((s) => s.id),
          rationale: adaptTextToDepth(
            'GPIIb/IIIa inhibitors prevent the final common pathway of platelet aggregation by blocking fibrinogen bridging.',
            rationaleDepth
          ),
        },
      ],
      overallExplanation: adaptTextToDepth(
        'Platelet inhibitors target distinct steps in the activation cascade: primary signaling via P2Y12 ADP receptors vs. the final common aggregation pathway at GPIIb/IIIa.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'P2Y12 antagonists inhibit initial ADP-mediated dense granule recruitment; GPIIb/IIIa blockers prevent platelet-platelet bridging.',
        rationaleDepth
      ),
      sourceReference: 'Receptor Pharmacology Reference',
    });
  }

  // 7. MULTIPLE-CHOICE: Esterase vs CYP Bioactivation Pathways
  if (generated.length < count) {
    generated.push({
      id: baseTime + 7,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Metabolism & Enzymatic Activation',
      questionStem:
        'Which statement correctly describes the metabolic fate of Clopidogrel versus Prasugrel in human hepatic/intestinal tissue?',
      type: 'multiple-choice',
      options: [
        'A. ~85% of Clopidogrel is hydrolyzed to an inactive carboxylic acid by human carboxylesterase 1 (hCE1), whereas Prasugrel is rapidly bioactivated by intestinal hCE2.',
        'B. Both Clopidogrel and Prasugrel depend primarily on CYP2C19 for initial rate-limiting oxidation.',
        'C. Prasugrel is inactivated by esterases, whereas Clopidogrel is protected from esterase cleavage.',
        'D. Ticagrelor requires two CYP3A4 oxidation steps before becoming active.',
      ],
      correctIndex: 0,
      optionExplanations: [
        adaptTextToDepth('Correct: 85% of Clopidogrel is shunted to inactive carboxylic acid metabolite by hCE1, leaving only 15% for CYP oxidation. Prasugrel utilizes rapid hCE2 activation.', rationaleDepth),
        adaptTextToDepth('Incorrect: Prasugrel does not rely heavily on CYP2C19; it is activated by CYP3A4 and CYP2B6.', rationaleDepth),
        adaptTextToDepth('Incorrect: Prasugrel requires esterase cleavage by hCE2 for its activation, not inactivation.', rationaleDepth),
        adaptTextToDepth('Incorrect: Ticagrelor is directly active in its parent form.', rationaleDepth),
      ],
      overallExplanation: adaptTextToDepth(
        'The marked difference in potency and clinical predictability between Clopidogrel and Prasugrel stems from esterase shunting: ~85% of clopidogrel is destroyed by hCE1, whereas Prasugrel uses hCE2 as a necessary activating step.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Clopidogrel 85% lost to hCE1 inactivation; Prasugrel utilizes hCE2 activation followed by single CYP step.',
        rationaleDepth
      ),
      sourceReference: 'Drug Metabolism & Pharmacogenomics Review',
    });
  }

  // 8. SUB-STATEMENTS: Resistance & CYP2C19 Polymorphisms
  if (generated.length < count) {
    generated.push({
      id: baseTime + 8,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Pharmacogenomics & Clinical Resistance',
      questionStem:
        'Evaluate the structure-activity and pharmacogenomic statements below concerning antiplatelet resistance:',
      type: 'sub-statements',
      subStatements: [
        {
          id: 'res_a',
          statement: 'Patients carrying CYP2C19 *2 or *3 loss-of-function alleles exhibit significantly impaired platelet inhibition when taking Clopidogrel.',
          isCorrect: true,
          rationale: adaptTextToDepth('True: CYP2C19 is essential for both oxidation steps generating clopidogrel active thiol.', rationaleDepth),
        },
        {
          id: 'res_b',
          statement: 'Prasugrel efficacy is heavily compromised in CYP2C19 poor metabolizers.',
          isCorrect: false,
          rationale: adaptTextToDepth('False: Prasugrel bioactivation is mediated predominantly by CYP3A4 and CYP2B6, avoiding CYP2C19 dependence.', rationaleDepth),
        },
        {
          id: 'res_c',
          statement: 'Ticagrelor efficacy remains intact in patients with CYP2C19 loss-of-function mutations.',
          isCorrect: true,
          rationale: adaptTextToDepth('True: Ticagrelor is directly active without requiring hepatic CYP bioactivation.', rationaleDepth),
        },
      ],
      overallExplanation: adaptTextToDepth(
        'CYP2C19 genetic polymorphism is the primary cause of Clopidogrel hypo-responsiveness. Non-thienopyridines and second-generation agents circumvent this bottleneck.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'CYP2C19 poor metabolizers (*2/*3): Switch from Clopidogrel to Ticagrelor or Prasugrel.',
        rationaleDepth
      ),
      sourceReference: 'CPIC Pharmacogenomics Guidelines',
    });
  }

  // 9. RANKING: Molecular Weight & Scaffold Complexity
  if (generated.length < count) {
    generated.push({
      id: baseTime + 9,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Chemical Properties & Molecular Weight Ranking',
      questionStem:
        'Rank the chemical structures below from SMALLEST molecular weight to LARGEST molecular weight:',
      type: 'ranking',
      rankingPrompt: 'Order from smallest MW (1) to largest MW (4):',
      rankingItems: [
        { id: 'mw_1', label: 'Aspirin (Acetylsalicylic acid, MW ≈ 180.2 g/mol)', correctRank: 1, rationale: adaptTextToDepth('Simplest monocyclic salicylate core.', rationaleDepth) },
        { id: 'mw_2', label: 'Clopidogrel (Thienopyridine ester, MW ≈ 321.8 g/mol)', correctRank: 2, rationale: adaptTextToDepth('Bicyclic thienopyridine with single chlorophenyl group.', rationaleDepth) },
        { id: 'mw_3', label: 'Tirofiban (N-sulfonyl tyrosine, MW ≈ 440.6 g/mol)', correctRank: 3, rationale: adaptTextToDepth('Extended peptidomimetic with sulfonamide tail.', rationaleDepth) },
        { id: 'mw_4', label: 'Ticagrelor / Cangrelor (Nucleoside / Nucleotide mimetics, MW > 520 g/mol)', correctRank: 4, rationale: adaptTextToDepth('Complex poly-functionalized nucleoside/nucleotide scaffolds.', rationaleDepth) },
      ],
      overallExplanation: adaptTextToDepth(
        'Scaffold size reflects evolutionary drug design: from tiny covalent warheads (Aspirin) to small molecules (Clopidogrel) to peptidomimetics and nucleotide mimetics (Ticagrelor, Cangrelor).',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Smallest MW: Aspirin (180); Largest MW: Cangrelor / Eptifibatide (cyclic heptapeptide >800).',
        rationaleDepth
      ),
      sourceReference: 'Medicinal Chemistry Scaffold Atlas',
    });
  }

  // 10. MULTIPLE-CHOICE: Active Thiol Warhead Structure
  if (generated.length < count) {
    generated.push({
      id: baseTime + 10,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Chemical Mechanism & Warhead Chemistry',
      questionStem:
        'Which chemical functional group in the active metabolites of Clopidogrel and Prasugrel is directly responsible for irreversible covalent receptor inactivation?',
      type: 'multiple-choice',
      options: [
        'A. A free sulfhydryl (-SH / thiol) group that forms an intermolecular disulfide bond with a receptor cysteine residue.',
        'B. An electrophilic ester carbonyl that undergoes nucleophilic attack by Serine 529.',
        'C. A quaternary ammonium salt that creates a non-covalent ionic bridge with Aspartate.',
        'D. A dichloromethylene group that coordinates with active site divalent magnesium.',
      ],
      correctIndex: 0,
      optionExplanations: [
        adaptTextToDepth('Correct: The active metabolite exposes an exocyclic free thiol (-SH) that attacks Cys17/Cys270 on P2Y12 to form a permanent covalent disulfide bond.', rationaleDepth),
        adaptTextToDepth('Incorrect: Ester trans-acetylation of Ser529 is the mechanism of Aspirin in COX-1, not thienopyridines.', rationaleDepth),
        adaptTextToDepth('Incorrect: Quaternary amines form reversible ionic bonds, not irreversible inactivation.', rationaleDepth),
        adaptTextToDepth('Incorrect: Dichloromethylene is unique to Cangrelor as an unhydrolyzable bridge.', rationaleDepth),
      ],
      overallExplanation: adaptTextToDepth(
        'Both Clopidogrel and Prasugrel active forms contain an unmasked free thiol (-SH) generated after opening the dihydrothienopyridine ring, which forms a permanent covalent disulfide bridge with Cys17 or Cys270 of the P2Y12 receptor.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Thienopyridine active warhead = free thiol (-SH) forming covalent -S-S- disulfide bridge with receptor cysteine.',
        rationaleDepth
      ),
      sourceReference: 'SAR Warhead Chemistry Compendium',
    });
  }

  // 11. MULTIPLE-CHOICE: Ticagrelor Dyspnea Mechanism
  if (generated.length < count) {
    generated.push({
      id: baseTime + 11,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Adverse Effects & Off-Target SAR',
      questionStem:
        'Which off-target structural interaction explains why Ticagrelor uniquely causes self-limiting dyspnea and ventricular pauses compared to thienopyridines?',
      type: 'multiple-choice',
      options: [
        'A. Structural resemblance to adenosine allows Ticagrelor to inhibit the equilibrative nucleoside transporter 1 (ENT1), raising extracellular adenosine levels.',
        'B. Irreversible acetylation of pulmonary cyclooxygenase-2 (COX-2).',
        'C. Direct agonism of platelet thromboxane prostanoid (TP) receptors.',
        'D. Covalent modification of renal proximal tubule sodium-glucose cotransporters.',
      ],
      correctIndex: 0,
      optionExplanations: [
        adaptTextToDepth('Correct: As an adenosine analogue, Ticagrelor inhibits ENT1 cellular uptake of adenosine, elevating endogenous plasma adenosine which triggers bronchospasm/dyspnea and sinus pauses.', rationaleDepth),
        adaptTextToDepth('Incorrect: Ticagrelor does not acetylate COX-2.', rationaleDepth),
        adaptTextToDepth('Incorrect: Ticagrelor is an antagonist at P2Y12, not a TP agonist.', rationaleDepth),
        adaptTextToDepth('Incorrect: SGLT2 is unaffected by antiplatelet nucleosides.', rationaleDepth),
      ],
      overallExplanation: adaptTextToDepth(
        'Because of its adenosine-mimicking chemical structure, Ticagrelor inhibits ENT1, increasing systemic adenosine concentrations. This causes transient dyspnea in ~10-15% of patients and nocturnal bradyarrhythmias.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Ticagrelor dyspnea is mediated by ENT1 inhibition and increased circulating adenosine.',
        rationaleDepth
      ),
      sourceReference: 'Clinical Toxicology & Off-Target SAR',
    });
  }

  // 12. CLASSIFICATION: Reversibility & Platelet Lifespan Independence
  if (generated.length < count) {
    generated.push({
      id: baseTime + 12,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Binding Reversibility Classification',
      questionStem:
        'Classify the following antithrombotics into REVERSIBLE inhibitors versus IRREVERSIBLE (covalent) inhibitors:',
      type: 'matching',
      matchingTargets: [
        {
          id: 'rev_yes',
          label: 'Reversible inhibitor: Antiplatelet effect dissipates as systemic drug is cleared from plasma',
          acceptedStructureIds: strList
            .filter((s) => s.reversibility?.toLowerCase().includes('rev') && !s.reversibility?.toLowerCase().includes('irrev'))
            .map((s) => s.id),
          rationale: adaptTextToDepth(
            'Reversible agents dissociate dynamically from their receptors based on binding equilibrium.',
            rationaleDepth
          ),
        },
        {
          id: 'rev_no',
          label: 'Irreversible (suicide/covalent) inhibitor: Receptor remains permanently disabled for platelet lifetime',
          acceptedStructureIds: strList
            .filter((s) => s.reversibility?.toLowerCase().includes('irrev'))
            .map((s) => s.id),
          rationale: adaptTextToDepth(
            'Covalent modification permanently inactivates the target enzyme or receptor until new platelets are synthesized.',
            rationaleDepth
          ),
        },
      ],
      overallExplanation: adaptTextToDepth(
        'Reversibility dictates perioperative management: reversible agents allow rapid procedural clearance (Cangrelor hours, Ticagrelor 3-5 days), whereas irreversible agents (Aspirin, Clopidogrel, Prasugrel) require 5-10 days of platelet turnover.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Reversible: Cangrelor, Ticagrelor, Tirofiban. Irreversible: Aspirin, Clopidogrel, Prasugrel, Ticlopidine.',
        rationaleDepth
      ),
      sourceReference: 'Perioperative Antithrombotic Management Guide',
    });
  }

  // 13. MULTIPLE-CHOICE: Cangrelor Structure & Stability
  if (generated.length < count) {
    generated.push({
      id: baseTime + 13,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Bioisosterism & Chemical Modification',
      questionStem:
        'What specific bioisosteric substitution in Cangrelor prevents its enzymatic breakdown by circulating ectonucleotidases (NTPDases)?',
      type: 'multiple-choice',
      options: [
        'A. Replacement of the anhydride oxygen with a dichloromethylene (-CCl2-) group between the α and β phosphate positions.',
        'B. Insertion of a cyclopropyl ring on the adenine base.',
        'C. Esterification of the ribose 2\'-hydroxyl with a carboxylic acid.',
        'D. Substitution of the purine ring with an indole nucleus.',
      ],
      correctIndex: 0,
      optionExplanations: [
        adaptTextToDepth('Correct: The -CCl2- bridge creates a stable phosphonate that resists cleavage by alkaline phosphatases and ecto-ATPases.', rationaleDepth),
        adaptTextToDepth('Incorrect: The cyclopropyl ring is on the phenylethylamino tail, not the base.', rationaleDepth),
        adaptTextToDepth('Incorrect: Ribose hydroxyls are intact; no esterification exists.', rationaleDepth),
        adaptTextToDepth('Incorrect: Cangrelor retains a purine adenine core.', rationaleDepth),
      ],
      overallExplanation: adaptTextToDepth(
        'Endogenous ADP and ATP are rapidly dephosphorylated in the blood by vascular ectonucleotidases. Cangrelor incorporates a non-hydrolyzable dichloromethylene phosphonate bridge (-CCl2-) that mimics the phosphate geometry while resisting enzymatic hydrolysis.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Dichloromethylene bridge (-CCl2-) in Cangrelor provides chemical stability against phosphatase cleavage.',
        rationaleDepth
      ),
      sourceReference: 'Medicinal Chemistry of Nucleotide Analogues',
    });
  }

  // 14. RANKING: Hepatic Metabolism Dependency
  if (generated.length < count) {
    generated.push({
      id: baseTime + 14,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Hepatic Metabolism & Bioactivation Ranking',
      questionStem:
        'Rank the antiplatelet agents below according to their DEPENDENCE ON HEPATIC METABOLISM for producing antiplatelet action (from 1 = Least Dependent to 4 = Most Dependent):',
      type: 'ranking',
      rankingPrompt: 'Order from least dependent on hepatic bioactivation (1) to most dependent (4):',
      rankingItems: [
        { id: 'hep_1', label: 'Cangrelor / Tirofiban (0% hepatic activation; directly active parent drug)', correctRank: 1, rationale: adaptTextToDepth('Directly active parent molecules require zero metabolic conversion.', rationaleDepth) },
        { id: 'hep_2', label: 'Ticagrelor (Active parent drug with active metabolite AR-C124910XX)', correctRank: 2, rationale: adaptTextToDepth('Parent drug is already fully active; CYP3A4 creates an equipotent metabolite.', rationaleDepth) },
        { id: 'hep_3', label: 'Prasugrel (Single hepatic CYP step following intestinal esterase cleavage)', correctRank: 3, rationale: adaptTextToDepth('Requires 1 rapid CYP step (CYP3A4/2B6) after esterase cleavage.', rationaleDepth) },
        { id: 'hep_4', label: 'Clopidogrel (Two sequential hepatic CYP oxidation steps with 85% esterase loss)', correctRank: 4, rationale: adaptTextToDepth('Most dependent: two rate-limited CYP steps required to yield active thiol.', rationaleDepth) },
      ],
      overallExplanation: adaptTextToDepth(
        'Dependence on hepatic bioactivation introduces pharmacokinetic variability, drug interactions (e.g. omeprazole inhibiting CYP2C19), and delayed onset.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Least to most hepatic bioactivation dependent: Cangrelor (none) < Ticagrelor (direct) < Prasugrel (1-step) < Clopidogrel (2-step).',
        rationaleDepth
      ),
      sourceReference: 'Clinical Pharmacology Ranking Standards',
    });
  }

  // 15. SUB-STATEMENTS: Clinical Pearl Synthesis
  if (generated.length < count) {
    generated.push({
      id: baseTime + 15,
      questionNumberLabel: `Question ${generated.length + 1}`,
      category: 'Clinical SAR Pearl Synthesis',
      questionStem:
        'Evaluate the following comprehensive clinical medicinal chemistry statements:',
      type: 'sub-statements',
      subStatements: [
        {
          id: 'pearl_a',
          statement: 'Proton pump inhibitors that inhibit CYP2C19 (such as omeprazole) can reduce the antiplatelet efficacy of Clopidogrel but do not inhibit Ticagrelor or Cangrelor.',
          isCorrect: true,
          rationale: adaptTextToDepth('True: Clopidogrel requires CYP2C19 bioactivation; Ticagrelor and Cangrelor do not.', rationaleDepth),
        },
        {
          id: 'pearl_b',
          statement: 'Aspirin inhibits platelet COX-1 selectively at low doses (81 mg) because platelets in portal circulation are exposed to high aspirin concentrations before first-pass hepatic de-acetylation.',
          isCorrect: true,
          rationale: adaptTextToDepth('True: Pre-systemic portal acetylation selectively disables platelets while sparing vascular prostacyclin (PGI2) synthesis by endothelial cells.', rationaleDepth),
        },
        {
          id: 'pearl_c',
          statement: 'Tirofiban and Eptifibatide can be administered orally with high bioavailability.',
          isCorrect: false,
          rationale: adaptTextToDepth('False: Due to peptide/peptidomimetic backbone and polar ionic groups, GPIIb/IIIa inhibitors have poor oral bioavailability and must be administered by IV infusion.', rationaleDepth),
        },
      ],
      overallExplanation: adaptTextToDepth(
        'Clinical success in antiplatelet pharmacotherapy requires integrating molecular structure, route of administration, and metabolic drug-drug interactions.',
        rationaleDepth
      ),
      highYieldPearl: adaptTextToDepth(
        'Low-dose aspirin exploits portal vein pre-systemic exposure; omeprazole selectively impairs clopidogrel via CYP2C19 inhibition.',
        rationaleDepth
      ),
      sourceReference: 'Cardiovascular Pharmacotherapy Review',
    });
  }

  return generated.slice(0, count);
}

/**
 * Calls backend API to generate a novel alternative quiz replacing old questions.
 * If backend fails or is offline, falls back to synthesizeOfflineAlternativeQuestions.
 */
export async function generateAlternativeQuestionsAPI(options: {
  structures: ChemicalStructure[];
  existingQuestions: AntiplateletQuestion[];
  pageTitle: string;
  competencies: string[];
  rationaleDepth: RationaleDepth;
  sourceMaterial?: string;
  count?: number;
}): Promise<AntiplateletQuestion[]> {
  try {
    const response = await fetch('/api/gemini/generate-alternative-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `Failed to generate questions: ${response.status}`);
    }

    const result = await response.json();
    if (!Array.isArray(result.questions) || result.questions.length === 0) {
      throw new Error('No questions returned by Generative Quiz Mode.');
    }

    return result.questions;
  } catch (err: any) {
    console.warn('Backend question generation failed, invoking authentic offline synthesizer:', err);
    return synthesizeOfflineAlternativeQuestions(
      options.structures,
      options.competencies,
      options.rationaleDepth,
      options.count || 4
    );
  }
}
