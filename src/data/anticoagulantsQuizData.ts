import { ReviewModule, ReviewPage } from '../types/reviewModule';
import {
  DABIGATRAN_STEM_STRUCTURE,
  DABIGATRAN_WORKBENCH_QUESTION,
} from './dabigatranWorkbenchData';

export const anticoagulantsPages: ReviewPage[] = [
  {
    pageNumber: 1,
    pageTitle: 'Direct Thrombin Inhibitors & Oral Anticoagulants',
    subtitle: 'Dabigatran Etexilate Double Prodrug Analysis & SAR',
    sections: [
      {
        sectionTitle: 'Direct Thrombin Inhibitors (Dabigatran Etexilate)',
        headerNote:
          'Consider the chemical structure of Dabigatran etexilate (Pradaxa) to evaluate its double prodrug bioactivation pathway and thrombin inhibition SAR.',
        structures: [DABIGATRAN_STEM_STRUCTURE],
        questions: [
          {
            id: 1,
            questionNumberLabel: 'Question 1',
            category: 'Anticoagulants - Direct Thrombin Inhibitors',
            questionStem:
              'Which statement regarding Dabigatran etexilate and its pharmacological mechanism is TRUE?',
            type: 'multiple-choice',
            options: [
              'A. Dabigatran etexilate is an active competitive direct thrombin inhibitor that does not require bioactivation.',
              'B. Dabigatran directly and reversibly inhibits both free and clot-bound thrombin (Factor IIa).',
              'C. Dabigatran acts indirectly by binding antithrombin III to accelerate Factor Xa inactivation.',
              'D. Dabigatran is an irreversible suicide inhibitor that forms a covalent bond with Ser195 in thrombin.',
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect. Dabigatran etexilate is an inactive double prodrug requiring cleavage of both the ethyl ester and hexyl carbamate groups.',
              'Correct! Dabigatran is a direct, reversible, competitive inhibitor of both free thrombin and fibrin-bound thrombin, unlike heparin which cannot inhibit clot-bound thrombin.',
              'Incorrect. Unfractionated heparin and LMWH act via antithrombin III; dabigatran is a direct thrombin inhibitor that does not require antithrombin III.',
              'Incorrect. Dabigatran binds reversibly and non-covalently; it is not an irreversible covalent inhibitor.',
            ],
            overallExplanation:
              'Dabigatran is a potent, competitive, reversible direct thrombin inhibitor. It binds directly to the active site of thrombin, inhibiting both soluble and fibrin-bound thrombin without requiring antithrombin III as a cofactor.',
            highYieldPearl:
              'DOAC Mechanism Pearl: Dabigatran targets Factor IIa (Thrombin) directly and reversibly (both free and clot-bound). In contrast, Rivaroxaban, Apixaban, and Edoxaban target Factor Xa.',
            sourceReference: 'Anticoagulants Review Worksheet, Page 1, Question 1',
            sourcePageNumber: 1,
          },
          DABIGATRAN_WORKBENCH_QUESTION,
        ],
      },
    ],
  },
];

export function getDefaultAnticoagulantsModule(): ReviewModule {
  return {
    id: 'anticoagulants_mcp2',
    title: 'Review for Anticoagulants',
    subtitle: 'Direct Thrombin Inhibitors, Factor Xa Inhibitors, Heparins & Warfarin',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'RACO',
    isBuiltIn: true,
    createdAt: '2026-11-04',
    pages: anticoagulantsPages,
  };
}
