export interface VariableMeta {
  key: string;
  name: string;
  labelSpanish: string;
  unit: string;
  chemicalFormula?: string;
  chemicalRole: string;
  samplingMethod: string;
  continuousSuitability: 'Óptima (pH)' | 'Problemática (Ceros)' | 'Problemática (Colas Pesadas)' | 'Moderada';
  justificationNotes: string;
}

export const PHYSICOCHEMICAL_VARIABLES_META: VariableMeta[] = [
  {
    key: 'fixedAcidity',
    name: 'fixed acidity',
    labelSpanish: 'Acidez Fija',
    unit: 'g(ácido tartárico)/dm³',
    chemicalFormula: 'C₄H₆O₆',
    chemicalRole: 'Ácidos orgánicos no volátiles mayoritarios (tartárico, málico y cítrico) que dan estructura y frescura al vino.',
    samplingMethod: 'Titulación volumétrica ácido-base con NaOH.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Presenta asimetría positiva moderada (0.98) y colas hacia valores altos por adiciones enológicas de tartárico.'
  },
  {
    key: 'volatileAcidity',
    name: 'volatile acidity',
    labelSpanish: 'Acidez Volátil',
    unit: 'g(ácido acético)/dm³',
    chemicalFormula: 'CH₃COOH',
    chemicalRole: 'Ácido acético producido por fermentación bacteriana (Acetobacter). Niveles excesivos imparten sabor avinagrado desagradable.',
    samplingMethod: 'Destilación por arrastre de vapor y titulación.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Asimetría positiva (0.67), limitada legalmente a máximos por reglamentación vinícola.'
  },
  {
    key: 'citricAcid',
    name: 'citric acid',
    labelSpanish: 'Ácido Cítrico',
    unit: 'g/dm³',
    chemicalFormula: 'C₆H₈O₇',
    chemicalRole: 'Ácido tricarboxílico presente en pequeñas cantidades; añade frescura y complejidad pero puede ser degradado por bacterias lácticas.',
    samplingMethod: 'Método enzimático o cromatografía líquida (HPLC).',
    continuousSuitability: 'Problemática (Ceros)',
    justificationNotes: 'Posee 132 muestras exactamente en 0.0 g/dm³ (8.25% de la muestra), generando una masa puntual en cero y violando la continuidad estricta sin censura.'
  },
  {
    key: 'residualSugar',
    name: 'residual sugar',
    labelSpanish: 'Azúcar Residual',
    unit: 'g/dm³',
    chemicalFormula: 'C₆H₁₂O₆ (Glucosa + Fructosa)',
    chemicalRole: 'Azúcares no fermentados remanentes tras la fermentación alcohólica. En vinos secos suele ser inferior a 3-4 g/L.',
    samplingMethod: 'Método de Rebelein o densimetría con corrección alcohólica.',
    continuousSuitability: 'Problemática (Colas Pesadas)',
    justificationNotes: 'Extrema asimetría positiva (4.54) y curtosis leptocúrtica severa (28.62) con vinos atípicos dulces hasta 15.5 g/dm³.'
  },
  {
    key: 'chlorides',
    name: 'chlorides',
    labelSpanish: 'Cloruros',
    unit: 'g(NaCl)/dm³',
    chemicalFormula: 'Cl⁻',
    chemicalRole: 'Sales minerales de cloro provenientes del terruño y el agua de riego. Aportan salinidad al paladar.',
    samplingMethod: 'Potenciometría de ión selectivo o método de Charpentier-Volhard.',
    continuousSuitability: 'Problemática (Colas Pesadas)',
    justificationNotes: 'La variable con mayor patología distribucional: asimetría 5.68 y curtosis 41.72 con valores extremos atípicos.'
  },
  {
    key: 'freeSulfurDioxide',
    name: 'free sulfur dioxide',
    labelSpanish: 'Dióxido de Azufre Libre (SO₂)',
    unit: 'mg/dm³',
    chemicalFormula: 'SO₂ (gas + bisulfito)',
    chemicalRole: 'Forma activa de SO₂ libre no combinada. Actúa como antioxidante primordial y agente antimicrobiano.',
    samplingMethod: 'Titulación yodométrica rápida (método de Ripper).',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Reportado como valores enteros o casi enteros (discretización instrumental de titulación).'
  },
  {
    key: 'totalSulfurDioxide',
    name: 'total sulfur dioxide',
    labelSpanish: 'Dióxido de Azufre Total (SO₂)',
    unit: 'mg/dm³',
    chemicalFormula: 'SO₂ libre + combinado',
    chemicalRole: 'Suma de SO₂ libre y formas combinadas con aldehídos y azúcares. Estrictamente regulado por salud pública.',
    samplingMethod: 'Destilación y acidificación previa a titulación yodométrica.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Asimetría positiva marcada (1.52) y amplio rango con colas extendidas hasta 289 mg/dm³.'
  },
  {
    key: 'density',
    name: 'density',
    labelSpanish: 'Densidad',
    unit: 'g/cm³',
    chemicalFormula: 'ρ (Masa / Volumen)',
    chemicalRole: 'Determinada por el contenido alcohólico (< 1.0) y los sólidos disueltos/azúcares (> 1.0).',
    samplingMethod: 'Picnometría hidrostática o densímetro oscilante digital de tubo en U.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Aunque simétrica (asimetría 0.07), su desviación estándar es diminuta (σ = 0.0019) y está constreñida en un estrechísimo rango físico.'
  },
  {
    key: 'pH',
    name: 'pH',
    labelSpanish: 'pH (Potencial Hidrógeno)',
    unit: 'unidades de pH',
    chemicalFormula: '-\\log_{10}[a_{\\text{H}^+}]',
    chemicalRole: 'Regulador maestro de la estabilidad microbiológica, el equilibrio de ionización de antocianos (color) y la percepción de acidez.',
    samplingMethod: 'Potenciometría de alta resolución con electrodo de vidrio combinado.',
    continuousSuitability: 'Óptima (pH)',
    justificationNotes: 'Variable continua ejemplar: distribución unimodal mesocúrtica simétrica (|asimetría| = 0.19, curtosis = 0.81), media ≈ mediana (3.31), sin ceros ni censura artificial.'
  },
  {
    key: 'sulphates',
    name: 'sulphates',
    labelSpanish: 'Sulfatos',
    unit: 'g(K₂SO₄)/dm³',
    chemicalFormula: 'SO₄²⁻',
    chemicalRole: 'Sales de sulfato añadidas como conservante que interactúan sinérgicamente con el SO₂.',
    samplingMethod: 'Gravimetría con cloruro de bario o turbidimetría.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Asimetría moderada-alta (2.43) y curtosis de 11.72 por vinos enriquecidos con sales potásicas.'
  },
  {
    key: 'alcohol',
    name: 'alcohol',
    labelSpanish: 'Graduación Alcohólica (% vol)',
    unit: '% vol (v/v)',
    chemicalFormula: 'CH₃CH₂OH (Etanol)',
    chemicalRole: 'Etanol resultante de la conversión anaerobia de azúcares por levaduras Saccharomyces. Aporta cuerpo y calidez.',
    samplingMethod: 'Ebulliometría o densimetría tras destilación alcohólica.',
    continuousSuitability: 'Moderada',
    justificationNotes: 'Distribución asimétrica positiva (0.86) truncada en el umbral comercial de vinos secos (> 8.4%).'
  }
];
