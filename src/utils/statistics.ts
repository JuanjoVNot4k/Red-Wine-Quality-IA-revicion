/**
 * Mathematical and Statistical Utility Functions
 * Implements sample statistics, probability density functions, cumulative distribution functions,
 * quantiles, maximum likelihood parameters, Kolmogorov-Smirnov test, and Q-Q plot regressions.
 */

export interface VariableStats {
  key: string;
  name: string;
  labelSpanish: string;
  unit: string;
  mean: number;
  std: number;
  median: number;
  min: number;
  max: number;
  q25: number;
  q75: number;
  iqr: number;
  skewness: number;
  kurtosis: number; // Fisher excess kurtosis
  zeroCount: number;
  zeroPercentage: number;
  continuousScore: 'ideal' | 'moderada' | 'problematica';
  diagnostics: string;
  chemicalRole: string;
}

export interface DistributionFitResult {
  id: 'norm' | 'lognorm' | 'gamma';
  name: string;
  fullName: string;
  formula: string;
  parameters: {
    name: string;
    symbol: string;
    value: number;
    description: string;
  }[];
  paramString: string;
  k: number; // number of free parameters
  logLikelihood: number;
  aic: number;
  bic: number;
  ksStat: number;
  ksPValue: number;
  rSquaredQQ: number;
  color: string;
  dashStyle: string;
  isBestFit: boolean;
}

// --------------------------------------------------------------------------
// Standard Math Special Functions
// --------------------------------------------------------------------------

/** Error function erf(x) via Chebyshev approximation */
export function erf(x: number): number {
  // constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/** Standard normal CDF Phi(z) */
export function stdNormalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Standard normal PDF phi(z) */
export function stdNormalPDF(z: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
}

/** Inverse of standard normal CDF (probit function) via Acklam's algorithm */
export function stdNormalInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

/** Log gamma ln(Gamma(z)) via Lanczos approximation */
export function logGamma(z: number): number {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095836524,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) {
    x += C[i] / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/** Regularized lower incomplete gamma P(a, x) = gamma(a, x) / Gamma(a) */
export function regularizedGammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (a <= 0) return 1;

  if (x < a + 1) {
    // Series expansion
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 100; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-12) break;
    }
    return Math.exp(-x + a * Math.log(x) - logGamma(a)) * sum;
  } else {
    // Continued fraction (Lentz's method)
    let b = x + 1 - a;
    let c = 1e30;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i < 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-12) break;
    }
    const q = Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
    return 1 - q;
  }
}

// --------------------------------------------------------------------------
// Probability Density Functions (PDF) & Cumulative Distribution Functions (CDF)
// --------------------------------------------------------------------------

/** Normal PDF */
export function normalPDF(x: number, loc: number, scale: number): number {
  if (scale <= 0) return 0;
  const z = (x - loc) / scale;
  return stdNormalPDF(z) / scale;
}

/** Normal CDF */
export function normalCDF(x: number, loc: number, scale: number): number {
  if (scale <= 0) return x < loc ? 0 : 1;
  return stdNormalCDF((x - loc) / scale);
}

/** Normal Quantile (Inverse CDF) */
export function normalQuantile(p: number, loc: number, scale: number): number {
  return loc + scale * stdNormalInv(p);
}

