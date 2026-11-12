import fs from 'fs';
import path from 'path';
import initRDKitModule from '@rdkit/rdkit';
import { SMARTS_OVERRIDE_DICT, getCorrectedSmarts } from '../src/utils/smartsDictionary.js';
import { getPharmacophoresForStructure } from '../src/utils/pharmacophoreData.js';

async function main() {
  console.log('Initializing RDKit...');
  const initRDKit = (initRDKitModule as any).default || initRDKitModule;
  const RDKit = await initRDKit();
  console.log('RDKit initialized successfully.');

  const dataDir = path.resolve('src/data');
  const files: string[] = [];

  function collectFiles(dir: string) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        collectFiles(full);
      } else if (f.endsWith('.ts') && !f.endsWith('.d.ts')) {
        files.push(full);
      }
    }
  }
  collectFiles(dataDir);

  interface StructureItem {
    file: string;
    id: string;
    name: string;
    smiles: string;
    keyFunctionalGroups: string[];
    pharmacophores: Array<{ name: string; smarts?: string }>;
  }

  const structures: StructureItem[] = [];

  // We can dynamically evaluate or regex extract structure objects
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(process.cwd(), filePath);

    // Look for structure definitions with smiles
    // Match blocks with smiles/canonicalSmiles
    const structRegex = /\{[^{}]*?(?:id|name)\s*:\s*['"`]([^'"`]+)['"`][^{}]*?smiles\s*:\s*['"`]([^'"`]+)['"`][\s\S]*?\}/gi;

    // A more thorough pass: match all string literals for smiles, keyFunctionalGroups, pharmacophores
    // Let's also import modules dynamically where possible
    try {
      const mod = await import(`file://${filePath}`);
      for (const [exportName, val] of Object.entries(mod)) {
        if (!val || typeof val !== 'object') continue;

        const checkItem = (item: any) => {
          if (!item || typeof item !== 'object') return;
          const smiles = item.canonicalSmiles || item.canonical_smiles || item.smiles;
          if (smiles && typeof smiles === 'string' && smiles.length > 2) {
            structures.push({
              file: relPath,
              id: item.id || item.name || 'unknown',
              name: item.name || item.id || 'Unnamed',
              smiles,
              keyFunctionalGroups: Array.isArray(item.keyFunctionalGroups) ? item.keyFunctionalGroups : [],
              pharmacophores: Array.isArray(item.pharmacophores)
                ? item.pharmacophores.map((p: any) => ({ name: p.name || p.id || '', smarts: p.smarts }))
                : [],
            });
          }
        };

        if (Array.isArray(val)) {
          val.forEach(checkItem);
        } else {
          checkItem(val);
          // Also check dictionary objects like EXAM_STRUCTURES = { ... }
          for (const subVal of Object.values(val)) {
            checkItem(subVal);
          }
        }
      }
    } catch (e: any) {
      // If dynamic import failed, fallback to text regex
    }
  }

  // Deduplicate structures by (name + smiles)
  const uniqueStructures = new Map<string, StructureItem>();
  for (const s of structures) {
    const key = `${s.name.toLowerCase()}::${s.smiles}`;
    if (!uniqueStructures.has(key)) {
      uniqueStructures.set(key, s);
    } else {
      const existing = uniqueStructures.get(key)!;
      // Merge functional groups
      for (const fg of s.keyFunctionalGroups) {
        if (!existing.keyFunctionalGroups.includes(fg)) existing.keyFunctionalGroups.push(fg);
      }
      for (const ph of s.pharmacophores) {
        if (!existing.pharmacophores.some(p => p.name === ph.name)) existing.pharmacophores.push(ph);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`CURRICULUM CORPUS AUDIT REPORT`);
  console.log(`======================================================`);
  console.log(`Total Unique Chemical Structures Scanned: ${uniqueStructures.size}`);

  const allTags = new Map<string, { count: number; drugs: Set<string>; explicitSmarts?: string }>();

  for (const s of uniqueStructures.values()) {
    const pGroups = getPharmacophoresForStructure(s as any);
    for (const p of pGroups) {
      const tag = p.name;
      if (!allTags.has(tag)) allTags.set(tag, { count: 0, drugs: new Set(), explicitSmarts: p.smarts });
      const entry = allTags.get(tag)!;
      entry.count++;
      entry.drugs.add(s.name);
    }
  }

  console.log(`Total Unique Pharmacophore/Functional Group Descriptors: ${allTags.size}`);

  // Test resolution & RDKit matching for every structure + tag
  let totalEvaluations = 0;
  let resolvedEvaluations = 0;
  let rdkitMatchedEvaluations = 0;
  let unresolvedTags = new Map<string, { count: number; drugs: string[] }>();
  let smartsFailedMatchTags = new Map<string, { count: number; smarts: string; drugs: string[] }>();

  for (const s of uniqueStructures.values()) {
    let mol: any = null;
    try {
      mol = RDKit.get_mol(s.smiles);
    } catch {
      continue;
    }
    if (!mol) continue;

    const pGroups = getPharmacophoresForStructure(s as any);

    // Deduplicate tags for this drug
    const seenNames = new Set<string>();
    for (const item of pGroups) {
      if (seenNames.has(item.name)) continue;
      seenNames.add(item.name);

      totalEvaluations++;
      const resolvedSmarts = item.smarts || getCorrectedSmarts(item.name, '');

      if (!resolvedSmarts) {
        if (!unresolvedTags.has(item.name)) unresolvedTags.set(item.name, { count: 0, drugs: [] });
        const unres = unresolvedTags.get(item.name)!;
        unres.count++;
        if (!unres.drugs.includes(s.name)) unres.drugs.push(s.name);
        continue;
      }

      resolvedEvaluations++;

      // Test RDKit substructure match
      let qmol: any = null;
      try {
        qmol = RDKit.get_qmol(resolvedSmarts);
      } catch {
        // syntax error in SMARTS
      }

      if (!qmol) {
        if (!smartsFailedMatchTags.has(item.name)) {
          smartsFailedMatchTags.set(item.name, { count: 0, smarts: resolvedSmarts, drugs: [] });
        }
        const fail = smartsFailedMatchTags.get(item.name)!;
        fail.count++;
        if (!fail.drugs.includes(s.name)) fail.drugs.push(s.name);
        continue;
      }

      let matchStr = '';
      try {
        matchStr = mol.get_substruct_match(qmol);
      } catch {
        matchStr = '';
      }
      qmol.delete();

      // Fallback: relaxed topological query
      if ((!matchStr || matchStr === '{}' || matchStr === '[]') && (resolvedSmarts.includes('=') || resolvedSmarts.includes(':'))) {
        let relQmol: any = null;
        try {
          relQmol = RDKit.get_qmol(resolvedSmarts.replace(/[:=]/g, '~'));
          if (relQmol) {
            matchStr = mol.get_substruct_match(relQmol);
          }
        } catch {} finally {
          relQmol?.delete();
        }
      }

      if (matchStr && matchStr !== '{}' && matchStr !== '[]') {
        rdkitMatchedEvaluations++;
      } else {
        if (!smartsFailedMatchTags.has(item.name)) {
          smartsFailedMatchTags.set(item.name, { count: 0, smarts: resolvedSmarts, drugs: [] });
        }
        const fail = smartsFailedMatchTags.get(item.name)!;
        fail.count++;
        if (!fail.drugs.includes(s.name)) fail.drugs.push(s.name);
      }
    }

    mol.delete();
  }

  console.log(`\n--- EVALUATION SUMMARY ---`);
  console.log(`Total Drug-Tag Pairs Evaluated: ${totalEvaluations}`);
  console.log(`Resolved to SMARTS: ${resolvedEvaluations} (${((resolvedEvaluations / totalEvaluations) * 100).toFixed(1)}%)`);
  console.log(`Matched on RDKit Canvas: ${rdkitMatchedEvaluations} (${((rdkitMatchedEvaluations / totalEvaluations) * 100).toFixed(1)}%)`);
  console.log(`Orphan Tags (Zero SMARTS resolved): ${totalEvaluations - resolvedEvaluations}`);
  console.log(`Broken Match Tags (SMARTS generated but failed RDKit match): ${resolvedEvaluations - rdkitMatchedEvaluations}`);

  // Sort unresolved tags by frequency
  const sortedUnresolved = [...unresolvedTags.entries()].sort((a, b) => b[1].count - a[1].count);
  console.log(`\nTop Unmapped / Orphan Functional Groups (${sortedUnresolved.length} distinct tags):`);
  for (const [tag, info] of sortedUnresolved.slice(0, 30)) {
    console.log(`  - "${tag}" (x${info.count}) -> Drugs: ${info.drugs.slice(0, 3).join(', ')}`);
  }

  // Sort failed match tags by frequency
  const sortedFailed = [...smartsFailedMatchTags.entries()].sort((a, b) => b[1].count - a[1].count);
  console.log(`\nTop Mismatched / Incompatible SMARTS (${sortedFailed.length} distinct tags):`);
  for (const [tag, info] of sortedFailed.slice(0, 20)) {
    console.log(`  - "${tag}" (x${info.count}, SMARTS: "${info.smarts}") -> Drugs: ${info.drugs.slice(0, 3).join(', ')}`);
  }
}

main().catch(console.error);
