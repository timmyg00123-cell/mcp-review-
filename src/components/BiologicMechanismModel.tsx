import React, { useMemo } from 'react';
import { Activity, ShieldCheck, Layers } from 'lucide-react';
import type { TopDrugStructureRecord } from '../data/topDrugsSmilesData';
import type { ChemicalStructure } from '../types/reviewModule';
import { FibrinolysisCascadeViewer } from './FibrinolysisCascadeViewer';

export interface BiologicMechanismModelProps {
  structureRecord?: TopDrugStructureRecord;
  compoundName?: string;
  isFlipped?: boolean;
  height?: number;
  className?: string;
  activePharmacophores?: Array<{ id?: string; name?: string; smarts?: string; color?: string }>;
  hoveredPharmacophore?: { id?: string; name?: string; smarts?: string; color?: string } | null;
}

type BiologicPathwayFamily =
  | 'fibrinolytic'
  | 'insulin'
  | 'incretin'
  | 'pcsk9'
  | 'tnf'
  | 'rankl'
  | 'ige'
  | 'epo';

interface PathwayNodeSpec {
  stepLabel: string;
  title: string;
  subtitle: string;
  detail: string;
  accentHex: string;
  fillVar: string;
}

interface PathwayDiagramSpec {
  family: BiologicPathwayFamily;
  pathwayTitle: string;
  referenceCitation: string;
  blindedSlotLabel: string;
  blindedModalityHint: string;
  revealedBioengineeringNote: string;
  arrowLabels: [string, string];
  inhibitsStep1?: boolean;
  nodes: [PathwayNodeSpec, PathwayNodeSpec, PathwayNodeSpec];
}