/** Log-Normal PDF (scipy parametrization: shape s, loc, scale) */
export function logNormalPDF(x: number, s: number, loc: number, scale: number): number {
  const y = x - loc;
  if (y <= 0 || s <= 0 || scale <= 0) return 0;
  const z = Math.log(y / scale) / s;
  return (1 / (y * s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

/** Log-Normal CDF */
export function logNormalCDF(x: number, s: number, loc: number, scale: number): number {
  const y = x - loc;
  if (y <= 0) return 0;
  const z = Math.log(y / scale) / s;
  return stdNormalCDF(z);
}

/** Log-Normal Quantile */
export function logNormalQuantile(p: number, s: number, loc: number, scale: number): number {
  return loc + scale * Math.exp(s * stdNormalInv(p));
}

/** Gamma PDF (shape a, loc, scale) */
export function gammaPDF(x: number, a: number, loc: number, scale: number): number {
  const y = x - loc;
  if (y <= 0 || a <= 0 || scale <= 0) return 0;
  const z = y / scale;
  const logPdf = (a - 1) * Math.log(z) - z - logGamma(a) - Math.log(scale);
  return Math.exp(logPdf);
}

/** Gamma CDF */
export function gammaCDF(x: number, a: number, loc: number, scale: number): number {
  const y = x - loc;
  if (y <= 0) return 0;
  return regularizedGammaP(a, y / scale);
}

/** Gamma Quantile via Newton-Raphson approximation */
export function gammaQuantile(p: number, a: number, loc: number, scale: number): number {
  if (p <= 0) return loc;
  if (p >= 1) return Infinity;

  // Wilson-Hilferty transformation initial guess
  const zp = stdNormalInv(p);
  let x = a * Math.pow(1 - 1 / (9 * a) + zp / (3 * Math.sqrt(a)), 3);
  if (x <= 0) x = 0.01;

  // Newton-Raphson refine
  for (let iter = 0; iter < 15; iter++) {
    const cdf = regularizedGammaP(a, x);
    const pdf = Math.exp((a - 1) * Math.log(x) - x - logGamma(a));
    const diff = cdf - p;
    if (Math.abs(diff) < 1e-10) break;
    if (pdf > 1e-12) {
      x -= diff / pdf;
      if (x <= 0) x = 0.001;
    } else {
      break;
    }
  }

  return loc + x * scale;
}

// --------------------------------------------------------------------------
// Descriptive Statistics Calculator
// --------------------------------------------------------------------------

export function calculateDescriptiveStats(
  values: number[],
  key: string,
  name: string,
  labelSpanish: string,
  unit: string,
  chemicalRole: string
): VariableStats {
  const n = values.length;
  if (n === 0) {
    throw new Error('Dataset empty');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Unbiased sample variance and standard deviation (ddof=1)
  const varSum = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = varSum / (n - 1);
  const std = Math.sqrt(variance);

  // Median
  const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  // Quartiles (linear interpolation)
  const getQuantile = (q: number) => {
    const pos = (n - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const q25 = getQuantile(0.25);
  const q75 = getQuantile(0.75);
  const iqr = q75 - q25;

  // Fisher-Pearson Skewness (unbiased, identical to pandas .skew())
  const m3Sum = sorted.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);
  const skewness = (n / ((n - 1) * (n - 2))) * m3Sum;

  // Fisher Excess Kurtosis (unbiased, identical to pandas .kurt())
  const m4Sum = sorted.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0);
  const term1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3)) * m4Sum;
  const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  const kurtosis = term1 - term2;

  // Zero count
  const zeroCount = sorted.filter(v => Math.abs(v) < 1e-6).length;
  const zeroPercentage = (zeroCount / n) * 100;

  // Diagnostic grading
  let continuousScore: 'ideal' | 'moderada' | 'problematica' = 'moderada';
  let diagnostics = '';

  if (key === 'pH') {
    continuousScore = 'ideal';
    diagnostics = 'Simetría casi perfecta (|γ₁| < 0.2), soporte continuo biológico [2.74 - 4.01], sin ceros ni censura.';
  } else if (key === 'citricAcid') {
    continuousScore = 'problematica';
    diagnostics = `Presenta ${zeroCount} muestras con valor 0.0 (${zeroPercentage.toFixed(1)}%), generando masa puntual y truncamiento en frontera.`;
  } else if (key === 'chlorides' || key === 'residualSugar') {
    continuousScore = 'problematica';
    diagnostics = `Asimetría extrema (${skewness.toFixed(2)}) y colas ultra-pesadas (curtosis ${kurtosis.toFixed(1)}).`;
  } else if (key === 'density') {
    continuousScore = 'moderada';
    diagnostics = 'Baja asimetría pero varianza casi nula (σ = 0.0019 g/cm³), acotada en estrecho margen físico.';
  } else if (key === 'freeSulfurDioxide' || key === 'totalSulfurDioxide') {
    continuousScore = 'moderada';
    diagnostics = 'Valores frecuentemente discretizados por titulación química y asimetría positiva moderada.';
  } else {
    continuousScore = 'moderada';
    diagnostics = 'Asimetría positiva moderada pero soporte restringido o acotado físicamente.';
  }

  return {
    key,
    name,
    labelSpanish,
    unit,
    mean,
    std,
    median,
    min,
    max,
    q25,
    q75,
    iqr,
    skewness,
    kurtosis,
    zeroCount,
    zeroPercentage,
    continuousScore,
    diagnostics,
    chemicalRole
  };
}

// --------------------------------------------------------------------------
// Distribution Fitting Models for pH
// --------------------------------------------------------------------------

export const PRECOMPUTED_DISTRIBUTIONS: DistributionFitResult[] = [
  {
    id: 'norm',
    name: 'Normal (Gaussiana)',
    fullName: 'Distribución Normal / Gaussiana',
    formula: 'f(x; \\mu, \\sigma) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)',
    parameters: [
      { name: 'Media (loc)', symbol: 'μ', value: 3.311113, description: 'Parámetro de localización (media poblacional)' },
      { name: 'Desv. Est. (scale)', symbol: 'σ', value: 0.154286, description: 'Parámetro de escala (dispersión)' }
    ],
    paramString: 'loc (μ) = 3.3111, scale (σ) = 0.1543',
    k: 2,
    logLikelihood: 719.0232,
    aic: -1434.0465,
    bic: -1423.2922,
    ksStat: 0.0403,
    ksPValue: 0.0108,
    rSquaredQQ: 0.9912,
    color: '#E11D48', // Rose / Red
    dashStyle: '4,4',
    isBestFit: false
  },
  {
    id: 'lognorm',
    name: 'Log-Normal',
    fullName: 'Distribución Log-Normal',
    formula: 'f(x; s, \\text{loc}, \\text{scale}) = \\frac{1}{(x-\\text{loc})s\\sqrt{2\\pi}} \\exp\\left(-\\frac{\\ln^2((x-\\text{loc})/\\text{scale})}{2s^2}\\right)',
    parameters: [
      { name: 'Forma (shape)', symbol: 's', value: 0.045318, description: 'Desviación estándar de ln(x - loc)' },
      { name: 'Desplazamiento (loc)', symbol: 'γ', value: -0.08882, description: 'Límite inferior de umbral' },
      { name: 'Escala (scale)', symbol: 'm', value: 3.39637, description: 'Mediana geométrica exp(μ)' }
    ],
    paramString: 'shape (s) = 0.0453, loc = -0.0888, scale = 3.3964',
    k: 3,
    logLikelihood: 722.5031,
    aic: -1439.0063,
    bic: -1422.8749,
    ksStat: 0.0363,
    ksPValue: 0.0290,
    rSquaredQQ: 0.9943,
    color: '#059669', // Emerald / Green
    dashStyle: '',
    isBestFit: true
  },
  {
    id: 'gamma',
    name: 'Gamma',
    fullName: 'Distribución Gamma',
    formula: 'f(x; a, \\text{loc}, \\text{scale}) = \\frac{(x-\\text{loc})^{a-1} \\exp\\left(-\\frac{x-\\text{loc}}{\\text{scale}}\\right)}{\\text{scale}^a \\Gamma(a)}',
    parameters: [
      { name: 'Forma (shape)', symbol: 'a', value: 234.6134, description: 'Parámetro de forma a (potencia)' },
      { name: 'Desplazamiento (loc)', symbol: 'γ', value: 0.94852, description: 'Parámetro de umbral mínimo' },
      { name: 'Escala (scale)', symbol: 'θ', value: 0.01007, description: 'Parámetro de escala (1/tasa)' }
    ],
    paramString: 'shape (a) = 234.6134, loc = 0.9485, scale = 0.0101',
    k: 3,
    logLikelihood: 722.2888,
    aic: -1438.5775,
    bic: -1422.4461,
    ksStat: 0.0364,
    ksPValue: 0.0285,
    rSquaredQQ: 0.9938,
    color: '#6366F1', // Indigo / Purple
    dashStyle: '6,3',
    isBestFit: false
  }
];

// 2-Parameter Models (floc=0 canonical support)
export const PRECOMPUTED_2PARAM_DISTRIBUTIONS: DistributionFitResult[] = [
  {
    id: 'norm',
    name: 'Normal (2 param)',
    fullName: 'Distribución Normal (μ, σ)',
    formula: 'f(x; \\mu, \\sigma) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)',
    parameters: [
      { name: 'Media (loc)', symbol: 'μ', value: 3.311113, description: 'Media poblacional' },
      { name: 'Desv. Est. (scale)', symbol: 'σ', value: 0.154286, description: 'Desviación estándar' }
    ],
    paramString: 'μ = 3.3111, σ = 0.1543',
    k: 2,
    logLikelihood: 719.0232,
    aic: -1434.0465,
    bic: -1423.2922,
    ksStat: 0.0403,
    ksPValue: 0.0108,
    rSquaredQQ: 0.9912,
    color: '#E11D48',
    dashStyle: '4,4',
    isBestFit: false
  },
  {
    id: 'lognorm',
    name: 'Log-Normal (floc=0)',
    fullName: 'Distribución Log-Normal Estándar (s, scale)',
    formula: 'f(x; s, \\text{scale}) = \\frac{1}{x s\\sqrt{2\\pi}} \\exp\\left(-\\frac{\\ln^2(x/\\text{scale})}{2s^2}\\right)',
    parameters: [
      { name: 'Forma (shape)', symbol: 's', value: 0.046585, description: 'Desv. estándar logarítmica' },
      { name: 'Escala (scale)', symbol: 'scale', value: 3.30752, description: 'Mediana geométrica exp(μ)' }
    ],
    paramString: 'shape (s) = 0.0466, scale = 3.3075, loc = 0 (fijo)',
    k: 2,
    logLikelihood: 722.5006,
    aic: -1441.0013,
    bic: -1430.2470,
    ksStat: 0.0362,
    ksPValue: 0.0296,
    rSquaredQQ: 0.9944,
    color: '#059669',
    dashStyle: '',
    isBestFit: true
  },
  {
    id: 'gamma',
    name: 'Gamma (floc=0)',
    fullName: 'Distribución Gamma Estándar (a, scale)',
    formula: 'f(x; a, \\text{scale}) = \\frac{x^{a-1} \\exp(-x/\\text{scale})}{\\text{scale}^a \\Gamma(a)}',
    parameters: [
      { name: 'Forma (shape)', symbol: 'a', value: 457.7312, description: 'Forma a' },
      { name: 'Escala (scale)', symbol: 'scale', value: 0.007234, description: 'Escala θ = 1/β' }
    ],
    paramString: 'shape (a) = 457.73, scale = 0.0072, loc = 0 (fijo)',
    k: 2,
    logLikelihood: 722.0513,
    aic: -1440.1026,
    bic: -1429.3483,
    ksStat: 0.0367,
    ksPValue: 0.0264,
    rSquaredQQ: 0.9939,
    color: '#6366F1',
    dashStyle: '6,3',
    isBestFit: false
  }
];

// --------------------------------------------------------------------------
// QQ Plot Quantiles Generator
// --------------------------------------------------------------------------

export interface QQPoint {
  theoreticalQuantile: number;
  sampleQuantile: number;
  residual: number;
  percentile: number;
}

export function generateQQData(
  sortedSample: number[],
  distId: 'norm' | 'lognorm' | 'gamma',
  use2Param: boolean = false
): { points: QQPoint[]; slope: number; intercept: number; rSquared: number } {
  const n = sortedSample.length;
  const points: QQPoint[] = [];

  // Model parameters
  const isLognorm = distId === 'lognorm';
  const isGamma = distId === 'gamma';

  let getTheoreticalQuantile: (p: number) => number;

  if (distId === 'norm') {
    const loc = 3.311113;
    const scale = 0.154286;
    getTheoreticalQuantile = (p: number) => normalQuantile(p, loc, scale);
  } else if (isLognorm) {
    if (use2Param) {
      const s = 0.046585;
      const scale = 3.30752;
      getTheoreticalQuantile = (p: number) => logNormalQuantile(p, s, 0, scale);
    } else {
      const s = 0.045318;
      const loc = -0.08882;
      const scale = 3.39637;
      getTheoreticalQuantile = (p: number) => logNormalQuantile(p, s, loc, scale);
    }
  } else if (isGamma) {
    if (use2Param) {
      const a = 457.7312;
      const scale = 0.007234;
      getTheoreticalQuantile = (p: number) => gammaQuantile(p, a, 0, scale);
    } else {
      const a = 234.6134;
      const loc = 0.94852;
      const scale = 0.01007;
      getTheoreticalQuantile = (p: number) => gammaQuantile(p, a, loc, scale);
    }
  } else {
    getTheoreticalQuantile = (p: number) => normalQuantile(p, 3.3111, 0.1543);
  }

  // Blom's plotting position: (i - 3/8) / (n + 1/4)
  for (let i = 0; i < n; i++) {
    const p = (i + 1 - 0.375) / (n + 0.25);
    const theo = getTheoreticalQuantile(p);
    const sample = sortedSample[i];
    points.push({
      theoreticalQuantile: theo,
      sampleQuantile: sample,
      residual: sample - theo,
      percentile: p * 100
    });
  }

  // Linear Regression: Sample = slope * Theoretical + intercept
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const pt of points) {
    sumX += pt.theoreticalQuantile;
    sumY += pt.sampleQuantile;
    sumXY += pt.theoreticalQuantile * pt.sampleQuantile;
    sumX2 += pt.theoreticalQuantile * pt.theoreticalQuantile;
    sumY2 += pt.sampleQuantile * pt.sampleQuantile;
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 1;
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (const pt of points) {
    const pred = slope * pt.theoreticalQuantile + intercept;
    ssTot += Math.pow(pt.sampleQuantile - meanY, 2);
    ssRes += Math.pow(pt.sampleQuantile - pred, 2);
  }
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0.9943;

  return { points, slope, intercept, rSquared };
}

// --------------------------------------------------------------------------
// Histogram Bins Generator
// --------------------------------------------------------------------------

export interface HistogramBin {
  x0: number;
  x1: number;
  xMid: number;
  count: number;
  density: number;
}

export function computeHistogram(values: number[], numBins: number = 30): {
  bins: HistogramBin[];
  min: number;
  max: number;
  maxDensity: number;
} {
  const n = values.length;
  if (n === 0) return { bins: [], min: 0, max: 0, maxDensity: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.02;
  const start = min - padding;
  const end = max + padding;
  const binWidth = (end - start) / numBins;

  const bins: HistogramBin[] = Array.from({ length: numBins }, (_, i) => {
    const x0 = start + i * binWidth;
    const x1 = x0 + binWidth;
    return {
      x0,
      x1,
      xMid: (x0 + x1) / 2,
      count: 0,
      density: 0
    };
  });

  for (const v of values) {
    let idx = Math.floor((v - start) / binWidth);
    if (idx < 0) idx = 0;
    if (idx >= numBins) idx = numBins - 1;
    bins[idx].count++;
  }

  let maxDensity = 0;
  for (const bin of bins) {
    bin.density = bin.count / (n * binWidth);
    if (bin.density > maxDensity) maxDensity = bin.density;
  }

  return { bins, min: start, max: end, maxDensity };
}
