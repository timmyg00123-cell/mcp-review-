import type { DrugBindingSite, LigandRenderMode } from '../types/structure3d';

export interface ReceptorPocketTemplate {
  templateId: string;
  pdbId: string;
  ligandCode: string;
  ligandChain?: string;
  ligandMode?: LigandRenderMode;
  crystallizedLigandName: string;
  exactDrugIds: string[];
  targetName: string;
  geneSymbol: string;
  pocketMechanismSummary: string;
  bindingSites: DrugBindingSite[];
}

export const RECEPTOR_POCKET_TEMPLATES: Record<string, ReceptorPocketTemplate> = {
  cox1_aspirin: {
    templateId: 'cox1_aspirin',
    pdbId: '1PTH',
    ligandCode: 'SAL',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Salicylate (2-Hydroxybenzoate) + Acetylated Ser530',
    exactDrugIds: ['aspirin'],
    targetName: 'Cyclooxygenase-1 (COX-1 / PTGS1)',
    geneSymbol: 'PTGS1',
    pocketMechanismSummary:
      'Enters the hydrophobic arachidonate channel of COX-1, anchors via its carboxylate at the Arg120 constriction gate, and irreversibly transfers its acetyl group onto Ser530, leaving salicylate bound in the channel and permanently blocking thromboxane A2 synthesis for the platelet lifespan.',
    bindingSites: [
      {
        id: 'cox1_ser530_covalent',
        siteName: 'Ser530 Covalent Acetylation Site',
        drugMoiety: 'Labile O-Acetyl Ester Group',
        interactionType: 'covalent',
        colorAccent: '#ef4444',
        residues: [{ resn: 'SER', resi: 530, chain: 'A', label: 'Ser530 (Catalytic Channel)' }],
        reactionSummary:
          'Nucleophilic attack by the Ser530 hydroxyl oxygen on aspirin’s acetyl carbonyl forms a permanent O-acetyl-Ser530 ester and releases salicylate (SAL) inside the channel.',
        clinicalRelevance:
          'Because anucleate platelets cannot synthesize new COX-1, low-dose aspirin (81 mg) suppresses platelet TXA2 aggregation for the entire 7–10 day platelet lifespan.',
      },
      {
        id: 'cox1_arg120_gate',
        siteName: 'Arg120 Constriction Gate Salt Bridge',
        drugMoiety: '2-Hydroxybenzoate Carboxylate Anion',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 120, chain: 'A', label: 'Arg120 (Channel Entrance Gate)' },
          { resn: 'TYR', resi: 355, chain: 'A', label: 'Tyr355 (Gate Hydrogen-Bond Partner)' },
        ],
        reactionSummary:
          'Electrostatic salt bridge and hydrogen bond between the salicylate carboxylate and Arg120/Tyr355 position the ortho-acetyl ester directly opposite Ser530.',
        clinicalRelevance:
          'Non-acetylated NSAIDs (e.g., ibuprofen) taken right before aspirin sterically occupy Arg120 and block aspirin from reaching Ser530, blunting cardioprotection.',
      },
      {
        id: 'cox1_tyr385_apex',
        siteName: 'Tyr385 Catalytic Radical Apex',
        drugMoiety: 'Salicylate Aromatic Ring & Phenolic OH',
        interactionType: 'pi-stacking',
        colorAccent: '#f59e0b',
        residues: [{ resn: 'TYR', resi: 385, chain: 'A', label: 'Tyr385 (Catalytic Radical)' }],
        reactionSummary:
          'Hydrophobic and aromatic contacts below Tyr385 block arachidonic acid from reaching the heme-activated tyrosyl radical at the top of the cyclooxygenase tunnel.',
        clinicalRelevance:
          'Acetaminophen lacks an acidic carboxylate for Arg120 and instead acts primarily by reducing the oxidized ferryl-heme / Tyr385 radical state in low-peroxide CNS tissue.',
      },
    ],
  },


  cox2_propionic: {
    templateId: 'cox2_propionic',
    pdbId: '4PH9',
    ligandCode: 'IBP',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Ibuprofen',
    exactDrugIds: ['ibuprofen'],
    targetName: 'Cyclooxygenase-2 (COX-2 / PTGS2)',
    geneSymbol: 'PTGS2',
    pocketMechanismSummary:
      'Reversibly occupies the cyclooxygenase hydrophobic channel by pairing its aryl-acid group with the Arg120/Tyr355 constriction gate while packing its lipophilic core below Tyr385 to block prostaglandin G2/H2 synthesis.',
    bindingSites: [
      {
        id: 'cox2_arg120_anchor',
        siteName: 'Arg120 / Tyr355 Carboxylate Gate',
        drugMoiety: 'Propionic / Acetic Acid Carboxylate',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 120, chain: 'A', label: 'Arg120 (Ionic Gate)' },
          { resn: 'TYR', resi: 355, chain: 'A', label: 'Tyr355 (Gate Stabilizer)' },
        ],
        reactionSummary:
          'Reversible ionic salt bridge and hydrogen bond anchor the anionic carboxylate at the mouth of the COX channel without forming a covalent bond.',
        clinicalRelevance:
          'Explains why platelet inhibition with reversible NSAIDs wears off as plasma levels fall, unlike aspirin’s permanent acetylation.',
      },
      {
        id: 'cox2_tyr385_channel',
        siteName: 'Tyr385 / Trp387 Upper Hydrophobic Channel',
        drugMoiety: 'Isobutylphenyl / Naphthyl Aromatic Core',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TYR', resi: 385, chain: 'A', label: 'Tyr385 (Catalytic Apex)' },
          { resn: 'TRP', resi: 387, chain: 'A', label: 'Trp387 (Hydrophobic Wall)' },
        ],
        reactionSummary:
          'Van der Waals packing of the aryl tail fills the upper arachidonate cleft, sterically excluding substrate access to Tyr385.',
        clinicalRelevance:
          'The S-(+)-enantiomer of arylpropionic acids fits this chiral hydrophobic cleft with 10–100x higher potency than the R-(-)-antipode.',
      },
    ],
  },


  cox2_coxib: {
    templateId: 'cox2_coxib',
    pdbId: '3LN1',
    ligandCode: 'CEL',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Celecoxib',
    exactDrugIds: ['celecoxib'],
    targetName: 'Cyclooxygenase-2 Selective Side Pocket (PTGS2)',
    geneSymbol: 'PTGS2',
    pocketMechanismSummary:
      'Inserts its diaryl-heterocycle sulfonamide/oxicam scaffold into the larger COX-2 hydrophilic side pocket (created by the Ile523->Val509 substitution), selectively inhibiting inducible inflammatory prostaglandin synthesis while sparing gastric COX-1.',
    bindingSites: [
      {
        id: 'cox2_side_pocket',
        siteName: 'Val509 / Arg499 COX-2 Selectivity Side Pocket',
        drugMoiety: 'Benzenesulfonamide / Carboxamide Group',
        interactionType: 'hydrogen-bond',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'VAL', resi: 509, chain: 'A', label: 'Val509 (COX-2 Gatekeeper; Ile523 in COX-1)' },
          { resn: 'ARG', resi: 499, chain: 'A', label: 'Arg499 (Side-Pocket Polar Anchor)' },
          { resn: 'HIS', resi: 75, chain: 'A', label: 'His75 (Side-Pocket H-Bond)' },
        ],
        reactionSummary:
          'Smaller Val509 opens a hydrophilic side chamber where the sulfonamide NH2/S=O oxygens form hydrogen bonds with Arg499 and His75.',
        clinicalRelevance:
          'Bulky Ile523 in COX-1 blocks entry into this side pocket, conferring GI mucosal sparing—though arylsulfonamide cross-reactivity cautions apply in severe sulfa allergy.',
      },
      {
        id: 'cox2_central_channel',
        siteName: 'Leu338 / Ser339 Central Pyrazole Cleft',
        drugMoiety: 'Trifluoromethyl-Pyrazole & Tolyl Ring',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'LEU', resi: 338, chain: 'A', label: 'Leu338 (Hydrophobic Shelf)' },
          { resn: 'SER', resi: 339, chain: 'A', label: 'Ser339 (Channel Backbone)' },
        ],
        reactionSummary:
          'Hydrophobic packing stabilizes the diaryl core across the central channel without requiring an acidic carboxylate at Arg120.',
        clinicalRelevance:
          'Unopposed endothelial prostacyclin (PGI2) suppression relative to platelet TXA2 elevates thrombotic cardiovascular risk across selective COX-2 inhibitors.',
      },
    ],
  },


  mu_opioid: {
    templateId: 'mu_opioid',
    pdbId: '5C1M',
    ligandCode: 'VF1',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'BU72 Morphinan Agonist',
    exactDrugIds: [],
    targetName: 'Mu-Opioid Receptor (MOR / OPRM1)',
    geneSymbol: 'OPRM1',
    pocketMechanismSummary:
      'Binds deep in the orthosteric transmembrane pocket of Gi/o-coupled mu-opioid receptors via an essential protonated amine salt bridge to Asp147, hyperpolarizing nociceptive neurons via GIRK K+ opening and Ca2+ channel inhibition.',
    bindingSites: [
      {
        id: 'mor_asp147_ionic',
        siteName: 'Asp147 Protonated Amine Salt Bridge (TM3)',
        drugMoiety: 'Protonated Tertiary Piperidine / Morphinan Amine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 147, chain: 'A', label: 'Asp147 (Conserved TM3 Salt-Bridge Anchor)' },
          { resn: 'TYR', resi: 326, chain: 'A', label: 'Tyr326 (TM7 Polar Stabilizer)' },
        ],
        reactionSummary:
          'Cationic tertiary nitrogen forms a tight electrostatic salt bridge with Asp147, the universal recognition anchor for morphinan, phenylpiperidine, and open-chain opioids.',
        clinicalRelevance:
          'N-allyl or N-cyclopropylmethyl substitution on this nitrogen (naloxone, buprenorphine) shifts TM6 conformation from full agonism to competitive antagonism or partial agonism.',
      },
      {
        id: 'mor_his297_aromatic',
        siteName: 'His297 / Trp293 Aromatic Toggle Switch (TM6)',
        drugMoiety: 'Phenolic / Methoxyphenyl Aromatic Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'HIS', resi: 297, chain: 'A', label: 'His297 (Water-Mediated Phenolic Anchor)' },
          { resn: 'TRP', resi: 293, chain: 'A', label: 'Trp293 (TM6 Toggle Switch)' },
        ],
        reactionSummary:
          'Water-mediated hydrogen bonding to His297 and pi-stacking against Trp293 drive outward TM6 movement to couple inhibitory Gi/o proteins.',
        clinicalRelevance:
          'O-demethylation of 3-methoxy prodrugs/analogs (codeine -> morphine, hydrocodone -> hydromorphone, tramadol -> O-desmethyltramadol) via CYP2D6 exposes the free phenol, dramatically increasing His297 affinity.',
      },
    ],
  },


  nav15_pore: {
    templateId: 'nav15_pore',
    pdbId: '6LQA',
    ligandCode: 'QDN',
    ligandChain: 'B',
    ligandMode: 'het',
    crystallizedLigandName: 'Quinidine',
    exactDrugIds: ['quinidine'],
    targetName: 'Voltage-Gated Sodium Channel Inner Pore (Nav1.5 / SCN5A)',
    geneSymbol: 'SCN5A',
    pocketMechanismSummary:
      'Enters the intracellular-facing central cavity of voltage-gated Na+ channels in open/inactivated states, stacking against the conserved S6 aromatic receptor site to occlude Na+ influx and suppress action potential upstroke or ectopic firing.',
    bindingSites: [
      {
        id: 'nav_phe1760_aromatic',
        siteName: 'Phe1760 Local Anesthetic Aromatic Site (DIV-S6)',
        drugMoiety: 'Lipophilic Aromatic / Quinoline / Xylylamide Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'PHE', resi: 1760, chain: 'B', label: 'Phe1760 (DIV-S6 Pore Receptor)' },
          { resn: 'TYR', resi: 1767, chain: 'B', label: 'Tyr1767 (Cation-Pi & Gate Coupling)' },
        ],
        reactionSummary:
          'Pi-pi and cation-pi contacts between the drug’s aromatic ring + protonated amine and Phe1760/Tyr1767 physically plug the Na+ conduction pathway.',
        clinicalRelevance:
          'State-dependent dissociation kinetics separate Class Ib (lidocaine/mexiletine: rapid off-rate sparing normal tissue), Class Ia (quinidine: intermediate), and Class Ic (flecainide: slow off-rate widening QRS); anticonvulsants (phenytoin, lamotrigine, oxcarbazepine) similarly stabilize inactivated neuronal Nav channels.',
      },
      {
        id: 'nav_pore_selectivity',
        siteName: 'Ile1466 / Pore Fenestration Hydrophobic Wall',
        drugMoiety: 'Alkyl / Trifluoroethoxy Linker Chain',
        interactionType: 'hydrophobic',
        colorAccent: '#f59e0b',
        residues: [{ resn: 'ILE', resi: 1466, chain: 'B', label: 'Ile1466 (DIII-S6 Fenestration)' }],
        reactionSummary:
          'Neutral lipophilic drug species traverse lateral membrane fenestrations or the open intracellular gate to reach the inner vestibule.',
        clinicalRelevance:
          'Ischemic acidosis increases protonated trapping in depolarized tissue, enhancing lidocaine’s selective antiarrhythmic and local anesthetic block.',
      },
    ],
  },


  pbp3_betalactam: {
    templateId: 'pbp3_betalactam',
    pdbId: '3PBQ',
    ligandCode: 'IM2',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Acylated Beta-Lactam Adduct on Catalytic Ser294',
    exactDrugIds: [],
    targetName: 'Bacterial Penicillin-Binding Protein Transpeptidase (PBP3)',
    geneSymbol: 'ftsI',
    pocketMechanismSummary:
      'Mimics the D-Ala-D-Ala C-terminal peptidoglycan stem peptide and undergoes nucleophilic ring-opening by the catalytic serine of bacterial PBP transpeptidases (or serine beta-lactamases for clavulanate), forming a long-lived covalent acyl-enzyme ester that halts cell-wall cross-linking.',
    bindingSites: [
      {
        id: 'pbp_ser294_covalent',
        siteName: 'Ser294 / Lys297 Covalent Beta-Lactam Acylation Triad',
        drugMoiety: 'Strained 4-Membered Beta-Lactam Carbonyl',
        interactionType: 'covalent',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'SER', resi: 294, chain: 'A', label: 'Ser294 (Catalytic Nucleophile)' },
          { resn: 'LYS', resi: 297, chain: 'A', label: 'Lys297 (General Base Activator)' },
        ],
        reactionSummary:
          'Lys297 deprotonates Ser294, which attacks the ring-strained beta-lactam carbonyl to open the 4-membered ring into a hydrolytically stable covalent ester.',
        clinicalRelevance:
          'Bactericidal time-dependent killing depends on keeping free drug concentrations above MIC (%fT > MIC); clavulanate sacrifices itself via this exact serine acylation on bacterial beta-lactamases to protect amoxicillin.',
      },
      {
        id: 'pbp_thr487_oxyanion',
        siteName: 'Ser349 / Thr487 Carboxylate & Oxyanion Cleft',
        drugMoiety: 'Thiazolidine / Dihydrothiazine C3/C4 Carboxylate',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'SER', resi: 349, chain: 'A', label: 'Ser349 (SXN Motif Polar Anchor)' },
          { resn: 'THR', resi: 487, chain: 'A', label: 'Thr487 (KTG Motif Carboxylate Anchor)' },
        ],
        reactionSummary:
          'Hydrogen bonds mimic recognition of the terminal D-Ala carboxylate, aligning the beta-lactam carbonyl in the oxyanion hole.',
        clinicalRelevance:
          'R1 acyl side-chain modifications across penicillins and 1st–3rd generation cephalosporins tune Gram-negative porin penetration and steric shielding against beta-lactamases.',
      },
    ],
  },


  gyrase_fq: {
    templateId: 'gyrase_fq',
    pdbId: '2XCT',
    ligandCode: 'CPF',
    ligandChain: 'G',
    ligandMode: 'het',
    crystallizedLigandName: 'Ciprofloxacin + Mg2+-Water Bridge',
    exactDrugIds: ['ciprofloxacin'],
    targetName: 'Bacterial DNA Gyrase / Topoisomerase IV Cleavage Complex',
    geneSymbol: 'gyrA',
    pocketMechanismSummary:
      'Intercalates into nicked bacterial DNA at the DNA gyrase / topoisomerase IV cleavage gate and chelates a non-catalytic Mg2+ ion bridged through conserved Ser/Glu QRDR residues, trapping lethal double-stranded DNA breaks.',
    bindingSites: [
      {
        id: 'gyr_mg_water_bridge',
        siteName: 'Ser84 / Glu88 Mg2+-Water Chelation Bridge (GyrA)',
        drugMoiety: 'C3-Carboxylate & C4-Keto Coplanar Chelator',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'SER', resi: 1084, chain: 'B', label: 'Ser84 / Ser1084 (QRDR Water-Bridge)' },
          { resn: 'GLU', resi: 1088, chain: 'B', label: 'Glu88 / Glu1088 (QRDR Mg2+ Bridge)' },
        ],
        reactionSummary:
          'The 3-keto-4-carboxylic acid motif chelates a divalent Mg2+ ion whose hydration sphere hydrogen-bonds directly to GyrA Ser84 and Glu88.',
        clinicalRelevance:
          'Explains two hallmark clinical Pearls: (1) oral polyvalent cations (Ca2+, Mg2+, Al3+, Fe2+, Zn2+) chelate this exact C3/C4 keto-acid in the gut and block absorption; (2) Ser84/Glu88 QRDR point mutations cause high-level fluoroquinolone resistance.',
      },
      {
        id: 'gyr_dna_stack',
        siteName: 'Arg1122 & Cleaved DNA Base-Stacking Gate',
        drugMoiety: 'C6-Fluoro Quinolone Core & C7-Piperazine/Diamine',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [{ resn: 'ARG', resi: 1122, chain: 'B', label: 'Arg122 / Arg1122 (DNA Gate)' }],
        reactionSummary:
          'Bicyclic quinolone core pi-stacks between cleaved DNA bases at the 4-bp stagger while C7 basic substituents project toward GyrB.',
        clinicalRelevance:
          'C8-methoxy substitution in moxifloxacin enhances dual GyrA + ParC targeting against Gram-positive respiratory pathogens and anaerobes.',
      },
    ],
  },


  ribosome_antibiotic: {
    templateId: 'ribosome_antibiotic',
    pdbId: '4V56',
    ligandCode: 'SCM',
    ligandChain: 'AA',
    ligandMode: 'het',
    crystallizedLigandName: 'Ribosomal Decoding-Center / Tunnel Inhibitor (SCM)',
    exactDrugIds: [],
    targetName: 'Bacterial 30S / 50S Ribosomal Protein Synthesis Complex',
    geneSymbol: 'rrsA',
    pocketMechanismSummary:
      'Binds conserved bacterial rRNA nucleotides and Mg2+ coordination sites within the 30S decoding center (tetracyclines) or 50S peptidyl-transferase nascent-peptide exit tunnel (macrolides, lincosamides, nitrofurans) to selectively arrest prokaryotic translation.',
    bindingSites: [
      {
        id: 'ribo_decoding_mg',
        siteName: '16S rRNA Helix 34 / Mg2+ Coordination Pocket',
        drugMoiety: 'Polyketide Keto-Enol / Desosamine-Cladinose Core',
        interactionType: 'coordination',
        colorAccent: '#10b981',
        residues: [
          { resn: 'G', resi: 1064, chain: 'AA', label: 'G1064 (16S rRNA Helix 34)' },
          { resn: 'C', resi: 1192, chain: 'AA', label: 'C1192 (16S rRNA Decoding Cleft)' },
        ],
        reactionSummary:
          'Polar hydroxyl/keto oxygens and basic amino sugars hydrogen-bond with conserved bacterial rRNA phosphate-ribose backbones and coordinated Mg2+.',
        clinicalRelevance:
          'Doxycycline’s planar keto-enol chelates divalent cations in the GI tract and developing teeth/bone; macrolides/clindamycin share overlapping 50S 23S rRNA sites (erm methylation causes MLSB cross-resistance).',
      },
      {
        id: 'ribo_s5_protein_wall',
        siteName: 'Ribosomal Protein S5 Loop Interface',
        drugMoiety: 'Substituted Ring Edge & Amino Group',
        interactionType: 'hydrogen-bond',
        colorAccent: '#8b5cf6',
        residues: [{ resn: 'LYS', resi: 26, chain: 'AE', label: 'Lys26 (30S Protein S5 Loop)' }],
        reactionSummary:
          'Stabilizes the ribosome in a non-productive conformation that blocks aminoacyl-tRNA accommodation or peptide translocation.',
        clinicalRelevance:
          'Eukaryotic 80S cytoplasmic ribosomes carry divergent rRNA sequences at these positions, conferring selective antibacterial bacteriostatic activity.',
      },
    ],
  },


  dhfr_folate: {
    templateId: 'dhfr_folate',
    pdbId: '1U72',
    ligandCode: 'MTX',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Methotrexate + NADPH Cofactor',
    exactDrugIds: ['methotrexate'],
    targetName: 'Dihydrofolate Reductase / Folate Synthesis Active Cleft (DHFR)',
    geneSymbol: 'DHFR',
    pocketMechanismSummary:
      'Occupies the folate substrate cleft via high-affinity protonated 2,4-diaminopyrimidine/pteridine salt bridges (methotrexate, trimethoprim) or competitive PABA mimicry upstream in folate synthesis (sulfamethoxazole), depleting tetrahydrofolate cofactors needed for thymidylate and purine synthesis.',
    bindingSites: [
      {
        id: 'dhfr_glu30_pteridine',
        siteName: 'Glu30 Protonated Diaminopteridine Salt Bridge',
        drugMoiety: '2,4-Diaminopteridine / Diaminopyrimidine Ring',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'GLU', resi: 30, chain: 'A', label: 'Glu30 (Acidic Pteridine Anchor)' },
          { resn: 'ILE', resi: 7, chain: 'A', label: 'Ile7 (Backbone Carbonyl H-Bond)' },
        ],
        reactionSummary:
          'Flipped 180° relative to dihydrofolate, the protonated N1-amidine ring forms a tight bidentate salt bridge with Glu30 adjacent to the NADPH nicotinamide.',
        clinicalRelevance:
          'Confers ~1,000x tighter binding than natural folate; leucovorin (folinic acid) bypasses inhibited human DHFR, whereas trimethoprim selectively fits bacterial DHFR.',
      },
      {
        id: 'dhfr_arg70_tail',
        siteName: 'Arg70 / Phe31 PABA-Glutamate Cleft',
        drugMoiety: 'p-Aminobenzoyl-Glutamate / Trimethoxybenzyl Tail',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 70, chain: 'A', label: 'Arg70 (Alpha-Carboxylate Salt Bridge)' },
          { resn: 'PHE', resi: 31, chain: 'A', label: 'Phe31 (Aromatic PABA Pocket)' },
        ],
        reactionSummary:
          'Aromatic pi-packing with Phe31 and ionic pairing at Arg70 lock the PABA-like linker across the folate channel.',
        clinicalRelevance:
          'Sulfamethoxazole acts one step upstream as a PABA structural analog in bacterial dihydropteroate synthase, creating synergistic sequential folate blockade with trimethoprim.',
      },
    ],
  },


  tubulin_colchicine: {
    templateId: 'tubulin_colchicine',
    pdbId: '4O2B',
    ligandCode: 'LOC',
    ligandChain: 'B',
    ligandMode: 'het',
    crystallizedLigandName: 'Colchicine',
    exactDrugIds: ['colchicine'],
    targetName: 'Alpha/Beta-Tubulin Heterodimer Interface (TUBB)',
    geneSymbol: 'TUBB',
    pocketMechanismSummary:
      'Wedges into the intradimer interface between alpha- and beta-tubulin subunits, preventing curved-to-straight conformational straightening required for microtubule polymerization in neutrophils (colchicine) or helminth tegument cells (albendazole).',
    bindingSites: [
      {
        id: 'tub_cys241_trimethoxy',
        siteName: 'Cys241 Beta-Tubulin Hydrophobic Pocket',
        drugMoiety: 'Trimethoxyphenyl A-Ring / Benzimidazole Carbamate',
        interactionType: 'hydrogen-bond',
        colorAccent: '#10b981',
        residues: [
          { resn: 'CYS', resi: 241, chain: 'B', label: 'Cys241 (Beta-Tubulin Polar Anchor)' },
          { resn: 'LEU', resi: 255, chain: 'B', label: 'Leu255 (Beta-Tubulin Pocket Wall)' },
        ],
        reactionSummary:
          'Sulfhydryl-polar hydrogen bonding with Cys241 and hydrophobic burial in beta-tubulin anchor the A-ring deep in the T7 loop cavity.',
        clinicalRelevance:
          'Inhibits neutrophil chemotaxis and NLRP3 inflammasome assembly in acute gout flares without altering serum uric acid levels.',
      },
      {
        id: 'tub_alpha_thr179',
        siteName: 'Thr179 / Val181 Alpha-Tubulin Steric Wedge',
        drugMoiety: 'Methoxytropone C-Ring & Acetamide Linker',
        interactionType: 'hydrogen-bond',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'THR', resi: 179, chain: 'A', label: 'Thr179 (Alpha-Tubulin Interface)' },
          { resn: 'VAL', resi: 181, chain: 'A', label: 'Val181 (Intradimer Wedge)' },
        ],
        reactionSummary:
          'Bridges across the alpha-tubulin boundary, sterically blocking the T7 loop from flipping during protofilament assembly.',
        clinicalRelevance:
          'Narrow therapeutic index: P-gp or CYP3A4 inhibitors (clarithromycin, cyclosporine) sharply raise intracellular colchicine levels, causing severe GI toxicity and neuromyopathy.',
      },
    ],
  },


  gabaa_pam: {
    templateId: 'gabaa_pam',
    pdbId: '6HUP',
    ligandCode: 'DZP',
    ligandChain: 'D',
    ligandMode: 'het',
    crystallizedLigandName: 'Diazepam at Alpha1/Gamma2 Allosteric Interface',
    exactDrugIds: ['diazepam'],
    targetName: 'GABA-A Chloride Channel Receptor (GABRA1 / GABRG2)',
    geneSymbol: 'GABRA1',
    pocketMechanismSummary:
      'Binds allosterically at the extracellular alpha/gamma subunit interface (benzodiazepines, Z-drugs) or transmembrane subunit cleft (barbiturates, GABAergic anticonvulsants) to potentiate GABA-gated Cl- influx and neuronal hyperpolarization.',
    bindingSites: [
      {
        id: 'gaba_his102_alpha1',
        siteName: 'His102 / Tyr210 Alpha-1 Benzodiazepine Cleft',
        drugMoiety: 'C7-Halogen/Nitro Benzo-Ring & C2-Carbonyl/Triazole',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'HIS', resi: 102, chain: 'D', label: 'His102 (Alpha-1 Selectivity Determinant)' },
          { resn: 'TYR', resi: 210, chain: 'D', label: 'Tyr210 (Loop C Aromatic Cap)' },
        ],
        reactionSummary:
          'Pi-stacking against Tyr210 and polar halogen/carbonyl contact with Alpha-1 His102 stabilize the pre-activated extracellular domain.',
        clinicalRelevance:
          'Zolpidem and eszopiclone selectively favor Alpha-1-containing GABA-A receptors (His102) for hypnotic sedation, whereas classical benzodiazepines hit Alpha-1/2/3/5 to add anxiolytic, anticonvulsant, and muscle-relaxant effects.',
      },
      {
        id: 'gaba_phe77_gamma2',
        siteName: 'Phe77 Gamma-2 Complementary Subunit Wall',
        drugMoiety: 'Pendant C5-Phenyl / Imidazopyridine Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [{ resn: 'PHE', resi: 77, chain: 'C', label: 'Phe77 (Gamma-2 Interface Wall)' }],
        reactionSummary:
          'Edge-to-face aromatic stacking across the Alpha1(+)/Gamma2(-) subunit cleft allosterically increases GABA channel opening frequency.',
        clinicalRelevance:
          'Flumazenil competitively displaces benzodiazepines and Z-drugs from this exact Alpha/Gamma pocket; barbiturates (butalbital) bind a separate transmembrane site that prolongs channel open duration without a ceiling effect.',
      },
    ],
  },


  sert_monoamine: {
    templateId: 'sert_monoamine',
    pdbId: '5I6X',
    ligandCode: '8PR',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Paroxetine in Outward-Open Central S1 Site',
    exactDrugIds: ['paroxetine'],
    targetName: 'Monoamine Reuptake Transporter (SERT / NET / DAT)',
    geneSymbol: 'SLC6A4',
    pocketMechanismSummary:
      'Locks presynaptic Na+/Cl--coupled monoamine transporters (SERT, NET, and/or DAT) in an outward-open conformation via a central Asp98 amine salt bridge, blocking reuptake and elevating synaptic serotonin, norepinephrine, or dopamine.',
    bindingSites: [
      {
        id: 'sert_asp98_s1',
        siteName: 'Asp98 Central Amine Subsite A (TM1)',
        drugMoiety: 'Protonated Secondary / Tertiary Amine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 98, chain: 'A', label: 'Asp98 (Central S1 Cationic Anchor)' },
          { resn: 'TYR', resi: 95, chain: 'A', label: 'Tyr95 (Gatekeeper Floor)' },
        ],
        reactionSummary:
          'Direct salt bridge between the drug’s protonated amine and Asp98 mimics serotonin’s ethylamine tail and halts the inward transport cycle.',
        clinicalRelevance:
          'Shared pharmacophore across SSRIs, SNRIs, TCAs, atomoxetine, bupropion, and methylphenidate/amphetamines; combining two serotonergic agents risks life-threatening serotonin syndrome.',
      },
      {
        id: 'sert_subsite_bc',
        siteName: 'Phe341 / Ser438 Halogen-Aromatic Subsites B & C',
        drugMoiety: 'Fluorophenyl / Dichlorophenyl / Benzodioxole Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'PHE', resi: 341, chain: 'A', label: 'Phe341 (TM6 Aromatic Clamp)' },
          { resn: 'SER', resi: 438, chain: 'A', label: 'Ser438 (Subsite B Polar Wall)' },
        ],
        reactionSummary:
          'Halogenated aryl rings wedge into hydrophobic subsites B and C, dictating SERT vs. NET vs. DAT selectivity.',
        clinicalRelevance:
          'Paroxetine’s methylenedioxyphenyl ring also undergoes CYP2D6 oxidation to a carbene intermediate that potently inhibits CYP2D6; S-enantiomer escitalopram additionally engages the vestibular S2 allosteric site.',
      },
    ],
  },


  d2_receptor: {
    templateId: 'd2_receptor',
    pdbId: '6CM4',
    ligandCode: '8NU',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Risperidone in Inverse-Agonist Orthosteric Cleft',
    exactDrugIds: ['risperidone'],
    targetName: 'Dopamine D2 Receptor (DRD2)',
    geneSymbol: 'DRD2',
    pocketMechanismSummary:
      'Engages the conserved Asp114 orthosteric amine anchor and deep Trp386 hydrophobic cleft of dopamine D2-family GPCRs—acting either as an antagonist/partial agonist in mesolimbic psychosis & emesis or as a non-ergot agonist in Parkinson’s disease.',
    bindingSites: [
      {
        id: 'd2_asp114_amine',
        siteName: 'Asp114 Conserved Biogenic Amine Anchor (TM3)',
        drugMoiety: 'Protonated Piperidine / Piperazine / Propylamine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [{ resn: 'ASP', resi: 114, chain: 'A', label: 'Asp114 (TM3 Orthosteric Salt Bridge)' }],
        reactionSummary:
          'Electrostatic salt bridge anchors antipsychotics, metoclopramide, and dopamine agonists at the exact catecholamine ammonium site.',
        clinicalRelevance:
          '>80% striatal D2 blockade precipitates extrapyramidal symptoms (EPS) and hyperprolactinemia; aripiprazole acts as a partial agonist stabilizer, while pramipexole/ropinirole/levodopa-derived dopamine activate D2/D3 in Parkinson’s disease.',
      },
      {
        id: 'd2_trp386_deep',
        siteName: 'Trp386 / Phe389 Deep Benzisoxazole Aromatic Pocket',
        drugMoiety: 'Fluoro-Benzisoxazole / Thienobenzodiazepine / Butyrophenone',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TRP', resi: 386, chain: 'A', label: 'Trp386 (TM6 Toggle Switch)' },
          { resn: 'PHE', resi: 389, chain: 'A', label: 'Phe389 (TM6 Aromatic Wall)' },
        ],
        reactionSummary:
          'Deep aromatic extension packs below Trp386, locking TM6 in an inactive state for typical/atypical antipsychotics.',
        clinicalRelevance:
          'Second-generation atypicals combine faster D2 dissociation or simultaneous 5-HT2A antagonism to lower nigrostriatal EPS risk.',
      },
    ],
  },


  ht2_serotonin: {
    templateId: 'ht2_serotonin',
    pdbId: '6BQH',
    ligandCode: 'E2J',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Ritanserin 5-HT2 Antagonist',
    exactDrugIds: [],
    targetName: 'Serotonin 5-HT2 / 5-HT1 Receptor Pocket (HTR2C / HTR2A)',
    geneSymbol: 'HTR2C',
    pocketMechanismSummary:
      'Binds central serotonergic GPCR pockets via TM3 Asp134 salt-bridging and TM5/TM6 aromatic contacts, mediating postsynaptic 5-HT2A/2C antagonism (trazodone, mirtazapine, cyclobenzaprine) or 5-HT1A partial agonism (buspirone).',
    bindingSites: [
      {
        id: 'ht2_asp134_salt',
        siteName: 'Asp134 Orthosteric Piperazine Salt Bridge (TM3)',
        drugMoiety: 'Protonated Arylpiperazine / Azaspirodecanedione Amine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 134, chain: 'A', label: 'Asp134 (TM3 Ionic Anchor)' },
          { resn: 'SER', resi: 138, chain: 'A', label: 'Ser138 (TM3 Polar Assist)' },
        ],
        reactionSummary:
          'Protonated piperazine/tertiary amine forms a primary electrostatic anchor with Asp134 in the transmembrane bundle.',
        clinicalRelevance:
          '5-HT2A antagonism in trazodone and mirtazapine promotes restorative slow-wave sleep without SSRI-like sexual dysfunction, while buspirone’s 5-HT1A partial agonism relieves generalized anxiety without sedation or dependence.',
      },
      {
        id: 'ht2_trp324_aromatic',
        siteName: 'Trp324 / Phe327 Deep Hydrophobic Cleft (TM6)',
        drugMoiety: 'Triazolopyridine / Tetracyclic / Tricyclic Core',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'TRP', resi: 324, chain: 'A', label: 'Trp324 (TM6 Toggle Switch)' },
          { resn: 'PHE', resi: 327, chain: 'A', label: 'Phe327 (TM6 Aromatic Clamp)' },
        ],
        reactionSummary:
          'Pi-stacking against Trp324/Phe327 stabilizes the inactive receptor conformation.',
        clinicalRelevance:
          'Concurrent H1 and alpha-1 adrenergic affinity in trazodone, mirtazapine, and cyclobenzaprine contributes to sedation and orthostatic hypotension.',
      },
    ],
  },


  alpha2_adrenergic: {
    templateId: 'alpha2_adrenergic',
    pdbId: '6KUX',
    ligandCode: 'E3F',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Imidazoline Alpha-2 Agonist',
    exactDrugIds: [],
    targetName: 'Alpha-2A Adrenergic Receptor (ADRA2A)',
    geneSymbol: 'ADRA2A',
    pocketMechanismSummary:
      'Activates presynaptic Gi-coupled alpha-2A adrenergic autoreceptors in the brainstem, spinal dorsal horn, or ciliary body via Asp113 salt-bridging and TM5 serine contacts, suppressing sympathetic norepinephrine outflow, muscle spasticity, or aqueous humor production.',
    bindingSites: [
      {
        id: 'a2_asp113_imidazoline',
        siteName: 'Asp113 Imidazoline / Guanidine Salt Bridge (TM3)',
        drugMoiety: 'Protonated Imidazoline / Guanidine Ring',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [{ resn: 'ASP', resi: 113, chain: 'A', label: 'Asp113 (TM3 Cationic Anchor)' }],
        reactionSummary:
          'Bidentate ionic hydrogen bond between the imidazoline/guanidine NH+ group and Asp113 anchors the agonist in the catecholamine pocket.',
        clinicalRelevance:
          'Abrupt discontinuation of central alpha-2 agonists (clonidine, tizanidine) triggers rebound sympathetic surge and hypertensive crisis.',
      },
      {
        id: 'a2_phe390_cage',
        siteName: 'Trp387 / Phe390 Ortho-Halophenyl Cage (TM6)',
        drugMoiety: '2,6-Dichlorophenyl / Quinoxaline Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TRP', resi: 387, chain: 'A', label: 'Trp387 (TM6 Toggle)' },
          { resn: 'PHE', resi: 390, chain: 'A', label: 'Phe390 (Ortho-Chloro Clamp)' },
        ],
        reactionSummary:
          'Ortho-substituents force the aryl and imidazoline rings orthogonal to each other, fitting selectively into the alpha-2 aromatic cage over alpha-1.',
        clinicalRelevance:
          'Guanfacine’s higher alpha-2A subtype selectivity in prefrontal cortex improves ADHD executive control with less sedation than clonidine; ophthalmic brimonidine lowers intraocular pressure.',
      },
    ],
  },


  ppar_nuclear: {
    templateId: 'ppar_nuclear',
    pdbId: '2PRG',
    ligandCode: 'BRL',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Thiazolidinedione Agonist (BRL49653)',
    exactDrugIds: [],
    targetName: 'Peroxisome Proliferator-Activated Receptor (PPAR-gamma / PPAR-alpha)',
    geneSymbol: 'PPARG',
    pocketMechanismSummary:
      'Binds the large Y-shaped nuclear receptor ligand-binding domain and hydrogen-bonds with Helix-12 Tyr473 + His323/His449, recruiting transcriptional coactivators that upregulate insulin-sensitizing adipokines (PPAR-gamma TZDs) or lipoprotein lipase beta-oxidation (PPAR-alpha fibrates).',
    bindingSites: [
      {
        id: 'ppar_tyr473_af2',
        siteName: 'Tyr473 / His323 / His449 AF-2 Helix-12 Polar Headgroup',
        drugMoiety: 'Acidic Thiazolidinedione-2,4-dione / Fibric Acid Headgroup',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TYR', resi: 473, chain: 'A', label: 'Tyr473 (Helix-12 AF-2 Lock)' },
          { resn: 'HIS', resi: 323, chain: 'A', label: 'His323 (Polar Headgroup Network)' },
          { resn: 'HIS', resi: 449, chain: 'A', label: 'His449 (Polar Headgroup Network)' },
        ],
        reactionSummary:
          'Acidic imide/carboxylate headgroup forms a tetrahedral hydrogen-bond network that pins Helix-12 in its active coactivator-binding conformation.',
        clinicalRelevance:
          'Pioglitazone improves peripheral insulin sensitivity without hypoglycemia, but renal ENaC transcriptional upregulation causes fluid retention and contraindicates TZDs in NYHA Class III/IV heart failure.',
      },
      {
        id: 'ppar_lipophilic_arm',
        siteName: 'Cys285 / Ile341 Hydrophobic Y-Cavity Arm',
        drugMoiety: 'Alkoxybenzyl-Pyridine / Phenoxyisobutyrate Tail',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'CYS', resi: 285, chain: 'A', label: 'Cys285 (Central Cavity Sensor)' },
          { resn: 'ILE', resi: 341, chain: 'A', label: 'Ile341 (Beta-Sheet Lipophilic Arm)' },
        ],
        reactionSummary:
          'Extended lipophilic tail occupies the hydrophobic arm of the nuclear receptor pocket, determining PPAR-gamma vs. PPAR-alpha subtype preference.',
        clinicalRelevance:
          'Fibrates (fenofibrate, gemfibrozil) and omega-3 fatty acids preferentially activate hepatic PPAR-alpha to lower serum triglycerides by 35–50%.',
      },
    ],
  },


  dpp4_gliptin: {
    templateId: 'dpp4_gliptin',
    pdbId: '1X70',
    ligandCode: '715',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Sitagliptin',
    exactDrugIds: ['sitagliptin'],
    targetName: 'Dipeptidyl Peptidase-4 Serine Protease (DPP-4)',
    geneSymbol: 'DPP4',
    pocketMechanismSummary:
      'Competitively occupies the S1 hydrophobic pocket and Glu205/Glu206 dyad of DPP-4, preventing N-terminal cleavage of endogenous GLP-1 and GIP incretin hormones to enhance glucose-dependent insulin secretion.',
    bindingSites: [
      {
        id: 'dpp4_glu205_dyad',
        siteName: 'Glu205 / Glu206 N-Terminal Amine Dyad',
        drugMoiety: 'Chiral Beta-Amino / Aminopiperidine Cation',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'GLU', resi: 205, chain: 'A', label: 'Glu205 (Twin Glutamate Anchor)' },
          { resn: 'GLU', resi: 206, chain: 'A', label: 'Glu206 (Twin Glutamate Anchor)' },
        ],
        reactionSummary:
          'Protonated primary amine forms dual salt bridges with Glu205/Glu206, mimicking the free N-terminus of endogenous GLP-1.',
        clinicalRelevance:
          'Weight-neutral oral therapy with minimal hypoglycemia risk because GLP-1 stimulates insulin release strictly when blood glucose is elevated.',
      },
      {
        id: 'dpp4_s1_pocket',
        siteName: 'Tyr662 / Tyr666 S1 Fluorophenyl & S2\' Triazolopiperazine Pocket',
        drugMoiety: '2,4,5-Trifluorophenyl & CF3-Triazolopiperazine / Xanthine Core',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'TYR', resi: 662, chain: 'A', label: 'Tyr662 (S1 Aromatic Wall)' },
          { resn: 'PHE', resi: 357, chain: 'A', label: 'Phe357 (S2 Extensive Pi-Stack)' },
        ],
        reactionSummary:
          'Halogenated phenyl fills the tight S1 proline-recognition pocket while the fused heterocycle stacks against Phe357 for >1,000x selectivity over DPP-8/9.',
        clinicalRelevance:
          'Linagliptin’s xanthine scaffold drives hepatobiliary elimination—requiring zero renal dose adjustment in CKD, unlike sitagliptin.',
      },
    ],
  },


  sglt2_gliflozin: {
    templateId: 'sglt2_gliflozin',
    pdbId: '7VSI',
    ligandCode: '7R3',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Empagliflozin C-Glucoside',
    exactDrugIds: [],
    targetName: 'Renal Sodium-Glucose Cotransporter 2 (SGLT2 / SLC5A2)',
    geneSymbol: 'SLC5A2',
    pocketMechanismSummary:
      'Wedges its metabolically stable C-aryl glucoside into the outward-facing extracellular vestibule of proximal-tubule SGLT2, blocking Na+/glucose reabsorption to induce glycosuria, natriuresis, and cardiorenal protection.',
    bindingSites: [
      {
        id: 'sglt2_sugar_pocket',
        siteName: 'Asn75 / His80 / Glu99 D-Glucose Recognition Cleft',
        drugMoiety: 'Beta-D-Glucopyranosyl Polyhydroxyl Ring (C-C Linked)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ASN', resi: 75, chain: 'A', label: 'Asn75 (C2-OH / C3-OH H-Bond)' },
          { resn: 'HIS', resi: 80, chain: 'A', label: 'His80 (Sugar Ring Polar Clamp)' },
          { resn: 'GLU', resi: 99, chain: 'A', label: 'Glu99 (Glucose Hydroxyl Anchor)' },
        ],
        reactionSummary:
          'Multiple cooperative hydrogen bonds mimic D-glucose binding while the direct C-glycoside bond resists intestinal beta-glucosidase hydrolysis.',
        clinicalRelevance:
          'Replacing phlorizin’s labile O-glycoside with a C-aryl bond made once-daily oral SGLT2 inhibitors (canagliflozin) clinically viable.',
      },
      {
        id: 'sglt2_aglycone_vestibule',
        siteName: 'Phe98 / Leu286 Extracellular Aglycone Vestibule',
        drugMoiety: 'Chlorophenyl-Thiophene Lipophilic Diarylmethane Tail',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'PHE', resi: 98, chain: 'A', label: 'Phe98 (Vestibule Gate)' },
          { resn: 'LEU', resi: 286, chain: 'A', label: 'Leu286 (SGLT2 Selectivity Pocket)' },
        ],
        reactionSummary:
          'Diarylmethane aglycone extends into the outer hydrophobic vestibule, locking SGLT2 outward-open and conferring selectivity over intestinal SGLT1.',
        clinicalRelevance:
          'Lowers intraglomerular pressure via tubuloglomerular feedback (slowing CKD & HF hospitalizations), while glucosuria increases mycotic genital infection and euglycemic DKA risk.',
      },
    ],
  },


  glp1r_peptide: {
    templateId: 'glp1r_peptide',
    pdbId: '7KI0',
    ligandCode: 'P',
    ligandChain: 'P',
    ligandMode: 'chain',
    crystallizedLigandName: 'Semaglutide Peptide Chain P in Active GLP-1R',
    exactDrugIds: ['semaglutide'],
    targetName: 'Glucagon-Like Peptide-1 Receptor (GLP-1R)',
    geneSymbol: 'GLP1R',
    pocketMechanismSummary:
      'Inserts its N-terminal alpha-helical incretin peptide deep into the Class B GPCR transmembrane core while clasping the extracellular domain, stimulating Gs/cAMP-mediated glucose-dependent insulin release, glucagon suppression, delayed gastric emptying, and hypothalamic satiety.',
    bindingSites: [
      {
        id: 'glp1_tm_activation',
        siteName: 'Arg190 / Glu364 Deep Transmembrane Activation Core',
        drugMoiety: 'N-Terminal His7–Aib8–Glu9 Incretin Helix (DPP-4 Shielded)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 190, chain: 'R', label: 'Arg190 (TM2 Polar Activation Network)' },
          { resn: 'GLU', resi: 364, chain: 'R', label: 'Glu364 (TM6 Core Salt Bridge)' },
        ],
        reactionSummary:
          'The N-terminal peptide residues plunge into the 7TM bundle, engaging Arg190/Glu364 to kink TM6 outward and couple Gs.',
        clinicalRelevance:
          'Substituting Ala8 with alpha-aminoisobutyric acid (Aib8) in semaglutide and tirzepatide blocks DPP-4 proteolytic cleavage, extending half-life from 2 minutes to ~1 week (alongside C18/C20 fatty-diacid albumin binding).',
      },
      {
        id: 'glp1_ecd_clasp',
        siteName: 'Trp39 / Tyr69 Extracellular Domain Amphipathic Clasp',
        drugMoiety: 'C-Terminal Amphipathic Alpha-Helix & Acylated Lysine Linker',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TRP', resi: 39, chain: 'R', label: 'Trp39 (ECD Hydrophobic Groove)' },
          { resn: 'TYR', resi: 69, chain: 'R', label: 'Tyr69 (ECD Helix Recognition)' },
        ],
        reactionSummary:
          'Hydrophobic face of the C-terminal alpha-helix docks along the GLP-1R extracellular domain groove, capturing and orienting the peptide into the TM core.',
        clinicalRelevance:
          'Tirzepatide engineers this helix to co-activate both GIP and GLP-1 receptors for synergistic glycemic and weight reduction; all agents carry a thyroid C-cell tumor boxed warning.',
      },
    ],
  },


  ht3_channel: {
    templateId: 'ht3_channel',
    pdbId: '6NP0',
    ligandCode: 'CWB',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Granisetron in Pentameric Subunit Interface',
    exactDrugIds: ['granisetron'],
    targetName: 'Serotonin 5-HT3 Cation-Selective Ion Channel (HTR3A)',
    geneSymbol: 'HTR3A',
    pocketMechanismSummary:
      'Competitively occupies the aromatic box at the extracellular subunit interface of pentameric 5-HT3 ligand-gated cation channels on vagal afferents and the chemoreceptor trigger zone, blocking serotonin-induced emetic depolarization.',
    bindingSites: [
      {
        id: 'ht3_trp156_box',
        siteName: 'Trp156 / Tyr207 Aromatic Cation-Pi Box',
        drugMoiety: 'Protonated Azabicyclo / Imidazole Basic Nitrogen',
        interactionType: 'pi-stacking',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'TRP', resi: 156, chain: 'A', label: 'Trp156 (Loop B Cation-Pi Anchor)' },
          { resn: 'TYR', resi: 207, chain: 'A', label: 'Tyr207 (Loop C Lid)' },
        ],
        reactionSummary:
          'Cation-pi interaction between the basic tropane/imidazole amine and Trp156 locks Loop C over the closed channel state.',
        clinicalRelevance:
          'First-line prophylaxis and rescue for chemotherapy-induced and postoperative nausea/vomiting without causing dopamine-blockade extrapyramidal symptoms.',
      },
      {
        id: 'ht3_arg65_indazole',
        siteName: 'Arg65 / Trp63 Complementary Subunit Indazole/Carbazole Wall',
        drugMoiety: 'Carbazolone / Indazole Carbonyl Linker',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TRP', resi: 63, chain: 'B', label: 'Trp63 (Complementary Loop D)' },
          { resn: 'ARG', resi: 65, chain: 'B', label: 'Arg65 (Carbonyl Hydrogen Bond)' },
        ],
        reactionSummary:
          'Planar aromatic heterocycle and carbonyl linker bridge across the principal/complementary subunit interface.',
        clinicalRelevance:
          'High-dose IV ondansetron can prolong the QTc interval via off-target cardiac hERG channel block, requiring caution in hypokalemia/hypomagnesemia.',
      },
    ],
  },


  h1_histamine: {
    templateId: 'h1_histamine',
    pdbId: '3RZE',
    ligandCode: '5EH',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Doxepin in H1 Inverse-Agonist Pocket',
    exactDrugIds: [],
    targetName: 'Histamine H1 / H2 Receptor Orthosteric Pocket (HRH1)',
    geneSymbol: 'HRH1',
    pocketMechanismSummary:
      'Stabilizes the inactive conformation of histamine GPCRs as an inverse agonist via TM3 Asp107 amine salt-bridging and diaryl aromatic clamping—plus an anion-binding cradle (Lys191) that keeps zwitterionic 2nd-generation antihistamines out of the CNS.',
    bindingSites: [
      {
        id: 'h1_asp107_amine',
        siteName: 'Asp107 Orthosteric Amine Anchor (TM3)',
        drugMoiety: 'Protonated Piperazine / Piperidine / Guanidinothiazole Amine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 107, chain: 'A', label: 'Asp107 (Conserved Histamine Anchor)' },
          { resn: 'TYR', resi: 108, chain: 'A', label: 'Tyr108 (TM3 Aromatic Support)' },
        ],
        reactionSummary:
          'Salt bridge between the basic amine and Asp107 blocks histamine-stimulated Gq/PLC bronchoconstriction, vasodilation, and pruritus (or Gs gastric acid via H2 for famotidine).',
        clinicalRelevance:
          'First-generation lipophilic amines (promethazine, hydroxyzine, meclizine) cross the blood-brain barrier to treat motion sickness, vertigo, or acute anxiety/pruritus.',
      },
      {
        id: 'h1_lys191_zwitterion',
        siteName: 'Trp428 Aromatic Cage & Lys191 Peripheral Selectivity Vestibule',
        drugMoiety: 'Diphenylmethyl Core & Zwitterionic Carboxylate / Ester Tail',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TRP', resi: 428, chain: 'A', label: 'Trp428 (TM6 Inverse-Agonist Lock)' },
          { resn: 'LYS', resi: 191, chain: 'A', label: 'Lys191 (ECL2 Carboxylate Cradle)' },
        ],
        reactionSummary:
          'Diaryl rings lock Trp428 inactive while Lys191 welcomes the polar carboxylate of cetirizine (hydroxyzine’s oxidized metabolite).',
        clinicalRelevance:
          'Zwitterionic polarity + P-glycoprotein efflux exclude cetirizine and loratadine from brain H1 receptors, delivering non-sedating allergy relief.',
      },
    ],
  },


  cyp51_azole: {
    templateId: 'cyp51_azole',
    pdbId: '5TZ1',
    ligandCode: 'VT1',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Triazole Coordinated to Heme Iron in Fungal CYP51',
    exactDrugIds: [],
    targetName: 'Fungal Lanosterol 14-Alpha-Demethylase (CYP51 / ERG11)',
    geneSymbol: 'ERG11',
    pocketMechanismSummary:
      'Coordinates the 6th axial ligand position of fungal cytochrome P450 heme iron via an unhindered imidazole/triazole ring nitrogen, blocking lanosterol demethylation and depleting fungal membrane ergosterol (or directly binding ergosterol pores for nystatin).',
    bindingSites: [
      {
        id: 'cyp51_heme_coordination',
        siteName: 'Cys470-Heme Fe3+ Axial Azole Coordination',
        drugMoiety: 'Triazole N4 / Imidazole N3 Lone Pair',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'CYS', resi: 470, chain: 'A', label: 'Cys470 (Proximal Heme Thiolate)' },
          { resn: 'TYR', resi: 132, chain: 'A', label: 'Tyr132 (Active-Site Heme Propionate)' },
        ],
        reactionSummary:
          'Direct coordinate bond from the azole nitrogen to ferric heme iron prevents molecular O2 binding and lanosterol oxidation.',
        clinicalRelevance:
          'Triazoles (fluconazole) show far higher selectivity for fungal CYP51 over human steroidogenic/hepatic CYPs than imidazoles (ketoconazole, clotrimazole), though CYP2C9/CYP3A4 drug interactions (warfarin, statins) remain clinically critical.',
      },
      {
        id: 'cyp51_substrate_channel',
        siteName: 'Tyr118 / Leu376 Hydrophobic Access Channel',
        drugMoiety: 'Difluorophenyl / Dichlorobenzyl Lipophilic Tail',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TYR', resi: 118, chain: 'A', label: 'Tyr118 (Channel Wall)' },
          { resn: 'LEU', resi: 376, chain: 'A', label: 'Leu376 (Substrate Recognition Cleft)' },
        ],
        reactionSummary:
          'Halogenated phenyl rings pack tightly in the fungal substrate access channel, positioning the azole ring perpendicular to the porphyrin plane.',
        clinicalRelevance:
          'Topical polyene nystatin complements azoles by directly complexing existing membrane ergosterol to form fungicidal ion-leaking pores without systemic absorption.',
      },
    ],
  },


  hmgcr_statin: {
    templateId: 'hmgcr_statin',
    pdbId: '1HWK',
    ligandCode: '117',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Atorvastatin',
    exactDrugIds: ['atorvastatin'],
    targetName: 'HMG-CoA Reductase Catalytic Domain (HMGCR)',
    geneSymbol: 'HMGCR',
    pocketMechanismSummary:
      'Competitively inhibits the rate-limiting step of hepatic cholesterol biosynthesis with nanomolar affinity via a chiral 3,5-dihydroxyheptanoate HMG transition-state mimic, triggering SREBP-2 upregulation of hepatic LDL receptors and lowering plasma LDL-C.',
    bindingSites: [
      {
        id: 'hmg_polar_head',
        siteName: 'Lys691 / Glu559 / Asp690 HMG-Like Oxyanion Cradle',
        drugMoiety: '(3R,5R)-3,5-Dihydroxyheptanoate Pharmacophore',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'LYS', resi: 691, chain: 'A', label: 'Lys691 (Carboxylate Salt Bridge)' },
          { resn: 'GLU', resi: 559, chain: 'A', label: 'Glu559 (C5-OH Hydrogen Bond)' },
          { resn: 'ASP', resi: 690, chain: 'A', label: 'Asp690 (C3-OH Hydrogen Bond)' },
        ],
        reactionSummary:
          'Mimics the mevaldil-CoA tetrahedral intermediate through a dense ionic and hydrogen-bond network in the catalytic cis-loop.',
        clinicalRelevance:
          'Simvastatin and lovastatin are administered as inactive closed lactone prodrugs that require in vivo hydrolysis to open this active 3,5-dihydroxy acid headgroup; atorvastatin, rosuvastatin, and pravastatin are already active open acids.',
      },
      {
        id: 'hmg_hydrophobic_groove',
        siteName: 'Leu562 / Arg590 Shallow Hydrophobic Groove',
        drugMoiety: 'Fluorophenyl-Pyrrole / Pyrimidine / Decalin Core',
        interactionType: 'hydrophobic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 590, chain: 'A', label: 'Arg590 (Fluorophenyl Cation-Pi / H-Bond)' },
          { resn: 'LEU', resi: 562, chain: 'A', label: 'Leu562 (Hydrophobic Shelf)' },
        ],
        reactionSummary:
          'Synthetic diaryl-heterocycles induce an additional shallow hydrophobic groove absent in endogenous HMG-CoA binding, boosting potency >1,000-fold.',
        clinicalRelevance:
          'Hydrophilic statins (rosuvastatin, pravastatin) rely on hepatocyte OATP1B1 uptake and avoid CYP3A4 metabolism, lowering drug-interaction myopathy risk compared with simvastatin/lovastatin.',
      },
    ],
  },


  ace_dicarboxylate: {
    templateId: 'ace_dicarboxylate',
    pdbId: '1O86',
    ligandCode: 'LPR',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Lisinopril + Catalytic Zn2+',
    exactDrugIds: ['lisinopril'],
    targetName: 'Angiotensin-Converting Enzyme (ACE)',
    geneSymbol: 'ACE',
    pocketMechanismSummary:
      'Chelates the catalytic Zn2+ ion of somatic ACE via a dicarboxylate/phosphinate transition-state mimic while anchoring its C-terminal proline carboxylate in S2\', blocking angiotensin I -> II conversion and bradykinin degradation.',
    bindingSites: [
      {
        id: 'ace_zn_triad',
        siteName: 'His383 / His387 / Glu411 Catalytic Zn2+ Coordination',
        drugMoiety: 'Central Carboxylate / Phosphinate Zinc-Binding Group',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'HIS', resi: 383, chain: 'A', label: 'His383 (HEXXH Zn2+ Ligand)' },
          { resn: 'HIS', resi: 387, chain: 'A', label: 'His387 (HEXXH Zn2+ Ligand)' },
          { resn: 'GLU', resi: 384, chain: 'A', label: 'Glu384 (Catalytic Acid-Base)' },
        ],
        reactionSummary:
          'Bidentate oxygen coordination to catalytic Zn2+ and H-bonding to Glu384 mimic the tetrahedral peptide-hydrolysis transition state.',
        clinicalRelevance:
          'Enalapril, ramipril, benazepril, and fosinopril mask this polar zinc-binding group as an ethyl/acyloxyalkyl ester prodrug for oral absorption; lisinopril’s lysyl side chain rides PEPT1 transporters as an active drug.',
      },
      {
        id: 'ace_s2prime_lys511',
        siteName: 'Lys511 / Tyr520 S2\' Proline Carboxylate Anchor',
        drugMoiety: 'C-Terminal Proline / Bicyclic Carboxylate & S1\' Lysyl/Phenethyl',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'LYS', resi: 511, chain: 'A', label: 'Lys511 (S2\' Salt Bridge)' },
          { resn: 'TYR', resi: 520, chain: 'A', label: 'Tyr520 (S2\' H-Bond)' },
        ],
        reactionSummary:
          'Salt bridge with Lys511 and H-bond with Tyr520 orient the peptidomimetic backbone across S1–S1\'–S2\'.',
        clinicalRelevance:
          'Inhibiting ACE’s kininase II activity elevates bradykinin—explaining dry cough and potentially life-threatening angioedema (contraindicating coadministration with sacubitril; boxed fetal toxicity warning in pregnancy).',
      },
    ],
  },


  ace_thiol: {
    templateId: 'ace_thiol',
    pdbId: '1UZF',
    ligandCode: 'MCO',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Captopril + Catalytic Zn2+',
    exactDrugIds: ['captopril'],
    targetName: 'Angiotensin-Converting Enzyme (ACE — Thiol Inhibitor)',
    geneSymbol: 'ACE',
    pocketMechanismSummary:
      'Coordinates the active-site Zn2+ of ACE directly via a potent sulfhydryl (-SH) thiolate ligand while locking its L-proline carboxylate onto Lys511/Tyr520 in the S2\' subsite.',
    bindingSites: [
      {
        id: 'cap_thiol_zn',
        siteName: 'His383 / His387 Sulfhydryl–Zn2+ Thiolate Bond',
        drugMoiety: 'Mercaptoalkanoyl Thiolate (-S-)',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'HIS', resi: 383, chain: 'A', label: 'His383 (Zn2+ Coordination)' },
          { resn: 'HIS', resi: 387, chain: 'A', label: 'His387 (Zn2+ Coordination)' },
        ],
        reactionSummary:
          'High-affinity sulfur-to-zinc coordination displaces the catalytic water molecule without requiring an S1 phenethyl group.',
        clinicalRelevance:
          'The free sulfhydryl (-SH) group confers rapid onset without prodrug bioactivation, but causes rapid disulfide dimerization (short t1/2 -> BID/TID dosing) and unique thiol-mediated dysgeusia (taste loss) and maculopapular rash.',
      },
      {
        id: 'cap_proline_s2',
        siteName: 'Lys511 / Gln281 S2\' L-Proline Pocket',
        drugMoiety: '(S)-2-Methylpropanoyl-L-Proline Carboxylate',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'LYS', resi: 511, chain: 'A', label: 'Lys511 (S2\' Salt Bridge)' },
          { resn: 'TYR', resi: 520, chain: 'A', label: 'Tyr520 (S2\' H-Bond)' },
        ],
        reactionSummary:
          'Ionic salt bridge and amide carbonyl H-bonding mimic the C-terminal His-Leu dipeptide of Angiotensin I.',
        clinicalRelevance:
          'Inspired replacement of the thiol with non-thiol dicarboxylate (enalapril/lisinopril) and phosphinate (fosinopril) zinc-binding groups to eliminate thiol rash and extend duration to once daily.',
      },
    ],
  },


  at1r_sartan: {
    templateId: 'at1r_sartan',
    pdbId: '4ZUD',
    ligandCode: 'OLM',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Olmesartan',
    exactDrugIds: ['olmesartan'],
    targetName: 'Angiotensin II Type 1 Receptor (AT1R / AGTR1)',
    geneSymbol: 'AGTR1',
    pocketMechanismSummary:
      'Competitively/insurmountably blocks angiotensin II binding in the extracellular transmembrane pocket of Gq-coupled AT1 receptors via Arg167 tetrazole/carboxylate salt-bridging, causing vasodilation and decreased aldosterone secretion without elevating bradykinin.',
    bindingSites: [
      {
        id: 'at1_arg167_tetrazole',
        siteName: 'Arg167 / Tyr35 Acidic Tetrazole & Carboxylate Clamp',
        drugMoiety: 'Acidic Tetrazole Bioisostere & Imidazole Carboxylate/Hydroxymethyl',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 167, chain: 'A', label: 'Arg167 (ECL2 Dual Ionic Anchor)' },
          { resn: 'TYR', resi: 35, chain: 'A', label: 'Tyr35 (TM1 Hydrogen Bond)' },
        ],
        reactionSummary:
          'Deprotonated tetrazole (lipophilic carboxylic-acid bioisostere, pKa ~4.9) and imidazole acid/alcohol form cooperative salt bridges and H-bonds with Arg167 and Tyr35.',
        clinicalRelevance:
          'Losartan’s C5-hydroxymethyl is oxidized by CYP2C9 into active C5-carboxylate EXP3174 (10–40x stronger Arg167 binding), whereas olmesartan, candesartan, valsartan, irbesartan, and telmisartan already carry the active carboxylate.',
      },
      {
        id: 'at1_trp84_biphenyl',
        siteName: 'Trp84 / Phe182 Biphenyl-Alkyl Hydrophobic Cradle',
        drugMoiety: 'Biphenyl Scaffold & n-Propyl / n-Butyl Lipophilic Chain',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TRP', resi: 84, chain: 'A', label: 'Trp84 (TM2 Pi-Stacking Wall)' },
          { resn: 'ILE', resi: 288, chain: 'A', label: 'Ile288 (TM7 Lipophilic Pocket)' },
        ],
        reactionSummary:
          'Biphenyl core pi-stacks with Trp84 while the alkyl chain fills the hydrophobic TM7 subpocket to confer slow dissociation ("insurmountable" antagonism).',
        clinicalRelevance:
          'Spares ACE/kininase II—making ARBs the preferred alternative in ACE-inhibitor dry cough, though hyperkalemia and fetal renal toxicity (pregnancy boxed warning) still apply.',
      },
    ],
  },


  renin_aliskiren: {
    templateId: 'renin_aliskiren',
    pdbId: '2V0Z',
    ligandCode: 'C41',
    ligandChain: 'C',
    ligandMode: 'het',
    crystallizedLigandName: 'Aliskiren',
    exactDrugIds: ['aliskiren'],
    targetName: 'Human Renin Aspartyl Protease (REN)',
    geneSymbol: 'REN',
    pocketMechanismSummary:
      'Spans the S3-sp through S2\' subsites of human renin and hydrogen-bonds directly to the catalytic Asp32/Asp215 dyad via a central hydroxyethylene transition-state isostere, blocking the rate-limiting conversion of angiotensinogen to angiotensin I.',
    bindingSites: [
      {
        id: 'renin_asp_dyad',
        siteName: 'Asp32 / Asp215 Catalytic Aspartyl Protease Dyad',
        drugMoiety: 'Central Sec-Alcohol & Primary Amine Transition-State Mimic',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 32, chain: 'C', label: 'Asp32 (Catalytic Dyad)' },
          { resn: 'ASP', resi: 215, chain: 'C', label: 'Asp215 (Catalytic Dyad)' },
        ],
        reactionSummary:
          'Non-cleavable hydroxyethylene-amine core forms tight bidentate hydrogen bonds and salt bridges across both catalytic aspartates.',
        clinicalRelevance:
          'Suppresses plasma renin activity (PRA) upstream of ACE and AT1R—unlike ACEIs/ARBs which reflexively elevate PRA.',
      },
      {
        id: 'renin_s3sp_subpocket',
        siteName: 'Tyr14 / Ala115 Deep S3sp Methoxypropoxy Sub-Pocket',
        drugMoiety: '3-Methoxypropoxy-Phenyl Non-Peptide Side Chain',
        interactionType: 'hydrophobic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TYR', resi: 14, chain: 'C', label: 'Tyr14 (S3sp Sub-Pocket Entrance)' },
          { resn: 'ALA', resi: 115, chain: 'C', label: 'Ala115 (Deep S3sp Wall)' },
        ],
        reactionSummary:
          'Alkoxy-aryl tail reaches into the narrow non-substrate S3sp sub-pocket unique to human renin, enabling non-peptide potency.',
        clinicalRelevance:
          'Contraindicated in pregnancy and must not be combined with ACE inhibitors or ARBs in patients with diabetes due to hyperkalemia, hypotension, and acute kidney injury.',
      },
    ],
  },


  beta1_adrenergic: {
    templateId: 'beta1_adrenergic',
    pdbId: '7JJO',
    ligandCode: '5FW',
    ligandChain: 'R',
    ligandMode: 'het',
    crystallizedLigandName: 'Catecholamine / Aryloxypropanolamine in Beta-1R',
    exactDrugIds: [],
    targetName: 'Cardiac Beta-1 Adrenergic Receptor (ADRB1)',
    geneSymbol: 'ADRB1',
    pocketMechanismSummary:
      'Occupies the orthosteric catecholamine pocket of cardiac Gs-coupled beta-1 adrenergic receptors via Asp138/Asn352 aryloxypropanolamine anchoring—either blocking sympathetic chronotropy/inotropy & renin release (beta-blockers) or acutely stimulating contractility (dobutamine).',
    bindingSites: [
      {
        id: 'b1_asp138_ethanolamine',
        siteName: 'Asp138 / Asn352 Ethanolamine Chiral Salt Bridge',
        drugMoiety: '(S)-Beta-Hydroxyl & Protonated Isopropyl/tert-Butyl Amine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 138, chain: 'R', label: 'Asp138 (TM3 Ionic Anchor)' },
          { resn: 'ASN', resi: 352, chain: 'R', label: 'Asn352 (TM7 Chiral Beta-OH H-Bond)' },
        ],
        reactionSummary:
          'Protonated secondary amine and chiral beta-OH form a coupled salt bridge and H-bond with Asp138 and Asn352.',
        clinicalRelevance:
          'Mortality-reducing cornerstone in HFrEF (metoprolol succinate, carvedilol, bisoprolol) and post-MI; esmolol’s para-ester is rapidly hydrolyzed by RBC esterases (t1/2 ~9 min) for ultra-short IV titration.',
      },
      {
        id: 'b1_ser228_para_selectivity',
        siteName: 'Ser228 / Phe315 Para-Substituent Selectivity Pocket (TM5)',
        drugMoiety: 'Para-Substituted Phenoxy Ring (vs. Unsubstituted Naphthyl/Carbazole)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'SER', resi: 228, chain: 'R', label: 'Ser228 (TM5 Polar Pocket)' },
          { resn: 'PHE', resi: 315, chain: 'R', label: 'Phe315 (TM6 Aromatic Wall)' },
        ],
        reactionSummary:
          'Extended para-substituents (metoprolol, atenolol, bisoprolol, nebivolol) fit the beta-1 extracellular cleft while sterically disfavoring bronchial beta-2 receptors.',
        clinicalRelevance:
          'Cardioselective ("BEAM") beta-1 blockers reduce bronchospasm risk in COPD/asthma compared with nonselective propranolol, nadolol, timolol, sotalol, or alpha-1/beta carvedilol.',
      },
    ],
  },


  beta2_adrenergic: {
    templateId: 'beta2_adrenergic',
    pdbId: '2RH1',
    ligandCode: 'CAU',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Carazolol in Beta-2 Adrenergic Pocket',
    exactDrugIds: [],
    targetName: 'Bronchial Beta-2 Adrenergic Receptor (ADRB2)',
    geneSymbol: 'ADRB2',
    pocketMechanismSummary:
      'Engages airway smooth-muscle Gs-coupled beta-2 adrenergic receptors via Asp113 amine anchoring and TM5 Ser203/Ser207 hydrogen bonding to stimulate adenylyl cyclase / cAMP bronchodilation.',
    bindingSites: [
      {
        id: 'b2_ser203_headgroup',
        siteName: 'Ser203 / Ser207 TM5 Saligenin / Catechol Agonist Trigger',
        drugMoiety: 'Saligenin / Formanilide / Hydroxyquinolinone Headgroup',
        interactionType: 'hydrogen-bond',
        colorAccent: '#10b981',
        residues: [
          { resn: 'SER', resi: 203, chain: 'A', label: 'Ser203 (TM5 Agonist H-Bond)' },
          { resn: 'SER', resi: 207, chain: 'A', label: 'Ser207 (TM5 Agonist H-Bond)' },
        ],
        reactionSummary:
          'Dual hydrogen bonds pull TM5 inward by ~2 Å, triggering outward TM6 rotation and Gs/cAMP smooth-muscle relaxation.',
        clinicalRelevance:
          'Replacing isoproterenol’s catechol with a meta-hydroxymethyl saligenin (albuterol, salmeterol, vilanterol) prevents COMT methylation and extends bronchodilator duration.',
      },
      {
        id: 'b2_asp113_exosite',
        siteName: 'Asp113 Amine Anchor & Lipophilic Exosite Tail',
        drugMoiety: 'Bulky N-tert-Butyl (SABA) or Long Lipophilic Arylalkyl Tail (LABA)',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ASP', resi: 113, chain: 'A', label: 'Asp113 (TM3 Amine Salt Bridge)' },
          { resn: 'ASN', resi: 312, chain: 'A', label: 'Asn312 (TM7 Beta-OH Anchor)' },
        ],
        reactionSummary:
          'Bulky N-substituents confer beta-2 selectivity over cardiac beta-1, while long lipophilic tails (salmeterol, vilanterol, olodaterol, indacaterol) anchor in membrane/exosite microdomains.',
        clinicalRelevance:
          'LABAs last 12–24 hours for maintenance therapy; in asthma, LABAs must always be paired with an inhaled corticosteroid (ICS) to prevent severe asthma-related mortality.',
      },
    ],
  },


  cav1_ccb: {
    templateId: 'cav1_ccb',
    pdbId: '6JPA',
    ligandCode: '9Z9',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Dihydropyridine (Nifedipine/Amlodipine-Class) in Domain III/IV Fenestration',
    exactDrugIds: [],
    targetName: 'L-Type Voltage-Gated Calcium Channel (Cav1.2 / Cav1.1)',
    geneSymbol: 'CACNA1S',
    pocketMechanismSummary:
      'Binds either the Domain III–IV lipid-facing transmembrane fenestration (vascular-selective dihydropyridines) or the central intracellular pore cavity (cardio-active verapamil/diltiazem) of L-type Ca2+ channels to reduce smooth-muscle vasomotor tone or AV nodal conduction.',
    bindingSites: [
      {
        id: 'cav_nh_hbond',
        siteName: 'Tyr1365 / Ser1011 Dihydropyridine N1-H Fenestration Anchor',
        drugMoiety: '1,4-Dihydropyridine N1-H & C3/C5 Ester Carbonyls (or Pore Amine)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TYR', resi: 1365, chain: 'A', label: 'Tyr1365 (DIV-S6 H-Bond)' },
          { resn: 'SER', resi: 1011, chain: 'A', label: 'Ser1011 (DIII-P Fenestration)' },
        ],
        reactionSummary:
          'The 1,4-DHP ring N1-H hydrogen-bonds across the DIII/DIV fenestration, allosterically stabilizing the inactivated channel state favored in depolarized vascular smooth muscle.',
        clinicalRelevance:
          'CYP3A4 aromatization of the 1,4-DHP ring into a planar pyridine destroys this N1-H geometry and completely abolishes activity; clevidipine’s butyryloxymethyl ester allows ultra-rapid blood-esterase clearance.',
      },
      {
        id: 'cav_ortho_phenyl',
        siteName: 'Met1057 / Phe1013 Orthogonal C4-Aryl Clamp',
        drugMoiety: 'Ortho/Meta-Substituted C4-Phenyl (or Phenylalkylamine/Benzothiazepine)',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'PHE', resi: 1013, chain: 'A', label: 'Phe1013 (DIII Fenestration Gate)' },
          { resn: 'MET', resi: 1057, chain: 'A', label: 'Met1057 (DIII-S6 Hydrophobic Wall)' },
        ],
        reactionSummary:
          'Ortho-chloro/nitro substitution forces the C4-phenyl ring perpendicular ("boat-bow") to the DHP plane, locking it into the hydrophobic cleft.',
        clinicalRelevance:
          'DHPs (amlodipine, nifedipine, isradipine) cause arteriolar vasodilation and peripheral edema; non-DHPs (verapamil, diltiazem) enter the open central pore in firing SA/AV nodal cells for rate/angina control (avoid in HFrEF).',
      },
    ],
  },


  ca2_sulfonamide: {
    templateId: 'ca2_sulfonamide',
    pdbId: '3HS4',
    ligandCode: 'AZM',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Acetazolamide + Catalytic Zn2+',
    exactDrugIds: ['acetazolamide'],
    targetName: 'Carbonic Anhydrase II (CA-II / CA2)',
    geneSymbol: 'CA2',
    pocketMechanismSummary:
      'Coordinates the active-site tetrahedral Zn2+ ion of proximal-tubule/ciliary/neuronal carbonic anhydrase via a deprotonated primary sulfonamide (-SO2NH-) anion, halting CO2 + H2O <-> HCO3- + H+ interconversion.',
    bindingSites: [
      {
        id: 'ca2_zn_sulfonamide',
        siteName: 'His94 / His96 / His119 Catalytic Zn2+ Sulfonamide Bond',
        drugMoiety: 'Unsubstituted Primary Sulfonamide / Sulfamate Anion (-SO2NH-)',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'HIS', resi: 94, chain: 'A', label: 'His94 (Zn2+ Triad)' },
          { resn: 'HIS', resi: 96, chain: 'A', label: 'His96 (Zn2+ Triad)' },
          { resn: 'HIS', resi: 119, chain: 'A', label: 'His119 (Zn2+ Triad)' },
        ],
        reactionSummary:
          'Deprotonated sulfonamide nitrogen directly coordinates catalytic Zn2+ as its fourth tetrahedral ligand, displacing the nucleophilic hydroxide ion.',
        clinicalRelevance:
          'N-substitution on the primary -SO2NH2 group completely abolishes carbonic anhydrase inhibition; causes urinary HCO3- wasting (normal-anion-gap metabolic acidosis) useful in glaucoma, altitude sickness, and metabolic alkalosis, while topiramate’s sulfamate shares weak CA inhibition (nephrolithiasis risk).',
      },
      {
        id: 'ca2_thr199_gate',
        siteName: 'Thr199 Gatekeeper Hydrogen-Bond Network',
        drugMoiety: 'Sulfonamide S=O Oxygen & Thiadiazole Ring',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [{ resn: 'THR', resi: 199, chain: 'A', label: 'Thr199 (Doorkeeper H-Bond)' }],
        reactionSummary:
          'Thr199 accepts an NH hydrogen bond and donates an OH hydrogen bond to the sulfonamide oxygen, locking orientation.',
        clinicalRelevance:
          'This primary aryl/heteroaryl-SO2NH2 motif was the historic medicinal chemistry launchpad from which thiazide and loop diuretics were discovered.',
      },
    ],
  },


  slc12_diuretic: {
    templateId: 'slc12_diuretic',
    pdbId: '7SMP',
    ligandCode: '82U',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Bumetanide in Extracellular Cl- Co-Transport Cavity',
    exactDrugIds: ['bumetanide'],
    targetName: 'Renal Electroneutral Cation-Chloride Cotransporter (NKCC2 / NCC)',
    geneSymbol: 'SLC12A2',
    pocketMechanismSummary:
      'Enters the luminal ion-translocation pathway of thick-ascending-limb NKCC2 (loop diuretics) or distal-convoluted-tubule NCC (thiazide/thiazide-like diuretics), competing at the Cl- site to block NaCl reabsorption.',
    bindingSites: [
      {
        id: 'nkcc_cl_site',
        siteName: 'Tyr383 / Ile493 Chloride-Site Carboxylate & Sulfonamide Cleft',
        drugMoiety: 'Anionic Carboxylate / Sulfonylurea & Sulfamoyl Group (-SO2NH2)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TYR', resi: 383, chain: 'A', label: 'Tyr383 (Ion-Pathway Polar Anchor)' },
          { resn: 'ILE', resi: 493, chain: 'A', label: 'Ile493 (TM6 Pore Wall)' },
        ],
        reactionSummary:
          'Anionic acid/sulfonamide headgroup occupies the Cl- binding pocket via OAT1/OAT3 tubular secretion into the nephron lumen.',
        clinicalRelevance:
          'Loop diuretics (furosemide, bumetanide, torsemide; plus non-sulfonamide Michael-acceptor ethacrynic acid for severe sulfa allergy) waste Ca2+, whereas NCC thiazides (HCTZ, chlorthalidone, metolazone) enhance Ca2+ reabsorption.',
      },
      {
        id: 'nkcc_vestibule_aryl',
        siteName: 'Met382 / Phe590 Lipophilic Phenoxy/Furfuryl Pocket',
        drugMoiety: 'Phenoxy (Bumetanide), Furfuryl (Furosemide), or Benzothiadiazine Core',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'MET', resi: 382, chain: 'A', label: 'Met382 (TM3 Hydrophobic Pocket)' },
          { resn: 'PHE', resi: 590, chain: 'A', label: 'Phe590 (Extracellular Gate)' },
        ],
        reactionSummary:
          '5-phenoxy substitution in bumetanide packs more tightly in the hydrophobic pocket than furosemide’s furfuryl amine, yielding ~40x higher molar potency.',
        clinicalRelevance:
          'Increased distal Na+ delivery drives collecting-duct K+ and H+ secretion (hypokalemic metabolic alkalosis), countered by ENaC blockers (triamterene, amiloride) or MR antagonists.',
      },
    ],
  },


  mr_steroid: {
    templateId: 'mr_steroid',
    pdbId: '2AA2',
    ligandCode: 'AS4',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Steroidal Ligand in Mineralocorticoid Receptor LBD',
    exactDrugIds: [],
    targetName: 'Mineralocorticoid Receptor (MR / NR3C2)',
    geneSymbol: 'NR3C2',
    pocketMechanismSummary:
      'Binds the steroid ligand-binding pocket of collecting-duct mineralocorticoid receptors via C3-ketone anchoring at Gln776/Arg817 while bulky C7-substituents destabilize Helix-12, downregulating aldosterone-driven ENaC Na+ retention, K+ wasting, and myocardial fibrosis.',
    bindingSites: [
      {
        id: 'mr_gln776_aring',
        siteName: 'Gln776 / Arg817 Steroid A-Ring 3-Ketone Anchor',
        drugMoiety: 'Delta-4-3-Ketosteroid A-Ring',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'GLN', resi: 776, chain: 'A', label: 'Gln776 (Helix-3 3-Keto H-Bond)' },
          { resn: 'ARG', resi: 817, chain: 'A', label: 'Arg817 (Helix-5 3-Keto H-Bond)' },
        ],
        reactionSummary:
          'Conserved hydrogen-bond clamp recognizes the unsaturated 3-ketone A-ring shared with endogenous aldosterone.',
        clinicalRelevance:
          'Mortality-reducing pillar in HFrEF and resistant hypertension/ascites; requires serum K+ monitoring for hyperkalemia, especially alongside ACEIs/ARBs.',
      },
      {
        id: 'mr_asn770_helix12',
        siteName: 'Asn770 / Thr945 C17-Spirolactone & C7 Antagonist Wedge',
        drugMoiety: 'C17-Spirolactone & C7-Thioacetyl (Spironolactone) / C9,11-Epoxide (Eplerenone)',
        interactionType: 'hydrophobic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASN', resi: 770, chain: 'A', label: 'Asn770 (Polar Steroid D-Ring Contact)' },
          { resn: 'THR', resi: 945, chain: 'A', label: 'Thr945 (Helix-10 Pocket Wall)' },
        ],
        reactionSummary:
          'Bulky C7 alpha-substituents sterically prevent Helix-12 from closing into its agonist AF-2 conformation.',
        clinicalRelevance:
          'Eplerenone’s 9,11-alpha-epoxide eliminates off-target androgen and progesterone receptor cross-binding—preventing the gynecomastia and mastodynia seen with spironolactone.',
      },
    ],
  },


  neprilysin_arni: {
    templateId: 'neprilysin_arni',
    pdbId: '5JMY',
    ligandCode: '6LD',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Sacubitrilat (LBQ657, Active Metabolite of Sacubitril) + Zn2+',
    exactDrugIds: ['sacubitril'],
    targetName: 'Neprilysin Neutral Endopeptidase (NEP / MME)',
    geneSymbol: 'MME',
    pocketMechanismSummary:
      'After esterase cleavage of prodrug sacubitril to sacubitrilat (LBQ657), chelates catalytic Zn2+ in neprilysin while burying its biphenyl group in S1\', preserving endogenous ANP/BNP/CNP natriuretic peptides for vasodilation and natriuresis.',
    bindingSites: [
      {
        id: 'nep_zn_succinyl',
        siteName: 'His583 / His587 / Glu646 Catalytic Zn2+ Coordination',
        drugMoiety: 'Succinyl Carboxylate Zinc-Binding Group (Released from Ethyl Ester)',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'HIS', resi: 583, chain: 'A', label: 'His583 (HEXXH Zn2+ Ligand)' },
          { resn: 'HIS', resi: 587, chain: 'A', label: 'His587 (HEXXH Zn2+ Ligand)' },
          { resn: 'GLU', resi: 584, chain: 'A', label: 'Glu584 (Catalytic Base)' },
        ],
        reactionSummary:
          'Deprotonated succinyl carboxylate coordinates active-site Zn2+, halting proteolytic cleavage of vasoactive peptides.',
        clinicalRelevance:
          'Because neprilysin also degrades bradykinin and angiotensin II, sacubitril is paired with valsartan (ARNI) and strictly requires a 36-hour washout from ACE inhibitors to prevent angioedema.',
      },
      {
        id: 'nep_s1prime_biphenyl',
        siteName: 'Phe106 / Arg717 Deep S1\' Biphenyl & C-Terminal Pocket',
        drugMoiety: 'Chiral Biphenylmethyl S1\' Group & Terminal Carboxylate',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'PHE', resi: 106, chain: 'A', label: 'Phe106 (S1\' Aromatic Pocket)' },
          { resn: 'ARG', resi: 717, chain: 'A', label: 'Arg717 (C-Terminal Salt Bridge)' },
        ],
        reactionSummary:
          'Biphenyl tail packs deeply in S1\' while Arg717 anchors the second carboxylate.',
        clinicalRelevance:
          'Elevates plasma BNP (use NT-proBNP rather than BNP to monitor heart failure status on sacubitril/valsartan).',
      },
    ],
  },


  pde3_cyclic_nucleotide: {
    templateId: 'pde3_cyclic_nucleotide',
    pdbId: '1SO2',
    ligandCode: '666',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Dihydropyridazinone PDE3 Inhibitor + Mg2+',
    exactDrugIds: [],
    targetName: 'Cyclic Nucleotide Phosphodiesterase Catalytic Pocket (PDE3 / PDE4)',
    geneSymbol: 'PDE3B',
    pocketMechanismSummary:
      'Clamps between conserved Gln988 and Phe1004 in the cyclic-nucleotide phosphodiesterase catalytic pocket adjacent to the binuclear metal center, preventing cAMP hydrolysis to boost myocardial inotropy/vasodilation (PDE3: milrinone, cilostazol) or suppress airway inflammation (PDE4: roflumilast, theophylline, dipyridamole).',
    bindingSites: [
      {
        id: 'pde3_gln_clamp',
        siteName: 'Gln988 / Phe1004 Invariant Purine-Scanner Clamp',
        drugMoiety: 'Pyridazinone / Bipyridinone / Benzamide Lactam-Aryl Core',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'GLN', resi: 988, chain: 'A', label: 'Gln988 (Invariant Purine H-Bond)' },
          { resn: 'PHE', resi: 1004, chain: 'A', label: 'Phe1004 (Hydrophobic Clamp)' },
        ],
        reactionSummary:
          'Mimics the adenine ring of cAMP via bidentate H-bonding to Gln988 while pi-stacking face-to-face against Phe1004.',
        clinicalRelevance:
          'Milrinone ("inodilator") increases cardiac cAMP independently of beta-1 receptors—preserving acute efficacy in beta-blocked decompensated HFrEF, while cilostazol inhibits platelet/vascular PDE3 in intermittent claudication (contraindicated in HF).',
      },
      {
        id: 'pde3_his_metal',
        siteName: 'His737 / Asp822 Binuclear Zn2+/Mg2+ Catalytic Pocket',
        drugMoiety: 'Nitrile / Dichloropyridyl Polar Extension',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'HIS', resi: 737, chain: 'A', label: 'His737 (Catalytic Proton Donor)' },
          { resn: 'ASP', resi: 822, chain: 'A', label: 'Asp822 (Metal Bridge)' },
        ],
        reactionSummary:
          'Polar substituent projects into the water shell of the binuclear divalent metal center, blocking cyclic phosphate cleavage.',
        clinicalRelevance:
          'Selective PDE4 inhibition by roflumilast (and dual PDE3/4 inhibition by inhaled ensifentrine) elevates leukocyte/airway cAMP to reduce severe COPD exacerbations.',
      },
    ],
  },


  nak_atpase_digoxin: {
    templateId: 'nak_atpase_digoxin',
    pdbId: '4HYT',
    ligandCode: 'OBN',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Cardiac Glycoside (Ouabain) in Extracellular E2P Vestibule',
    exactDrugIds: [],
    targetName: 'Cardiac Na+/K+-ATPase Alpha-1 Subunit (ATP1A1)',
    geneSymbol: 'ATP1A1',
    pocketMechanismSummary:
      'Wedges its U-shaped cis-trans-cis steroid nucleus and unsaturated C17-beta lactone into the extracellular E2P cation pathway of sarcolemmal Na+/K+-ATPase, raising intracellular Na+ to slow NCX Ca2+ extrusion (positive inotropy) while enhancing vagal AV-nodal tone.',
    bindingSites: [
      {
        id: 'nak_thr797_lactone',
        siteName: 'Thr797 / Asp804 C17-Beta Unsaturated Lactone & K+ Site',
        drugMoiety: 'Essential C17-Beta Unsaturated 5-Membered Butenolide Lactone',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'THR', resi: 797, chain: 'A', label: 'Thr797 (Lactone H-Bond)' },
          { resn: 'ASP', resi: 804, chain: 'A', label: 'Asp804 (K+ Competition Site)' },
        ],
        reactionSummary:
          'Unsaturated lactone carbonyl inserts directly over the extracellular K+-binding Asp804/Glu327 site, competing directly with extracellular K+.',
        clinicalRelevance:
          'Explains why loop/thiazide-induced hypokalemia dramatically precipitates digoxin toxicity (arrhythmias, xanthopsia): fewer K+ ions compete against digoxin at Asp804!',
      },
      {
        id: 'nak_gln111_glycone',
        siteName: 'Gln111 / Asn122 Extracellular Sugar-Chain Mouth',
        drugMoiety: 'C3-Beta Digitoxose Oligosaccharide & Cis-Trans-Cis Steroid Core',
        interactionType: 'hydrogen-bond',
        colorAccent: '#10b981',
        residues: [
          { resn: 'GLN', resi: 111, chain: 'A', label: 'Gln111 (TM1-2 Loop Sugar Contact)' },
          { resn: 'GLU', resi: 327, chain: 'A', label: 'Glu327 (TM4 Cation Gate)' },
        ],
        reactionSummary:
          'Cup-shaped steroid core packs against TM4–TM6 while C3 sugars stabilize residence time at the extracellular mouth.',
        clinicalRelevance:
          'Renally cleared P-gp substrate: amiodarone, verapamil, or quinidine inhibit P-gp and double serum digoxin levels; severe toxicity is reversed with digoxin immune Fab.',
      },
    ],
  },


  fxa_doac: {
    templateId: 'fxa_doac',
    pdbId: '2P16',
    ligandCode: 'GG2',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Apixaban in S1 / S4 L-Shaped Factor Xa Cleft',
    exactDrugIds: ['apixaban'],
    targetName: 'Coagulation Factor Xa Serine Protease (F10)',
    geneSymbol: 'F10',
    pocketMechanismSummary:
      'Adopts an L-shaped conformation spanning the deep S1 specificity pocket and S4 aromatic box of both free and prothrombinase-bound Factor Xa without requiring antithrombin, blocking prothrombin -> thrombin activation (or upstream VKORC1 gamma-carboxylation for warfarin).',
    bindingSites: [
      {
        id: 'fxa_s1_pocket',
        siteName: 'Asp189 / Ser195 S1 Specificity Pocket',
        drugMoiety: 'p-Methoxyphenyl (Apixaban) or 5-Chlorothiophene (Rivaroxaban)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ASP', resi: 189, chain: 'A', label: 'Asp189 (Bottom of S1 Pocket)' },
          { resn: 'SER', resi: 195, chain: 'A', label: 'Ser195 (Catalytic Triad Entrance)' },
        ],
        reactionSummary:
          'Neutral aryl/halothiophene group replaces unstable positively charged benzamidines inside S1, conferring high oral bioavailability.',
        clinicalRelevance:
          'Predictable oral anticoagulation without routine INR monitoring; reversed in life-threatening bleeding by decoy Factor Xa protein andexanet alfa.',
      },
      {
        id: 'fxa_s4_aromatic_box',
        siteName: 'Tyr99 / Phe174 / Trp215 S4 Aromatic Box',
        drugMoiety: 'Phenyl-Piperidinone / Morpholinone Lactam Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'TYR', resi: 99, chain: 'A', label: 'Tyr99 (S4 Box Wall)' },
          { resn: 'PHE', resi: 174, chain: 'A', label: 'Phe174 (S4 Box Wall)' },
          { resn: 'TRP', resi: 215, chain: 'A', label: 'Trp215 (S4 Floor)' },
        ],
        reactionSummary:
          'Cation-pi/aryl-pi stacking inside the three-walled S4 aromatic box drives sub-nanomolar Factor Xa selectivity.',
        clinicalRelevance:
          'Warfarin instead inhibits hepatic VKORC1 to deplete gamma-carboxylated Factors II, VII, IX, X (plus Proteins C & S), requiring INR monitoring and CYP2C9/vitamin K vigilance.',
      },
    ],
  },


  thrombin_dti: {
    templateId: 'thrombin_dti',
    pdbId: '1KTS',
    ligandCode: 'C24',
    ligandChain: 'B',
    ligandMode: 'het',
    crystallizedLigandName: 'Argatroban in Thrombin S1 / S2 / S3 Active Site',
    exactDrugIds: ['argatroban'],
    targetName: 'Coagulation Thrombin / Factor IIa Serine Protease (F2)',
    geneSymbol: 'F2',
    pocketMechanismSummary:
      'Directly and reversibly binds the catalytic active cleft of both soluble and fibrin-bound thrombin (Factor IIa) via an S1 Asp189 guanidine/benzamidine salt bridge, blocking fibrinogen cleavage and Factor XIII/platelet activation.',
    bindingSites: [
      {
        id: 'f2_asp189_s1',
        siteName: 'Asp189 Deep S1 Arginine/Benzamidine Salt Bridge',
        drugMoiety: 'Protonated Guanidine (Argatroban) or Benzamidine (Dabigatran)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 189, chain: 'B', label: 'Asp189 (S1 Specificity Anchor)' },
          { resn: 'GLY', resi: 219, chain: 'B', label: 'Gly219 (S1 Backbone H-Bond)' },
        ],
        reactionSummary:
          'Bidentate electrostatic salt bridge mimics the P1 arginine side chain of fibrinogen right beside catalytic Ser195.',
        clinicalRelevance:
          'Dabigatran’s highly polar benzamidine + carboxylate cannot cross gut membranes alone—requiring double prodrug masking as dabigatran etexilate (storage in desiccant container; reversed by idarucizumab).',
      },
      {
        id: 'f2_trp60d_cage',
        siteName: 'Trp60D / Trp215 S2 & S4 Hydrophobic Insertion Cage',
        drugMoiety: 'TetrahydroquinolineSulfonyl & Methylpiperidine (or Benzimidazole)',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TRP', resi: 215, chain: 'B', label: 'Trp215 (Aryl-Binding Site)' },
          { resn: 'HIS', resi: 57, chain: 'B', label: 'His57 (Catalytic Triad Wall)' },
        ],
        reactionSummary:
          'Sulfonamide/benzimidazole core tucks beneath thrombin’s 60-insertion loop without engaging PF4.',
        clinicalRelevance:
          'Hepatically cleared parenteral argatroban is a drug of choice for heparin-induced thrombocytopenia (HIT) in severe renal failure.',
      },
    ],
  },


  at3_pentasaccharide: {
    templateId: 'at3_pentasaccharide',
    pdbId: '1E03',
    ligandCode: 'E',
    ligandChain: 'E',
    ligandMode: 'carbs',
    crystallizedLigandName: 'Sulfated Heparin Pentasaccharide Sequence (Chain E)',
    exactDrugIds: ['fondaparinux'],
    targetName: 'Antithrombin III Heparin-Binding Exosite (SERPINC1)',
    geneSymbol: 'SERPINC1',
    pocketMechanismSummary:
      'Electrostatistically docks a specific 3-O-sulfated glucosamine pentasaccharide sequence onto positively charged Lys/Arg residues of Antithrombin III, inducing an allosteric reactive-center-loop expulsion that accelerates Factor Xa inactivation ~300–1,000-fold.',
    bindingSites: [
      {
        id: 'at3_lys114_3osulfate',
        siteName: 'Lys114 / Lys125 Essential 3-O-Sulfated Glucosamine Cradle',
        drugMoiety: 'Polyanionic 2-N-, 6-O-, and Critical 3-O-Sulfate Groups',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'LYS', resi: 114, chain: 'I', label: 'Lys114 (Helix-D 3-O-Sulfate Lock)' },
          { resn: 'LYS', resi: 125, chain: 'I', label: 'Lys125 (Pentasaccharide Groove)' },
        ],
        reactionSummary:
          'Dense polyanionic sulfate and carboxylate groups form cooperative salt bridges along Helix D of antithrombin, expelling the hinge of its reactive-center loop.',
        clinicalRelevance:
          'Synthetic pentasaccharide fondaparinux (5 sugars) and short LMWH chains (enoxaparin) accelerate Factor Xa inhibition selectively with minimal PF4/HIT risk; fondaparinux is contraindicated if CrCl < 30 mL/min.',
      },
      {
        id: 'at3_arg47_arg129',
        siteName: 'Arg47 / Arg129 Helix-A / Helix-D Allosteric Extension',
        drugMoiety: 'Iduronic / Glucuronic Acid Carboxylates (+ >=18-Sugar Bridge in UFH)',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 47, chain: 'I', label: 'Arg47 (Helix-A Basic Cradle)' },
          { resn: 'ARG', resi: 129, chain: 'I', label: 'Arg129 (Helix-D Extension)' },
        ],
        reactionSummary:
          'Stabilizes Helix-D elongation; only unfractionated heparin chains >=18 saccharide units long can simultaneously physically bridge antithrombin onto thrombin (IIa).',
        clinicalRelevance:
          'Protamine sulfate carries dense positive arginine charges that ionically neutralize unfractionated heparin completely (and enoxaparin partially, fondaparinux not at all).',
      },
    ],
  },


  p2y12_thienopyridine: {
    templateId: 'p2y12_thienopyridine',
    pdbId: '4NTJ',
    ligandCode: 'AZJ',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'AZD1283 Reversible P2Y12 Antagonist',
    exactDrugIds: [],
    targetName: 'Platelet P2Y12 Purinergic Receptor (P2RY12)',
    geneSymbol: 'P2RY12',
    pocketMechanismSummary:
      'Blocks ADP-stimulated Gi signaling in platelet P2Y12 receptors—either irreversibly after hepatic CYP bioactivation opens the thienopyridine ring into a reactive thiol that forms a disulfide bond with extracellular Cys97/Cys17 (clopidogrel, prasugrel, ticlopidine), or reversibly at an allosteric pocket without bioactivation (ticagrelor).',
    bindingSites: [
      {
        id: 'p2y12_cys97_thiol',
        siteName: 'Cys97 Covalent Disulfide / Polar Anchor Site',
        drugMoiety: 'Bioactivated Thiophene-Opened Sulfhydryl (-SH) / Ticagrelor Triazolopyrimidine',
        interactionType: 'covalent',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'CYS', resi: 97, chain: 'A', label: 'Cys97 (TM3 Disulfide Target)' },
          { resn: 'ASN', resi: 159, chain: 'A', label: 'Asn159 (TM4 H-Bond)' },
        ],
        reactionSummary:
          'Thienopyridine active thiol metabolites covalently cross-link extracellular cysteines to disable P2Y12 for the 7–10 day platelet lifespan, whereas ticagrelor binds reversibly.',
        clinicalRelevance:
          'Clopidogrel requires 2-step CYP2C19 activation (boxed warning: CYP2C19 poor metabolizers or omeprazole co-therapy lose efficacy); prasugrel uses esterases + 1-step CYP for faster, more consistent inhibition.',
      },
      {
        id: 'p2y12_arg256_pocket',
        siteName: 'Arg256 / Lys280 / Tyr105 Anionic & Halobenzyl Cleft',
        drugMoiety: 'Carboxylate / Sulfonylurea & 2-Chlorobenzyl / Difluorophenyl Tail',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 256, chain: 'A', label: 'Arg256 (TM6 Ionic Anchor)' },
          { resn: 'LYS', resi: 280, chain: 'A', label: 'Lys280 (TM7 Cationic Wall)' },
          { resn: 'TYR', resi: 105, chain: 'A', label: 'Tyr105 (Halobenzyl Pi-Stack)' },
        ],
        reactionSummary:
          'Electrostatic pairing with Arg256/Lys280 and halobenzyl pi-stacking lock the antagonist across the ADP-binding vestibule.',
        clinicalRelevance:
          'Dual antiplatelet therapy (DAPT = aspirin + P2Y12 inhibitor) prevents coronary stent thrombosis.',
      },
    ],
  },


  p2y12_nucleotide: {
    templateId: 'p2y12_nucleotide',
    pdbId: '4PXZ',
    ligandCode: '6AD',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: '2-Methylthio-ADP Nucleotide Analog',
    exactDrugIds: [],
    targetName: 'Platelet P2Y12 Orthosteric Nucleotide Pocket (P2RY12)',
    geneSymbol: 'P2RY12',
    pocketMechanismSummary:
      'Directly occupies the orthosteric ADP nucleotide pocket of platelet P2Y12 via stabilized halomethylene-triphosphate salt bridges without requiring oral absorption or hepatic activation, providing immediate IV on/off platelet inhibition (cangrelor).',
    bindingSites: [
      {
        id: 'p2y_nuc_arg256',
        siteName: 'Arg256 / Lys280 Stabilized Triphosphate Cradle',
        drugMoiety: 'Dichloromethylene-Bisphosphonate Bioisostere of ATP',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 256, chain: 'A', label: 'Arg256 (Phosphate Salt Bridge)' },
          { resn: 'LYS', resi: 280, chain: 'A', label: 'Lys280 (Phosphate Salt Bridge)' },
        ],
        reactionSummary:
          'Multi-ionic salt bridges mimic ATP polyphosphates while dichloromethylene substitution blocks ectonucleotidase breakdown into pro-aggregatory ADP.',
        clinicalRelevance:
          'Plasma dephosphorylation gives cangrelor an ultra-short 3–6 minute half-life—restoring normal platelet function within 60 minutes of stopping the IV infusion during PCI.',
      },
      {
        id: 'p2y_nuc_tyr105',
        siteName: 'Tyr105 / Phe106 Adenine C2-Thioether Pi-Cage',
        drugMoiety: 'N6/C2-Substituted Adenine Purine Core',
        interactionType: 'pi-stacking',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TYR', resi: 105, chain: 'A', label: 'Tyr105 (Purine Pi-Stack)' },
          { resn: 'CYS', resi: 194, chain: 'A', label: 'Cys194 (TM5 Ribose Pocket)' },
        ],
        reactionSummary:
          'Substituted purine core stacks tightly against Tyr105 while bulky N6/C2 chains prevent inward receptor activation.',
        clinicalRelevance:
          'Because cangrelor occupies P2Y12 during infusion, short-lived active thiol metabolites of clopidogrel/prasugrel cannot bind if dosed too early—administer oral thienopyridines right as cangrelor stops.',
      },
    ],
  },


  gpiibiiia_tirofiban: {
    templateId: 'gpiibiiia_tirofiban',
    pdbId: '2VDM',
    ligandCode: 'AGG',
    ligandChain: 'B',
    ligandMode: 'het',
    crystallizedLigandName: 'Tirofiban + MIDAS Mg2+ at AlphaIIb/Beta3 Interface',
    exactDrugIds: ['tirofiban'],
    targetName: 'Platelet Integrin Alpha-IIb / Beta-3 (GPIIb/IIIa)',
    geneSymbol: 'ITGB3',
    pocketMechanismSummary:
      'Mimics the Arg-Gly-Asp (RGD) sequence of fibrinogen across the alpha-IIb/beta-3 subunit cleft—pairing a basic piperidine nitrogen with alpha-IIb Asp224 and a tyrosine-carboxylate with the beta-3 MIDAS Mg2+ ion to block the final common pathway of platelet cross-linking.',
    bindingSites: [
      {
        id: 'gp_midas_mg',
        siteName: 'Ser121 / Ser123 Beta-3 MIDAS Mg2+ Carboxylate Coordination',
        drugMoiety: 'Sulfonyl-L-Tyrosine Carboxylate ("Asp" RGD Mimic)',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'SER', resi: 121, chain: 'B', label: 'Ser121 (Beta-3 MIDAS Mg2+ Site)' },
          { resn: 'SER', resi: 123, chain: 'B', label: 'Ser123 (Beta-3 MIDAS Mg2+ Site)' },
        ],
        reactionSummary:
          'Anionic carboxylate directly coordinates the Metal-Ion-Dependent Adhesion Site (MIDAS) Mg2+ in the beta-3 subunit, mimicking RGD’s aspartate.',
        clinicalRelevance:
          'Blocks platelet aggregation regardless of agonist (ADP, TXA2, thrombin, collagen), making parenteral tirofiban potent in high-risk ACS/PCI with major bleeding and thrombocytopenia monitoring.',
      },
      {
        id: 'gp_asp224_propeller',
        siteName: 'Asp224 Alpha-IIb Beta-Propeller Salt Bridge',
        drugMoiety: 'Piperidine Basic Nitrogen ("Arg" RGD Mimic, ~14 Å Spacer)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 224, chain: 'A', label: 'Asp224 (Alpha-IIb RGD Arg Pocket)' },
          { resn: 'PHE', resi: 160, chain: 'A', label: 'Phe160 (Alpha-IIb Linker Groove)' },
        ],
        reactionSummary:
          'Four-methylene flexible spacer positions the protonated piperidine nitrogen at the exact ~14 Å RGD distance to salt-bridge with alpha-IIb Asp224.',
        clinicalRelevance:
          'Non-peptide scaffold gives low immunogenicity and reversible renal/biliary clearance (reduce dose by 50% when CrCl < 60 mL/min).',
      },
    ],
  },


  gpiibiiia_eptifibatide: {
    templateId: 'gpiibiiia_eptifibatide',
    pdbId: '2VDN',
    ligandCode: 'C',
    ligandChain: 'C',
    ligandMode: 'chain',
    crystallizedLigandName: 'Eptifibatide Cyclic Heptapeptide (Chain C) + MIDAS Mg2+',
    exactDrugIds: ['eptifibatide'],
    targetName: 'Platelet Integrin Alpha-IIb / Beta-3 (GPIIb/IIIa — KGD Peptide)',
    geneSymbol: 'ITGB3',
    pocketMechanismSummary:
      'Presents a disulfide-constrained cyclic heptapeptide homoArg-Gly-Asp (KGD/hRGD) motif derived from rattlesnake barbourin across the alpha-IIb/beta-3 interface, selectively blocking fibrinogen cross-linking without cross-reacting with alpha-v/beta-3 vitronectin integrins.',
    bindingSites: [
      {
        id: 'ept_midas_asp',
        siteName: 'Ser121 / Glu220 Beta-3 MIDAS Mg2+ Aspartate Chelation',
        drugMoiety: 'Cyclic Peptide Aspartate Side-Chain Carboxylate',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'SER', resi: 121, chain: 'B', label: 'Ser121 (Beta-3 MIDAS Mg2+)' },
          { resn: 'GLU', resi: 220, chain: 'B', label: 'Glu220 (ADMIDAS/MIDAS Bridge)' },
        ],
        reactionSummary:
          'Peptide aspartate coordinates the beta-3 MIDAS Mg2+ ion while disulfide cyclization pre-organizes the turn geometry.',
        clinicalRelevance:
          'Rapid reversible off-rate restores hemostasis within 4–8 hours after stopping IV infusion; renally cleared (contraindicated in dialysis).',
      },
      {
        id: 'ept_homoarg_asp224',
        siteName: 'Asp224 Alpha-IIb Homoarginine Specificity Pocket',
        drugMoiety: 'Extended Homoarginine Guanidinium Side Chain',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [{ resn: 'ASP', resi: 224, chain: 'A', label: 'Asp224 (Alpha-IIb Basic Pocket)' }],
        reactionSummary:
          'One-carbon-longer homoarginine reaches deep into alpha-IIb Asp224 while sterically excluding shallower alpha-v integrins.',
        clinicalRelevance:
          'High integrin specificity avoids off-target endothelial detachment while powerfully preventing acute stent thrombosis.',
      },
    ],
  },


  par1_vorapaxar: {
    templateId: 'par1_vorapaxar',
    pdbId: '3VW7',
    ligandCode: 'VPX',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Vorapaxar in Covered Surface Pocket of PAR-1',
    exactDrugIds: ['vorapaxar'],
    targetName: 'Platelet Protease-Activated Receptor-1 (PAR-1 / F2R)',
    geneSymbol: 'F2R',
    pocketMechanismSummary:
      'Buries its rigid tricyclic himbacine-derived lactone into an occluded superficial transmembrane tunnel beneath ECL2 of platelet PAR-1, insurmountably blocking thrombin’s cleaved SFLLRN tethered-ligand peptide from activating platelets.',
    bindingSites: [
      {
        id: 'par1_ecl2_lid',
        siteName: 'His255 / Leu258 ECL2 Occluded Lid Hydrogen Bond',
        drugMoiety: 'Ethyl Carbamate & Fluorophenyl-Pyridine Tail',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'HIS', resi: 255, chain: 'A', label: 'His255 (ECL2 Cap)' },
          { resn: 'LEU', resi: 258, chain: 'A', label: 'Leu258 (ECL2 Backbone Clamp)' },
        ],
        reactionSummary:
          'ECL2 folds directly over vorapaxar like a closed lid, trapping the ligand with virtually zero dissociation over a platelet’s lifetime.',
        clinicalRelevance:
          'Explains vorapaxar’s functionally irreversible 3–4 week pharmacodynamic antiplatelet effect and boxed warning contraindicating use in any patient with prior stroke, TIA, or intracranial hemorrhage.',
      },
      {
        id: 'par1_tyr353_cage',
        siteName: 'Tyr183 / Tyr337 / Tyr353 Tricyclic Lactone Cage',
        drugMoiety: 'Himbacine Tricyclic Gamma-Lactone Core',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TYR', resi: 183, chain: 'A', label: 'Tyr183 (TM3 Floor)' },
          { resn: 'TYR', resi: 353, chain: 'A', label: 'Tyr353 (TM7 Wall)' },
        ],
        reactionSummary:
          'Dense tyrosine cage cradles the rigid natural-product-inspired tricyclic core without needing a protonated amine.',
        clinicalRelevance:
          'CYP3A4 substrate—avoid strong CYP3A4 inhibitors (ketoconazole, clarithromycin) or inducers (rifampin).',
      },
    ],
  },

  herg_kv11: {
    templateId: 'herg_kv11',
    pdbId: '8ZYO',
    ligandCode: 'XB7',
    ligandChain: 'D',
    ligandMode: 'het',
    crystallizedLigandName: 'Cationic Pore Blocker (XB7) in hERG Aromatic Cavity',
    exactDrugIds: [],
    targetName: 'Cardiac hERG Delayed-Rectifier K+ Channel (Kv11.1 / KCNH2)',
    geneSymbol: 'KCNH2',
    pocketMechanismSummary:
      'Enters the unusually wide inner pore cavity of cardiac Kv11.1 (hERG) channels and stacks against the four-fold Tyr652/Phe656 S6 aromatic ring, blocking rapid delayed-rectifier IKr K+ efflux to prolong phase-3 repolarization and action potential duration.',
    bindingSites: [
      {
        id: 'herg_tyr652_ring',
        siteName: 'Tyr652 / Phe656 Tetrameric S6 Aromatic Cage',
        drugMoiety: 'Iodinated Benzofuran (Amiodarone), Methanesulfonanilide (Sotalol), & Tertiary Amine',
        interactionType: 'pi-stacking',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'TYR', resi: 652, chain: 'D', label: 'Tyr652 (S6 Cation-Pi / Pi-Stack)' },
          { resn: 'PHE', resi: 656, chain: 'D', label: 'Phe656 (Lower S6 Hydrophobic Clamp)' },
        ],
        reactionSummary:
          'Absence of the Pro-X-Pro kink exposes four Tyr652 and four Phe656 side chains into the central pore, avidly trapping amphiphilic aryl-amines.',
        clinicalRelevance:
          'Therapeutically prolongs effective refractory period in Class III antiarrhythmics (amiodarone, dronedarone, sotalol), but excessive IKr block prolongs QTc and risks Torsades de Pointes (especially with sotalol in renal impairment or hypokalemia; amiodarone carries much lower Torsades risk despite multi-organ iodine/fibrosis toxicities).',
      },
      {
        id: 'herg_thr623_filter',
        siteName: 'Thr623 / Ser624 Pore-Helix Selectivity Base',
        drugMoiety: 'Sulfonamide / Carbonyl Polar Linker',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'THR', resi: 623, chain: 'D', label: 'Thr623 (Pore Helix Base)' },
          { resn: 'SER', resi: 624, chain: 'D', label: 'Ser624 (Selectivity Filter Mouth)' },
        ],
        reactionSummary:
          'Polar sulfonamide/carbonyl groups hydrogen-bond right below the K+ selectivity filter.',
        clinicalRelevance:
          'Non-iodinated dronedarone removes amiodarone’s 3,5-diiodo substituents to spare thyroid/pulmonary toxicity, though it is contraindicated in permanent AF or severe decompensated heart failure.',
      },
    ],
  },

  hiv_rt_polymerase: {
    templateId: 'hiv_rt_polymerase',
    pdbId: '1RTD',
    ligandCode: 'TTP',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Nucleoside Triphosphate + Catalytic Mg2+ in Polymerase Palm',
    exactDrugIds: [],
    targetName: 'Viral Reverse Transcriptase / Viral RNA-DNA Polymerase',
    geneSymbol: 'pol',
    pocketMechanismSummary:
      'Either competes at the catalytic Asp110/Asp185/Asp186 Mg2+ nucleotide-incorporation site lacking a 3\'-OH to cause obligate chain termination (NRTIs, acyclovir/valganciclovir, sofosbuvir) or wedges into the adjacent hydrophobic NNRTI thumb/palm pocket (efavirenz).',
    bindingSites: [
      {
        id: 'rt_ymdd_mg',
        siteName: 'Asp110 / Asp185 / Asp186 Catalytic YMDD Mg2+ Triad',
        drugMoiety: 'Bioactivated 5\'-Triphosphate (or Phosphoramidate/Phosphonate) & Sugar Analog',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'ASP', resi: 110, chain: 'A', label: 'Asp110 (Palm Catalytic Triad)' },
          { resn: 'ASP', resi: 185, chain: 'A', label: 'Asp185 (YMDD Motif)' },
          { resn: 'ASP', resi: 186, chain: 'A', label: 'Asp186 (YMDD Motif)' },
        ],
        reactionSummary:
          'Two coordinated Mg2+ ions catalyze incorporation of the drug nucleotide onto the 3\'-primer terminus; absence of a functional 3\'-OH halts further viral strand elongation.',
        clinicalRelevance:
          'Tenofovir and sofosbuvir carry built-in phosphonate/phosphoramidate groups to bypass slow first-step phosphorylation, whereas acyclovir/valacyclovir require herpesvirus thymidine kinase for selective activation in infected cells.',
      },
      {
        id: 'rt_tyr181_pocket',
        siteName: 'Tyr183 / Tyr181 Palm Base-Stacking & Allosteric NNRTI Pocket',
        drugMoiety: 'Cytosine/Adenine/Guanine/Uridine Base (or Cyclopropyl-Alkynyl Benzoxazinone)',
        interactionType: 'pi-stacking',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'TYR', resi: 183, chain: 'A', label: 'Tyr183 (YMDD Nucleotide Stack)' },
          { resn: 'TYR', resi: 181, chain: 'A', label: 'Tyr181 (NNRTI Hydrophobic Pocket)' },
        ],
        reactionSummary:
          'Nucleobase Watson-Crick pairs with template RNA/DNA, while NNRTIs (efavirenz) bind the nearby Tyr181/Lys103 pocket to allosterically distort the YMDD triad.',
        clinicalRelevance:
          'M184V mutates the YMDD motif to confer emtricitabine resistance while hyper-sensitizing HIV-1 to tenofovir; K103N confers single-step efavirenz resistance.',
      },
    ],
  },

  hiv_integrase: {
    templateId: 'hiv_integrase',
    pdbId: '3OYA',
    ligandCode: 'RLT',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Raltegravir + Two Catalytic Mg2+ Ions on Viral DNA',
    exactDrugIds: ['raltegravir'],
    targetName: 'HIV-1 Integrase Intasome Active Site (INSTI)',
    geneSymbol: 'int',
    pocketMechanismSummary:
      'Chelates the two essential divalent Mg2+ cofactors in the DDE catalytic triad of HIV integrase via a coplanar diketo-acid-like triad while displacing the reactive viral 3\'-deoxyadenosine DNA end, blocking proviral integration into host chromosomes.',
    bindingSites: [
      {
        id: 'insti_dde_mg',
        siteName: 'Asp128 / Asp185 / Glu221 Two-Metal Mg2+ Chelation Triad',
        drugMoiety: 'Coplanar Tri-Oxygen Chelating Core (Pyrimidinone Keto-Enol-Amide)',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'ASP', resi: 128, chain: 'A', label: 'Asp128 (DDE Mg2+ Triad)' },
          { resn: 'ASP', resi: 185, chain: 'A', label: 'Asp185 (DDE Mg2+ Triad)' },
          { resn: 'GLU', resi: 221, chain: 'A', label: 'Glu221 (DDE Mg2+ Triad)' },
        ],
        reactionSummary:
          'Three coplanar oxygen atoms simultaneously coordinate both catalytic Mg2+ ions at the intasome active center.',
        clinicalRelevance:
          'Critical counseling Pearl: oral Ca2+, Mg2+, Fe2+, Al3+, or Zn2+ antacids/supplements chelate this exact 3-oxygen motif in the gut and cause virologic failure if coadministered improperly!',
      },
      {
        id: 'insti_halobenzyl',
        siteName: 'Pro214 & Viral DNA 3\'-Adenosine Displacement Pocket',
        drugMoiety: 'p-Fluorobenzyl Lipophilic Tail',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [{ resn: 'PRO', resi: 214, chain: 'A', label: 'Pro214 (3\'-End Pocket)' }],
        reactionSummary:
          'Fluorobenzyl ring inserts into the pocket vacated by the displaced terminal viral 3\'-adenosine base, pi-stacking against the penultimate viral cytosine.',
        clinicalRelevance:
          'Eliminated primarily via UGT1A1 glucuronidation rather than CYP3A4, giving raltegravir a remarkably clean metabolic drug-interaction profile.',
      },
    ],
  },

  neuraminidase_flu: {
    templateId: 'neuraminidase_flu',
    pdbId: '2HU4',
    ligandCode: 'G39',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Oseltamivir Carboxylate',
    exactDrugIds: ['oseltamivir'],
    targetName: 'Influenza A/B Viral Neuraminidase (Sialidase)',
    geneSymbol: 'NA',
    pocketMechanismSummary:
      'Mimics the planar sialosyl-cation transition state of sialic acid cleavage inside influenza neuraminidase, clumping newly budded virions onto host-cell sialic acid receptors and halting viral spread across respiratory epithelium.',
    bindingSites: [
      {
        id: 'na_arg_triad',
        siteName: 'Arg118 / Arg292 / Arg371 Tri-Arginine Carboxylate Clamp',
        drugMoiety: 'Active Cyclohexene Carboxylate (Cleaved from Ethyl Ester Prodrug)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 118, chain: 'A', label: 'Arg118 (Arginine Triad)' },
          { resn: 'ARG', resi: 292, chain: 'A', label: 'Arg292 (Arginine Triad)' },
          { resn: 'ARG', resi: 371, chain: 'A', label: 'Arg371 (Arginine Triad)' },
        ],
        reactionSummary:
          'Three conserved arginines form an intense electrostatic clamp around the C1 carboxylate of oseltamivir carboxylate.',
        clinicalRelevance:
          'Administered orally as ethyl-ester prodrug oseltamivir phosphate to mask this polar carboxylate for ~80% GI absorption before hepatic carboxylesterase-1 activation.',
      },
      {
        id: 'na_glu276_pentyl',
        siteName: 'Glu119 Basic Pocket & Glu276 Induced Hydrophobic Pocket',
        drugMoiety: 'C4 Primary Amine & Bulky 3-Pentyloxy Lipophilic Side Chain',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'GLU', resi: 119, chain: 'A', label: 'Glu119 (C4-Amine Salt Bridge)' },
          { resn: 'GLU', resi: 276, chain: 'A', label: 'Glu276 (Induced Pentyloxy Pocket)' },
          { resn: 'HIS', resi: 274, chain: 'A', label: 'His274 (H274Y Resistance Gate)' },
        ],
        reactionSummary:
          'The 3-pentyloxy group forces Glu276 to rotate and form a hydrophobic pocket; the H274Y resistance mutation blocks that Glu276 rotation.',
        clinicalRelevance:
          'Initiate within 48 hours of symptom onset (or sooner in hospitalized/high-risk influenza) to shorten illness and complications.',
      },
    ],
  },

  hk_atpase_ppi: {
    templateId: 'hk_atpase_ppi',
    pdbId: '5YLU',
    ligandCode: 'HKT',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Luminal Acid-Pump Inhibitor in Gastric H+/K+-ATPase',
    exactDrugIds: [],
    targetName: 'Gastric Parietal-Cell H+/K+-ATPase Proton Pump (ATP4A)',
    geneSymbol: 'ATP4A',
    pocketMechanismSummary:
      'Accumulates selectively as a weak-base prodrug inside acidic parietal-cell secretory canaliculi (pH ~1.0), rearranges into a reactive cyclic sulfenamide, and forms an irreversible covalent disulfide bond with luminal Cys813 to shut down the final step of gastric acid secretion.',
    bindingSites: [
      {
        id: 'ppi_cys813_disulfide',
        siteName: 'Cys813 Luminal Vestibule Covalent Disulfide Target',
        drugMoiety: 'Acid-Rearranged Pyridinium Sulfenamide (from Benzimidazole Sulfoxide)',
        interactionType: 'covalent',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'CYS', resi: 813, chain: 'A', label: 'Cys813 (TM5-TM6 Luminal Target)' },
          { resn: 'ASP', resi: 137, chain: 'A', label: 'Asp137 (Luminal Entrance)' },
        ],
        reactionSummary:
          'Acid-catalyzed Smiles rearrangement converts the prodrug sulfoxide into a thiophilic sulfenamide that forms a covalent S–S bond with Cys813.',
        clinicalRelevance:
          'Give 30–60 minutes BEFORE breakfast so pumps are actively inserted into acidic canaliculi when peak plasma prodrug arrives; acid suppression lasts 24–48 h despite a ~1 h plasma half-life.',
      },
      {
        id: 'ppi_tyr799_channel',
        siteName: 'Tyr799 / Glu795 Luminal Ion-Exit Conduit',
        drugMoiety: 'Alkoxy-Pyridine & Substituted Benzimidazole Rings',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TYR', resi: 799, chain: 'A', label: 'Tyr799 (Luminal Conduit Wall)' },
          { resn: 'GLU', resi: 795, chain: 'A', label: 'Glu795 (Cation-Binding Site)' },
        ],
        reactionSummary:
          'Aromatic scaffold physically plugs the luminal K+ import conduit, locking the ATPase in its E2 state.',
        clinicalRelevance:
          'S-enantiomer esomeprazole reduces first-pass CYP2C19 clearance relative to racemic omeprazole; pantoprazole minimizes CYP2C19 inhibition in clopidogrel-treated patients.',
      },
    ],
  },

  pde5_inhibitor: {
    templateId: 'pde5_inhibitor',
    pdbId: '1UDT',
    ligandCode: 'VIA',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Sildenafil + Zn2+/Mg2+ in PDE5 Catalytic Site',
    exactDrugIds: ['sildenafil'],
    targetName: 'cGMP-Specific Phosphodiesterase Type 5 (PDE5A)',
    geneSymbol: 'PDE5A',
    pocketMechanismSummary:
      'Competitively mimics the guanine base of cGMP inside the PDE5 catalytic cleft via Gln817 bidentate hydrogen bonding and Phe820 pi-clamping, preserving NO-stimulated cGMP to relax corpus cavernosum and pulmonary arterial smooth muscle.',
    bindingSites: [
      {
        id: 'pde5_gln817_clamp',
        siteName: 'Gln817 / Phe820 Purine-Mimetic Clamp',
        drugMoiety: 'Pyrazolopyrimidinone (Sildenafil) or Beta-Carboline (Tadalafil) Core',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'GLN', resi: 817, chain: 'A', label: 'Gln817 (cGMP-Selective H-Bond Clamp)' },
          { resn: 'PHE', resi: 820, chain: 'A', label: 'Phe820 (Hydrophobic Clamp)' },
        ],
        reactionSummary:
          'Lactam NH/C=O forms bidentate H-bonds with Gln817 (whose side-chain orientation selects cGMP over cAMP) while Phe820 pi-stacks below.',
        clinicalRelevance:
          'ABSOLUTE CONTRAINDICATION with organic nitrates (nitroglycerin, isosorbide mononitrate/dinitrate): synergistic NO -> cGMP accumulation causes refractory, life-threatening hypotension!',
      },
      {
        id: 'pde5_tyr612_pocket',
        siteName: 'Tyr612 / Val782 Ethoxyphenyl-Sulfonylpiperazine Pocket',
        drugMoiety: '2-Ethoxyphenyl & Methylpiperazine-Sulfonyl Tail',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'TYR', resi: 612, chain: 'A', label: 'Tyr612 (M-Loop Pocket)' },
          { resn: 'VAL', resi: 782, chain: 'A', label: 'Val782 (Hydrophobic Wall)' },
        ],
        reactionSummary:
          'Bulky alkoxyaryl substituent fills the H-pocket adjacent to the Zn2+/Mg2+ binuclear center.',
        clinicalRelevance:
          'Sildenafil’s ~10% cross-inhibition of retinal PDE6 causes transient blue-tinted vision (cyanopsia); tadalafil’s rigid scaffold spares PDE6 and extends half-life to ~17.5 hours (also approved for BPH + ED and PAH).',
      },
    ],
  },

  muscarinic_antagonist: {
    templateId: 'muscarinic_antagonist',
    pdbId: '5CXV',
    ligandCode: '0HK',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Tiotropium beneath Closed Tyrosine Lid',
    exactDrugIds: ['tiotropium'],
    targetName: 'Muscarinic Acetylcholine Receptor (M3 / M1 — CHRM3 / CHRM1)',
    geneSymbol: 'CHRM1',
    pocketMechanismSummary:
      'Binds the orthosteric acetylcholine pocket beneath a closed three-tyrosine aromatic lid via Asp105 cationic amine/quaternary-ammonium pairing, blocking Gq-coupled smooth-muscle contraction in airways (LAMAs/SAMAs), bladder detrusor, GI tract, or striatal cholinergic interneurons.',
    bindingSites: [
      {
        id: 'musc_asp105_tyr_lid',
        siteName: 'Asp105 Cationic Cage & Tyr106/Tyr381/Tyr404 Aromatic Lid',
        drugMoiety: 'Quaternary Ammonium (Inhaled LAMA/SAMA) or Tertiary Amine (Oral)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 105, chain: 'A', label: 'Asp105 (Orthosteric Ammonium Anchor)' },
          { resn: 'TYR', resi: 106, chain: 'A', label: 'Tyr106 (Tyrosine Lid)' },
          { resn: 'TYR', resi: 404, chain: 'A', label: 'Tyr404 (Tyrosine Lid)' },
        ],
        reactionSummary:
          'Asp105 and three surrounding tyrosines form an enclosed cation-pi vault that slows dissociation—giving tiotropium/umeclidinium >24-hour M3 residence.',
        clinicalRelevance:
          'Permanent positive charge on quaternary nitrogens (ipratropium, tiotropium, umeclidinium, aclidinium, glycopyrrolate) prevents GI/blood-brain barrier absorption—avoiding central anticholinergic delirium!',
      },
      {
        id: 'musc_asn382_ester',
        siteName: 'Asn382 / Trp157 Twin-Aryl Hydroxyl-Ester Pocket',
        drugMoiety: 'alpha-Hydroxy-Dithienyl / Diphenyl Glycolate or Isoquinoline Core',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ASN', resi: 382, chain: 'A', label: 'Asn382 (TM6 Dual H-Bond Lock)' },
          { resn: 'TRP', resi: 157, chain: 'A', label: 'Trp157 (TM4 Hydrophobic Pocket)' },
        ],
        reactionSummary:
          'Bidentate H-bonding between Asn382 and the hydroxyl + ester carbonyl locks TM6 in its inactive inverse-agonist state.',
        clinicalRelevance:
          'Tertiary amines cross membranes for overactive bladder (oxybutynin, solifenacin, M3-selective darifenacin), GI spasm (dicyclomine), or drug-induced EPS (benztropine, trihexyphenidyl), but carry Beers Criteria fall/delirium/urinary-retention warnings in older adults.',
      },
    ],
  },

  gr_corticosteroid: {
    templateId: 'gr_corticosteroid',
    pdbId: '1M2Z',
    ligandCode: 'DEX',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Dexamethasone in Glucocorticoid Receptor LBD',
    exactDrugIds: ['dexamethasone'],
    targetName: 'Glucocorticoid Receptor Ligand-Binding Domain (GR / NR3C1)',
    geneSymbol: 'NR3C1',
    pocketMechanismSummary:
      'Binds cytosolic glucocorticoid receptors via A-ring 3-ketone, 11-beta-hydroxyl, and C17/C20 substituent hydrogen-bonding networks, inducing nuclear translocation that transrepresses NF-kappaB / AP-1 pro-inflammatory cytokines and upregulates annexin-1.',
    bindingSites: [
      {
        id: 'gr_asn564_11beta',
        siteName: 'Asn564 Essential 11-Beta-Hydroxyl Activation Switch',
        drugMoiety: 'Essential C11-Beta Hydroxyl & C9-Alpha Fluoro Substituent',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASN', resi: 564, chain: 'A', label: 'Asn564 (Helix-3 11-Beta-OH H-Bond)' },
          { resn: 'GLN', resi: 570, chain: 'A', label: 'Gln570 (A-Ring 3-Keto Anchor)' },
        ],
        reactionSummary:
          'The 11-beta-OH forms an indispensable H-bond with Asn564; C9-alpha fluorination (dexamethasone, betamethasone, fluticasone, triamcinolone, clobetasol) inductively increases 11-beta-OH acidity and H-bond strength.',
        clinicalRelevance:
          '11-keto prodrugs prednisone and cortisone are biologically INACTIVE at Asn564 until hepatic 11-beta-HSD1 reduces C11=O into active 11-beta-OH prednisolone and hydrocortisone!',
      },
      {
        id: 'gr_arg611_17alpha',
        siteName: 'Arg611 / Gln642 / Thr739 C17-Alpha Lipophilic Pocket',
        drugMoiety: 'C17-Alpha Propionate/Furoate/Acetonide & C16 Methyl/Hydroxyl',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'ARG', resi: 611, chain: 'A', label: 'Arg611 (A-Ring Clamp)' },
          { resn: 'GLN', resi: 642, chain: 'A', label: 'Gln642 (C17-OH / Ester Pocket)' },
          { resn: 'THR', resi: 739, chain: 'A', label: 'Thr739 (C20-Carbonyl H-Bond)' },
        ],
        reactionSummary:
          'C16 substitution abolishes mineralocorticoid Na+-retaining cross-activity, while bulky C17-alpha furoate/propionate esters fill a lipophilic side pocket.',
        clinicalRelevance:
          'Inhaled corticosteroids (fluticasone, budesonide, mometasone, ciclesonide) combine ultra-high C17 lipophilicity with ~99% hepatic first-pass inactivation to minimize systemic HPA suppression (rinse mouth after inhalation to prevent thrush).',
      },
    ],
  },

  er_estrogen: {
    templateId: 'er_estrogen',
    pdbId: '1ERE',
    ligandCode: 'EST',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: '17-Beta-Estradiol in Estrogen Receptor Alpha LBD',
    exactDrugIds: ['estradiol'],
    targetName: 'Estrogen Receptor Alpha Ligand-Binding Domain (ER-alpha / ESR1)',
    geneSymbol: 'ESR1',
    pocketMechanismSummary:
      'Anchors its phenolic A-ring at Glu353/Arg394 and D-ring 17-beta-OH at His524 inside ER-alpha—either folding Helix-12 closed to drive estrogenic transcription (estradiol, ethinyl estradiol, conjugated estrogens) or projecting a basic side chain against Asp351 to displace Helix-12 in breast tissue (SERM raloxifene).',
    bindingSites: [
      {
        id: 'er_glu353_phenol',
        siteName: 'Glu353 / Arg394 Phenolic C3-OH Pincer',
        drugMoiety: 'Aromatic Steroid/Benzothiophene Phenolic C3-Hydroxyl',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'GLU', resi: 353, chain: 'A', label: 'Glu353 (Phenolic OH Acceptor)' },
          { resn: 'ARG', resi: 394, chain: 'A', label: 'Arg394 (Water-Bridged Phenol Clamp)' },
          { resn: 'PHE', resi: 404, chain: 'A', label: 'Phe404 (A-Ring Pi-Stack)' },
        ],
        reactionSummary:
          'Planar aromatic A-ring pi-stacks with Phe404 while its phenolic OH forms a tight hydrogen-bond pincer with Glu353 and Arg394.',
        clinicalRelevance:
          'Adding a C17-alpha ethinyl group (ethinyl estradiol in combined oral contraceptives) sterically blocks hepatic 17-beta-HSD oxidation, raising oral potency >10-fold.',
      },
      {
        id: 'er_his524_asp351',
        siteName: 'His524 D-Ring Anchor & Asp351 Helix-12 SERM Switch',
        drugMoiety: '17-Beta-Hydroxyl (Agonists) vs. Piperidinylethoxy Side Chain (Raloxifene)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'HIS', resi: 524, chain: 'A', label: 'His524 (17-Beta-OH Agonist Lock)' },
          { resn: 'ASP', resi: 351, chain: 'A', label: 'Asp351 (SERM Helix-12 Switch)' },
        ],
        reactionSummary:
          'Estradiol’s 17-beta-OH pulls His524 inward so Helix-12 caps the pocket; raloxifene’s piperidine salt-bridges with Asp351 to push Helix-12 into an antagonist groove in breast/endometrium while preserving bone AF-1 agonism.',
        clinicalRelevance:
          'Raloxifene treats postmenopausal osteoporosis while reducing invasive ER+ breast cancer risk; both estrogens and SERMs increase venous thromboembolism (VTE) risk.',
      },
    ],
  },

  pr_progestin: {
    templateId: 'pr_progestin',
    pdbId: '1A28',
    ligandCode: 'STR',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Progesterone in Progesterone Receptor LBD',
    exactDrugIds: ['progesterone'],
    targetName: 'Progesterone Receptor Ligand-Binding Domain (PR / PGR)',
    geneSymbol: 'PGR',
    pocketMechanismSummary:
      'Binds nuclear progesterone receptors via Gln725/Arg766 3-ketone recognition and hydrophobic C17/C20 packing to suppress hypothalamic-pituitary LH surges, thicken cervical mucus, and oppose estrogen-driven endometrial proliferation.',
    bindingSites: [
      {
        id: 'pr_gln725_aring',
        siteName: 'Gln725 / Arg766 / Phe778 Steroid A-Ring 3-Ketone Clamp',
        drugMoiety: 'Delta-4-3-Ketosteroid A-Ring',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'GLN', resi: 725, chain: 'A', label: 'Gln725 (3-Keto H-Bond)' },
          { resn: 'ARG', resi: 766, chain: 'A', label: 'Arg766 (3-Keto H-Bond)' },
        ],
        reactionSummary:
          'Conserved polar clamp positions the steroid scaffold inside the LBD.',
        clinicalRelevance:
          'Adding a progestin (progesterone, medroxyprogesterone, norethindrone, levonorgestrel) is mandatory during systemic estrogen therapy in any patient with an intact uterus to prevent endometrial hyperplasia/carcinoma.',
      },
      {
        id: 'pr_cys891_dring',
        siteName: 'Cys891 / Thr894 C17/C20 Hydrophobic D-Ring Subpocket',
        drugMoiety: 'C20-Ketone / 17-Alpha-Acetoxy (MPA) / 17-Alpha-Ethinyl (19-Nortestosterones)',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'CYS', resi: 891, chain: 'A', label: 'Cys891 (Helix-10 Polar Contact)' },
          { resn: 'THR', resi: 894, chain: 'A', label: 'Thr894 (D-Ring Pocket)' },
        ],
        reactionSummary:
          '17-alpha-acetoxy (medroxyprogesterone) or 17-alpha-ethinyl (levonorgestrel, norethindrone) shields the D-ring from rapid hepatic first-pass metabolism.',
        clinicalRelevance:
          'Depot medroxyprogesterone acetate carries a boxed warning for reversible bone mineral density loss with prolonged (>2 year) use.',
      },
    ],
  },

  ar_androgen: {
    templateId: 'ar_androgen',
    pdbId: '1E3G',
    ligandCode: 'R18',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Androgen Agonist (Metribolone) in Androgen Receptor LBD',
    exactDrugIds: [],
    targetName: 'Androgen Receptor / Steroid 5-Alpha-Reductase Pathway (AR / SRD5A2)',
    geneSymbol: 'AR',
    pocketMechanismSummary:
      'Either directly activates nuclear androgen receptors via Gln711/Arg752 3-ketone and Asn705/Thr877 17-beta-OH hydrogen bonds (testosterone), or acts as a 4-azasteroid transition-state inhibitor of 5-alpha-reductase to prevent conversion of testosterone into higher-affinity dihydrotestosterone in prostate tissue (finasteride, dutasteride).',
    bindingSites: [
      {
        id: 'ar_asn705_17oh',
        siteName: 'Asn705 / Thr877 Essential 17-Beta-Hydroxyl Lock',
        drugMoiety: '17-Beta-Hydroxyl (Testosterone/DHT) or C17-t-Butyl/Aryl Carboxamide (5-ARIs)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASN', resi: 705, chain: 'A', label: 'Asn705 (17-Beta-OH H-Bond)' },
          { resn: 'THR', resi: 877, chain: 'A', label: 'Thr877 (Helix-11 Agonist Switch)' },
        ],
        reactionSummary:
          'Dual H-bonds to the 17-beta-OH stabilize Helix-12 closure; 5alpha-reduction of testosterone’s A-ring to DHT doubles residence time in this pocket.',
        clinicalRelevance:
          'Finasteride (Type II) and dutasteride (Type I & II) block prostatic DHT formation to shrink BPH prostate volume over 3–6 months and lower PSA by ~50% (Teratogen: pregnant individuals must not handle crushed tablets!).',
      },
      {
        id: 'ar_gln711_aring',
        siteName: 'Gln711 / Arg752 Steroid A-Ring 3-Keto / 4-Azasteroid Lactam Pocket',
        drugMoiety: '3-Ketosteroid (Testosterone) or 4-Aza-3-Oxo Lactam Mimic',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'GLN', resi: 711, chain: 'A', label: 'Gln711 (A-Ring 3-Keto H-Bond)' },
          { resn: 'ARG', resi: 752, chain: 'A', label: 'Arg752 (A-Ring Clamp)' },
        ],
        reactionSummary:
          'Recognizes the planar/saturated A-ring 3-carbonyl; in 5-alpha-reductase, the 4-aza lactam of finasteride/dutasteride forms a covalent NADP-dihydrofinasteride adduct.',
        clinicalRelevance:
          'Testosterone replacement requires monitoring hematocrit (erythrocytosis), PSA, lipids, and misuse/cardiovascular risk.',
      },
    ],
  },

  otr_oxytocin: {
    templateId: 'otr_oxytocin',
    pdbId: '7RYC',
    ligandCode: 'L',
    ligandChain: 'L',
    ligandMode: 'chain',
    crystallizedLigandName: 'Oxytocin Cyclic Nonapeptide (Chain L) + Mg2+ in Active OTR',
    exactDrugIds: ['oxytocin'],
    targetName: 'Myometrial Oxytocin Receptor (OTR / OXTR)',
    geneSymbol: 'OXTR',
    pocketMechanismSummary:
      'Docks its Cys1–Cys6 disulfide-bridged cyclic nonapeptide ring alongside a co-binding extracellular Mg2+ ion in Gq-coupled myometrial oxytocin receptors, stimulating IP3/Ca2+-mediated rhythmic uterine contractions and postpartum hemostasis.',
    bindingSites: [
      {
        id: 'otr_tyr2_core',
        siteName: 'Gln171 / Phe291 Deep Tyr2–Ile3 Cyclic Disulfide Ring Pocket',
        drugMoiety: 'Cys1–Cys6 Disulfide Macrocycle & Tyr2/Ile3 Side Chains',
        interactionType: 'pi-stacking',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'GLN', resi: 171, chain: 'O', label: 'Gln171 (TM4 Polar Anchor)' },
          { resn: 'PHE', resi: 291, chain: 'O', label: 'Phe291 (TM6 Toggle Switch)' },
        ],
        reactionSummary:
          'Tyr2 plunges to the bottom of the orthosteric pocket while Ile3 fits the hydrophobic OTR selectivity subpocket (distinguishing oxytocin from Phe3-containing vasopressin).',
        clinicalRelevance:
          'High-alert IV infusion titrated for labor induction/augmentation and active management of postpartum uterine atony; overstimulation risks uterine tachysystole and water intoxication.',
      },
      {
        id: 'otr_mg_allosteric',
        siteName: 'Glu42 / Asp100 Extracellular Mg2+ Co-Binding Coordination Site',
        drugMoiety: 'Peptide Backbone Carbonyls & C-Terminal Pro7–Leu8–Gly9-NH2 Tail',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'GLU', resi: 42, chain: 'O', label: 'Glu42 (TM1 Mg2+ Allosteric Enhancer)' },
          { resn: 'ASP', resi: 100, chain: 'O', label: 'Asp100 (TM2 Polar Coordination)' },
        ],
        reactionSummary:
          'Physiologic Mg2+ bridges Glu42/Asp100 directly to the oxytocin peptide backbone, acting as a positive allosteric cofactor required for high-potency OTR activation.',
        clinicalRelevance:
          'Because proteases rapidly degrade the linear/disulfide peptide in the GI tract, oxytocin must be administered parenterally (IV/IM).',
      },
    ],
  },

  v2r_vasopressin: {
    templateId: 'v2r_vasopressin',
    pdbId: '7BB7',
    ligandCode: 'H',
    ligandChain: 'H',
    ligandMode: 'chain',
    crystallizedLigandName: 'Vasopressin Cyclic Nonapeptide (Chain H) in Active V2R',
    exactDrugIds: [],
    targetName: 'Vasopressin Receptor (Renal V2R / Vascular V1aR — AVPR2)',
    geneSymbol: 'AVPR2',
    pocketMechanismSummary:
      'Engages vasopressin GPCR transmembrane pockets—either as a cyclic peptide agonist driving Gs-mediated aquaporin-2 water reabsorption & endothelial vWF release (desmopressin) / V1a splanchnic vasoconstriction (terlipressin), or as a non-peptide V2 antagonist promoting electrolyte-free aquaresis (tolvaptan).',
    bindingSites: [
      {
        id: 'v2_gln174_ring',
        siteName: 'Gln96 / Gln174 / Phe287 Deep Cyclic Peptide / Benzazepine Pocket',
        drugMoiety: 'Tyr2–Phe3 Disulfide Macrocycle (or Tolvaptan Benzazepine Core)',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'GLN', resi: 96, chain: 'A', label: 'Gln96 (TM2 Polar Network)' },
          { resn: 'GLN', resi: 174, chain: 'A', label: 'Gln174 (TM4 H-Bond)' },
          { resn: 'PHE', resi: 287, chain: 'A', label: 'Phe287 (TM6 Toggle Switch)' },
        ],
        reactionSummary:
          'Aromatic Tyr2/Phe3 side chains activate Phe287 in agonists (desmopressin), whereas non-peptide tolvaptan wedges deeper to lock TM6 inactive.',
        clinicalRelevance:
          'Tolvaptan drives pure free-water excretion ("aquaretic") to raise serum Na+ in euvolemic/hypervolemic hyponatremia and slow ADPKD cyst growth (REMS warning for hepatotoxicity & overly rapid Na+ correction -> osmotic demyelination).',
      },
      {
        id: 'v2_asp103_arg8',
        siteName: 'Asp103 / Glu198 Extracellular D-Arg8 / L-Lys8 Selectivity Gate',
        drugMoiety: '1-Deamino & D-Arg8 Tail (Desmopressin) vs. Triglycyl-Lys8 (Terlipressin)',
        interactionType: 'ionic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'ASP', resi: 103, chain: 'A', label: 'Asp103 (ECL1/TM2 Acidic Gate)' },
          { resn: 'ARG', resi: 202, chain: 'A', label: 'Arg202 (ECL2 Lid)' },
        ],
        reactionSummary:
          'Inverting L-Arg8 to D-Arg8 and removing Cys1’s alpha-amine in desmopressin (DDAVP) selectively favors renal/endothelial V2R over pressor V1aR while resisting aminopeptidases.',
        clinicalRelevance:
          'Desmopressin treats central diabetes insipidus, nocturnal enuresis, and mild Hemophilia A / Type 1 vWD (monitor for hyponatremia); triglycyl-prodrug terlipressin targets V1a receptors in hepatorenal syndrome.',
      },
    ],
  },

  cyclophilin_cyclosporine: {
    templateId: 'cyclophilin_cyclosporine',
    pdbId: '1CWA',
    ligandCode: 'C',
    ligandChain: 'C',
    ligandMode: 'chain',
    crystallizedLigandName: 'Cyclosporine Cyclic Undecapeptide (Chain C) in Cyclophilin A',
    exactDrugIds: ['cyclosporine'],
    targetName: 'Cyclophilin A – Calcineurin Immunophilin Complex (PPIA)',
    geneSymbol: 'PPIA',
    pocketMechanismSummary:
      'Binds cytosolic Cyclophilin A via its N-methylated lipophilic cyclic undecapeptide scaffold to create a composite "molecular-glue" surface that inhibits calcineurin phosphatase, blocking NFAT dephosphorylation and IL-2 transcription in activated T lymphocytes.',
    bindingSites: [
      {
        id: 'cypa_arg55_face',
        siteName: 'Arg55 / Trp121 Cyclophilin A Peptidyl-Prolyl Groove',
        drugMoiety: 'MeBmt1–Abu2–MeVal11 Cyclophilin-Binding Face',
        interactionType: 'hydrogen-bond',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 55, chain: 'A', label: 'Arg55 (Prolyl-Isomerase Catalytic Site)' },
          { resn: 'TRP', resi: 121, chain: 'A', label: 'Trp121 (MeVal11 Carbonyl H-Bond)' },
        ],
        reactionSummary:
          'Seven N-methylated amide bonds shield polar NH groups for membrane permeability while docking tightly across Cyclophilin A’s isomerase cleft.',
        clinicalRelevance:
          'Narrow therapeutic index requiring trough monitoring in organ transplantation and severe autoimmune disease; strong CYP3A4/P-gp substrate (azole antifungals, macrolides, diltiazem, and grapefruit sharply elevate nephrotoxicity and hypertension).',
      },
      {
        id: 'cypa_phe60_glue',
        siteName: 'Phe60 / His126 Composite Calcineurin-Effector Rim',
        drugMoiety: 'Solvent-Exposed MeLeu4–MeLeu6 Calcineurin-Inhibitory Loop',
        interactionType: 'hydrophobic',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'PHE', resi: 60, chain: 'A', label: 'Phe60 (Hydrophobic Saddle)' },
          { resn: 'HIS', resi: 126, chain: 'A', label: 'His126 (Rim Clamp)' },
        ],
        reactionSummary:
          'Binding to Cyclophilin A flips cyclosporine’s opposite peptide face outward so the binary complex sterically blocks calcineurin.',
        clinicalRelevance:
          'Note that modified microemulsion (Neoral/Gengraf) and non-modified (Sandimmune) oral formulations are NOT bioequivalent.',
      },
    ],
  },

  ache_donepezil: {
    templateId: 'ache_donepezil',
    pdbId: '4EY7',
    ligandCode: 'E20',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Donepezil Spanning CAS to PAS Gorge',
    exactDrugIds: ['donepezil'],
    targetName: 'Human Acetylcholinesterase Catalytic Gorge (AChE)',
    geneSymbol: 'ACHE',
    pocketMechanismSummary:
      'Threads the entire 20-Å aromatic gorge of synaptic acetylcholinesterase from Trp86 at the catalytic anionic site up to Trp286 at the peripheral anionic site, reversibly preserving cortical acetylcholine (or blocking pathological extrasynaptic NMDA Ca2+ excitotoxicity for memantine).',
    bindingSites: [
      {
        id: 'ache_trp86_cas',
        siteName: 'Trp86 Catalytic Anionic Site (CAS) Benzylpiperidine Base',
        drugMoiety: 'Protonated N-Benzylpiperidine Ring',
        interactionType: 'pi-stacking',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'TRP', resi: 86, chain: 'A', label: 'Trp86 (Bottom CAS Cation-Pi)' },
          { resn: 'HIS', resi: 447, chain: 'A', label: 'His447 (Catalytic Triad Base)' },
        ],
        reactionSummary:
          'Cation-pi and face-to-face pi-stacking against Trp86 shield the Ser203–His447–Glu334 catalytic triad without covalently carbamylating Ser203.',
        clinicalRelevance:
          'Enhances central cholinergic transmission in mild-to-severe Alzheimer’s dementia, while vagal cholinergic tone can cause bradycardia, syncope, nausea, or vivid dreams.',
      },
      {
        id: 'ache_trp286_pas',
        siteName: 'Trp286 / Phe295 Peripheral Anionic Site (PAS) Indanone Mouth',
        drugMoiety: 'Dimethoxyindanone Carbonyl Headgroup',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TRP', resi: 286, chain: 'A', label: 'Trp286 (Gorge Entrance PAS Stack)' },
          { resn: 'PHE', resi: 295, chain: 'A', label: 'Phe295 (Backbone Carbonyl H-Bond)' },
        ],
        reactionSummary:
          'Dimethoxyindanone stacks at the mouth of the gorge (Trp286) with a backbone H-bond at Phe295, giving >1,000x selectivity for AChE over peripheral butyrylcholinesterase.',
        clinicalRelevance:
          'Memantine complements donepezil in moderate-to-severe Alzheimer’s by acting as an uncompetitive, voltage-dependent Mg2+-like open-channel blocker of NMDA glutamate receptors.',
      },
    ],
  },

  vdr_casr: {
    templateId: 'vdr_casr',
    pdbId: '1DB1',
    ligandCode: 'VDX',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: '1,25-Dihydroxyvitamin D3 in Calcium/Vitamin-D Regulatory Pocket',
    exactDrugIds: [],
    targetName: 'Calcium-Homeostasis / Vitamin-D Endocrine Regulatory Pocket (VDR / CaSR)',
    geneSymbol: 'VDR',
    pocketMechanismSummary:
      'Modulates systemic calcium/parathyroid and hematopoietic cofactor homeostasis via high-affinity endocrine receptor binding—allosterically sensitizing parathyroid CaSR to extracellular Ca2+ to suppress PTH secretion (cinacalcet) or supplying essential cobalamin/mineral cofactors.',
    bindingSites: [
      {
        id: 'vdr_polar_clamp',
        siteName: 'Tyr143 / Ser278 / Arg274 Polar Recognition Network',
        drugMoiety: 'Protonated Naphthylethylamine (Cinacalcet) / Corrin-Polar Group',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'TYR', resi: 143, chain: 'A', label: 'Tyr143 (Polar Anchor)' },
          { resn: 'ARG', resi: 274, chain: 'A', label: 'Arg274 (Electrostatic Clamp)' },
        ],
        reactionSummary:
          'Electrostatic and polar anchoring stabilizes the active endocrine receptor conformation.',
        clinicalRelevance:
          'Cinacalcet’s R-enantiomer acts as a positive allosteric calcimimetic at parathyroid CaSR to lower PTH in dialysis secondary hyperparathyroidism and parathyroid carcinoma (monitor closely for hypocalcemia and QT prolongation!).',
      },
      {
        id: 'vdr_his305_lipophilic',
        siteName: 'His305 / His397 Lipophilic Fluoromethyl-Aryl Pocket',
        drugMoiety: 'm-(Trifluoromethyl)phenyl Propyl Tail',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'HIS', resi: 305, chain: 'A', label: 'His305 (Pocket Clamp)' },
          { resn: 'HIS', resi: 397, chain: 'A', label: 'His397 (Helix-12 Stabilizer)' },
        ],
        reactionSummary:
          'Hydrophobic packing stabilizes transmembrane/nuclear signaling transitions.',
        clinicalRelevance:
          'Cinacalcet is a potent CYP2D6 inhibitor and CYP3A4 substrate; take with food to increase oral bioavailability by 50–80%.',
      },
    ],
  },

  fpps_bisphosphonate: {
    templateId: 'fpps_bisphosphonate',
    pdbId: '2F8Z',
    ligandCode: 'ZOL',
    ligandChain: 'F',
    ligandMode: 'het',
    crystallizedLigandName: 'Zoledronic Acid + Three Mg2+ Ions in FPPS',
    exactDrugIds: ['zoledronicacid'],
    targetName: 'Osteoclast Farnesyl Pyrophosphate Synthase (FPPS / FDPS)',
    geneSymbol: 'FDPS',
    pocketMechanismSummary:
      'Avidly binds bone hydroxyapatite mineral via its P–C–P geminal bisphosphonate hook; upon osteoclast resorption, chelates three Mg2+ ions in FPPS while its protonated nitrogen side chain mimics a carbocation intermediate to block small-GTPase prenylation and induce osteoclast apoptosis.',
    bindingSites: [
      {
        id: 'fpps_asp_mg3',
        siteName: 'Asp103 / Asp107 / Asp243 Trinuclear Mg2+ Bisphosphonate Hook',
        drugMoiety: 'Non-Hydrolyzable P–C(OH)–P Geminal Bisphosphonate Trident',
        interactionType: 'coordination',
        colorAccent: '#f59e0b',
        residues: [
          { resn: 'ASP', resi: 103, chain: 'F', label: 'Asp103 (DDXXD Mg2+ Motif)' },
          { resn: 'ASP', resi: 107, chain: 'F', label: 'Asp107 (DDXXD Mg2+ Motif)' },
          { resn: 'ASP', resi: 243, chain: 'F', label: 'Asp243 (Second DDXXD Mg2+ Motif)' },
        ],
        reactionSummary:
          'Mimics inorganic pyrophosphate by coordinating a cluster of three Mg2+ ions bridged to both conserved DDXXD aspartate motifs (and to Ca2+ in bone mineral).',
        clinicalRelevance:
          'Poor (<1%) oral absorption and direct Ca2+/Mg2+ chelation dictate strict oral bisphosphonate administration: take on an empty stomach with 6–8 oz plain water ONLY and stay upright >=30 min (60 min for ibandronate) to prevent erosive esophagitis!',
      },
      {
        id: 'fpps_thr201_lys200',
        siteName: 'Thr201 / Lys200 Carbocation-Mimetic Nitrogen Side Chain',
        drugMoiety: 'Protonated Imidazole (Zoledronate), Pyridine (Risedronate), or Alkylamine (Alendronate/Ibandronate)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'LYS', resi: 200, chain: 'F', label: 'Lys200 (Pyrophosphate Clamp)' },
          { resn: 'THR', resi: 201, chain: 'F', label: 'Thr201 (Carbocation-Mimic H-Bond)' },
        ],
        reactionSummary:
          'Protonated R2 nitrogen hydrogen-bonds to Thr201/Gln240 main-chain oxygens, mimicking the allylic carbocation transition state of isoprenoid condensation.',
        clinicalRelevance:
          'Heterocyclic nitrogens (zoledronic acid, risedronate) tighten Thr201 binding 100–10,000x over non-nitrogen bisphosphonates; screen dental status (osteonecrosis of the jaw) and CrCl (>=30–35 mL/min).',
      },
    ],
  },

  nachr_varenicline: {
    templateId: 'nachr_varenicline',
    pdbId: '5KXI',
    ligandCode: 'NCT',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Agonist in Alpha-4 / Beta-2 Nicotinic Aromatic Box',
    exactDrugIds: [],
    targetName: 'Neuronal Alpha-4 / Beta-2 Nicotinic Acetylcholine Receptor (CHRNA4 / CHRNB2)',
    geneSymbol: 'CHRNA4',
    pocketMechanismSummary:
      'Binds as a high-affinity partial agonist inside the aromatic Trp156 cage at the alpha-4(+)/beta-2(-) interface of mesolimbic nicotinic receptors—releasing moderate tonic dopamine (~45% of nicotine) to blunt withdrawal cravings while competitively blocking smoked nicotine’s reward spike.',
    bindingSites: [
      {
        id: 'nachr_trp156_cage',
        siteName: 'Trp156 / Tyr204 Alpha-4 Principal Aromatic Cation-Pi Box',
        drugMoiety: 'Protonated Bridged Benzazepine Secondary Amine',
        interactionType: 'pi-stacking',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'TRP', resi: 156, chain: 'A', label: 'Trp156 (Loop B Cation-Pi & H-Bond)' },
          { resn: 'TYR', resi: 204, chain: 'A', label: 'Tyr204 (Loop C Aromatic Lid)' },
        ],
        reactionSummary:
          'Bidentate cation-pi and backbone carbonyl H-bonding to Trp156 gives varenicline higher affinity than nicotine itself, with partial Loop C closure.',
        clinicalRelevance:
          'Dual smoking-cessation mechanism: relieves cravings between cigarettes (partial agonism) AND makes lapsed smoking unrewarding (competitive antagonism).',
      },
      {
        id: 'nachr_trp57_beta2',
        siteName: 'Trp57 / Leu121 Beta-2 Complementary Quinoxaline Wall',
        drugMoiety: 'Rigid Fused Quinoxaline Heterocycle',
        interactionType: 'hydrophobic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'TRP', resi: 57, chain: 'B', label: 'Trp57 (Beta-2 Complementary Face)' },
          { resn: 'LEU', resi: 121, chain: 'B', label: 'Leu121 (Beta-2 Subtype Gate)' },
        ],
        reactionSummary:
          'Rigid cytisine-inspired quinoxaline scaffold contacts Beta-2 Leu121/Trp57 to restrict full pore gating.',
        clinicalRelevance:
          'Excreted >90% unchanged in urine (dose-adjust when CrCl < 30 mL/min); take after eating with a full glass of water to minimize nausea.',
      },
    ],
  },

  ht1b_triptan: {
    templateId: 'ht1b_triptan',
    pdbId: '4IAR',
    ligandCode: 'ERM',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Indole-Core 5-HT1B Agonist',
    exactDrugIds: [],
    targetName: 'Cranial Serotonin 5-HT1B / 5-HT1D Receptor (HTR1B)',
    geneSymbol: 'HTR1B',
    pocketMechanismSummary:
      'Selectively activates Gi-coupled 5-HT1B receptors on dilated meningeal blood vessels and presynaptic 5-HT1D receptors on trigeminal nerve endings—reversing intracranial vasodilation and blocking CGRP / substance P neurogenic inflammation to abort acute migraine.',
    bindingSites: [
      {
        id: 'ht1b_asp129_indole',
        siteName: 'Asp129 / Thr134 Indole-Ethylamine Orthosteric Core',
        drugMoiety: 'Serotonin-Mimetic Indole NH & Protonated Alkylamine/Pyrrolidine',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ASP', resi: 129, chain: 'A', label: 'Asp129 (TM3 Amine Salt Bridge)' },
          { resn: 'THR', resi: 134, chain: 'A', label: 'Thr134 (Indole NH H-Bond)' },
        ],
        reactionSummary:
          'Direct mimicry of 5-HT’s protonated ethylamine at Asp129 and indole NH at Thr134 triggers Gi signaling.',
        clinicalRelevance:
          'CONTRAINDICATED in ischemic heart disease, Prinzmetal angina, uncontrolled hypertension, hemiplegic/basilar migraine, or within 24 hours of another triptan/ergotamine due to 5-HT1B coronary vasoconstriction.',
      },
      {
        id: 'ht1b_c5_sulfonamide',
        siteName: 'Ser212 / Phe330 C5-Sulfonamide / Triazole Selectivity Pocket',
        drugMoiety: 'C5 Sulfonamide (Sumatriptan), Sulfonyl (Eletriptan), or Triazole (Rizatriptan)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#8b5cf6',
        residues: [
          { resn: 'SER', resi: 212, chain: 'A', label: 'Ser212 (TM5 C5-Substituent Pocket)' },
          { resn: 'PHE', resi: 330, chain: 'A', label: 'Phe330 (TM6 Aromatic Clamp)' },
        ],
        reactionSummary:
          'Bulky C5 indole substituents direct selectivity toward 5-HT1B/1D while sparing systemic 5-HT2A vasoconstrictor receptors.',
        clinicalRelevance:
          'Sumatriptan and rizatriptan are metabolized by MAO-A (propranolol raises rizatriptan levels -> use 5 mg max dose); eletriptan relies on CYP3A4.',
      },
    ],
  },

  rar_retinoid: {
    templateId: 'rar_retinoid',
    pdbId: '2LBD',
    ligandCode: 'REA',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Retinoic Acid in RAR-Gamma Ligand-Binding Domain',
    exactDrugIds: [],
    targetName: 'Nuclear Retinoic Acid Receptor Gamma (RAR-gamma / RARG)',
    geneSymbol: 'RARG',
    pocketMechanismSummary:
      'Binds nuclear Retinoic Acid Receptors (RAR-alpha/beta/gamma) via a buried Arg278/Ser289 carboxylate clamp and hydrophobic polyene/naphthoic channel, normalizing follicular keratinocyte differentiation, shrinking sebaceous glands, and suppressing acne inflammation.',
    bindingSites: [
      {
        id: 'rar_arg278_acid',
        siteName: 'Arg278 / Ser289 Terminal Carboxylate Salt Bridge',
        drugMoiety: 'Conjugated Polyene Carboxylate (Isotretinoin) or Naphthoic Acid (Adapalene)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 278, chain: 'A', label: 'Arg278 (Buried Carboxylate Anchor)' },
          { resn: 'SER', resi: 289, chain: 'A', label: 'Ser289 (Beta-Turn H-Bond)' },
        ],
        reactionSummary:
          'Salt bridge and hydrogen bond lock the polar carboxylate headgroup deep inside the RAR pocket to stabilize Helix-12 coactivator recruitment.',
        clinicalRelevance:
          'Oral isotretinoin (13-cis-retinoic acid) is a severe human teratogen governed by the iPLEDGE REMS program (two negative pregnancy tests + two contraception forms; monitor triglycerides & LFTs; avoid tetracyclines -> pseudotumor cerebri).',
      },
      {
        id: 'rar_phe230_adamantyl',
        siteName: 'Phe230 / Leu271 Lipophilic Beta-Ionone / Adamantyl Tunnel',
        drugMoiety: 'Beta-Ionone Ring (Isotretinoin) or Photostable Adamantyl-Phenyl Core (Adapalene)',
        interactionType: 'hydrophobic',
        colorAccent: '#10b981',
        residues: [
          { resn: 'PHE', resi: 230, chain: 'A', label: 'Phe230 (Hydrophobic Cavity)' },
          { resn: 'LEU', resi: 271, chain: 'A', label: 'Leu271 (RAR-Beta/Gamma Selectivity)' },
        ],
        reactionSummary:
          'Replacing flexible polyene double bonds with an adamantyl-biaryl scaffold in adapalene confers RAR-beta/gamma selectivity and complete UV/benzoyl-peroxide photostability.',
        clinicalRelevance:
          'Topical adapalene can be co-applied directly with benzoyl peroxide without oxidative degradation.',
      },
    ],
  },

  xo_urate: {
    templateId: 'xo_urate',
    pdbId: '1N5X',
    ligandCode: 'TEI',
    ligandChain: 'A',
    ligandMode: 'het',
    crystallizedLigandName: 'Febuxostat in Molybdopterin Active-Site Channel',
    exactDrugIds: ['febuxostat'],
    targetName: 'Xanthine Oxidase Molybdopterin Catalytic Tunnel (XDH)',
    geneSymbol: 'XDH',
    pocketMechanismSummary:
      'Blocks purine catabolism (hypoxanthine -> xanthine -> uric acid) inside the molybdopterin active tunnel of xanthine oxidase—either as a non-purine plug filling the entire channel regardless of Mo redox state (febuxostat) or via suicide oxidation to oxypurinol coordinated to Mo(IV) (allopurinol).',
    bindingSites: [
      {
        id: 'xo_arg880_glu802',
        siteName: 'Arg880 / Glu802 Molybdopterin Catalytic Pocket',
        drugMoiety: 'Thiazole-Carboxylate (Febuxostat) or Pyrazolopyrimidine/Oxypurinol Core (Allopurinol)',
        interactionType: 'ionic',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'ARG', resi: 880, chain: 'A', label: 'Arg880 (Carboxylate / Keto Salt Bridge)' },
          { resn: 'GLU', resi: 802, chain: 'A', label: 'Glu802 (Purine Recognition Base)' },
        ],
        reactionSummary:
          'Anchors right in front of the Mo=S(=O) cofactor—allopurinol is oxidized by XO into oxypurinol (t1/2 ~18–24 h) which tightly coordinates reduced Mo(IV), whereas febuxostat ionically clamps Arg880 across both Mo(VI) and Mo(IV).',
        clinicalRelevance:
          'LIFE-THREATENING INTERACTION: Xanthine oxidase also inactivates 6-mercaptopurine and azathioprine—combining allopurinol or febuxostat causes severe bone-marrow toxicity!',
      },
      {
        id: 'xo_phe914_tunnel',
        siteName: 'Phe914 / Phe1009 Narrow Aromatic Access Tunnel',
        drugMoiety: 'Cyanophenyl-Isobutoxy Lipophilic Tail',
        interactionType: 'pi-stacking',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'PHE', resi: 914, chain: 'A', label: 'Phe914 (Parallel Pi-Sandwich)' },
          { resn: 'PHE', resi: 1009, chain: 'A', label: 'Phe1009 (Perpendicular Pi-Wall)' },
        ],
        reactionSummary:
          'Sandwiches tightly between Phe914 and Phe1009, sterically sealing the substrate access tunnel without interfering with other purine/pyrimidine enzymes.',
        clinicalRelevance:
          'Allopurinol requires HLA-B*58:01 screening in high-risk populations (SCAR/SJS-TEN risk) and renal dose titration; febuxostat carries a cardiovascular mortality boxed warning.',
      },
    ],
  },

  trb_thyroid: {
    templateId: 'trb_thyroid',
    pdbId: '1XZX',
    ligandCode: 'T3',
    ligandChain: 'X',
    ligandMode: 'het',
    crystallizedLigandName: '3,5,3\'-Triiodothyronine (T3) in Thyroid Receptor Beta',
    exactDrugIds: ['thyroid'],
    targetName: 'Nuclear Thyroid Hormone Receptor Beta-1 (TR-beta / THRB)',
    geneSymbol: 'THRB',
    pocketMechanismSummary:
      'After peripheral 5\'-deiodinase conversion of prohormone T4 (levothyroxine) to active T3 (or direct T3/T4 delivery from desiccated thyroid), buries completely inside nuclear thyroid hormone receptors via Arg282 carboxylate clamping and His435 phenolic H-bonding to regulate basal metabolic gene transcription.',
    bindingSites: [
      {
        id: 'trb_his435_outer_ring',
        siteName: 'His435 / Phe272 Outer-Ring 4\'-Phenolic & 3\'-Iodine Switch',
        drugMoiety: 'Outer Phenolic 4\'-OH & Single 3\'-Iodo Substituent (after 5\'-Deiodination)',
        interactionType: 'hydrogen-bond',
        colorAccent: '#ef4444',
        residues: [
          { resn: 'HIS', resi: 435, chain: 'X', label: 'His435 (Helix-11 4\'-OH Agonist Lock)' },
          { resn: 'PHE', resi: 272, chain: 'X', label: 'Phe272 (3\'-Iodine Hydrophobic Pocket)' },
        ],
        reactionSummary:
          'Single 3\'-iodine fits snugly into the Phe272 pocket while 4\'-OH H-bonds to His435; removing the bulky 5\'-iodine of T4 increases TR affinity ~10-fold!',
        clinicalRelevance:
          'Levothyroxine (synthetic T4, t1/2 ~7 days) provides a steady reservoir converted intracellularly to T3, avoiding acute cardiac T3 spikes; wait 6–8 weeks before rechecking TSH after dose changes.',
      },
      {
        id: 'trb_arg282_alanine',
        siteName: 'Arg282 / Asn331 Inner Diiodotyrosyl-Alanine Zwitterion Clamp',
        drugMoiety: 'L-Alanine Zwitterion & Orthogonal 3,5-Diiodo Inner Ring',
        interactionType: 'ionic',
        colorAccent: '#3b82f6',
        residues: [
          { resn: 'ARG', resi: 282, chain: 'X', label: 'Arg282 (Alanine Carboxylate Salt Bridge)' },
          { resn: 'ASN', resi: 331, chain: 'X', label: 'Asn331 (Alpha-Ammonium H-Bond)' },
        ],
        reactionSummary:
          'Bulky 3,5-diiodo atoms force the two diphenyl-ether rings perpendicular (90°), locking the L-alanine tail into Arg282/Asn331.',
        clinicalRelevance:
          'Take on an empty stomach 30–60 min before breakfast with water, separated by >=4 hours from Ca2+, Fe2+, Mg/Al antacids, PPIs, or bile-acid resins!',
      },
    ],
  },
};
