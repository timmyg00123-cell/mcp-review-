import { ReviewModule } from '../../types/reviewModule';
import { getDefaultRenalDrugsModule } from './renalDrugsModuleData';
import { getDefaultRespiratoryBronchodilatorsModule } from './respiratoryBronchodilatorsModuleData';
import { getDefaultRespiratoryAntiinflammatoriesModule } from './respiratoryAntiinflammatoriesModuleData';

export * from './exam1Structures';
export * from './renalDrugsModuleData';
export * from './respiratoryBronchodilatorsModuleData';
export * from './respiratoryAntiinflammatoriesModuleData';
export * from './exam1CumulativeQuizData';

export const EXAM_1_MODULE_IDS = [
  'renal_drugs_mcp2',
  'respiratory_bronchodilators_mcp2',
  'respiratory_antiinflammatories_mcp2',
] as const;

export function getExam1Modules(): ReviewModule[] {
  return [
    getDefaultRenalDrugsModule(),
    getDefaultRespiratoryBronchodilatorsModule(),
    getDefaultRespiratoryAntiinflammatoriesModule(),
  ];
}
