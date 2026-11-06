import React, { useState, useEffect } from 'react';
import { ChemicalStructure } from '../types/reviewModule';
import { SmilesCanvas } from './SmilesCanvas';
import { resolveChemicalClass } from '../utils/chemicalClassDictionary';
import {
  resolveClinicalPharmacology,
  ClinicalPharmacologyProfile,
} from '../utils/clinicalPharmacologyDictionary';
import {
  getTargetReceptor,
  getReversibility,
  getRouteOfAdmin,
  getDrugState,
} from '../utils/structureDataUtils';
import {
  ZoomIn,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Brain,
  Sparkles,
  BookmarkCheck,
  BookmarkX,
  Lightbulb,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface StructureFlashcardCardFaceProps {
  structure: ChemicalStructure;
  drugName?: string;
  isFlipped: boolean;
  isSuspended?: boolean;
  onToggleSuspend?: () => void;
  onFlip: () => void;
  children?: React.ReactNode; // Rating buttons slot on back face
}

/**
 * Enhanced flashcard face presentation component matching StructureComparator and MinimizedStructureCard.
 *
 * Front face: Strictly blinded chemical structure canvas on `bg-[var(--structure-canvas-bg)]`,
 * MolBlock vector coordinates, and click-to-zoom modal.
 *
 * Back face (Option B): Two-column split deck layout featuring reference drug properties
 * on the left and comprehensive clinical pharmacology (metabolism, BBB, pregnancy safety) on the right.
 */
export const StructureFlashcardCardFace: React.FC<StructureFlashcardCardFaceProps> = ({
  structure,
  drugName,
  isFlipped,
  isSuspended = false,
  onToggleSuspend,
  onFlip,
  children,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Close zoom modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomModalOpen) {
        setIsZoomModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen]);

  const canonicalSmiles =
    structure.canonical_smiles || structure.canonicalSmiles || structure.smiles || '';

  const cleanName = (structure.name || drugName || '').replace(/\[.*?\]\s*/g, '').trim();
  const tradeSuffix =
    structure.tradeName && structure.tradeName.toLowerCase() !== cleanName.toLowerCase()
      ? ` (${structure.tradeName})`
      : '';

  const mw =
    structure.mw ?? structure.pubchemAudit?.molecularWeight
      ? `${structure.mw ?? structure.pubchemAudit?.molecularWeight} g/mol`
      : '—';

  const logP =
    structure.logP !== undefined && structure.logP !== null
      ? structure.logP
      : structure.pubchemAudit?.xlogp !== undefined && structure.pubchemAudit?.xlogp !== null
      ? structure.pubchemAudit.xlogp
      : '—';

  const target = getTargetReceptor(structure);
  const reversibility = getReversibility(structure);
  const drugState = getDrugState(structure);
  const route = getRouteOfAdmin(structure);
  const chemicalClass = resolveChemicalClass(structure);
  const clinicalProfile: ClinicalPharmacologyProfile = resolveClinicalPharmacology(structure);

  const keyMoieties: string[] =
    structure.keyFunctionalGroups && structure.keyFunctionalGroups.length > 0
      ? structure.keyFunctionalGroups
      : ['Aromatic pharmacophore core', 'Receptor binding moiety'];

  const sarText =
    structure.sarNotes ||
    structure.sar_rationale ||
    structure.moa_summary ||
    clinicalProfile.clinicalPearls ||
    'Target binding mediated by key stereocenters and complementary electrostatic interactions.';

  // Color helper for Pregnancy Safety Badge
  const getPregnancyBadge = () => {
    switch (clinicalProfile.pregnancyRisk) {
      case 'safe':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
          badgeText: 'Pregnancy Safe (Placenta-Sparing)',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      case 'contraindicated':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200',
          badgeText: 'Contraindicated / Teratogen',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      case 'caution':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200',
          badgeText: 'Clinical Caution (Benefit vs Risk)',
          icon: <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
    }
  };

  const pregBadge = getPregnancyBadge();

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* FRONT FACE (BLINDED) */}
      {/* ========================================================= */}
      {!isFlipped && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* 1. Prompt Header */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Structure Recognition Challenge
                </span>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Identify the Pharmacologic Class & Key Moieties
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
              Blinded Card Face
            </span>
          </div>

          {/* 2. High-Contrast Vector Canvas with Zoom Trigger */}
          <div className="p-6 flex flex-col items-center">
            <div
              onClick={() => setIsZoomModalOpen(true)}
              className="w-full max-w-xl h-72 bg-[var(--structure-canvas-bg)] rounded-xl border border-slate-200/80 dark:border-slate-800 relative flex items-center justify-center overflow-hidden cursor-zoom-in group shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              title="Click to zoom chemical structure"
            >
              <SmilesCanvas
                smiles={canonicalSmiles}
                molBlock={structure.pubchemMolBlock}
                fallbackImageUrl={structure.pngUrl}
                cid={structure.cid}
                width={400}
                height={260}
                altText="Blinded candidate chemical structure"
                className="w-full h-full flex items-center justify-center pointer-events-none"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 text-white text-xs font-medium flex items-center gap-1.5 shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to zoom vector structure</span>
                </span>
              </div>

              {/* Floating zoom button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomModalOpen(true);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
                title="Zoom structure"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center max-w-md">
              Inspect the molecular scaffold, key substituents, and ring systems above. Determine the therapeutic class, target receptor, and SAR profile before revealing.
            </p>
          </div>

          {/* 3. Action Footer: Show Answer Button */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <button
              type="button"
              onClick={onFlip}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span>Show Answer / Flip Card</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/50 text-[10px] font-mono uppercase tracking-wider">
                Space
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BACK FACE: OPTION B TWO-COLUMN SPLIT DECK LAYOUT */}
      {/* ========================================================= */}
      {isFlipped && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* 1. Header Banner: Drug Identity, Class, Scaffolds & Actions */}
          <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  {structure.pharmacologicalClass || 'Cardiovascular Therapeutic Agent'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-medium truncate max-w-xs">
                  {chemicalClass}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {cleanName}
                </h2>
                {tradeSuffix && (
                  <span className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
                    {tradeSuffix}
                  </span>
                )}
              </div>
            </div>

            {/* Header Controls: Suspend Toggle, PubChem Link, Zoom */}
            <div className="flex items-center gap-2">
              {onToggleSuspend && (
                <button
                  type="button"
                  onClick={onToggleSuspend}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSuspended
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={isSuspended ? 'Resume card in spaced repetition rotation' : 'Suspend card from review queue'}
                >
                  {isSuspended ? (
                    <>
                      <BookmarkX className="w-3.5 h-3.5" />
                      <span>Suspended</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Suspend Card</span>
                    </>
                  )}
                </button>
              )}

              {structure.cid && (
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title={`View PubChem CID ${structure.cid}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                title="Zoom structure"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Responsive Two-Column Body Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN: CHEMICAL STRUCTURE & COMPARATOR STATS */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              {/* Structure Canvas Container */}
              <div
                onClick={() => setIsZoomModalOpen(true)}
                className="w-full h-64 bg-[var(--structure-canvas-bg)] rounded-xl border border-slate-200/80 dark:border-slate-800 relative flex items-center justify-center overflow-hidden cursor-zoom-in group shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                title="Click to zoom chemical structure"
              >
                <SmilesCanvas
                  smiles={canonicalSmiles}
                  molBlock={structure.pubchemMolBlock}
                  fallbackImageUrl={structure.pngUrl}
                  cid={structure.cid}
                  width={340}
                  height={220}
                  altText={`${cleanName} chemical structure`}
                  className="w-full h-full flex items-center justify-center pointer-events-none"
                />

                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-slate-900/80 text-white text-[11px] font-medium flex items-center gap-1 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to zoom</span>
                  </span>
                </div>
              </div>

              {/* Key Moieties / Pharmacophore Badges */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Key Pharmacophore Moieties & Functional Groups
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keyMoieties.map((moiety, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{moiety}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2x2/2x3 Reference Property Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {/* Molecular Weight */}
                <div className="p-2 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Molecular Wt
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {mw}
                  </span>
                </div>

                {/* LogP */}
                <div className="p-2 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    xLogP
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {logP}
                  </span>
                </div>

                {/* Drug State */}
                <div className="p-2 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Drug State
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {drugState}
                  </span>
                </div>

                {/* Target Receptor & Reversibility */}
                <div className="p-2 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50 col-span-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Primary Target Receptor
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {target}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium shrink-0">
                      {reversibility}
                    </span>
                  </div>
                </div>

                {/* Route of Administration */}
                <div className="p-2 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Route
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {route}
                  </span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN: CLINICAL PHARMACOLOGY CALLOUTS */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-3.5">
              {/* 1. Metabolism & Bioactivation Card */}
              <div className="p-3.5 rounded-xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400">
                  <Flame className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Metabolism & Bioactivation
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {clinicalProfile.metabolism}
                </p>
                {clinicalProfile.metabolismLocation && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Location: {clinicalProfile.metabolismLocation}
                  </p>
                )}
              </div>

              {/* 2. Blood-Brain Barrier (BBB) Penetration Card */}
              <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                  <Brain className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Blood-Brain Barrier (BBB) Penetration
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {clinicalProfile.bbbCrossing}
                </p>
                {clinicalProfile.bbbCnsEffects && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">CNS Manifestations:</strong>{' '}
                    {clinicalProfile.bbbCnsEffects}
                  </p>
                )}
              </div>

              {/* 3. Pregnancy Safety & Teratogenicity Profile Card */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${pregBadge.bg}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {pregBadge.icon}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Pregnancy Profile
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 shadow-2xs">
                    {pregBadge.badgeText}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-normal">
                  {clinicalProfile.pregnancySummary}
                </p>
                {clinicalProfile.pregnancyCategory && (
                  <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">
                    {clinicalProfile.pregnancyCategory}
                  </span>
                )}
              </div>

              {/* 4. Structure-Activity Relationship (SAR) Notes */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Structure-Activity Relationship (SAR) Notes
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sarText}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Bottom Slot: Anki Spaced Repetition Rating Buttons */}
          {children && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
              {children}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* HIGH-RESOLUTION VECTOR STRUCTURE ZOOM MODAL */}
      {/* ========================================================= */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isFlipped ? cleanName : 'Chemical Structure Vector View (Blinded)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  High-resolution vector render with 2D stereocenters and substituents
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Canvas */}
            <div className="p-6 bg-[var(--structure-canvas-bg)] flex items-center justify-center min-h-[380px]">
              <SmilesCanvas
                smiles={canonicalSmiles}
                molBlock={structure.pubchemMolBlock}
                fallbackImageUrl={structure.pngUrl}
                cid={structure.cid}
                width={560}
                height={360}
                altText={`${isFlipped ? cleanName : 'Blinded'} chemical structure enlarged`}
                className="w-full h-full flex items-center justify-center"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">
                {structure.cid ? `PubChem CID: ${structure.cid}` : 'SMILES 2D coordinates'}
              </span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
