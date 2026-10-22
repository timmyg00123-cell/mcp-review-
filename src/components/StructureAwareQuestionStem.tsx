import React, { useEffect, useState } from 'react';
import { GraphEntity, medChemGraphDb } from '../db/medChemGraphDb';
import { enrichEntityInDexie } from '../services/pubchemService';
import { getTwoHopMedChemSubgraph } from '../services/graphRetrieval';
import { ChemicalStructure } from '../types/reviewModule';
import { SmilesCanvas } from './SmilesCanvas';
import {
  FlaskConical,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Layers,
  Network,
} from 'lucide-react';

const ROMAN_NUMERALS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
];

export function indexToRoman(idx: number): string {
  return ROMAN_NUMERALS[idx] || `${idx + 1}`;
}

export function getStructureRomanId(item: { id?: string; document_label?: string }, idx: number): string {
  if (item.document_label && item.document_label.trim()) {
    return item.document_label.trim();
  }
  if (!item.id) return indexToRoman(idx);
  const trimmed = item.id.trim();
  if (/^(drug|compound)\s+[a-z0-9]+/i.test(trimmed)) {
    return trimmed;
  }
  if (/^(X{0,3})(IX|IV|V?I{0,3})$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  return trimmed || indexToRoman(idx);
}

export interface StructureAwareQuestionStemProps {
  /** Array of entity IDs to look up and render from Dexie (from question.displayed_structure_entity_ids) */
  displayed_structure_entity_ids?: string[];
  /** Single entity ID fallback */
  targetEntityId?: string;
  /** Whether the drug name should be blinded for structure identification */
  blindDrugName?: boolean;
  /** When exam mode is active, prevent revealing the drug identity */
  examModeActive?: boolean;
  /** Optional pre-loaded structures from section or question */
  structures?: ChemicalStructure[];
}

interface LoadedStructureItem {
  id: string;
  name: string;
  entity: GraphEntity | null;
  structureImageDataUrl?: string;
  smiles?: string;
  cid?: number;
  molecularWeight?: number;
  xlogp?: number;
  drug_state?: string;
  summary?: string;
  subgraphNodes?: GraphEntity[];
}

export const StructureAwareQuestionStem: React.FC<StructureAwareQuestionStemProps> = ({
  displayed_structure_entity_ids,
  targetEntityId,
  blindDrugName = true,
  examModeActive = false,
  structures,
}) => {
  // Collect all unique canonical IDs to render
  const entityIds: string[] = Array.from(
    new Set([
      ...(displayed_structure_entity_ids || []),
      ...(targetEntityId ? [targetEntityId] : []),
    ])
  )
    .map((id) => (id || '').trim().toLowerCase())
    .filter(Boolean);

  const [loadedStructures, setLoadedStructures] = useState<LoadedStructureItem[]>([]);
  const [isRevealed, setIsRevealed] = useState<boolean>(!blindDrugName);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const createdObjectUrls: string[] = [];

    if (blindDrugName) {
      setIsRevealed(false);
    } else {
      setIsRevealed(true);
    }

    async function loadAllStructures() {
      // 1. If structures array is provided from question/section, prioritize matching against it
      if (structures && structures.length > 0) {
        let matched: ChemicalStructure[] = [];
        if (targetEntityId) {
          const tLower = targetEntityId.toLowerCase().trim();
          const found = structures.find(
            (s) =>
              s.id.toLowerCase() === tLower ||
              s.name.toLowerCase() === tLower ||
              s.name.toLowerCase().includes(tLower)
          );
          if (found) matched = [found];
        }
        if (matched.length === 0 && entityIds.length > 0) {
          matched = structures.filter((s) => {
            const sIdLower = s.id.toLowerCase();
            const sNameLower = s.name.toLowerCase();
            return entityIds.some(
              (id) => id === sIdLower || id === sNameLower || sNameLower.includes(id)
            );
          });
        }
        if (matched.length === 0 && (targetEntityId || entityIds.length > 0)) {
          matched = structures;
        }

        if (matched.length > 0) {
          const loaded: LoadedStructureItem[] = matched.map((s, sIdx) => ({
            id: s.id || ROMAN_NUMERALS[sIdx] || `${sIdx + 1}`,
            name: s.name,
            entity: null,
            structureImageDataUrl:
              s.pngUrl ||
              (s.cid
                ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${s.cid}/PNG?image_size=large`
                : ''),
            smiles: s.pubchemAudit?.canonicalSmiles,
            cid: s.cid || s.pubchemAudit?.cid,
            molecularWeight: s.mw ?? s.pubchemAudit?.molecularWeight,
            xlogp: s.logP ?? s.pubchemAudit?.xlogp,
            drug_state: s.drug_state || 'Active Drug',
            summary: s.moa_summary || s.sar_rationale || s.sarNotes,
            subgraphNodes: [],
          }));
          if (isMounted) {
            setLoadedStructures(loaded);
            setLoading(false);
          }
          return;
        }
      }

      if (entityIds.length === 0) {
        setLoadedStructures([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const items: LoadedStructureItem[] = [];

      for (let idx = 0; idx < entityIds.length; idx++) {
        const id = entityIds[idx];
        try {
          let ent = await medChemGraphDb.entities.get(id);

          // If not in Dexie or lacking cached 2D structure image, enrich via PubChem
          if (!ent || !ent.chemData?.structureImageDataUrl) {
            await enrichEntityInDexie(id);
            ent = await medChemGraphDb.entities.get(id);
          }

          let subgraphNodes: GraphEntity[] = [];
          try {
            const subgraph = await getTwoHopMedChemSubgraph(id);
            subgraphNodes = subgraph.entities.filter((e) => e.id !== id).slice(0, 4);
          } catch {
            // non-fatal
          }

          const chem = ent?.chemData;
          // Prefer native Blob ObjectURL to eliminate Base64 decoding and V8 heap retention
          let structureImageDataUrl = chem?.structureImageDataUrl;
          if (chem?.structureImageBlob && typeof window !== 'undefined' && typeof URL.createObjectURL === 'function') {
            const blobUrl = URL.createObjectURL(chem.structureImageBlob);
            createdObjectUrls.push(blobUrl);
            structureImageDataUrl = blobUrl;
          } else if (!structureImageDataUrl && chem?.cid) {
            structureImageDataUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${chem.cid}/PNG?image_size=large`;
          }

          items.push({
            id: ROMAN_NUMERALS[idx] || id,
            name: ent?.name || id,
            entity: ent || null,
            structureImageDataUrl,
            smiles: chem?.isomericSmiles || chem?.canonicalSmiles,
            cid: chem?.cid,
            molecularWeight: chem?.molecularWeight,
            xlogp: chem?.xlogp,
            drug_state: 'Active Drug',
            summary: ent?.clinical_and_sar_summary,
            subgraphNodes,
          });
        } catch (err) {
          console.warn(`[StructureAwareQuestionStem] Failed loading structure for "${id}":`, err);
        }
      }

      if (isMounted) {
        setLoadedStructures(items);
        setLoading(false);
      }
    }

    loadAllStructures();

    return () => {
      isMounted = false;
      // Revoke all created ObjectURLs to completely release browser memory
      createdObjectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
    };
  }, [JSON.stringify(entityIds), blindDrugName, structures]);

  if (entityIds.length === 0 && (!structures || structures.length === 0)) return null;

  return (
    <div className="mb-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-linear-to-br from-indigo-50/50 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-950 p-4 shadow-xs">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-indigo-700 dark:text-indigo-300">
              {blindDrugName
                ? 'Structure Challenge: Identify the Compound'
                : 'Chemical Structure & MOA'}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {blindDrugName
                ? 'Deduce drug identity, active pharmacophores, and receptor target from the structure below:'
                : 'Reference chemical structure for this question:'}
            </p>
          </div>
        </div>

        {/* Identity Reveal Toggle if name is blinded */}
        {blindDrugName && !examModeActive && (
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask Compound Name</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Identity &amp; MOA Insights</span>
              </>
            )}
          </button>
        )}

        {blindDrugName && examModeActive && (
          <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Blind Exam Mode</span>
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="h-36 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
          <FlaskConical className="w-6 h-6 animate-pulse text-indigo-500" />
          <span>Looking up chemical structure(s) from Dexie &amp; PubChem...</span>
        </div>
      )}

      {/* Rendered Structure(s) List/Grid */}
      {!loading && loadedStructures.length > 0 && (
        <div
          className={`grid gap-4 ${
            loadedStructures.length > 1
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-12 items-center'
          }`}
        >
          {loadedStructures.map((item, idx) => {
            const hasImageOrSmiles = Boolean(item.structureImageDataUrl || item.smiles);
            const romanId = getStructureRomanId(item, idx);

            return (
              <React.Fragment key={`${item.id}_${idx}`}>
                {/* Structure Image / Canvas Card */}
                <div
                  className={`${
                    loadedStructures.length === 1 ? 'md:col-span-5' : ''
                  } flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs`}
                >
                  {hasImageOrSmiles ? (
                    <SmilesCanvas
                      smiles={item.smiles}
                      fallbackImageUrl={item.structureImageDataUrl}
                      width={260}
                      height={170}
                      altText={
                        isRevealed || !blindDrugName
                          ? item.name
                          : `Structure ${romanId} (Name Blinded)`
                      }
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-slate-400 text-xs italic">
                      No 2D structure available for Structure {romanId}
                    </div>
                  )}

                  <div className="mt-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {isRevealed || !blindDrugName
                      ? item.name
                      : `Structure ${romanId} (Name Blinded)`}
                  </div>
                </div>

                {/* Properties & Clues Column */}
                <div
                  className={`${
                    loadedStructures.length === 1 ? 'md:col-span-7' : ''
                  } space-y-2.5`}
                >
                  {/* Identity Header */}
                  <div>
                    <div className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                      Structure {romanId}
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {isRevealed || !blindDrugName ? (
                        <>
                          <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                            {item.name}
                          </span>
                          {item.cid && (
                            <a
                              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${item.cid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-normal text-blue-500 hover:underline flex items-center gap-0.5"
                            >
                              <span>CID {item.cid}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </>
                      ) : (
                        <span className="font-mono text-slate-500 tracking-wider">
                          [Structure {romanId} — Name Blinded]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Physicochemical Properties Chips */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400">
                        MW
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                        {item.molecularWeight ? `${item.molecularWeight.toFixed(1)} g/mol` : '—'}
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                      <div className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400">
                        LogP
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                        {item.xlogp !== undefined && item.xlogp !== null ? item.xlogp.toFixed(1) : '—'}
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                      <div className="text-[9px] uppercase font-mono text-purple-600 dark:text-purple-400">
                        Drug State
                      </div>
                      <div className="font-bold text-purple-900 dark:text-purple-200 font-mono text-[11px] truncate">
                        {item.drug_state || 'Active Drug'}
                      </div>
                    </div>
                  </div>

                  {/* Revealed MOA & 2-Hop Graph Connections */}
                  {(isRevealed || !blindDrugName) && item.summary && (
                    <div className="space-y-1.5 pt-1.5 border-t border-indigo-100 dark:border-indigo-900/50 animate-fadeIn">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-indigo-700 dark:text-indigo-400">
                          MOA Summary:
                        </span>{' '}
                        {item.summary}
                      </p>

                      {item.subgraphNodes && item.subgraphNodes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Network className="w-3 h-3 text-indigo-500" />
                            <span>Connections:</span>
                          </span>
                          {item.subgraphNodes.map((n) => (
                            <span
                              key={n.id}
                              className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                            >
                              {n.name || n.id}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
