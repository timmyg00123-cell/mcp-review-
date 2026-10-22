import React, { useState } from 'react';
import { ChemicalStructure, PubChemAuditInfo } from '../types/reviewModule';
import { Search, ExternalLink, X, Check, Loader2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface PubChemAuditEditModalProps {
  structure: ChemicalStructure | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAudit: (updatedStructure: ChemicalStructure) => void;
}

export const PubChemAuditEditModal: React.FC<PubChemAuditEditModalProps> = ({
  structure,
  isOpen,
  onClose,
  onSaveAudit,
}) => {
  if (!isOpen || !structure) return null;

  const [inputVal, setInputVal] = useState<string>(String(structure.cid || structure.name || ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewAudit, setPreviewAudit] = useState<PubChemAuditInfo | null>(structure.pubchemAudit || null);
  const [previewPngUrl, setPreviewPngUrl] = useState<string>(structure.pngUrl);

  const handleAuditLookup = async () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      let resolvedCid: number | null = null;
      if (/^\d+$/.test(trimmed)) {
        resolvedCid = parseInt(trimmed, 10);
      } else {
        // Resolve name to CID via NIH PubChem PUG REST
        const nameQuery = encodeURIComponent(trimmed.split(' ')[0]);
        const cidRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${nameQuery}/cids/JSON`);
        if (!cidRes.ok) {
          throw new Error(`Could not locate "${trimmed}" in PubChem database. Check spelling or enter CID directly.`);
        }
        const cidData = await cidRes.json();
        resolvedCid = cidData?.IdentifierList?.CID?.[0] || null;
      }

      if (!resolvedCid) {
        throw new Error('No PubChem Compound ID (CID) matched this query.');
      }

      // Fetch property details
      const propUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${resolvedCid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP/JSON`;
      const propRes = await fetch(propUrl);
      if (!propRes.ok) {
        throw new Error(`NIH PubChem property request failed for CID ${resolvedCid}.`);
      }
      const propData = await propRes.json();
      const props = propData?.PropertyTable?.Properties?.[0];

      const newPng = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${resolvedCid}/PNG?image_size=large`;
      setPreviewPngUrl(newPng);

      const audit: PubChemAuditInfo = {
        cid: resolvedCid,
        status: 'verified',
        verifiedAt: new Date().toISOString().split('T')[0],
        source: 'nih_pug_rest',
        canonicalSmiles: props?.CanonicalSMILES || '',
        iupacName: props?.IUPACName || '',
        molecularFormula: props?.MolecularFormula || '',
        molecularWeight: props?.MolecularWeight ? Number(props.MolecularWeight) : undefined,
        xlogp: props?.XLogP !== undefined ? Number(props.XLogP) : undefined,
        pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${resolvedCid}`,
        matchScore: 100,
      };

      setPreviewAudit(audit);
    } catch (err: any) {
      console.error('Audit lookup error:', err);
      setError(err?.message || 'Failed to verify compound against PubChem.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (!previewAudit) return;
    const updated: ChemicalStructure = {
      ...structure,
      cid: previewAudit.cid,
      pubchemUrl: previewAudit.pubChemUrl,
      pngUrl: previewPngUrl,
      mw: previewAudit.molecularWeight ?? structure.mw,
      logP: previewAudit.xlogp ?? structure.logP,
      pubchemAudit: previewAudit,
    };
    onSaveAudit(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              {structure.id}
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                PubChem Audit Verification: {structure.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit or override the NIH PubChem Compound ID (CID) for this molecule
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search / CID Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            NIH PubChem CID or Compound Name:
          </label>
          <div className="flex gap-2">
            <input
              id="pubchem-audit-search-input"
              name="pubchemAuditSearch"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuditLookup()}
              placeholder="e.g. 60947 or Tirofiban"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAuditLookup}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Audit PubChem</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Details & 2D Chemical Structure Preview */}
        {previewAudit && (
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>PubChem Audit Verified</span>
              </span>
              <a
                href={previewAudit.pubChemUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
              >
                <span>CID {previewAudit.cid} on PubChem</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <img
                src={previewPngUrl}
                alt="PubChem 2D Structure"
                width="320"
                height="320"
                loading="lazy"
                className="h-28 w-28 aspect-square object-contain bg-white rounded p-1 border border-slate-100"
              />
              <div className="text-xs space-y-1 flex-1 min-w-0">
                {previewAudit.molecularFormula && (
                  <div>
                    <span className="text-slate-400 font-mono">Formula: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {previewAudit.molecularFormula}
                    </span>
                  </div>
                )}
                {previewAudit.molecularWeight && (
                  <div>
                    <span className="text-slate-400 font-mono">Molecular Weight: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {previewAudit.molecularWeight} g/mol
                    </span>
                  </div>
                )}
                {previewAudit.xlogp !== undefined && (
                  <div>
                    <span className="text-slate-400 font-mono">LogP: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {previewAudit.xlogp}
                    </span>
                  </div>
                )}
                {previewAudit.canonicalSmiles && (
                  <div className="truncate">
                    <span className="text-slate-400 font-mono">SMILES: </span>
                    <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                      {previewAudit.canonicalSmiles}
                    </span>
                  </div>
                )}
                <div className="text-[10px] text-slate-500 pt-1">
                  Source: NIH National Library of Medicine PUG REST · Audited {previewAudit.verifiedAt}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyChanges}
            disabled={!previewAudit}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Verified PubChem CID</span>
          </button>
        </div>
      </div>
    </div>
  );
};
