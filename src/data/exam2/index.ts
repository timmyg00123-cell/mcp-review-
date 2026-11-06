import { ReviewModule } from '../../types/reviewModule';
import { getDefaultDiureticsModule } from './diureticsModuleData';
import { getDefaultSympatholyticsModule } from './sympatholyticsModuleData';
import { getDefaultVasodilatorsModule } from './vasodilatorsModuleData';
import { getDefaultRaasModule } from './raasModuleData';
import { getDefaultAntihyperlipidemicsModule } from './antihyperlipidemicsModuleData';

export * from './exam2Structures';
export * from './diureticsModuleData';
export * from './sympatholyticsModuleData';
export * from './vasodilatorsModuleData';
export * from './raasModuleData';
export * from './antihyperlipidemicsModuleData';

export const EXAM_2_MODULE_IDS = [
  'antihypertensives_1_mcp2',
  'antihypertensives_2_mcp2',
  'antihypertensives_3_mcp2',
  'antihypertensives_4_mcp2',
  'antihyperlipidemics_mcp2',
] as const;

export function getExam2Modules(): ReviewModule[] {
  return [
    getDefaultDiureticsModule(),
    getDefaultSympatholyticsModule(),
    getDefaultVasodilatorsModule(),
    getDefaultRaasModule(),
    getDefaultAntihyperlipidemicsModule(),
  ];
}
