import React, { useState, useEffect } from 'react';
import { ChemicalStructure, antiplateletStructures } from '../data/antiplateletQuizData';
import { Search, ExternalLink, X, Loader2, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

interface PubChemPropertyData {
  CID: number;
  Title?: string;
  MolecularFormula?: string;
  MolecularWeight?: number;
  CanonicalSMILES?: string;
  IsomericSMILES?: string;
  IUPACName?: string;
  XLogP?: number;
  RotatableBondCount?: number;
}

interface PubChemInspectorModalProps {
  initialStructure?: ChemicalStructure | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PubChemInspectorModal: React.FC<PubChemInspectorModalProps> = ({
  initialStructure,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialStructure?.name || 'Clopidogrel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compoundData, setCompoundData] = useState<PubChemPropertyData | null>(null);
  const [copiedSmiles, setCopiedSmiles] = useState(false);

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
      const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,IsomericSMILES,XLogP,RotatableBondCount/JSON`;
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                NIH PubChem Structure & Chemical Inspector
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live compound resolution via PubChem PUG REST API · NIH National Library of Medicine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Compound Selector Pills */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Quick Antiplatelet Candidates:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickCompounds.map((item) => (
              <button
                key={item.cid}
                onClick={() => {
                  setSearchTerm(item.label);
                  fetchPubChemData(item.label, item.cid);
                }}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  compoundData?.CID === item.cid
                    ? 'bg-blue-600 text-white'
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
              placeholder="Search any chemical name or PubChem CID..."
              className="w-full px-3.5 py-2 pl-9 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-sm rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect'}
          </button>
        </form>

        {/* Content Body */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
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

            {/* Physicochemical & Pharmacophore Properties */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
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
    </div>
  );
};