function normalizeBioKey(raw?: string): string {
  return (raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export function resolveBiologicPathwayFamily(name?: string): BiologicPathwayFamily | null {
  const key = normalizeBioKey(name);
  if (!key) return null;

  if (
    key.includes('alteplase') ||
    key.includes('reteplase') ||
    key.includes('tenecteplase') ||
    key.includes('streptokinase') ||
    key.includes('urokinase')
  ) {
    return 'fibrinolytic';
  }
  if (key.includes('dulaglutide') || key.includes('semaglutide') || key.includes('liraglutide')) {
    return 'incretin';
  }
  if (key.includes('insulin')) {
    return 'insulin';
  }
  if (key.includes('evolocumab') || key.includes('alirocumab')) {
    return 'pcsk9';
  }
  if (
    key.includes('adalimumab') ||
    key.includes('etanercept') ||
    key.includes('infliximab') ||
    key.includes('certolizumab') ||
    key.includes('golimumab')
  ) {
    return 'tnf';
  }
  if (key.includes('denosumab')) {
    return 'rankl';
  }
  if (key.includes('omalizumab')) {
    return 'ige';
  }
  if (key.includes('epoetin') || key.includes('darbepoetin')) {
    return 'epo';
  }
  return null;
}

export function hasDedicatedBiologicModel(name?: string): boolean {
  return resolveBiologicPathwayFamily(name) !== null;
}

function buildPathwayDiagramSpec(
  family: Exclude<BiologicPathwayFamily, 'fibrinolytic'>,
  drugName: string
): PathwayDiagramSpec {
  const lower = drugName.toLowerCase();

  switch (family) {
    case 'insulin': {
      let bioNote = 'Recombinant 51-aa two-chain peptide (A-chain 21 aa + B-chain 30 aa; 3 disulfide bridges).';
      if (lower.includes('lispro')) {
        bioNote = 'Rapid-Acting Analog: B28-Lys / B29-Pro inversion prevents Zn²⁺ hexamer self-association → rapid monomer absorption.';
      } else if (lower.includes('aspart')) {
        bioNote = 'Rapid-Acting Analog: B28 Pro → Asp substitution introduces electrostatic repulsion → rapid dissociation to active monomers.';
      } else if (lower.includes('glargine')) {
        bioNote = 'Long-Acting Basal: A21-Gly + B31/B32-diArg shifts pI (5.4 → 6.7) → forms subcutaneous microprecipitates at pH 7.4 (peakless 24h).';
      } else if (lower.includes('degludec')) {
        bioNote = 'Ultra-Long Basal: Des-B30 + B29 hexadecanedioyl-γ-L-Glu fatty diacid → soluble multi-hexamer chains + reversible albumin binding (>42h).';
      } else if (lower.includes('regular')) {
        bioNote = 'Short-Acting Unmodified Human Insulin: Zn²⁺-stabilized hexamer depot must dissociate into monomers prior to capillary entry.';
      }

      return {
        family: 'insulin',
        pathwayTitle: 'Insulin Receptor RTK → GLUT4 Translocation Cascade',
        referenceCitation: 'Goodman & Gilman Ch. 47 / Katzung Ch. 41',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Subcutaneous Peptide Hormone / Engineered Monomer-Hexamer Depot',
        revealedBioengineeringNote: bioNote,
        arrowLabels: ['Binds α-Subunit', 'IRS-1 / PI3K / Akt'],
        inhibitsStep1: false,
        nodes: [
          {
            stepLabel: 'SUBCUTANEOUS DEPOT / LIGAND',
            title: 'Blinded Biologic (?)',
            subtitle: 'Monomeric peptide hormone in plasma',
            detail: 'Disulfide-linked A & B chains',
            accentHex: '#0284C7',
            fillVar: 'var(--bio-panel, #f8fafc)',
          },
          {
            stepLabel: 'CELL-SURFACE RTK',
            title: 'Insulin Receptor (α₂β₂)',
            subtitle: 'β-subunit Tyr autophosphorylation',
            detail: 'Recruits IRS-1 → PI3K → PIP₃ → Akt',
            accentHex: '#6366F1',
            fillVar: 'var(--bio-stage2-indigo-bg, #eef2ff)',
          },
          {
            stepLabel: 'METABOLIC EFFECTOR',
            title: 'GLUT4 Translocation',
            subtitle: '↑ Skeletal muscle & adipocyte glucose uptake',
            detail: '↑ Glycogen synthesis • ↓ Hepatic gluconeogenesis',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'incretin': {
      return {
        family: 'incretin',
        pathwayTitle: 'GLP-1 Receptor Agonist → Glucose-Dependent Insulinotropic Pathway',
        referenceCitation: 'Goodman & Gilman Ch. 47 / Katzung Ch. 41',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'DPP-4–Resistant Incretin Fusion Macromolecule',
        revealedBioengineeringNote:
          'Homodimeric fusion of 2 DPP-4–resistant GLP-1(7-37) analogs (Ala8→Gly) covalently linked to modified human IgG4-Fc (~63 kDa; once-weekly SC).',
        arrowLabels: ['Agonizes Gs GPCR', '↑ cAMP / PKA / Epac2'],
        inhibitsStep1: false,
        nodes: [
          {
            stepLabel: 'INCRETIN BIOLOGIC AGONIST',
            title: 'Blinded Biologic (?)',
            subtitle: 'FcRn-recycled long-acting incretin mimetic',
            detail: 'Protected against rapid DPP-4 cleavage',
            accentHex: '#0284C7',
            fillVar: 'var(--bio-panel, #f8fafc)',
          },
          {
            stepLabel: 'PANCREATIC β-CELL GPCR',
            title: 'GLP-1 Receptor (Gs)',
            subtitle: 'Adenylyl cyclase → ↑ intracellular cAMP',
            detail: 'Closes K_ATP • Opens Ca_v → Insulin exocytosis',
            accentHex: '#6366F1',
            fillVar: 'var(--bio-stage2-indigo-bg, #eef2ff)',
          },
          {
            stepLabel: 'GLYCEMIC HOMEOSTASIS',
            title: 'GLUT4 Uptake & ↓ Glucagon',
            subtitle: 'Glucose-dependent insulin release',
            detail: '↓ α-cell glucagon • Delays gastric emptying',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'pcsk9': {
      return {
        family: 'pcsk9',
        pathwayTitle: 'PCSK9 Neutralization → Hepatic LDL-Receptor Recycling Pathway',
        referenceCitation: 'Goodman & Gilman Ch. 33 / Katzung Ch. 35',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Monoclonal Antibody Sequestration of Circulating Convertase',
        revealedBioengineeringNote:
          'Fully human IgG2λ monoclonal antibody (~144 kDa) binding free circulating PCSK9 catalytic/prodomain interface to prevent LDLR EGF-A binding.',
        arrowLabels: ['Sequesters PCSK9', 'Prevents Lysosomal Lysis'],
        inhibitsStep1: true,
        nodes: [
          {
            stepLabel: 'EXTRACELLULAR NEUTRALIZATION',
            title: 'Blinded Biologic (?)',
            subtitle: 'Binds free plasma PCSK9 with pM affinity',
            detail: 'Blocks PCSK9–LDLR (EGF-A) interaction',
            accentHex: '#F43F5E',
            fillVar: 'var(--bio-stage2-rose-bg, #fff1f2)',
          },
          {
            stepLabel: 'HEPATOCYTE MEMBRANE',
            title: 'Hepatic LDL-R Recycling',
            subtitle: 'Endosomal LDL-R escapes lysosomal degradation',
            detail: '↑ Surface LDL-R density (~150× recycling)',
            accentHex: '#0284C7',
            fillVar: 'var(--bio-stage2-cyan-bg, #ecfeff)',
          },
          {
            stepLabel: 'LIPOPROTEIN CLEARANCE',
            title: '↓↓ Plasma LDL-C (~60%)',
            subtitle: 'Accelerated hepatic clearance of ApoB-100 LDL',
            detail: 'Synergistic with statin SREBP-2 upregulation',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'tnf': {
      const isFusionDecoy = lower.includes('etanercept');
      const bioNote = isFusionDecoy
        ? 'Dimeric soluble p75 TNFR2 extracellular domain fused to human IgG1 Fc (~150 kDa); binds both TNF-α and lymphotoxin-α (TNF-β).'
        : 'Recombinant fully human anti-TNF-α IgG1κ monoclonal antibody (~148 kDa); neutralizes soluble and transmembrane trimeric TNF-α.';

      return {
        family: 'tnf',
        pathwayTitle: 'TNF-α Cytokine Sequestration → NF-κB Blockade Cascade',
        referenceCitation: 'Goodman & Gilman Ch. 35 / Katzung Ch. 36',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Extracellular Cytokine Neutralizer (mAb / Soluble Receptor-Fc)',
        revealedBioengineeringNote: bioNote,
        arrowLabels: ['Neutralizes TNF-α', 'Blocks TNFR1/2 Signaling'],
        inhibitsStep1: true,
        nodes: [
          {
            stepLabel: 'CYTOKINE SEQUESTRATION',
            title: 'Blinded Biologic (?)',
            subtitle: 'Captures soluble & membrane trimeric TNF-α',
            detail: 'Prevents ligand binding to cell-surface receptors',
            accentHex: '#F43F5E',
            fillVar: 'var(--bio-stage2-rose-bg, #fff1f2)',
          },
          {
            stepLabel: 'RECEPTOR CHECKPOINT',
            title: 'TNFR1 / TNFR2 Silenced',
            subtitle: 'Halts TRADD / TRAF2 / RIPK1 recruitment',
            detail: 'Prevents IKK phosphorylation of IκBα',
            accentHex: '#D97706',
            fillVar: 'var(--bio-stage2-amber-bg, #fffbeb)',
          },
          {
            stepLabel: 'ANTI-INFLAMMATORY OUTCOME',
            title: '↓ NF-κB & MAPK Cascade',
            subtitle: '↓ IL-1β, IL-6, MMP-3 & leukocyte adhesion',
            detail: 'Halts synovial pannus & mucosal inflammation',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'rankl': {
      return {
        family: 'rankl',
        pathwayTitle: 'RANKL Neutralization → Osteoclastogenesis Inhibition Pathway',
        referenceCitation: 'Goodman & Gilman Ch. 48 / Katzung Ch. 42',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Osteoprotegerin (OPG)-Mimetic Anti-Cytokine Antibody',
        revealedBioengineeringNote:
          'Fully human IgG2κ monoclonal antibody (~147 kDa) mimicking endogenous osteoprotegerin (OPG) by binding osteoblast-derived RANKL.',
        arrowLabels: ['Sequesters RANKL', 'Blocks RANK Activation'],
        inhibitsStep1: true,
        nodes: [
          {
            stepLabel: 'OSTEOBLAST MICROENVIRONMENT',
            title: 'Blinded Biologic (?)',
            subtitle: 'Binds soluble & osteoblast-membrane RANKL',
            detail: 'Functional biomimetic of endogenous OPG',
            accentHex: '#F43F5E',
            fillVar: 'var(--bio-stage2-rose-bg, #fff1f2)',
          },
          {
            stepLabel: 'OSTEOCLAST PRECURSOR',
            title: 'RANK Receptor Unbound',
            subtitle: 'Blocks TRAF6 / NF-κB / NFATc1 signaling',
            detail: 'Prevents monocyte-macrophage fusion & maturation',
            accentHex: '#7C3AED',
            fillVar: 'var(--bio-stage2-indigo-bg, #eef2ff)',
          },
          {
            stepLabel: 'SKELETAL PRESERVATION',
            title: '↓ Bone Resorption & ↑ BMD',
            subtitle: 'Inhibits ruffled-border acid/cathepsin Kolysis',
            detail: 'Preserves cortical & trabecular bone mass',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'ige': {
      return {
        family: 'ige',
        pathwayTitle: 'Free IgE Fc Neutralization → Mast Cell Stabilization Pathway',
        referenceCitation: 'Goodman & Gilman Ch. 40 / Katzung Ch. 20',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Anti-Immunoglobulin Fc-Targeted Humanized Antibody',
        revealedBioengineeringNote:
          'Recombinant humanized IgG1κ mAb (~149 kDa) targeting the Cε3 (Fc) domain of FREE circulating IgE without cross-linking receptor-bound IgE.',
        arrowLabels: ['Binds Free IgE Cε3', 'Prevents FcεRI Docking'],
        inhibitsStep1: true,
        nodes: [
          {
            stepLabel: 'INTRAVASCULAR SEQUESTRATION',
            title: 'Blinded Biologic (?)',
            subtitle: 'Binds Cε3 Fc domain of free plasma IgE',
            detail: 'Does NOT bind IgE already on mast cells',
            accentHex: '#F43F5E',
            fillVar: 'var(--bio-stage2-rose-bg, #fff1f2)',
          },
          {
            stepLabel: 'MAST CELL / BASOPHIL SURFACE',
            title: 'FcεRI Cross-Linking Blocked',
            subtitle: 'Downregulates high-affinity FcεRI density',
            detail: 'Prevents allergen-bridged Lyn / Syk activation',
            accentHex: '#0891B2',
            fillVar: 'var(--bio-stage2-cyan-bg, #ecfeff)',
          },
          {
            stepLabel: 'ALLERGIC ATTENUATION',
            title: '↓ Mast Cell Degranulation',
            subtitle: '↓ Histamine, LTC₄/LTD₄ & PGD₂ release',
            detail: 'Prevents IgE-mediated bronchospasm & urticaria',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }

    case 'epo': {
      return {
        family: 'epo',
        pathwayTitle: 'EPO-R Homodimerization → JAK2 / STAT5 Erythropoiesis Cascade',
        referenceCitation: 'Goodman & Gilman Ch. 41 / Katzung Ch. 33',
        blindedSlotLabel: 'Blinded Biologic (?)',
        blindedModalityHint: 'Recombinant Glycoprotein Hematopoietic Growth Factor',
        revealedBioengineeringNote:
          '165-amino-acid recombinant human erythropoietin glycoprotein (~30.4 kDa; CHO-cell glycosylated at Asn24, Asn38, Asn83, Ser126).',
        arrowLabels: ['Dimerizes EPO-R', 'JAK2 → STAT5 Phosphorylation'],
        inhibitsStep1: false,
        nodes: [
          {
            stepLabel: 'HEMATOPOIETIC CYTOKINE',
            title: 'Blinded Biologic (?)',
            subtitle: 'Glycosylated 165-aa endocrine growth factor',
            detail: 'Replaces renal peritubular EPO in CKD anemia',
            accentHex: '#0284C7',
            fillVar: 'var(--bio-panel, #f8fafc)',
          },
          {
            stepLabel: 'MARROW CFU-E PROGENITOR',
            title: 'EPO-R Homodimer + JAK2',
            subtitle: 'Trans-phosphorylates JAK2 tyrosine kinase',
            detail: 'STAT5 dimerization → nuclear Bcl-xL / GATA-1',
            accentHex: '#DB2777',
            fillVar: 'var(--bio-stage2-pink-bg, #fdf2f8)',
          },
          {
            stepLabel: 'ERYTHROID MATURATION',
            title: '↑ Reticulocytes & RBC Mass',
            subtitle: 'Prevents erythroblast apoptosis + ↑ Hgb synthesis',
            detail: 'Requires adequate iron, folate & B12 stores',
            accentHex: '#10B981',
            fillVar: 'var(--bio-fdp-bg, #ecfdf5)',
          },
        ],
      };
    }
  }
}

export const BiologicMechanismModel: React.FC<BiologicMechanismModelProps> = ({
  structureRecord,
  compoundName,
  isFlipped = false,
  height = 220,
  className = '',
  activePharmacophores = [],
  hoveredPharmacophore = null,
}) => {
  const rawUid = React.useId();
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '');

  const resolvedDrugName = (structureRecord?.genericName || compoundName || 'Therapeutic Biologic').trim();
  const family = useMemo(() => resolveBiologicPathwayFamily(resolvedDrugName), [resolvedDrugName]);
  const effectiveFamily: Exclude<BiologicPathwayFamily, 'fibrinolytic'> =
    family && family !== 'fibrinolytic' ? family : 'tnf';
  const spec = useMemo(
    () => buildPathwayDiagramSpec(effectiveFamily, resolvedDrugName),
    [effectiveFamily, resolvedDrugName]
  );

  // Fibrinolytic thrombolytics delegate directly to the specialized FibrinolysisCascadeViewer
  if (family === 'fibrinolytic') {
    const syntheticStructure: ChemicalStructure = {
      id: normalizeBioKey(resolvedDrugName) || 'fibrinolytic_biologic',
      name: resolvedDrugName,
      isBiologic: true,
      smiles: '',
      chemicalClass: 'Recombinant / Protein Thrombolytic Biologic',
      pharmacologicalClass: 'Fibrinolytic / Plasminogen Activator',
      target: 'Plasminogen (Arg561-Val562 peptide bond)',
      reversibility: 'Enzymatic catalytic cleavage',
      route: 'IV',
      keyFunctionalGroups: [],
      pkPdHighlights: {
        onset: 'Immediate (IV)',
        duration: 'Fibrinolytic window',
        halfLife: 'Agent-specific',
        elimination: 'Hepatic receptor-mediated clearance',
      },
      sarNotes: structureRecord?.biologicDescription || '',
      moa_summary: structureRecord?.biologicDescription || '',
    };
    const convertedActiveMap: Record<string, { id: string; name: string; color: string }> = {};
    if (isFlipped && activePharmacophores) {
      for (const p of activePharmacophores) {
        if (p.id) {
          convertedActiveMap[p.id] = {
            id: p.id,
            name: p.name || p.id,
            color: p.color || '#38BDF8',
          };
        }
      }
    }

    return (
      <FibrinolysisCascadeViewer
        structure={syntheticStructure}
        activePharmacophoreIds={convertedActiveMap}
        hoveredPharmacophoreId={isFlipped ? (hoveredPharmacophore?.id ?? null) : null}
        height={Math.max(210, height)}
        isBlinded={!isFlipped}
        className={className}
      />
    );
  }

  const drugSlotTitle = isFlipped ? resolvedDrugName : spec.blindedSlotLabel;
  const headerBadgeText = isFlipped ? resolvedDrugName : 'Blinded Biologic (?)';

  const nodeGlowId = `${uid}-bio-node-glow`;
  const arrowActivateId = `${uid}-bio-arrow-activate`;
  const arrowDownstreamId = `${uid}-bio-arrow-downstream`;
  const barInhibitId = `${uid}-bio-bar-inhibit`;

  return (
    <div
      className={`bio-model-theme relative w-full flex flex-col justify-between rounded-xl overflow-hidden bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-lg ${className}`}
      style={{ minHeight: height }}
      role="region"
      aria-label={
        isFlipped
          ? `Mechanism of Action Model for ${resolvedDrugName}`
          : 'Blinded Therapeutic Biologic Mechanism Model'
      }
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5 text-xs border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{spec.pathwayTitle}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden md:inline shrink-0">
            ({spec.referenceCitation})
          </span>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
            isFlipped
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700/60'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-700/60'
          }`}
        >
          {headerBadgeText}
        </span>
      </div>

      {/* Authoritative 3-Stage Vector Pathway SVG */}
      <div className="relative w-full flex-1 flex items-center justify-center py-1.5">
        <svg
          viewBox="0 0 860 210"
          className="w-full h-auto max-h-[210px] select-none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id={nodeGlowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id={arrowActivateId}
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
            </marker>
            <marker
              id={arrowDownstreamId}
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
            </marker>
            <marker
              id={barInhibitId}
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <line x1="5" y1="0" x2="5" y2="10" stroke="#F43F5E" strokeWidth="2.8" />
            </marker>
          </defs>

          {/* NODE 1: Therapeutic Biologic Slot */}
          <g id={`${uid}-bio-stage-1`}>
            <rect
              x="16"
              y="32"
              width="240"
              height="146"
              rx="12"
              fill={spec.nodes[0].fillVar}
              stroke={isFlipped ? '#10B981' : spec.nodes[0].accentHex}
              strokeWidth="2"
              filter={`url(#${nodeGlowId})`}
            />
            <rect
              x="28"
              y="44"
              width="216"
              height="20"
              rx="5"
              fill="var(--bio-node-alt, #f1f5f9)"
            />
            <text
              x="136"
              y="58"
              fill={spec.nodes[0].accentHex}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {spec.nodes[0].stepLabel}
            </text>
            <text
              x="136"
              y="92"
              fill={isFlipped ? 'var(--bio-active-emerald-text, #065f46)' : 'var(--bio-text, #0f172a)'}
              fontSize={drugSlotTitle.length > 22 ? '11.5' : '13.5'}
              fontWeight="800"
              textAnchor="middle"
            >
              {drugSlotTitle}
            </text>
            <text x="136" y="116" fill="var(--bio-text-secondary, #334155)" fontSize="9.5" textAnchor="middle">
              {spec.nodes[0].subtitle}
            </text>
            <text
              x="136"
              y="138"
              fill="var(--bio-text-muted, #475569)"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {spec.nodes[0].detail}
            </text>
            <text
              x="136"
              y="162"
              fill={isFlipped ? 'var(--bio-fdp-badge, #059669)' : '#6366F1'}
              fontSize="8.5"
              fontWeight="700"
              textAnchor="middle"
            >
              {isFlipped
                ? structureRecord?.molecularWeight
                  ? `MW: ~${(structureRecord.molecularWeight / 1000).toFixed(1)} kDa`
                  : 'Recombinant Therapeutic Biologic'
                : 'Identity Blinded on Front'}
            </text>
          </g>

          {/* CONNECTOR 1 -> 2 */}
          <g id={`${uid}-bio-connector-1`}>
            <line
              x1="256"
              y1="105"
              x2="306"
              y2="105"
              stroke={spec.inhibitsStep1 ? '#F43F5E' : 'var(--bio-cyan, #0284c7)'}
              strokeWidth="2.6"
              strokeDasharray={spec.inhibitsStep1 ? '5 3' : undefined}
              markerEnd={spec.inhibitsStep1 ? `url(#${barInhibitId})` : `url(#${arrowActivateId})`}
            />
            <text
              x="281"
              y="91"
              fill={
                spec.inhibitsStep1
                  ? 'var(--bio-inhibit-label, #e11d48)'
                  : 'var(--bio-activate-label, #0284c7)'
              }
              fontSize="8"
              fontWeight="700"
              textAnchor="middle"
            >
              {spec.arrowLabels[0]}
            </text>
          </g>

          {/* NODE 2: Receptor / Target Transduction */}
          <g id={`${uid}-bio-stage-2`}>
            <rect
              x="312"
              y="32"
              width="240"
              height="146"
              rx="12"
              fill={spec.nodes[1].fillVar}
              stroke={spec.nodes[1].accentHex}
              strokeWidth="1.8"
            />
            <rect x="324" y="44" width="216" height="20" rx="5" fill="var(--bio-node-alt, #f1f5f9)" />
            <text
              x="432"
              y="58"
              fill={spec.nodes[1].accentHex}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {spec.nodes[1].stepLabel}
            </text>
            <text
              x="432"
              y="92"
              fill="var(--bio-text, #0f172a)"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
            >
              {spec.nodes[1].title}
            </text>
            <text x="432" y="116" fill="var(--bio-text-secondary, #334155)" fontSize="9.5" textAnchor="middle">
              {spec.nodes[1].subtitle}
            </text>
            <text
              x="432"
              y="142"
              fill="var(--bio-text-muted, #475569)"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {spec.nodes[1].detail}
            </text>
          </g>

          {/* CONNECTOR 2 -> 3 */}
          <g id={`${uid}-bio-connector-2`}>
            <line
              x1="552"
              y1="105"
              x2="600"
              y2="105"
              stroke="#10B981"
              strokeWidth="2.6"
              markerEnd={`url(#${arrowDownstreamId})`}
            />
            <text
              x="576"
              y="91"
              fill="var(--bio-downstream-label, #059669)"
              fontSize="8"
              fontWeight="700"
              textAnchor="middle"
            >
              {spec.arrowLabels[1]}
            </text>
          </g>

          {/* NODE 3: Cellular / Physiological Effector */}
          <g id={`${uid}-bio-stage-3`}>
            <rect
              x="606"
              y="32"
              width="238"
              height="146"
              rx="12"
              fill={spec.nodes[2].fillVar}
              stroke={spec.nodes[2].accentHex}
              strokeWidth="2"
              filter={`url(#${nodeGlowId})`}
            />
            <rect
              x="618"
              y="44"
              width="214"
              height="20"
              rx="5"
              fill="var(--bio-active-emerald-bg, #d1fae5)"
            />
            <text
              x="725"
              y="58"
              fill="var(--bio-active-emerald-text, #065f46)"
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {spec.nodes[2].stepLabel}
            </text>
            <text
              x="725"
              y="92"
              fill="var(--bio-fdp-title, #065f46)"
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
            >
              {spec.nodes[2].title}
            </text>
            <text x="725" y="116" fill="var(--bio-fdp-sub, #047857)" fontSize="9.5" textAnchor="middle">
              {spec.nodes[2].subtitle}
            </text>
            <text
              x="725"
              y="142"
              fill="var(--bio-fdp-badge, #059669)"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {spec.nodes[2].detail}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer: Blinded Modality Hint on Front vs Revealed Bioengineering & Architecture on Flip */}
      <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] leading-snug">
        {!isFlipped ? (
          <div className="flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 min-w-0">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{spec.blindedModalityHint}</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300 shrink-0">
              Flip to Reveal Drug & Bioengineering
            </span>
          </div>
        ) : (
          <div className="space-y-0.5 text-left">
            <div className="flex items-start gap-1.5 text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong className="text-emerald-700 dark:text-emerald-300">{resolvedDrugName}:</strong>{' '}
                {spec.revealedBioengineeringNote}
              </span>
            </div>
            {structureRecord?.biologicDescription &&
              structureRecord.biologicDescription !== spec.revealedBioengineeringNote && (
                <p className="text-[10px] text-slate-600 dark:text-slate-400 pl-5 line-clamp-2">
                  {structureRecord.biologicDescription}
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiologicMechanismModel;
