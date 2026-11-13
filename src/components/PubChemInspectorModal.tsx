import React, { useState, useEffect, useMemo } from 'react';
import { ChemicalStructure, antiplateletStructures } from '../data/antiplateletQuizData';
import {
  Search,
  ExternalLink,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Activity,
  Atom,
  ShieldAlert,
  Layers,
  Box,
  AlertTriangle,
  CheckCircle2,
  Pill,
  Info,
  Clock,
  Zap,
  Target,
  FileText,
  HeartPulse,
} from 'lucide-react';
import { getDrugIntelligenceProfile, DrugIntelligenceProfile } from '../data/drugIntelligenceData';
import { findCanonicalTargetForDrug, findMedChemProfile } from '../data/canonicalPharmacophorePkData';
import { fetchClinicalDossier, ClinicalDossierRecord } from '../services/clinicalDossierService';
import { resolveClinicalPharmacology } from '../utils/clinicalPharmacologyDictionary';
import type { PharmacophorePkPdGroup, KeyPocketResidueContact } from '../types/structure3d';

interface PubChemPropertyData {
  CID: number;
  Title?: string;
  MolecularFormula?: string;
  MolecularWeight?: number;
  CanonicalSMILES?: string;
  IsomericSMILES?: string;
  InChIKey?: string;
  IUPACName?: string;
  XLogP?: number;
  RotatableBondCount?: number;
}

export interface PubChemInspectorModalProps {
  initialStructure?: ChemicalStructure | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenIn3DLab?: (structure: ChemicalStructure, fullscreen?: boolean) => void;
}

export type TabType = 'decision' | 'pharmacophores' | 'safety' | 'chemical';

