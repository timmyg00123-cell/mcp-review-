import { getDefaultHeartFailureModule } from '../src/data/heartFailureModuleData';
import { loadAllReviewModules } from '../src/utils/moduleStorage';

const mod = getDefaultHeartFailureModule();
if (mod.id !== 'heart_failure_mcp2') throw new Error(`Incorrect module ID: ${mod.id}`);

let totalQuestions = 0;
mod.pages.forEach((p) => {
  p.sections.forEach((s) => {
    totalQuestions += s.questions.length;
  });
});

if (totalQuestions !== 21) {
  throw new Error(`Expected 21 questions in Review 10, found ${totalQuestions}`);
}

const allModules = loadAllReviewModules();
const hfInStorage = allModules.find((m) => m.id === 'heart_failure_mcp2');
if (!hfInStorage) {
  throw new Error('Heart Failure module not registered in moduleStorage loadAllReviewModules');
}

console.log('Heart Failure module verification PASSED with 21 questions');
