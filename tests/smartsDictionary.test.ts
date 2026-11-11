import assert from 'node:assert';
import { getCorrectedSmarts, SMARTS_OVERRIDE_DICT } from '../src/utils/smartsDictionary.js';

// 1. Furfurylamino on Furosemide
const furosemideTag = 'Furfurylamino substituent at C2';
const furosemideSmarts = getCorrectedSmarts(furosemideTag, '');
assert.strictEqual(furosemideSmarts, 'NCc1ccco1', 'Furfurylamino substituent at C2 must resolve to NCc1ccco1');

// 2. Furan & Benzofuran
assert.strictEqual(getCorrectedSmarts('Furan ring', ''), 'c1ccco1');
assert.strictEqual(getCorrectedSmarts('2-Butylbenzofuran Core', ''), 'c1ccc2occc2c1');

// 3. Amines & Heterocycles
assert.strictEqual(getCorrectedSmarts('Secondary Propylamino Group', ''), 'NCCC');
assert.strictEqual(getCorrectedSmarts('Tertiary Diethylamino Group', ''), 'N(CC)CC');
assert.strictEqual(getCorrectedSmarts('Pyridine ring', ''), 'c1ccncc1');
assert.strictEqual(getCorrectedSmarts('Piperazine ring', ''), 'C1CNCCN1');

// 4. Existing overrides must remain intact
assert.strictEqual(getCorrectedSmarts('hexahydronaphthalene', ''), '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1');
assert.strictEqual(getCorrectedSmarts('sulfonamide', ''), 'S(=O)(=O)N');

// 5. Alkyl groups and no inverted substring matches (e.g. methyl should NOT match trifluoromethyl)
assert.strictEqual(getCorrectedSmarts('Methyl group', ''), 'C', '"Methyl group" must resolve to C, NOT C(F)(F)F');
assert.strictEqual(getCorrectedSmarts('16-beta-methyl group', ''), 'C', '"16-beta-methyl group" must resolve to C');
assert.strictEqual(getCorrectedSmarts('Alpha-methyl substituent', ''), 'C', '"Alpha-methyl substituent" must resolve to C');
assert.strictEqual(getCorrectedSmarts('2-Carbon ethyl linker', ''), 'CC', '"2-Carbon ethyl linker" must resolve to CC, NOT C(F)(F)F');
assert.strictEqual(getCorrectedSmarts('Propyl chain', ''), 'CCC', '"Propyl chain" must resolve to CCC');
assert.strictEqual(getCorrectedSmarts('Butyl substituent', ''), 'CCCC', '"Butyl substituent" must resolve to CCCC');
assert.strictEqual(getCorrectedSmarts('Saligenin head group', ''), 'c1ccc(O)c(CO)c1', 'Saligenin must resolve to c1ccc(O)c(CO)c1');
assert.strictEqual(getCorrectedSmarts('Trifluoromethyl group', ''), 'C(F)(F)F', 'Trifluoromethyl must still resolve to C(F)(F)F');

console.log('✓ All SMARTS dictionary tests passed');
