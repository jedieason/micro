// Unit membership supplied by the user; Review entries are included.
export const units = [
  {
    "id": "cell-injury-and-adaption",
    "name": "Cell injury and adaption",
    "codes": [
      "PA0097",
      "PA0313",
      "PA0335",
      "PA0162",
      "PA0198",
      "PA0081",
      "PA0220",
      "PA0074",
      "PA0017",
      "PA0144",
      "PA0208",
      "PA0211",
      "PA0214",
      "PA0216"
    ]
  },
  {
    "id": "inflammation",
    "name": "Inflammation",
    "codes": [
      "PA0270",
      "PA0044",
      "PA0143",
      "PA0202",
      "PA0198"
    ]
  },
  {
    "id": "hemodynamic-derangement",
    "name": "Hemodynamic derangement",
    "codes": [
      "PA0008",
      "PA0059",
      "PA0076",
      "PA0215",
      "PA0096",
      "PA0335"
    ]
  },
  {
    "id": "infection",
    "name": "Infection",
    "codes": [
      "PA0255",
      "PA0271",
      "PA0218",
      "PA0306",
      "PA0251",
      "PA0022",
      "PA0015",
      "PA0201",
      "PA0316",
      "PA0302",
      "PA0206",
      "PA0332",
      "PA0198"
    ]
  },
  {
    "id": "immunological-disorder",
    "name": "Immunological disorder",
    "codes": [
      "PA0030",
      "PA0284",
      "PA0061",
      "PA0264",
      "PA0302"
    ]
  },
  {
    "id": "disease-of-infancy-and-childhood",
    "name": "Disease of infancy and childhood",
    "codes": [
      "PA0289",
      "PA0305",
      "PA0247",
      "PA0341",
      "PA0313"
    ]
  },
  {
    "id": "epithelial-neoplasm",
    "name": "Epithelial neoplasm",
    "codes": [
      "PA0047",
      "PA0337",
      "PA0338",
      "PA0102",
      "PA0295",
      "PA0260",
      "PA0207",
      "PA0249"
    ]
  },
  {
    "id": "non-epithelial-neoplasm",
    "name": "Non-epithelial neoplasm",
    "codes": [
      "PA0104",
      "PA0158",
      "PA0195",
      "PA0314",
      "PA0336",
      "PA0226",
      "PA0100",
      "PA0285"
    ]
  },
  {
    "id": "cardiovascular-system",
    "name": "Cardiovascular system",
    "codes": [
      "PA0002",
      "PA0340",
      "PA0197",
      "PA0171",
      "PA0306",
      "PA0335"
    ]
  },
  {
    "id": "respiratory-system",
    "name": "Respiratory system",
    "codes": [
      "PA0174",
      "PA0308",
      "PA0307",
      "PA0021",
      "PA0041",
      "PA0024",
      "PA0040",
      "PA0263",
      "PA0017",
      "PA0198",
      "PA0015",
      "PA0316",
      "PA0302",
      "PA0030",
      "PA0341"
    ]
  },
  {
    "id": "liver-and-biliary-tract",
    "name": "Liver and biliary tract",
    "codes": [
      "PA0067",
      "PA0071",
      "PA0184",
      "PA0281",
      "PA0334",
      "PA0282",
      "PA0075",
      "PA0286",
      "PA0342",
      "PA0074",
      "PA0211",
      "PA0061",
      "PA0265",
      "PA0333",
      "PA0069",
      "PA0311",
      "PA0345",
      "PA0214",
      "PA0076",
      "PA0215"
    ]
  },
  {
    "id": "head-and-neck",
    "name": "Head and neck",
    "codes": [
      "PA0273",
      "PA0045",
      "PA0046",
      "PA0260",
      "PA0044"
    ]
  },
  {
    "id": "gi-tract-and-pancreas",
    "name": "GI tract and pancreas",
    "codes": [
      "PA0279",
      "PA0309",
      "PA0055",
      "PA0047",
      "PA0207",
      "PA0249",
      "PA0280",
      "PA0310",
      "PA0312",
      "PA0248",
      "PA0343",
      "PA0344",
      "PA0201",
      "PA0202",
      "PA0270",
      "PA0206",
      "PA0059"
    ]
  }
];
export function unitCodes(ids) { return [...new Set(units.filter(u => ids.includes(u.id)).flatMap(u => u.codes))]; }