export const PubChemInspectorModal: React.FC<PubChemInspectorModalProps> = ({
  initialStructure,
  isOpen,
  onClose,
  onOpenIn3DLab,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialStructure?.name || 'Clopidogrel');
  const [activeTab, setActiveTab] = useState<TabType>('decision');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compoundData, setCompoundData] = useState<PubChemPropertyData | null>(null);
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const [copiedInChIKey, setCopiedInChIKey] = useState(false);
  const [selectedPharmacophoreId, setSelectedPharmacophoreId] = useState<string | null>(null);
  const [dossier, setDossier] = useState<ClinicalDossierRecord | null>(null);

  // Sync initial structure when opened
  useEffect(() => {
    if (initialStructure) {
      setSearchTerm(initialStructure.name);
      fetchPubChemData(initialStructure.name, initialStructure.cid);
    } else if (isOpen) {
      fetchPubChemData(searchTerm);
    }
  }, [initialStructure, isOpen]);

  const fetchPubChemData = async (query: string, explicitCid?: number) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      let cid = explicitCid;

      // If no CID provided, resolve compound name to CID first
      if (!cid) {
        const cleanName = encodeURIComponent(query.trim().split(' ')[0]);
        const cidRes = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${cleanName}/cids/JSON`
        );
        if (!cidRes.ok) {
          throw new Error(`Could not resolve "${query}" in PubChem database.`);
        }
        const cidJson = await cidRes.json();
        cid = cidJson?.IdentifierList?.CID?.[0];
      }

      if (!cid) {
        throw new Error('No valid Compound ID (CID) found.');
      }

      // Fetch compound physical & chemical properties
      const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,InChIKey,XLogP,RotatableBondCount/JSON`;
      const propRes = await fetch(propUrl);
      if (!propRes.ok) {
        throw new Error(`PubChem property lookup failed for CID ${cid}`);
      }
      const propJson = await propRes.json();
      const props = propJson?.PropertyTable?.Properties?.[0];

      if (props) {
        setCompoundData(props);
      } else {
        throw new Error('No property data returned from PubChem.');
      }
    } catch (err: any) {
      console.warn('PubChem fetch error:', err);
      setError(err?.message || 'Failed to retrieve data from NIH PubChem API.');
      setCompoundData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySmiles = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  const handleCopyInChIKey = (inchiKey: string) => {
    navigator.clipboard.writeText(inchiKey);
    setCopiedInChIKey(true);
    setTimeout(() => setCopiedInChIKey(false), 2000);
  };

  // Resolve current drug name and intelligence profiles
  const currentDrugName = searchTerm.trim() || initialStructure?.name || compoundData?.Title || 'Clopidogrel';
  const intelProfile = useMemo(() => getDrugIntelligenceProfile(currentDrugName), [currentDrugName]);
  const canonical = useMemo(() => findCanonicalTargetForDrug(currentDrugName), [currentDrugName]);
  const medChemProfile = useMemo(
    () => (canonical ? findMedChemProfile(canonical.geneSymbol) : undefined),
    [canonical]
  );

  // Auto-select first pharmacophore group if none selected
  useEffect(() => {
    if (medChemProfile?.pharmacophoreGroups?.length) {
      setSelectedPharmacophoreId(medChemProfile.pharmacophoreGroups[0].id);
    } else {
      setSelectedPharmacophoreId(null);
    }
  }, [medChemProfile]);

  // Load clinical dossier from DailyMed/RxNorm/StatPearls
  useEffect(() => {
    let isMounted = true;
    if (currentDrugName) {
      fetchClinicalDossier(currentDrugName)
        .then((rec) => {
          if (isMounted) setDossier(rec);
        })
        .catch((err) => {
          console.warn('[PubChemInspectorModal] Failed to load clinical dossier:', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [currentDrugName]);

  // Build chemical structure representation for 3D Lab handoff
  const currentStructure: ChemicalStructure = useMemo(() => {
    const matchingFromDict = Object.values(antiplateletStructures).find(
      (s) =>
        s.name.toLowerCase() === currentDrugName.toLowerCase() ||
        (compoundData?.CID && s.cid === compoundData.CID)
    );
    if (matchingFromDict) return matchingFromDict;
    if (initialStructure && initialStructure.name.toLowerCase() === currentDrugName.toLowerCase()) {
      return initialStructure;
    }
    return {
      id: compoundData?.CID ? String(compoundData.CID) : 'inspector-drug',
      name: compoundData?.Title || currentDrugName,
      chemicalClass: canonical?.targetName || 'Small Molecule Pharmaceutical',
      pharmacologicalClass: canonical?.description || 'Therapeutic Agent',
      cid: compoundData?.CID || 0,
      canonicalSmiles: compoundData?.CanonicalSMILES || compoundData?.IsomericSMILES || '',
      smiles: compoundData?.IsomericSMILES || compoundData?.CanonicalSMILES || '',
      pubchemUrl: compoundData?.CID ? `https://pubchem.ncbi.nlm.nih.gov/compound/${compoundData.CID}` : '',
      pngUrl: compoundData?.CID ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${compoundData.CID}/PNG?image_size=large` : '',
      target: canonical?.targetName || 'Molecular Target',
      target_receptor: canonical?.targetName || 'Molecular Target',
      reversibility: 'Reversible',
      drug_state: intelProfile?.isProdrug ? 'Prodrug' : 'Active Drug',
      route: 'Oral / Systemic',
      keyFunctionalGroups: [],
      pharmacophores: [],
      pkPdHighlights: {
        onset: intelProfile?.tMax || 'Standard',
        duration: intelProfile?.halfLife || 'Standard',
        halfLife: intelProfile?.halfLife || 'See clinical pharmacology',
        elimination: intelProfile?.clearance || 'Renal/Hepatic',
        bioactivation: intelProfile?.prodrugActivation,
      },
      sarNotes: intelProfile?.clinicalDecisionRationale || canonical?.description || 'Curricular therapeutic agent.',
    };
  }, [currentDrugName, compoundData, initialStructure, canonical, intelProfile]);

  const pharmFallback = useMemo(() => resolveClinicalPharmacology(currentStructure), [currentStructure]);

  const targetPdbId = canonical?.pdbId || intelProfile?.pdbId || medChemProfile?.pdbId;
  const hasPdbCoCrystal = Boolean(targetPdbId);

  if (!isOpen) return null;

  const quickCompounds = [
    { label: 'Clopidogrel', cid: 60606 },
    { label: 'Prasugrel', cid: 11626560 },
    { label: 'Ticagrelor', cid: 9871419 },
    { label: 'Cangrelor', cid: 9854012 },
    { label: 'Aspirin', cid: 2244 },
    { label: 'Tirofiban', cid: 60917 },
    { label: 'Eptifibatide', cid: 16132470 },
    { label: 'Ticlopidine', cid: 5472 },
    { label: 'Vorapaxar', cid: 10077130 },
    { label: 'Cilostazol', cid: 2754 },
    { label: 'Dipyridamole', cid: 3108 },
  ];

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'decision', label: 'Clinical PK/PD & Decision Guidance', icon: <Activity className="w-4 h-4" /> },
    { id: 'pharmacophores', label: 'Pharmacophores & SAR', icon: <Atom className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety, Toxicities & Warnings', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'chemical', label: 'Chemical Properties & PubChem', icon: <Layers className="w-4 h-4" /> },
  ];

  const selectedPharmacophore = medChemProfile?.pharmacophoreGroups?.find(
    (g) => g.id === selectedPharmacophoreId
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Pill className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">
                  {currentStructure.name || currentDrugName}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  {currentStructure.chemicalClass || canonical?.targetName || 'Small Molecule'}
                </span>
                {canonical?.geneSymbol && (
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Target: {canonical.geneSymbol}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Unified Clinical PK/PD, Pharmacophore SAR & NIH PubChem Chemical Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasPdbCoCrystal ? (
              <button
                onClick={() => {
                  if (onOpenIn3DLab) {
                    onOpenIn3DLab(currentStructure, true);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95"
                title="Launch 3D Lab with protein-ligand co-crystal in fullscreen mode"
              >
                <Box className="w-4 h-4" />
                <span className="font-semibold">Open in 3D Lab (Fullscreen)</span>
                {targetPdbId && (
                  <span className="bg-blue-500/40 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                    {targetPdbId}
                  </span>
                )}
              </button>
            ) : (
              <button
                disabled
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium text-xs rounded-xl cursor-not-allowed flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                title="No experimental 3D protein-ligand co-crystal mapped for this agent"
              >
                <Box className="w-4 h-4 opacity-50" />
                <span>3D Co-crystal Not Available</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Compound Selector Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Quick Candidates:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickCompounds.map((item) => (
              <button
                key={item.cid}
                onClick={() => {
                  setSearchTerm(item.label);
                  fetchPubChemData(item.label, item.cid);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  currentDrugName.toLowerCase() === item.label.toLowerCase() || compoundData?.CID === item.cid
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPubChemData(searchTerm);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              id="pubchem-inspector-search-input"
              name="pubchemInspectorSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chemical name or PubChem CID (e.g. Clopidogrel, Ticagrelor, Aspirin, 60606)..."
              className="w-full px-3.5 py-2 pl-9 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-sm rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect'}
          </button>
        </form>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Tab Content Area */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4 text-slate-800 dark:text-slate-200 min-h-[320px]">
          {/* TAB 1: CLINICAL PK/PD & DECISION GUIDANCE */}
          {activeTab === 'decision' && (
            <div className="space-y-4">
              {/* Prodrug / Active Drug Mechanism Badge & Bioactivation */}
              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Drug Activation State
                    </span>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                      intelProfile?.isProdrug
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {intelProfile?.isProdrug
                      ? 'Prodrug (Requires Bioactivation)'
                      : 'Active Drug (Direct-Acting)'}
                  </span>
                </div>

                {intelProfile?.prodrugActivation ? (
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-slate-100 font-semibold block mb-1">
                      Bioactivation Pathway:
                    </strong>
                    {intelProfile.prodrugActivation}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Direct-acting pharmacological agent that does not require metabolic bioactivation to engage its molecular target.
                  </p>
                )}
              </div>

              {/* Key Clinical PK/PD Metrics Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Key Pharmacokinetic Parameters
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Half-life (T1/2):</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.halfLife || 'See clinical pharmacology'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Peak Time (Tmax):</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.tMax || 'See clinical pharmacology'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Bioavailability (F):</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.bioavailability || 'See clinical pharmacology'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Protein Binding (PPB):</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.proteinBinding || 'High (>90%)'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">CYP Metabolism:</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.cypMetabolism || pharmFallback?.metabolism || 'Hepatic / Non-CYP'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[11px] font-medium">Clearance & Excretion:</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {intelProfile?.clearance || 'Renal and fecal excretion'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Why Choose This Drug: Decision Guidance Card */}
              <div className="p-4 rounded-xl border bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Clinical Decision Guidance: Why Choose This Drug?</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {intelProfile?.clinicalDecisionRationale ||
                    pharmFallback?.clinicalPearls ||
                    `Indicated as a core therapeutic agent in its class. Refer to evidence-based ACC/AHA clinical practice guidelines for specific patient stratification, combination antithrombotic regimens, and renal/hepatic dosing adjustments.`}
                </p>
              </div>

              {/* General Clinical Pearls Fallback */}
              {pharmFallback?.clinicalPearls && intelProfile && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 block">
                    Curricular Pharmacology Pearl:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {pharmFallback.clinicalPearls}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PHARMACOPHORES & SAR */}
          {activeTab === 'pharmacophores' && (
            <div className="space-y-4">
              {medChemProfile?.pharmacophoreGroups?.length ? (
                <>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <Atom className="w-4 h-4 text-purple-500" />
                      Select Functional Group Pharmacophore:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {medChemProfile.pharmacophoreGroups.map((group) => {
                        const isSelected = group.id === selectedPharmacophoreId;
                        return (
                          <button
                            key={group.id}
                            onClick={() => setSelectedPharmacophoreId(group.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: group.colorAccent || '#8b5cf6' }}
                            />
                            <span>{group.name}</span>
                            {group.chemicalFormula && (
                              <span className="font-mono text-[10px] opacity-80">
                                ({group.chemicalFormula})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pharmacophore Details Card */}
                  {selectedPharmacophore && (
                    <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-3.5">
                      <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: selectedPharmacophore.colorAccent || '#8b5cf6' }}
                          />
                          <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {selectedPharmacophore.name}
                          </h5>
                          {selectedPharmacophore.chemicalFormula && (
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                              {selectedPharmacophore.chemicalFormula}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Atoms: {selectedPharmacophore.atomNames.join(', ')}
                        </span>
                      </div>

                      {/* PK Impact */}
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 text-[11px] block">
                          Pharmacokinetic (PK) Role:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                            <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">Absorption:</strong>
                            {selectedPharmacophore.pharmacokinetics.absorption}
                          </div>
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                            <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">Metabolism & Shunts:</strong>
                            {selectedPharmacophore.pharmacokinetics.metabolism}
                          </div>
                          {selectedPharmacophore.pharmacokinetics.prodrugRole && (
                            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40 sm:col-span-2">
                              <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">Prodrug Bioactivation Role:</strong>
                              {selectedPharmacophore.pharmacokinetics.prodrugRole}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PD & Target Interaction */}
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 text-[11px] block">
                          Pharmacodynamic (PD) Target Engagement:
                        </span>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40 space-y-1.5 text-slate-700 dark:text-slate-300">
                          <div>
                            <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                              Target Binding Pocket Role:
                            </strong>
                            {selectedPharmacophore.clinicalPharmacodynamics.targetBindingRole}
                          </div>
                          <div>
                            <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                              Physiologic Effect:
                            </strong>
                            {selectedPharmacophore.clinicalPharmacodynamics.physiologicEffect}
                          </div>
                          <div>
                            <strong className="text-rose-700 dark:text-rose-300 block mb-0.5">
                              Adverse Effect & SAR Risk:
                            </strong>
                            {selectedPharmacophore.clinicalPharmacodynamics.adverseEffectRisks}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Pocket Residues */}
                  {medChemProfile?.keyPocketResidues?.length ? (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-blue-500" />
                        Target Binding Pocket Contacts ({medChemProfile.targetGeneSymbol} / PDB {medChemProfile.pdbId}):
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {medChemProfile.keyPocketResidues.map((res) => (
                          <div
                            key={`${res.chain || 'A'}_${res.resi}`}
                            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-slate-100">
                                {res.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {res.interactionType}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                              {res.clinicalImpact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : currentStructure.pharmacophores?.length ? (
                /* Fallback to structure pharmacophores if no canonical medChemProfile */
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-blue-500" />
                    Structure Pharmacophore Motifs:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStructure.pharmacophores.map((pharm) => (
                      <div
                        key={pharm.id}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {pharm.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold uppercase">
                            {pharm.category}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          <strong>SAR Role:</strong> {pharm.purpose}
                        </p>
                        {pharm.casual_sar_explanation && (
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">
                            &quot;{pharm.casual_sar_explanation}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Clean empty state for non-canonical agents */
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <Atom className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Pharmacophore & SAR Co-crystal Profile
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Interactive pharmacophore maps and co-crystal pocket residue contacts are curated for canonical curricular targets (e.g. Clopidogrel, Prasugrel, Ticagrelor, Tirofiban, Aspirin, etc.). Select a canonical candidate above or inspect chemical parameters in Tab 4.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAFETY, TOXICITIES & WARNINGS */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              {/* Boxed Warnings Alert Card */}
              {(intelProfile?.boxedWarnings || dossier?.dailyMed?.boxedWarning) ? (
                <div className="p-4 rounded-xl border bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>FDA Boxed Warning (Black Box Warning)</span>
                  </div>
                  <p className="text-xs text-rose-900 dark:text-rose-100 leading-relaxed font-medium">
                    {intelProfile?.boxedWarnings || dossier?.dailyMed?.boxedWarning}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl border bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>No FDA Black Boxed Warning reported for this agent.</span>
                </div>
              )}

              {/* Contraindications Checklist */}
              {intelProfile?.contraindications?.length ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Absolute Contraindications:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {intelProfile.contraindications.map((ci, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2 text-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200">{ci}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Clinical Monitoring & High-Risk Patient Factors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-blue-500" />
                  Clinical Monitoring & Pharmacogenomics:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <strong className="text-slate-900 dark:text-slate-100 block">
                      Pharmacogenomic Vulnerability:
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {intelProfile?.cypMetabolism.includes('CYP2C19')
                        ? 'High dependence on polymorphic CYP2C19. Loss-of-function alleles (*2, *3) reduce active metabolite formation and increase stent thrombosis risk. Consider genotype-guided therapy.'
                        : 'Low vulnerability to single CYP polymorphism; metabolized via redundant or direct-acting pathways.'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <strong className="text-slate-900 dark:text-slate-100 block">
                      High-Risk Populations:
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      Exercise caution in patients age &ge; 75, body weight &lt; 60 kg, or with moderate-to-severe renal/hepatic impairment due to elevated major hemorrhage risks.
                    </p>
                  </div>

                  {pharmFallback?.pregnancySummary && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 md:col-span-2">
                      <strong className="text-slate-900 dark:text-slate-100 block">
                        Pregnancy & Reproductive Considerations:
                      </strong>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                        {pharmFallback.pregnancySummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHEMICAL PROPERTIES & PUBCHEM */}
          {activeTab === 'chemical' && (
            <div className="space-y-4">
              {loading && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="text-sm">Fetching live structural parameters from PubChem...</span>
                </div>
              )}

              {error && !loading && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">PubChem Lookup Notice:</strong>
                    {error}
                  </div>
                </div>
              )}

              {compoundData && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* 2D Structure Image */}
                  <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200">
                    <img
                      src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${compoundData.CID}/PNG?image_size=large`}
                      alt={`${compoundData.Title || searchTerm} 2D Structure`}
                      width="320"
                      height="320"
                      loading="lazy"
                      className="max-h-[260px] w-auto aspect-square object-contain"
                    />
                    <div className="mt-3 text-center">
                      <span className="font-bold text-sm text-slate-900">
                        {compoundData.Title || searchTerm}
                      </span>
                      <span className="text-xs text-slate-500 block font-mono">
                        PubChem CID: {compoundData.CID}
                      </span>
                    </div>
                  </div>

                  {/* Physicochemical & SMILES Properties */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 block text-xs">
                        IUPAC Systematic Name:
                      </span>
                      <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300 break-words leading-relaxed">
                        {compoundData.IUPACName || 'N/A'}
                      </p>
                    </div>

                    {/* Metric grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Formula:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {compoundData.MolecularFormula || 'N/A'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Molecular Weight:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {compoundData.MolecularWeight ? `${compoundData.MolecularWeight} g/mol` : 'N/A'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px]">XLogP (Lipophilicity):</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {compoundData.XLogP !== undefined ? compoundData.XLogP : 'N/A'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Rotatable Bonds:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {compoundData.RotatableBondCount !== undefined ? compoundData.RotatableBondCount : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* SMILES with Copy button */}
                    {(compoundData.IsomericSMILES || compoundData.CanonicalSMILES) && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400 text-[11px]">Isomeric SMILES:</span>
                          <button
                            onClick={() =>
                              handleCopySmiles(compoundData.IsomericSMILES || compoundData.CanonicalSMILES || '')
                            }
                            className="text-[11px] flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {copiedSmiles ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-slate-600 dark:text-slate-300 break-all select-all">
                          {compoundData.IsomericSMILES || compoundData.CanonicalSMILES}
                        </p>
                      </div>
                    )}

                    {/* InChIKey with Copy button */}
                    {compoundData.InChIKey && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400 text-[11px]">InChIKey:</span>
                          <button
                            onClick={() => handleCopyInChIKey(compoundData.InChIKey || '')}
                            className="text-[11px] flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {copiedInChIKey ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-slate-600 dark:text-slate-300 break-all select-all">
                          {compoundData.InChIKey}
                        </p>
                      </div>
                    )}

                    {/* Link Out */}
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compoundData.CID}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        <span>Open Full Record on NIH PubChem</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
