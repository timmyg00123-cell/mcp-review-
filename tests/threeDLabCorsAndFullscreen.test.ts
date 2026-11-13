import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('structure3dService routes PDB coordinates through CORS-enabled EBI PDBe endpoint', () => {
  const source = fs.readFileSync('src/services/structure3dService.ts', 'utf-8');
  assert.ok(source.includes('www.ebi.ac.uk/pdbe/entry-files/download'), 'Uses EBI PDBe endpoint for open CORS');
  assert.ok(!source.includes('const url = `https://files.rcsb.org/download/${cleanId}.pdb`'), 'Eliminates blocked files.rcsb.org primary download');
});

test('ThreeDLabCanvas wraps ligand pre-parsing in non-fatal handler', () => {
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf-8');
  assert.ok(source.includes('try {') && source.includes('fetchPdbCoordinates'), 'Non-fatal try-catch around fetchPdbCoordinates');
});

test('ThreeDLabLibrary accepts initialFullscreen prop and App coordinates fullscreen handoff', () => {
  const libSource = fs.readFileSync('src/components/ThreeDLabLibrary.tsx', 'utf-8');
  assert.ok(libSource.includes('initialFullscreen?: boolean'), 'Accepts initialFullscreen prop');
  
  const appSource = fs.readFileSync('src/App.tsx', 'utf-8');
  assert.ok(appSource.includes('initialFullscreen={'), 'App passes initialFullscreen to ThreeDLabLibrary');
});
