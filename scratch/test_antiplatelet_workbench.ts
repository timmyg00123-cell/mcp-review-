import { THIENOPYRIDINE_WORKBENCH_DATA } from '../src/data/antiplateletWorkbenchData';
import { evaluateWorkbenchAnswer } from '../src/utils/workbenchEvaluator';
import { pdfPages } from '../src/data/antiplateletQuizData';

if (!THIENOPYRIDINE_WORKBENCH_DATA) throw new Error('THIENOPYRIDINE_WORKBENCH_DATA missing');

// Verify question 14 on page 3 contains the structural workbench
const page3 = pdfPages.find((p: any) => p.pageNumber === 3);
const q14 = page3?.sections?.[0]?.questions?.find((q: any) => q.id === 14);
if (!q14?.structuralWorkbench) {
  throw new Error('Question 14 does not attach structuralWorkbench');
}

// Test evaluation awarding points
const evalResult = evaluateWorkbenchAnswer(THIENOPYRIDINE_WORKBENCH_DATA, {
  selectedAmideIds: ['thiol_group'],
  selectedMoietyIds: ['thiolactone_ring'],
  dropZoneAssignments: {
    clopidogrel_bioactivation: 'CYP2C19 (2-step oxidation, 85% CES1 ester inactivation)',
    prasugrel_bioactivation: 'CES2 (rapid intestinal ester hydrolysis, 1-step CYP bioactivation)',
  },
  selectedCandidateId: 'active_cis_thiol_metabolite',
});

if (evalResult.totalScore < 1) {
  throw new Error(`Workbench evaluator awarded ${evalResult.totalScore}/4 points, expected > 0`);
}

console.log('Thienopyridine workbench verification PASSED with score:', evalResult.totalScore);
