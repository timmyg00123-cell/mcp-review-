import { normalizeDescriptor, getCorrectedSmarts } from '../src/utils/smartsDictionary.js';

const testTags = [
  'Delta-1,4-diene-3-one',
  'Delta-1,4-diene-3-one in Ring A',
  '17-Spirolactone ring',
  '7-Sulfonamide',
  'Nitrate Ester C1 (ALDH2 Nitric Oxide Donor)',
  'Trifluoroethylthio (Lipophilic Grip)',
  'Adenine Purine Base (Purinergic Agonist)',
  'Benzothiadiazine Core (NCC Transporter Blocker)',
  'Pyrazine ring',
  'Guanidinocarbonyl moiety',
  '3,5-Diamino groups',
  '6-Chloro electron-withdrawing group'
];

for (const tag of testTags) {
  const norm = normalizeDescriptor(tag);
  const sm = getCorrectedSmarts(tag, '');
  console.log(`Tag: "${tag}"`);
  console.log(`  Normalized: ${JSON.stringify(norm)}`);
  console.log(`  SMARTS: "${sm}"`);
}
