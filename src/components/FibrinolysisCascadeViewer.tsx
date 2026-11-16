import React, { useMemo, useState } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { ColorPaletteItem, getPharmacophoresForStructure } from '../utils/pharmacophoreData';
import { Shield, Sparkles, Activity, Scissors, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface FibrinolysisCascadeViewerProps {
  structure: ChemicalStructure;
  activePharmacophoreIds?: Record<string, ColorPaletteItem>;
  hoveredPharmacophoreId?: string | null;
  className?: string;
  height?: number; // default e.g. 260
  onTogglePharmacophore?: (group: PharmacophoreGroup) => void;
  onHoverPharmacophore?: (id: string | null) => void;
}

interface DomainMechanismConfig {
  key: string;
  matches: (tagId: string, tagName: string) => boolean;
  targetId: string;
  title: string;
  defaultColor: string;
  getExplanation: (drugName: string) => string;
}

const DOMAIN_MECHANISM_RULES: DomainMechanismConfig[] = [
  {
    key: 'kringle',
    matches: (id, name) => /kringle/i.test(name) || /kringle/i.test(id),
    targetId: 'kringle_anchor',
    title: 'Fibrin Binding Anchor (Lysine-Binding Site)',
    defaultColor: '#10B981', // Emerald
    getExplanation: (_drug) =>
      'Kringle-2 mediates high-affinity lysine binding to fibrin clots, concentrating plasmin generation at the thrombus surface.',
  },
  {
    key: 'twoChain',
    matches: (id, name) =>
      /two-chain|disulfide-linked/i.test(name) ||
      /two_chain|disulfide/i.test(id),
    targetId: 'direct_cleavage',
    title: 'Direct Cleavage without Fibrin Specificity',
    defaultColor: '#F97316', // Orange
    getExplanation: (_drug) =>
      'Directly cleaves circulating and clot-bound plasminogen indiscriminately, inducing systemic fibrinogenolysis.',
  },
  {
    key: 'catalytic',
    matches: (id, name) =>
      /catalytic|protease\s+triad|ser-his-asp|protease\s+domain/i.test(name) ||
      /catalytic|protease/i.test(id),
    targetId: 'cleavage_arrow',
    title: 'Arg561–Val562 Cleavage Activation',
    defaultColor: '#EF4444', // Red
    getExplanation: (_drug) =>
      'Ser-His-Asp catalytic triad hydrolyzes Arg561–Val562 peptide bond, converting inactive plasminogen to active two-chain plasmin.',
  },
  {
    key: 'finger',
    matches: (id, name) => /finger/i.test(name) || /finger/i.test(id),
    targetId: 'finger_binding',
    title: 'Fibrin Clot Finger Binding Node',
    defaultColor: '#06B6D4', // Cyan
    getExplanation: (_drug) =>
      'Mediates rapid initial binding of native t-PA to cross-linked fibrin fibers.',
  },
  {
    key: 'egf',
    matches: (id, name) => /egf/i.test(name) || /egf/i.test(id),
    targetId: 'hepatic_clearance',
    title: 'Hepatic Clearance Receptor Binding',
    defaultColor: '#F59E0B', // Amber
    getExplanation: (_drug) =>
      'Binds hepatic mannose / heavy chain receptors mediating rapid liver clearance (t1/2 ≈ 3.5 min).',
  },
  {
    key: 'pai1',
    matches: (id, name) =>
      /pai-?1|tetra-alanine|khrr/i.test(name) || /pai/i.test(id),
    targetId: 'pai1_shield',
    title: 'PAI-1 Checkpoint Shield (KHRR296-299AAAA)',
    defaultColor: '#8B5CF6', // Violet
    getExplanation: (_drug) =>
      'Tetra-alanine substitution eliminates basic cleavage site, rendering Tenecteplase 80-fold more resistant to PAI-1 inhibition.',
  },
  {
    key: 'glycosylation',
    matches: (id, name) =>
      /t103n|n117q|glycosyl|non-glycosyl/i.test(name) ||
      /t103n|n117q|glycosyl/i.test(id),
    targetId: 'half_life_extension',
    title: 'Extended Plasma Half-Life Callout',
    defaultColor: '#3B82F6', // Blue
    getExplanation: (drug) => {
      const lower = drug.toLowerCase();
      if (lower.includes('reteplase')) {
        return 'Non-glycosylated (E. coli expression) and missing finger/EGF domains prolong half-life to 14-18 min, enabling double-bolus dosing.';
      }
      return 'T103N addition + N117Q removal reduces hepatic clearance, extending elimination t1/2 from 3.5 to 20 minutes (allowing bolus dosing).';
    },
  },
  {
    key: 'bacterial',
    matches: (id, name) =>
      /bacterial|stoichiometric|allosteric|1:1/i.test(name) ||
      /bacterial|stoichiometric/i.test(id),
    targetId: 'allosteric_complex',
    title: '1:1 Allosteric Complex Formation',
    defaultColor: '#EC4899', // Pink
    getExplanation: (_drug) =>
      'Binds plasminogen non-enzymatically in 1:1 stoichiometry, inducing an allosteric conformational shift exposing the catalytic site without peptide cleavage.',
  },
  {
    key: 'twoChain',
    matches: (id, name) =>
      /two-chain|disulfide-linked/i.test(name) ||
      /two_chain|disulfide/i.test(id),
    targetId: 'direct_cleavage',
    title: 'Direct Cleavage without Fibrin Specificity',
    defaultColor: '#F97316', // Orange
    getExplanation: (_drug) =>
      'Directly cleaves circulating and clot-bound plasminogen indiscriminately, inducing systemic fibrinogenolysis.',
  },
];

export const FibrinolysisCascadeViewer: React.FC<FibrinolysisCascadeViewerProps> = ({
  structure,
  activePharmacophoreIds = {},
  hoveredPharmacophoreId = null,
  className = '',
  height = 260,
  onTogglePharmacophore,
  onHoverPharmacophore,
}) => {
  const [internalHoveredNode, setInternalHoveredNode] = useState<string | null>(null);

  // Available domain tags for this structure
  const pharmacophores = useMemo(
    () => getPharmacophoresForStructure(structure),
    [structure]
  );

  // Determine active and hovered domains
  const activeDomains = useMemo(() => {
    const activeMap: Record<
      string,
      {
        rule: DomainMechanismConfig;
        color: string;
        isHovered: boolean;
        tagName: string;
        tagGroup: PharmacophoreGroup;
      }
    > = {};

    pharmacophores.forEach((p) => {
      const isPinned = Boolean(activePharmacophoreIds[p.id]);
      const isHovered = hoveredPharmacophoreId === p.id;

      if (isPinned || isHovered) {
        const rule = DOMAIN_MECHANISM_RULES.find((r) => r.matches(p.id, p.name));
        if (rule) {
          const paletteItem = activePharmacophoreIds[p.id];
          const color = paletteItem ? paletteItem.hex : rule.defaultColor;
          activeMap[rule.targetId] = {
            rule,
            color,
            isHovered,
            tagName: p.name,
            tagGroup: p,
          };
        }
      }
    });

    return activeMap;
  }, [pharmacophores, activePharmacophoreIds, hoveredPharmacophoreId]);

  // Priority item for tooltip/callout banner (hovered > active > internal hovered > null)
  const priorityBannerInfo = useMemo(() => {
    // 1. Check direct prop hover
    if (hoveredPharmacophoreId) {
      const p = pharmacophores.find((item) => item.id === hoveredPharmacophoreId);
      if (p) {
        const rule = DOMAIN_MECHANISM_RULES.find((r) => r.matches(p.id, p.name));
        if (rule) {
          const color = activePharmacophoreIds[p.id]?.hex || rule.defaultColor;
          return {
            tagName: p.name,
            title: rule.title,
            explanation: rule.getExplanation(structure.name),
            color,
            isHovered: true,
          };
        }
      }
    }

    // 2. Check internal SVG node hover
    if (internalHoveredNode) {
      const rule = DOMAIN_MECHANISM_RULES.find((r) => r.targetId === internalHoveredNode);
      if (rule) {
        return {
          tagName: rule.title,
          title: rule.title,
          explanation: rule.getExplanation(structure.name),
          color: rule.defaultColor,
          isHovered: true,
        };
      }
    }

    // 3. Fallback to any active domain
    const activeEntries = Object.values(activeDomains);
    if (activeEntries.length > 0) {
      const top = activeEntries[0];
      return {
        tagName: top.tagName,
        title: top.rule.title,
        explanation: top.rule.getExplanation(structure.name),
        color: top.color,
        isHovered: false,
      };
    }

    return null;
  }, [
    hoveredPharmacophoreId,
    internalHoveredNode,
    pharmacophores,
    activeDomains,
    structure.name,
    activePharmacophoreIds,
  ]);

  // Helper to check target state
  const isTargetActive = (targetId: string) => Boolean(activeDomains[targetId]);
  const isTargetHovered = (targetId: string) =>
    activeDomains[targetId]?.isHovered || internalHoveredNode === targetId;
  const getTargetColor = (targetId: string, fallback: string) =>
    activeDomains[targetId]?.color || fallback;

  // Drug-specific characteristics
  const drugLower = structure.name.toLowerCase();
  const isStreptokinase = drugLower.includes('streptokinase');
  const isUrokinase = drugLower.includes('urokinase');
  const isTenecteplase = drugLower.includes('tenecteplase');
  const isReteplase = drugLower.includes('reteplase');

  const drugSubLabel = useMemo(() => {
    if (isTenecteplase) return 'TNK-tPA (T103N, N117Q, KHRR296-299AAAA)';
    if (isReteplase) return 'r-PA Deletion Mutant (K2 + Protease only)';
    if (isStreptokinase) return 'Bacterial Non-Enzymatic Activator (47 kDa)';
    if (isUrokinase) return 'u-PA Two-Chain Serine Protease (32 kDa)';
    return 'Recombinant Human t-PA (527 aa, 59 kDa)';
  }, [isTenecteplase, isReteplase, isStreptokinase, isUrokinase]);

  return (
    <div
      className={`relative w-full flex flex-col justify-between rounded-xl overflow-hidden bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700/80 p-2.5 text-slate-100 shadow-xl transition-all ${className}`}
      style={{ minHeight: height }}
      role="region"
      aria-label={`Fibrinolysis Cascade Mechanism for ${structure.name}`}
    >
      {/* Top Header / Drug Indicator */}
      <div className="flex items-center justify-between px-1 pb-1 text-xs border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Fibrinolytic Cascade</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            (Goodman & Gilman Ch. 32 / DiPiro)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            {structure.name}
          </span>
          {Object.keys(activeDomains).length > 0 && (
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-1.5 py-0.5 rounded">
              {Object.keys(activeDomains).length} Domain{Object.keys(activeDomains).length > 1 ? 's' : ''} Active
            </span>
          )}
        </div>
      </div>

      {/* Main SVG Cascade Diagram */}
      <div className="relative w-full flex-1 flex items-center justify-center py-1">
        <svg
          viewBox="0 0 880 430"
          className="w-full h-auto max-h-[340px] select-none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Glow Filter */}
            <filter id="cascade-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shield Glow Filter */}
            <filter id="shield-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="1.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Standard Arrows */}
            <marker
              id="arrow-down"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
            </marker>

            <marker
              id="arrow-catalytic"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
            </marker>

            <marker
              id="arrow-active-pulse"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
            </marker>

            <marker
              id="inhibit-bar"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <line x1="5" y1="0" x2="5" y2="10" stroke="#F43F5E" strokeWidth="2.5" />
            </marker>

            <linearGradient id="zymogen-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="active-enzyme-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#091E2E" />
            </linearGradient>

            <linearGradient id="fibrin-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#182234" />
            </linearGradient>
          </defs>

          {/* ======================================================== */}
          {/* STEP 1: TOP ROW - PLASMINOGEN (INACTIVE ZYMOGEN)         */}
          {/* ======================================================== */}

          {/* Fibrin Clot Substrate Anchor (Lysine Residues) */}
          <g
            id="node-fibrin-anchor"
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setInternalHoveredNode('finger_binding')}
            onMouseLeave={() => setInternalHoveredNode(null)}
          >
            <rect
              x="30"
              y="40"
              width="215"
              height="62"
              rx="10"
              fill="url(#fibrin-grad)"
              stroke={
                isTargetActive('finger_binding') || isTargetHovered('finger_binding')
                  ? getTargetColor('finger_binding', '#06B6D4')
                  : '#334155'
              }
              strokeWidth={
                isTargetActive('finger_binding') || isTargetHovered('finger_binding') ? '2.5' : '1.5'
              }
              filter={
                isTargetActive('finger_binding') || isTargetHovered('finger_binding')
                  ? 'url(#cascade-glow)'
                  : undefined
              }
            />
            <text x="45" y="62" fill="#E2E8F0" fontSize="11" fontWeight="700">
              Fibrin Clot Surface
            </text>
            <text x="45" y="78" fill="#94A3B8" fontSize="9.5">
              Cross-linked lysine residues
            </text>
            <text x="45" y="92" fill="#38BDF8" fontSize="8.5" fontFamily="monospace">
              High-affinity t-PA / zymogen locus
            </text>
          </g>

          {/* Connecting line: Fibrin Clot -> Clot-Bound Plasminogen */}
          <line
            x1="245"
            y1="71"
            x2="280"
            y2="71"
            stroke={
              isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor')
                ? getTargetColor('kringle_anchor', '#10B981')
                : '#475569'
            }
            strokeWidth={
              isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor') ? '2.5' : '1.5'
            }
            strokeDasharray="4 2"
          />

          {/* Plasminogen Zymogen Node */}
          <g id="node-plasminogen">
            <rect
              x="280"
              y="35"
              width="340"
              height="72"
              rx="12"
              fill="url(#zymogen-grad)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x="450" y="55" fill="#F8FAFC" fontSize="12.5" fontWeight="800" textAnchor="middle">
              PLASMINOGEN (Inactive Zymogen, 92 kDa)
            </text>
            <text x="450" y="70" fill="#94A3B8" fontSize="9.5" textAnchor="middle">
              Single-chain glycoprotein • Arg561–Val562 peptide bond intact
            </text>

            {/* Sub-pills: Clot-bound vs Circulating */}
            {/* Clot-Bound (Lysine site) */}
            <g
              id="node-kringle-anchor"
              className="cursor-pointer"
              onMouseEnter={() => setInternalHoveredNode('kringle_anchor')}
              onMouseLeave={() => setInternalHoveredNode(null)}
            >
              <rect
                x="292"
                y="77"
                width="150"
                height="22"
                rx="6"
                fill={
                  isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor')
                    ? '#064E3B'
                    : '#1E293B'
                }
                stroke={
                  isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor')
                    ? getTargetColor('kringle_anchor', '#10B981')
                    : '#334155'
                }
                strokeWidth={
                  isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor') ? '2' : '1'
                }
                filter={
                  isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor')
                    ? 'url(#cascade-glow)'
                    : undefined
                }
              />
              <text
                x="367"
                y="91"
                fill={
                  isTargetActive('kringle_anchor') || isTargetHovered('kringle_anchor')
                    ? '#6EE7B7'
                    : '#CBD5E1'
                }
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
              >
                ⚓ Clot-Bound (Kringles 1-5)
              </text>
            </g>

            {/* Circulating */}
            <rect
              x="455"
              y="77"
              width="155"
              height="22"
              rx="6"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="532" y="91" fill="#94A3B8" fontSize="9" textAnchor="middle">
              Circulating (Glu-Plasminogen)
            </text>
          </g>

          {/* ======================================================== */}
          {/* STEP 2: MIDDLE SECTION - ACTIVATION & REGULATION         */}
          {/* ======================================================== */}

          {/* Center Vertical Activation Arrow */}
          <line
            x1="450"
            y1="107"
            x2="450"
            y2="148"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow-down)"
          />

          {/* Cleavage Arrow / Site (Arg561-Val562) */}
          <g
            id="node-cleavage-arrow"
            className="cursor-pointer"
            onMouseEnter={() =>
              isUrokinase
                ? setInternalHoveredNode('direct_cleavage')
                : setInternalHoveredNode('cleavage_arrow')
            }
            onMouseLeave={() => setInternalHoveredNode(null)}
          >
            <rect
              x="335"
              y="150"
              width="230"
              height="48"
              rx="8"
              fill={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? '#431407'
                  : isTargetActive('cleavage_arrow') || isTargetHovered('cleavage_arrow')
                  ? '#450A0A'
                  : '#1E293B'
              }
              stroke={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? getTargetColor('direct_cleavage', '#F97316')
                  : isTargetActive('cleavage_arrow') || isTargetHovered('cleavage_arrow')
                  ? getTargetColor('cleavage_arrow', '#EF4444')
                  : '#475569'
              }
              strokeWidth={
                isTargetActive('cleavage_arrow') ||
                isTargetHovered('cleavage_arrow') ||
                isTargetActive('direct_cleavage') ||
                isTargetHovered('direct_cleavage')
                  ? '2.5'
                  : '1.5'
              }
              filter={
                isTargetActive('cleavage_arrow') ||
                isTargetHovered('cleavage_arrow') ||
                isTargetActive('direct_cleavage') ||
                isTargetHovered('direct_cleavage')
                  ? 'url(#cascade-glow)'
                  : undefined
              }
            />
            <text
              x="450"
              y="168"
              fill={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? '#FDBA74'
                  : isTargetActive('cleavage_arrow') || isTargetHovered('cleavage_arrow')
                  ? '#FCA5A5'
                  : '#F1F5F9'
              }
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              {isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                ? '⚡ Direct Serine Protease Cleavage'
                : '✂ Arg561–Val562 Cleavage Site'}
            </text>
            <text
              x="450"
              y="185"
              fill={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? '#FED7AA'
                  : isTargetActive('cleavage_arrow') || isTargetHovered('cleavage_arrow')
                  ? '#FECACA'
                  : '#94A3B8'
              }
              fontSize="9"
              textAnchor="middle"
            >
              {isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                ? 'Cleaves circulating & clot-bound plasminogen (Non-specific)'
                : isStreptokinase
                ? 'Allosteric Exposure (1:1 stoichiometry, no cut)'
                : 'Proteolytic hydrolysis → Two-chain active Plasmin'}
            </text>
          </g>

          <line
            x1="450"
            y1="198"
            x2="450"
            y2="238"
            stroke={
              isTargetActive('cleavage_arrow') || isTargetHovered('cleavage_arrow')
                ? getTargetColor('cleavage_arrow', '#EF4444')
                : '#64748B'
            }
            strokeWidth="2.5"
            markerEnd="url(#arrow-catalytic)"
          />

          {/* Left Catalyst Box: Fibrinolytic Activator Agent */}
          <g
            id="node-activator-agent"
            className="cursor-pointer"
            onMouseEnter={() => {
              if (isStreptokinase) setInternalHoveredNode('allosteric_complex');
              else if (isUrokinase) setInternalHoveredNode('direct_cleavage');
              else setInternalHoveredNode('cleavage_arrow');
            }}
            onMouseLeave={() => setInternalHoveredNode(null)}
          >
            <rect
              x="30"
              y="130"
              width="270"
              height="88"
              rx="10"
              fill="url(#zymogen-grad)"
              stroke={
                isTargetActive('allosteric_complex') ||
                isTargetActive('direct_cleavage') ||
                isTargetActive('cleavage_arrow')
                  ? '#10B981'
                  : '#3B82F6'
              }
              strokeWidth="2"
              filter="url(#cascade-glow)"
            />
            {/* Header pill */}
            <rect x="42" y="138" width="130" height="18" rx="4" fill="#1E3A8A" />
            <text x="107" y="151" fill="#93C5FD" fontSize="9" fontWeight="700" textAnchor="middle">
              CATALYTIC ACTIVATOR
            </text>
            <text x="42" y="174" fill="#FFFFFF" fontSize="13" fontWeight="800">
              {structure.name}
            </text>
            <text x="42" y="190" fill="#94A3B8" fontSize="8.5" fontWeight="500">
              {drugSubLabel}
            </text>
            <text x="42" y="205" fill="#38BDF8" fontSize="8.5" fontFamily="monospace">
              Route: {structure.route || 'IV'} • t1/2: {structure.pkPdHighlights?.halfLife || 'Short'}
            </text>
          </g>

          {/* Catalyst Activation Line pointing into Cleavage Site */}
          <path
            d="M 300 174 L 335 174"
            fill="none"
            stroke={
              isTargetActive('cleavage_arrow') ||
              isTargetActive('allosteric_complex') ||
              isTargetActive('direct_cleavage')
                ? '#10B981'
                : '#38BDF8'
            }
            strokeWidth="2.5"
            markerEnd="url(#arrow-active-pulse)"
          />

          {/* Right Regulators: PAI-1 and Hepatic Clearance */}
          {/* PAI-1 Inhibitor Node */}
          <g
            id="node-pai1-shield"
            className="cursor-pointer"
            onMouseEnter={() => setInternalHoveredNode('pai1_shield')}
            onMouseLeave={() => setInternalHoveredNode(null)}
          >
            <rect
              x="620"
              y="125"
              width="230"
              height="50"
              rx="8"
              fill={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield')
                  ? '#2E1065'
                  : '#1E293B'
              }
              stroke={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield')
                  ? getTargetColor('pai1_shield', '#8B5CF6')
                  : '#475569'
              }
              strokeWidth={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield') ? '2.5' : '1.5'
              }
              filter={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield')
                  ? 'url(#shield-glow)'
                  : undefined
              }
            />
            <text
              x="635"
              y="144"
              fill={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield')
                  ? '#C4B5FD'
                  : '#F1F5F9'
              }
              fontSize="11"
              fontWeight="700"
            >
              PAI-1 (Serpin Inactivator)
            </text>
            <text
              x="635"
              y="160"
              fill={
                isTargetActive('pai1_shield') || isTargetHovered('pai1_shield')
                  ? '#E9D5FF'
                  : '#94A3B8'
              }
              fontSize="8.5"
            >
              {isTenecteplase
                ? '🛡️ SHIELDED: 80× Resistance via AAAA mutation'
                : 'Rapidly neutralizes native t-PA (1:1 complex)'}
            </text>
          </g>

          {/* PAI-1 Inhibitory Line -> Cleavage Arrow */}
          <line
            x1="620"
            y1="150"
            x2="565"
            y2="150"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeDasharray="4 2"
            markerEnd="url(#inhibit-bar)"
          />

          {/* Hepatic Clearance Node */}
          <g
            id="node-hepatic-clearance"
            className="cursor-pointer"
            onMouseEnter={() => setInternalHoveredNode('hepatic_clearance')}
            onMouseLeave={() => setInternalHoveredNode(null)}
          >
            <rect
              x="620"
              y="185"
              width="230"
              height="50"
              rx="8"
              fill={
                isTargetActive('hepatic_clearance') ||
                isTargetActive('half_life_extension') ||
                isTargetHovered('hepatic_clearance') ||
                isTargetHovered('half_life_extension')
                  ? '#451A03'
                  : '#1E293B'
              }
              stroke={
                isTargetActive('hepatic_clearance') || isTargetHovered('hepatic_clearance')
                  ? getTargetColor('hepatic_clearance', '#F59E0B')
                  : isTargetActive('half_life_extension') || isTargetHovered('half_life_extension')
                  ? getTargetColor('half_life_extension', '#3B82F6')
                  : '#475569'
              }
              strokeWidth={
                isTargetActive('hepatic_clearance') || isTargetActive('half_life_extension')
                  ? '2.5'
                  : '1.5'
              }
              filter={
                isTargetActive('hepatic_clearance') || isTargetActive('half_life_extension')
                  ? 'url(#cascade-glow)'
                  : undefined
              }
            />
            <text
              x="635"
              y="204"
              fill={
                isTargetActive('hepatic_clearance') || isTargetHovered('hepatic_clearance')
                  ? '#FDE68A'
                  : isTargetActive('half_life_extension')
                  ? '#93C5FD'
                  : '#F1F5F9'
              }
              fontSize="11"
              fontWeight="700"
            >
              Hepatic Clearance & t1/2
            </text>
            <text
              x="635"
              y="220"
              fill={
                isTargetActive('half_life_extension')
                  ? '#BFDBFE'
                  : isTargetActive('hepatic_clearance')
                  ? '#FED7AA'
                  : '#94A3B8'
              }
              fontSize="8.5"
            >
              {isTenecteplase
                ? 'T103N/N117Q: Slower clearance → t1/2 20-24 min'
                : isReteplase
                ? 'No EGF/Finger: t1/2 14-18 min (double bolus)'
                : 'EGF / heavy chain binding → t1/2 3-5 min'}
            </text>
          </g>

          {/* ======================================================== */}
          {/* STEP 3: ACTIVE PLASMIN NODE                              */}
          {/* ======================================================== */}
          <g id="node-plasmin">
            <rect
              x="280"
              y="240"
              width="340"
              height="68"
              rx="12"
              fill="url(#active-enzyme-grad)"
              stroke="#0284C7"
              strokeWidth="2"
            />
            <text x="450" y="262" fill="#E0F2FE" fontSize="13" fontWeight="800" textAnchor="middle">
              ⚡ PLASMIN (Active Serine Protease, 85 kDa)
            </text>
            <text x="450" y="278" fill="#7DD3FC" fontSize="9.5" textAnchor="middle">
              Two chains linked by 2 disulfide bonds • Active catalytic triad exposed
            </text>
            <text x="450" y="293" fill="#BAE6FD" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
              His603 • Asp646 • Ser741
            </text>
          </g>

          {/* Alpha-2 Antiplasmin Regulator */}
          <g id="node-antiplasmin">
            <rect
              x="660"
              y="250"
              width="190"
              height="48"
              rx="8"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x="675" y="269" fill="#F87171" fontSize="10.5" fontWeight="700">
              α2-Antiplasmin
            </text>
            <text x="675" y="284" fill="#94A3B8" fontSize="8">
              Neutralizes free systemic plasmin
            </text>
          </g>

          {/* Alpha-2 Antiplasmin Inhibitory Line */}
          <line
            x1="660"
            y1="274"
            x2="620"
            y2="274"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeDasharray="3 2"
            markerEnd="url(#inhibit-bar)"
          />

          {/* ======================================================== */}
          {/* STEP 4: BOTTOM ROW - CLOT DIGESTION (FIBRINOLYSIS)       */}
          {/* ======================================================== */}

          {/* Plasmin Digestion Arrow Down */}
          <line
            x1="450"
            y1="308"
            x2="450"
            y2="345"
            stroke="#0284C7"
            strokeWidth="2"
            markerEnd="url(#arrow-down)"
          />

          {/* Substrate: Cross-Linked Fibrin Clot */}
          <g id="node-fibrin-substrate">
            <rect
              x="50"
              y="345"
              width="260"
              height="64"
              rx="10"
              fill="url(#fibrin-grad)"
              stroke={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? getTargetColor('direct_cleavage', '#F97316')
                  : '#475569'
              }
              strokeWidth={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage') ? '2.5' : '1.5'
              }
              filter={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? 'url(#cascade-glow)'
                  : undefined
              }
            />
            <text x="65" y="367" fill="#F1F5F9" fontSize="11.5" fontWeight="700">
              CROSS-LINKED FIBRIN CLOT
            </text>
            <text x="65" y="383" fill="#94A3B8" fontSize="9">
              Factor XIIIa stabilized meshwork
            </text>
            <text
              x="65"
              y="397"
              fill={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                  ? '#FB923C'
                  : '#CBD5E1'
              }
              fontSize="8.5"
              fontWeight={
                isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage') ? '700' : '400'
              }
            >
              {isTargetActive('direct_cleavage') || isTargetHovered('direct_cleavage')
                ? '⚠️ Systemic Fibrinogenolysis (Unrestricted)'
                : '(+ Circulating Fibrinogen if non-specific)'}
            </text>
          </g>

          {/* Horizontal Digestion Transition Arrow */}
          <g id="arrow-fibrinolysis">
            <line
              x1="310"
              y1="377"
              x2="520"
              y2="377"
              stroke="#38BDF8"
              strokeWidth="2.5"
              markerEnd="url(#arrow-down)"
            />
            <rect x="360" y="365" width="115" height="24" rx="4" fill="#0B132B" stroke="#1E293B" />
            <text x="417" y="381" fill="#7DD3FC" fontSize="9" fontWeight="700" textAnchor="middle">
              Fibrinolysis (Digestion)
            </text>
          </g>

          {/* Product: Fibrin Degradation Products (D-Dimer) */}
          <g id="node-fdp-products">
            <rect
              x="530"
              y="345"
              width="310"
              height="64"
              rx="10"
              fill="#064E3B"
              stroke="#059669"
              strokeWidth="2"
              filter="url(#cascade-glow)"
            />
            <text x="548" y="367" fill="#D1FAE5" fontSize="11.5" fontWeight="800">
              FIBRIN DEGRADATION PRODUCTS (FDPs)
            </text>
            <text x="548" y="383" fill="#A7F3D0" fontSize="9">
              Soluble split products: Fragment D, Fragment E
            </text>
            <text x="548" y="398" fill="#34D399" fontSize="8.5" fontWeight="700" fontFamily="monospace">
              ✓ D-DIMER POSITIVE (Specific Clot Dissolution)
            </text>
          </g>
        </svg>
      </div>

      {/* Dynamic Mechanism Callout / Interactive Tooltip Footer */}
      <div
        className={`mt-1.5 px-3 py-2 rounded-lg border text-xs transition-all duration-300 ${
          priorityBannerInfo
            ? 'bg-slate-800/90 border-slate-600 shadow-md'
            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
        }`}
      >
        {priorityBannerInfo ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-start sm:items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 sm:mt-0 shadow-sm"
                style={{ backgroundColor: priorityBannerInfo.color }}
              />
              <div>
                <span className="font-bold text-slate-100 mr-1.5">
                  {priorityBannerInfo.title}
                </span>
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  {priorityBannerInfo.explanation}
                </span>
              </div>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto shrink-0"
              style={{
                borderColor: `${priorityBannerInfo.color}80`,
                color: priorityBannerInfo.color,
                backgroundColor: `${priorityBannerInfo.color}15`,
              }}
            >
              {priorityBannerInfo.isHovered ? 'Hovered Domain' : 'Active Tag'}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Click or hover any protein domain tag below to spotlight its molecular role in the
                fibrinolytic cascade.
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              17 Biologic Domain Tags Supported
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
