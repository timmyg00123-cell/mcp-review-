import { getDefaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';
import { loadAllReviewModules } from '../src/utils/moduleStorage';

const mod = getDefaultAntiarrhythmicModule();
if (mod.id !== 'antiarrhythmics_mcp2') throw new Error(`Incorrect module ID: ${mod.id}`);

let totalQuestions = 0;
mod.pages.forEach((p) => {
  p.sections.forEach((s) => {
    totalQuestions += s.questions.length;
  });
});

if (totalQuestions !== 33) {
  throw new Error(`Expected 33 questions in Review 11, found ${totalQuestions}`);
}

const allModules = loadAllReviewModules();
const aaInStorage = allModules.find((m) => m.id === 'antiarrhythmics_mcp2');
if (!aaInStorage) {
  throw new Error('Antiarrhythmics module not registered in moduleStorage loadAllReviewModules');
}

console.log('Antiarrhythmics module verification PASSED with 33 questions');