export const syllabus = {
  "PA0002": {
    "slideNo": "5",
    "diagnosis": "Cardiac myxoma",
    "organ": "Heart",
    "diagnosisAliases": [
      "Myxoma",
      "Cardiac myxoma, left atrium"
    ],
    "organAliases": [
      "Left atrium",
      "Heart, left atrium"
    ]
  },
  "PA0008": {
    "slideNo": "10",
    "diagnosis": "Congestive splenomegaly",
    "organ": "Spleen",
    "diagnosisAliases": [
      "Splenic congestion",
      "Chronic passive congestion"
    ],
    "organAliases": [],
    "description": "1. Red pulp expansion\n2. Red pulp congestion (& fibrosis)\n3. Dilated sinusoids"
  },
  "PA0015": {
    "slideNo": "17",
    "diagnosis": "Aspergillosis",
    "organ": "Lung",
    "diagnosisAliases": [
      "Aspergillus infection"
    ],
    "organAliases": [],
    "description": "1. Fungal hyphae with septa and acute-angle branching\n2. Chronic inflammation\n3. Fibrosis\n4. Anthracosis"
  },
  "PA0017": {
    "slideNo": "18",
    "diagnosis": "Anthracosis",
    "organ": "Lung",
    "diagnosisAliases": [],
    "organAliases": [],
    "description": "1. Dark black pigments in macrophages/histiocytes"
  },
  "PA0021": {
    "slideNo": "22",
    "diagnosis": "Squamous cell carcinoma",
    "organ": "Lung",
    "diagnosisAliases": [
      "SCC"
    ],
    "organAliases": []
  },
  "PA0022": {
    "slideNo": "9",
    "diagnosis": "Mucormycosis",
    "organ": "Spleen",
    "diagnosisAliases": [
      "Zygomycosis"
    ],
    "organAliases": [],
    "description": "1. Aseptate hyphae with wide-angle branching\n2. Caseating granulomatous inflammation"
  },
  "PA0024": {
    "slideNo": "24",
    "diagnosis": "Bronchopneumonia",
    "organ": "Lung",
    "diagnosisAliases": [
      "Pneumonia"
    ],
    "organAliases": []
  },
  "PA0030": {
    "slideNo": "25",
    "diagnosis": "Amyloidoma",
    "organ": "Lung",
    "diagnosisAliases": [
      "Amyloidosis"
    ],
    "organAliases": []
  },
  "PA0040": {
    "slideNo": "26",
    "diagnosis": "Diffuse alveolar damage",
    "organ": "Lung",
    "diagnosisAliases": [
      "DAD",
      "ARDS"
    ],
    "organAliases": []
  },
  "PA0041": {
    "slideNo": "27",
    "diagnosis": "Mesothelioma",
    "organ": "Pleura",
    "diagnosisAliases": [
      "Malignant mesothelioma"
    ],
    "organAliases": []
  },
  "PA0044": {
    "slideNo": "29",
    "diagnosis": "Chronic sinusitis",
    "organ": "Maxillary sinus",
    "diagnosisAliases": [
      "Sinusitis"
    ],
    "organAliases": [
      "Sinus"
    ],
    "description": "1. Submucosal mixed inflammatory cell infiltrate of lymphocytes, plasma cells, and eosinophils\n2. Submucosal edema\n3. Basement membrane thickening"
  },
  "PA0045": {
    "slideNo": "30",
    "diagnosis": "Warthin tumor",
    "organ": "Parotid gland",
    "diagnosisAliases": [
      "Warthin's tumor",
      "Warthin’s tumor",
      "Papillary cystadenoma lymphomatosum"
    ],
    "organAliases": [
      "Salivary gland"
    ]
  },
  "PA0046": {
    "slideNo": "31",
    "diagnosis": "Pleomorphic adenoma",
    "organ": "Parotid gland",
    "diagnosisAliases": [
      "Mixed tumor",
      "Pleomorphic adenoma (mixed tumor)"
    ],
    "organAliases": [
      "Salivary gland"
    ]
  },
  "PA0047": {
    "slideNo": "32",
    "diagnosis": "Squamous cell carcinoma",
    "organ": "Esophagus",
    "diagnosisAliases": [
      "SCC"
    ],
    "organAliases": []
  },
  "PA0055": {
    "slideNo": "36",
    "diagnosis": "Neuroendocrine tumor",
    "organ": "Ileum",
    "diagnosisAliases": [
      "NET",
      "Carcinoid tumor"
    ],
    "organAliases": [
      "Small intestine"
    ]
  },
  "PA0059": {
    "slideNo": "41",
    "diagnosis": "Hemorrhoid",
    "organ": "Anus",
    "diagnosisAliases": [
      "Hemorrhoids",
      "Internal hemorrhoid"
    ],
    "organAliases": [
      "Anorectum",
      "Rectum"
    ],
    "description": "1. Dilated and congested submucosal vessels\n2. Thrombosis\n3. Organization & recanalization"
  },
  "PA0061": {
    "slideNo": "43",
    "diagnosis": "Acute cellular rejection",
    "organ": "Liver",
    "diagnosisAliases": [
      "ACR",
      "Acute rejection"
    ],
    "organAliases": []
  },
  "PA0067": {
    "slideNo": "51",
    "diagnosis": "Focal nodular hyperplasia",
    "organ": "Liver",
    "diagnosisAliases": [
      "FNH"
    ],
    "organAliases": []
  },
  "PA0069": {
    "slideNo": "53",
    "diagnosis": "Neonatal hepatitis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Giant cell hepatitis",
      "Neonatal hepatitis (giant cell hepatitis)"
    ],
    "organAliases": []
  },
  "PA0071": {
    "slideNo": "55",
    "diagnosis": "Hepatocellular carcinoma",
    "organ": "Liver",
    "diagnosisAliases": [
      "HCC"
    ],
    "organAliases": []
  },
  "PA0074": {
    "slideNo": "58",
    "diagnosis": "Steatosis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Fatty change",
      "Steatosis (fatty change)"
    ],
    "organAliases": [],
    "description": "1. Lipid droplets in hepatocytes"
  },
  "PA0075": {
    "slideNo": "59",
    "diagnosis": "Cirrhosis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Liver cirrhosis"
    ],
    "organAliases": []
  },
  "PA0076": {
    "slideNo": "61",
    "diagnosis": "Nutmeg liver",
    "organ": "Liver",
    "diagnosisAliases": [
      "Centrilobular congestion and necrosis",
      "Nutmeg liver (centrilobular congestion and necrosis)",
      "Chronic passive congestion"
    ],
    "organAliases": [],
    "description": "1. Centrilobular [zone 3] congestion\n2. Centrilobular [zone 3] hepatocyte necrosis"
  },
  "PA0081": {
    "slideNo": "65",
    "diagnosis": "Fat necrosis",
    "organ": "Pancreas",
    "diagnosisAliases": [
      "Enzymatic fat necrosis"
    ],
    "organAliases": [],
    "description": "1. Shadowy outlines of necrotic fat cells\n2. Basophilic calcium deposits\n3. Inflammation"
  },
  "PA0096": {
    "slideNo": "76",
    "diagnosis": "Infarct",
    "organ": "Kidney",
    "diagnosisAliases": [
      "Infarction",
      "Renal infarct",
      "Acute tubular necrosis",
      "ATN",
      "Infarct/Infarction"
    ],
    "organAliases": [
      "Renal"
    ],
    "description": "1. Wedge-shaped coagulative necrosis\n2. Acute tubular necrosis\n3. Thrombosis"
  },
  "PA0097": {
    "slideNo": "77",
    "diagnosis": "Acute tubular necrosis",
    "organ": "Kidney",
    "diagnosisAliases": [
      "ATN",
      "Acute tubular injury"
    ],
    "organAliases": [
      "Renal"
    ],
    "description": "1. Tubular epithelial coagulative necrosis\n2. Dead cells with preserved cellular outlines\n3. Cytoplasmic eosinophilia, may glassy appearance, may vacuolated\n4. Nuclear changes: karyolysis, pyknosis, karyorrhexis\n5. An inflammatory infiltrate"
  },
  "PA0100": {
    "slideNo": "81",
    "diagnosis": "Malignant melanoma",
    "organ": "Vulva",
    "diagnosisAliases": [
      "Melanoma"
    ],
    "organAliases": [
      "Skin",
      "Skin (vulva)"
    ]
  },
  "PA0102": {
    "slideNo": "83",
    "diagnosis": "Squamous cell carcinoma",
    "organ": "Uterine cervix",
    "diagnosisAliases": [
      "SCC",
      "Squamous cell carcinoma, cervix"
    ],
    "organAliases": [
      "Cervix"
    ]
  },
  "PA0104": {
    "slideNo": "85",
    "diagnosis": "Leiomyoma",
    "organ": "Uterine corpus",
    "diagnosisAliases": [
      "Fibroid",
      "Uterine leiomyoma"
    ],
    "organAliases": [
      "Uterus"
    ]
  },
  "PA0143": {
    "slideNo": "119",
    "diagnosis": "Suture granuloma",
    "organ": "Skin",
    "diagnosisAliases": [
      "Foreign body granuloma"
    ],
    "organAliases": [],
    "description": "1. Center: Suture\n2. Periphery: Granulomatous inflammation\n3. Epithelioid macrophages/histiocytes\n4. Multinucleated giant cells\n5. Lymphocytes, plasma cells\n6. Fibrosis/scar\n7. Other finding: Fat necrosis"
  },
  "PA0144": {
    "slideNo": "120",
    "diagnosis": "Intradermal nevus",
    "organ": "Skin",
    "diagnosisAliases": [
      "Intradermal melanocytic nevus",
      "Melanocytic nevus",
      "Intradermal nevus, skin (scalp)",
      "Intradermal (melanocytic) nevus"
    ],
    "organAliases": [
      "Skin (scalp)",
      "Scalp"
    ],
    "description": "1. Nests & cords of proliferative melanocytes\n2. Brown-black melanin pigmentation\n3. Adipocytic metaplasia"
  },
  "PA0158": {
    "slideNo": "135",
    "diagnosis": "Schwannoma",
    "organ": "Soft tissue",
    "diagnosisAliases": [
      "Neurilemmoma"
    ],
    "organAliases": [
      "Soft tissue (near T-level vertebra)"
    ]
  },
  "PA0162": {
    "slideNo": "138",
    "diagnosis": "Encephalomalacia",
    "organ": "Cerebrum",
    "diagnosisAliases": [
      "Liquefactive necrosis",
      "Cerebral infarction"
    ],
    "organAliases": [
      "Brain"
    ],
    "description": "1. Focal liquefactive necrosis\n2. Loss of the original structure → loosening of the tissue\n3. Neutrophil infiltration or “microabscess” may be present\n4. Reactive gliosis\n5. Gitter cells\n6. Histiocytes with phagocytosed myelin"
  },
  "PA0171": {
    "slideNo": "3",
    "diagnosis": "Amyloidosis",
    "organ": "Myocardium",
    "diagnosisAliases": [
      "Cardiac amyloidosis"
    ],
    "organAliases": [
      "Heart"
    ]
  },
  "PA0174": {
    "slideNo": "19",
    "diagnosis": "Adenocarcinoma",
    "organ": "Lung",
    "diagnosisAliases": [
      "Lung adenocarcinoma"
    ],
    "organAliases": []
  },
  "PA0184": {
    "slideNo": "60",
    "diagnosis": "Cholangiocarcinoma",
    "organ": "Liver",
    "diagnosisAliases": [
      "Intrahepatic cholangiocarcinoma",
      "CCC"
    ],
    "organAliases": []
  },
  "PA0195": {
    "slideNo": "134",
    "diagnosis": "Neurofibroma",
    "organ": "Soft tissue",
    "diagnosisAliases": [
      "Plexiform and diffuse neurofibroma",
      "Neurofibroma, plexiform and diffuse",
      "Neurofibroma, plexiform and diffuse, soft tissue (cheek)"
    ],
    "organAliases": [
      "Soft tissue (cheek)"
    ]
  },
  "PA0197": {
    "slideNo": "143",
    "diagnosis": "Acute rheumatic pancarditis",
    "organ": "Heart",
    "diagnosisAliases": [
      "Rheumatic pancarditis",
      "Rheumatic carditis",
      "Rheumatic heart disease"
    ],
    "organAliases": []
  },
  "PA0198": {
    "slideNo": "144",
    "diagnosis": "Caseating granulomatous inflammation",
    "organ": "Lung",
    "diagnosisAliases": [
      "Tuberculosis",
      "TB",
      "Caseous necrosis"
    ],
    "organAliases": [],
    "description": "1. Center: Caseous necrosis\n2. A structureless collection of lysed cells & amorphous granular debris\n3. Periphery: Granulomatous inflammation\n4. Epithelioid macrophages\n5. Langhans giant cells\n6. Lymphocytes\n7. Fibrosis"
  },
  "PA0201": {
    "slideNo": "147",
    "diagnosis": "Candidiasis",
    "organ": "Esophagus",
    "diagnosisAliases": [
      "Candida infection",
      "Candida esophagitis"
    ],
    "organAliases": [],
    "description": "1. Fungal yeasts and pseudohyphae\n2. Hyperkeratosis, parakeratosis\n3. Chronic inflammation\n4. Bacterial clumps"
  },
  "PA0202": {
    "slideNo": "148",
    "diagnosis": "Chronic ulcer",
    "organ": "Stomach",
    "diagnosisAliases": [
      "Chronic peptic ulcer",
      "Peptic ulcer"
    ],
    "organAliases": [],
    "description": "1. Mucosa defect with fibrinous necrosis and neutrophil\n2. Granulation tissue\n3. Fibrosis/scar\n4. Other finding: Fibrinous inflammation on the serosal surface"
  },
  "PA0206": {
    "slideNo": "150",
    "diagnosis": "Amebiasis",
    "organ": "Appendix",
    "diagnosisAliases": [
      "Amebic colitis",
      "Amoebiasis",
      "Entamoeba histolytica infection"
    ],
    "organAliases": [
      "Colon",
      "Large intestine"
    ],
    "description": "1. Round microorganisms\n2. Foamy cytoplasm\n3. Round, eccentric nucleus\n4. Ingested red blood cells\n5. Ulcer with inflamed granulation tissue and acute suppurative inflammation (transmural neutrophil infiltration)"
  },
  "PA0207": {
    "slideNo": "151",
    "diagnosis": "Familial adenomatous polyposis",
    "organ": "Large intestine",
    "diagnosisAliases": [
      "FAP",
      "Tubular adenoma",
      "Adenomatous polyposis"
    ],
    "organAliases": [
      "Colon"
    ]
  },
  "PA0208": {
    "slideNo": "152",
    "diagnosis": "Melanosis coli",
    "organ": "Large intestine",
    "diagnosisAliases": [
      "Pseudomelanosis coli"
    ],
    "organAliases": [
      "Colon"
    ],
    "description": "1. Yellow-brown ceroid-laden macrophages in the lamina propria"
  },
  "PA0211": {
    "slideNo": "153",
    "diagnosis": "Hemosiderosis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Hemochromatosis",
      "Iron overload"
    ],
    "organAliases": [],
    "description": "1. Golden yellow-brown, refractile hemosiderin accumulation in hepatocytes"
  },
  "PA0214": {
    "slideNo": "156",
    "diagnosis": "Obstructive cholestasis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Cholestasis"
    ],
    "organAliases": [],
    "description": "1. Green-brown bile pigments in hepatocytes and dilated canaliculi\n2. Portal edema, prominent ductular reaction & neutrophil infiltration (“pericholangitis”)\n3. Swelling of periportal hepatocytes (“feathery degeneration”)"
  },
  "PA0215": {
    "slideNo": "157",
    "diagnosis": "Cardiac sclerosis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Congestive cirrhosis",
      "Cardiac cirrhosis"
    ],
    "organAliases": [],
    "description": "1. Centrilobular congestion\n2. Centrilobular hepatocyte fibrosis"
  },
  "PA0216": {
    "slideNo": "158",
    "diagnosis": "Malaria pigment",
    "organ": "Liver",
    "diagnosisAliases": [
      "Hemozoin pigment",
      "Malaria"
    ],
    "organAliases": [],
    "description": "1. Brown-black malaria pigments in macrophages and hepatocytes"
  },
  "PA0218": {
    "slideNo": "160",
    "diagnosis": "Cytomegaloviral nephritis",
    "organ": "Kidney",
    "diagnosisAliases": [
      "CMV infection",
      "Cytomegalovirus infection",
      "CMV nephritis",
      "Cytomegalovirus (CMV) infection",
      "Cytomegaloviral (CMV) nephritis"
    ],
    "organAliases": [
      "Renal"
    ],
    "description": "1. Infected cells\n2. Cellular and nuclear enlargement\n3. Large intranuclear basophilic inclusions with halos/haloes\n4. Small cytoplasmic basophilic inclusions\n5. Chronic inflammation"
  },
  "PA0220": {
    "slideNo": "162",
    "diagnosis": "Nodular hyperplasia",
    "organ": "Prostate",
    "diagnosisAliases": [
      "Benign prostatic hyperplasia",
      "BPH"
    ],
    "organAliases": [],
    "description": "1. Nodules of cystically dilated hyperplastic glands"
  },
  "PA0226": {
    "slideNo": "167",
    "diagnosis": "Embryonal rhabdomyosarcoma",
    "organ": "Soft tissue",
    "diagnosisAliases": [
      "Rhabdomyosarcoma"
    ],
    "organAliases": []
  },
  "PA0247": {
    "slideNo": "142",
    "diagnosis": "Retinoblastoma",
    "organ": "Eye",
    "diagnosisAliases": [
      "RB"
    ],
    "organAliases": [
      "Retina"
    ]
  },
  "PA0248": {
    "slideNo": "187",
    "diagnosis": "IgG4-related autoimmune pancreatitis",
    "organ": "Pancreas",
    "diagnosisAliases": [
      "Autoimmune pancreatitis",
      "AIP"
    ],
    "organAliases": []
  },
  "PA0249": {
    "slideNo": "38",
    "diagnosis": "Adenocarcinoma",
    "organ": "Colon",
    "diagnosisAliases": [
      "Colonic adenocarcinoma",
      "Colon cancer"
    ],
    "organAliases": [
      "Large intestine"
    ]
  },
  "PA0251": {
    "slideNo": "39",
    "diagnosis": "Actinomycosis",
    "organ": "Ovary",
    "diagnosisAliases": [
      "Actinomyces infection",
      "Pelvic actinomycosis"
    ],
    "organAliases": [
      "Ovary (此片被病灶佔滿，其實沒有可供辨認為卵巢之組織)"
    ],
    "description": "1. Sulfur granules composed of clumped colonies of bacteria in center with eosinophilic periphery with club-like projections (Splendore-Hoeppli phenomenon)\n2. Acute and chronic inflammation with abscess formation\n3. May have granulomatous inflammation (suppurative granulomatous inflammation)"
  },
  "PA0255": {
    "slideNo": "80",
    "diagnosis": "Condyloma acuminatum",
    "organ": "Skin",
    "diagnosisAliases": [
      "Genital wart",
      "HPV infection"
    ],
    "organAliases": [],
    "description": "1. Papillomatosis\n2. Koilocytosis\n3. Acanthosis\n4. Hyperkeratosis\n5. Parakeratosis"
  },
  "PA0260": {
    "slideNo": "190",
    "diagnosis": "Nasopharyngeal carcinoma",
    "organ": "Nasopharynx",
    "diagnosisAliases": [
      "NPC"
    ],
    "organAliases": []
  },
  "PA0263": {
    "slideNo": "192",
    "diagnosis": "Pneumoconiosis",
    "organ": "Lung",
    "diagnosisAliases": [
      "Anthracosilicosis",
      "Coal worker pneumoconiosis"
    ],
    "organAliases": []
  },
  "PA0264": {
    "slideNo": "193",
    "diagnosis": "Allergic rhinitis",
    "organ": "Nasal cavity",
    "diagnosisAliases": [
      "Rhinitis"
    ],
    "organAliases": [
      "Nose"
    ]
  },
  "PA0265": {
    "slideNo": "45",
    "diagnosis": "Primary biliary cholangitis",
    "organ": "Liver",
    "diagnosisAliases": [
      "PBC",
      "Primary biliary cirrhosis"
    ],
    "organAliases": []
  },
  "PA0270": {
    "slideNo": "37",
    "diagnosis": "Acute suppurative appendicitis",
    "organ": "Appendix",
    "diagnosisAliases": [
      "Acute appendicitis"
    ],
    "organAliases": [],
    "description": "1. Mucosal and mural neutrophil infiltration, involving muscularis propria\n2. Mucosal ulceration\n3. Luminal and mural abscess\n4. Fibrinous inflammation on the serosal surface"
  },
  "PA0271": {
    "slideNo": "117",
    "diagnosis": "Molluscum contagiosum",
    "organ": "Skin",
    "diagnosisAliases": [
      "Molluscum contagiosum, skin (shin)"
    ],
    "organAliases": [
      "Skin (shin)"
    ],
    "description": "1. A cup-like lesion with a crater\n2. Epidermal hyperplasia\n3. Molluscum bodies (Henderson-Patterson bodies) in the crater: large, eosinophilic to basophilic intracytoplasmic inclusions that push aside nucleus"
  },
  "PA0273": {
    "slideNo": "28",
    "diagnosis": "Ameloblastoma",
    "organ": "Bone",
    "diagnosisAliases": [
      "Ameloblastoma, mandible",
      "Adamantinoma"
    ],
    "organAliases": [
      "Mandible",
      "Jaw"
    ]
  },
  "PA0279": {
    "slideNo": "33",
    "diagnosis": "Adenocarcinoma, signet-ring cell type",
    "organ": "Stomach",
    "diagnosisAliases": [
      "Signet-ring cell carcinoma",
      "Signet ring cell carcinoma",
      "Adenocarcinoma, signet-ring cell type (signet-ring cell carcinoma)",
      "Diffuse type gastric adenocarcinoma"
    ],
    "organAliases": [
      "Gastric"
    ]
  },
  "PA0280": {
    "slideNo": "35",
    "diagnosis": "Crohn’s disease",
    "organ": "Small intestine",
    "diagnosisAliases": [
      "Crohn disease",
      "Crohns disease",
      "Regional enteritis"
    ],
    "organAliases": [
      "Ileum",
      "Intestine"
    ]
  },
  "PA0281": {
    "slideNo": "42",
    "diagnosis": "Acute hepatitis",
    "organ": "Liver",
    "diagnosisAliases": [],
    "organAliases": []
  },
  "PA0282": {
    "slideNo": "47",
    "diagnosis": "Submassive necrosis",
    "organ": "Liver",
    "diagnosisAliases": [
      "Submassive hepatic necrosis",
      "Massive hepatic necrosis"
    ],
    "organAliases": []
  },
  "PA0284": {
    "slideNo": "69",
    "diagnosis": "Chronic rejection",
    "organ": "Kidney",
    "diagnosisAliases": [
      "Chronic allograft rejection",
      "Chronic renal allograft rejection"
    ],
    "organAliases": [
      "Renal"
    ]
  },
  "PA0285": {
    "slideNo": "88",
    "diagnosis": "Mature teratoma",
    "organ": "Ovary",
    "diagnosisAliases": [
      "Mature cystic teratoma",
      "Dermoid cyst",
      "Mature (cystic) teratoma"
    ],
    "organAliases": []
  },
  "PA0286": {
    "slideNo": "159",
    "diagnosis": "Steatohepatitis",
    "organ": "Liver",
    "diagnosisAliases": [
      "NASH",
      "Non-alcoholic steatohepatitis",
      "MASH"
    ],
    "organAliases": []
  },
  "PA0289": {
    "slideNo": "68",
    "diagnosis": "Nephroblastoma",
    "organ": "Kidney",
    "diagnosisAliases": [
      "Wilm's tumor",
      "Wilms tumor",
      "Nephroblastoma (Wilm's tumor)",
      "Wilms tumour"
    ],
    "organAliases": [
      "Soft tissue (kidney)",
      "Soft tissue",
      "Renal"
    ]
  },
  "PA0295": {
    "slideNo": "118",
    "diagnosis": "Basal cell carcinoma",
    "organ": "Skin",
    "diagnosisAliases": [
      "BCC"
    ],
    "organAliases": []
  },
  "PA0302": {
    "slideNo": "191",
    "diagnosis": "Pneumocystis jirovecii pneumonia",
    "organ": "Lung",
    "diagnosisAliases": [
      "PJP",
      "Pneumocystis pneumonia",
      "PCP"
    ],
    "organAliases": [],
    "description": "1. Foamy, granular, eosinophilic exudate in the alveolar spaces\n2. Interstitial thickening and inflammation\n3. Other finding: focal ossification"
  },
  "PA0305": {
    "slideNo": "171",
    "diagnosis": "Neuroblastoma",
    "organ": "Adrenal gland",
    "diagnosisAliases": [],
    "organAliases": [
      "Adrenal"
    ]
  },
  "PA0306": {
    "slideNo": "4",
    "diagnosis": "Infective endocarditis",
    "organ": "Aortic valve",
    "diagnosisAliases": [
      "Bacterial endocarditis",
      "Endocarditis"
    ],
    "organAliases": [
      "Heart valve",
      "Heart",
      "Mitral valve"
    ],
    "description": "1. Valve destruction with necrosis\n2. Vegetation: composed of fibrin, bacterial clumps, and inflammatory infiltrate (neutrophilic or lymphohistiocytic)\n3. Inflamed granulation tissue\n4. In chronic lesion: organization and calcification"
  },
  "PA0307": {
    "slideNo": "20",
    "diagnosis": "Small cell carcinoma",
    "organ": "Lung",
    "diagnosisAliases": [
      "Oat cell carcinoma",
      "SCLC"
    ],
    "organAliases": []
  },
  "PA0308": {
    "slideNo": "23",
    "diagnosis": "Mucinous adenocarcinoma",
    "organ": "Lung",
    "diagnosisAliases": [
      "Invasive mucinous adenocarcinoma",
      "(Invasive) mucinous adenocarcinoma"
    ],
    "organAliases": []
  },
  "PA0309": {
    "slideNo": "34",
    "diagnosis": "Adenocarcinoma, intestinal type",
    "organ": "Stomach",
    "diagnosisAliases": [
      "Intestinal type gastric adenocarcinoma",
      "Adenocarcinoma"
    ],
    "organAliases": [
      "Gastric"
    ]
  },
  "PA0310": {
    "slideNo": "40",
    "diagnosis": "Ulcerative colitis",
    "organ": "Large intestine",
    "diagnosisAliases": [
      "UC",
      "Chronic active colitis"
    ],
    "organAliases": [
      "Colon"
    ]
  },
  "PA0311": {
    "slideNo": "48",
    "diagnosis": "Biliary atresia",
    "organ": "Liver",
    "diagnosisAliases": [
      "Extrahepatic biliary atresia"
    ],
    "organAliases": [
      "Biliary tract"
    ]
  },
  "PA0312": {
    "slideNo": "63",
    "diagnosis": "Chronic pancreatitis",
    "organ": "Pancreas",
    "diagnosisAliases": [],
    "organAliases": []
  },
  "PA0313": {
    "slideNo": "196",
    "diagnosis": "Necrotizing enterocolitis",
    "organ": "Colon",
    "diagnosisAliases": [
      "NEC"
    ],
    "organAliases": [
      "Intestine",
      "Intestine/colon",
      "Large intestine"
    ],
    "description": "1. Coagulative necrosis with hemorrhage – mucosal and transmural (impending perforation)\n2. Chronic changes: strictures, crypt distortion, reactive epithelial cells"
  },
  "PA0314": {
    "slideNo": "197",
    "diagnosis": "Hemangioma",
    "organ": "Skin",
    "diagnosisAliases": [
      "Cavernous hemangioma",
      "Capillary hemangioma"
    ],
    "organAliases": []
  },
  "PA0316": {
    "slideNo": "198",
    "diagnosis": "Cryptococcosis",
    "organ": "Lung",
    "diagnosisAliases": [
      "Cryptococcus infection"
    ],
    "organAliases": [],
    "description": "1. Numerous round to oval, refractile, thick-walled fungal yeasts\n2. Focal necrosis\n3. Granulomatous inflammation (vaguely-formed granuloma / macrophage infiltration with scattered multinucleated giant cells)\n4. Infiltration of lymphocytes and plasma cells\n5. Intraalveolar fibrin deposition\n6. Fibrosis"
  },
  "PA0332": {
    "slideNo": "145",
    "diagnosis": "Herpes virus infection",
    "organ": "Skin",
    "diagnosisAliases": [
      "Herpes simplex virus infection",
      "HSV infection",
      "Herpes infection"
    ],
    "organAliases": [
      "Skin (thigh)",
      "Thigh",
      "Oral cavity (mouth floor)",
      "Oral cavity"
    ],
    "description": "1. Cytopathic effects compatible with herpes infection\n2. Multinucleation\n3. Margination of chromatin\n4. Molding of nuclei\n5. Ulcer with neutrophil infiltration and necrotic debris"
  },
  "PA0333": {
    "slideNo": "52",
    "diagnosis": "Primary sclerosing cholangitis",
    "organ": "Liver",
    "diagnosisAliases": [
      "PSC"
    ],
    "organAliases": [
      "Biliary tract"
    ]
  },
  "PA0334": {
    "slideNo": "50",
    "diagnosis": "Chronic hepatitis",
    "organ": "Liver",
    "diagnosisAliases": [],
    "organAliases": []
  },
  "PA0335": {
    "slideNo": "6",
    "diagnosis": "Myocardial infarction, remote",
    "organ": "Heart",
    "diagnosisAliases": [
      "Myocardial infarction",
      "Myocardial infarction, healed",
      "Healed myocardial infarction"
    ],
    "organAliases": [
      "Myocardium"
    ],
    "description": "1. Multifocal fibrosis replacing myocytes\n2. Slightly increased mononuclear inflammatory cells\n3. Focal granulation tissue\n4. Neovascularization (capillary proliferation), hemorrhage\n5. Myocyte vacuolization, especially subendocardial areas\n6. Hypertrophic changes of cardiomyocytes\n7. Increased cell and nuclear size"
  },
  "PA0336": {
    "slideNo": "132",
    "diagnosis": "Lymphangioma",
    "organ": "Pericardial soft tissue",
    "diagnosisAliases": [
      "Cystic hygroma"
    ],
    "organAliases": [
      "Heart",
      "Pericardium",
      "Soft tissue"
    ]
  },
  "PA0337": {
    "slideNo": "82",
    "diagnosis": "High-grade squamous intraepithelial lesion",
    "organ": "Cervix",
    "diagnosisAliases": [
      "HSIL",
      "CIN2",
      "High-grade squamous intraepithelial lesion (HSIL, CIN2)",
      "HSIL (CIN2)"
    ],
    "organAliases": [
      "Uterine cervix"
    ]
  },
  "PA0338": {
    "slideNo": "96",
    "diagnosis": "High-grade squamous intraepithelial lesion",
    "organ": "Cervix",
    "diagnosisAliases": [
      "HSIL",
      "CIN3",
      "High-grade squamous intraepithelial lesion (HSIL, CIN3)",
      "HSIL (CIN3)"
    ],
    "organAliases": [
      "Uterine cervix"
    ]
  },
  "PA0340": {
    "slideNo": "2",
    "diagnosis": "Atherosclerosis",
    "organ": "Artery",
    "diagnosisAliases": [
      "Atheroma",
      "Atherosclerotic cardiovascular disease"
    ],
    "organAliases": [
      "Aorta",
      "Artery (aorta)"
    ]
  },
  "PA0341": {
    "slideNo": "146",
    "diagnosis": "Hyaline membrane disease",
    "organ": "Lung",
    "diagnosisAliases": [
      "Respiratory distress syndrome",
      "RDS",
      "Neonatal respiratory distress syndrome",
      "NRDS"
    ],
    "organAliases": []
  },
  "PA0342": {
    "slideNo": "69",
    "diagnosis": "Alcoholic steatohepatitis",
    "organ": "Liver",
    "diagnosisAliases": [
      "ASH",
      "Alcoholic hepatitis"
    ],
    "organAliases": []
  },
  "PA0343": {
    "slideNo": "57",
    "diagnosis": "Intraductal papillary mucinous neoplasm",
    "organ": "Pancreas",
    "diagnosisAliases": [
      "IPMN",
      "Intraductal papillary mucinous neoplasm (IPMN)"
    ],
    "organAliases": []
  },
  "PA0344": {
    "slideNo": "82",
    "diagnosis": "Ductal adenocarcinoma",
    "organ": "Pancreas",
    "diagnosisAliases": [
      "Pancreatic ductal adenocarcinoma",
      "PDAC",
      "Pancreatic adenocarcinoma",
      "Adenocarcinoma"
    ],
    "organAliases": []
  },
  "PA0345": {
    "slideNo": "62",
    "diagnosis": "Chronic cholecystitis",
    "organ": "Gallbladder",
    "diagnosisAliases": [
      "Cholecystitis"
    ],
    "organAliases": []
  }
};
