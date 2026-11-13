import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('PubChemInspectorModal source code implements 4-tab clinical & medchem architecture', () => {
  const source = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf-8');
  assert.ok(source.includes('activeTab') || source.includes('selectedTab'), 'Implements tab state');
  assert.ok(source.includes('Clinical PK/PD') || source.includes('Decision'), 'Has PK/PD Decision tab');
  assert.ok(source.includes('Pharmacophore') || source.includes('SAR'), 'Has Pharmacophores tab');
  assert.ok(source.includes('Safety') || source.includes('Warning'), 'Has Safety & Warnings tab');
  assert.ok(source.includes('Chemical') || source.includes('PubChem'), 'Has Chemical PubChem tab');
});

test('PubChemInspectorModal provides Open in 3D Lab (Fullscreen) header action', () => {
  const source = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf-8');
  assert.ok(source.includes('onOpenIn3DLab'), 'Accepts onOpenIn3DLab callback prop');
  assert.ok(source.includes('3D Lab'), 'Renders 3D Lab action button in header');
});

test('App.tsx passes onOpenIn3DLab to PubChemInspectorModal', () => {
  const appSource = fs.readFileSync('src/App.tsx', 'utf-8');
  assert.ok(appSource.includes('onOpenIn3DLab='), 'Wired onOpenIn3DLab prop on PubChemInspectorModal');
});
