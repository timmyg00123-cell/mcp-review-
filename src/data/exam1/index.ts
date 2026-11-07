import { ReviewModule } from '../../types/reviewModule';
import { getDefaultRenalDrugsModule } from './renalDrugsModuleData';
import { getDefaultRespiratoryBronchodilatorsModule } from './respiratoryBronchodilatorsModuleData';
import { getDefaultRespiratoryAntiinflammatoriesModule } from './respiratoryAntiinflammatoriesModuleData';
import { getDefaultRenalReviewModule } from '../renalReviewModuleData';
import { getDefaultRespiratoryReviewModule } from '../respiratoryReviewModuleData';

export * from './exam1Structures';
export * from './renalDrugsModuleData';
export * from './respiratoryBronchodilatorsModuleData';
export * from './respiratoryAntiinflammatoriesModuleData';
export * from './exam1CumulativeQuizData';
export * from '../renalReviewModuleData';
export * from '../respiratoryReviewModuleData';

export const EXAM_1_MODULE_IDS = [
  'renal_review_mcp2',
  'respiratory_review_mcp2',
] as const;

export function getExam1Modules(): ReviewModule[] {
  return [
    getDefaultRenalReviewModule(),
    getDefaultRespiratoryReviewModule(),
  ];
}
