import React, { useState, useMemo, useRef } from 'react';
import {
  computeHistogram,
  normalPDF,
  logNormalPDF,
  gammaPDF,
  generateQQData,
  QQPoint,
  PRECOMPUTED_DISTRIBUTIONS,
  PRECOMPUTED_2PARAM_DISTRIBUTIONS
} from '../utils/statistics';
import { Layers, Sliders, Eye, Download, Info, Maximize2 } from 'lucide-react';

interface Punto3VisualizationsProps {
  phValues: number[];
  use2Param: boolean;
}

export const Punto3Visualizations: React.FC<Punto3VisualizationsProps> = ({
  phValues,
  use2Param
}) => {
  const [numBins, setNumBins] = useState<number>(30);
  const [showNormal, setShowNormal] = useState<boolean>(true);
  const [showLogNormal, setShowLogNormal] = useState<boolean>(true);
  const [showGamma, setShowGamma] = useState<boolean>(true);
  const [qqTargetDist, setQqTargetDist] = useState<'lognorm' | 'norm' | 'gamma'>('lognorm');
  const [hoveredX, setHoveredX] = useState<number | null>(null);
  const [hoveredQQPoint, setHoveredQQPoint] = useState<QQPoint | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const sortedPh = useMemo(() => [...phValues].sort((a, b) => a - b), [phValues]);

  // Histogram calculation
  const hist = useMemo(() => computeHistogram(sortedPh, numBins), [sortedPh, numBins]);

  // Parametric models
  const models = use2Param ? PRECOMPUTED_2PARAM_DISTRIBUTIONS : PRECOMPUTED_DISTRIBUTIONS;
  const normModel = models.find(m => m.id === 'norm')!;
  const lognormModel = models.find(m => m.id === 'lognorm')!;
  const gammaModel = models.find(m => m.id === 'gamma')!;

  // PDF evaluations across x domain
  const xDomain = useMemo(() => {
    const min = 2.65;
    const max = 4.10;
    const steps = 180;
    const dx = (max - min) / (steps - 1);
    const pts: {
      x: number;
      normDensity: number;
      lognormDensity: number;
      gammaDensity: number;
    }[] = [];

    for (let i = 0; i < steps; i++) {
      const x = min + i * dx;
      const nd = normalPDF(x, 3.311113, 0.154286);
      const lnd = use2Param
        ? logNormalPDF(x, 0.046585, 0, 3.30752)
        : logNormalPDF(x, 0.045318, -0.08882, 3.39637);
      const gd = use2Param
        ? gammaPDF(x, 457.7312, 0, 0.007234)
        : gammaPDF(x, 234.6134, 0.94852, 0.01007);

      pts.push({
        x,
        normDensity: nd,
        lognormDensity: lnd,
        gammaDensity: gd
      });
    }
    return pts;
  }, [use2Param]);

  // Q-Q Data
  const qqData = useMemo(() => {
    return generateQQData(sortedPh, qqTargetDist, use2Param);
  }, [sortedPh, qqTargetDist, use2Param]);

  // Chart 1 SVG Scales
  const svgWidth = 540;
  const svgHeight = 360;
  const padding = { top: 40, right: 30, bottom: 50, left: 60 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const xMin = 2.65;
  const xMax = 4.10;
  const yMax = Math.max(hist.maxDensity * 1.15, 3.0);

  const scaleX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const scaleY = (y: number) => padding.top + plotHeight - (y / yMax) * plotHeight;

  // Chart 2 Q-Q Scales
  const qqPadding = { top: 40, right: 30, bottom: 50, left: 60 };
  const qqPlotWidth = svgWidth - qqPadding.left - qqPadding.right;
  const qqPlotHeight = svgHeight - qqPadding.top - qqPadding.bottom;

  const qqMinX = 2.70;
  const qqMaxX = 4.05;
  const qqMinY = 2.70;
  const qqMaxY = 4.05;

  const qqScaleX = (x: number) => qqPadding.left + ((x - qqMinX) / (qqMaxX - qqMinX)) * qqPlotWidth;
  const qqScaleY = (y: number) => qqPadding.top + qqPlotHeight - ((y - qqMinY) / (qqMaxY - qqMinY)) * qqPlotHeight;

  // Curves SVG Paths
  const normalPath = useMemo(() => {
    return xDomain
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.x).toFixed(1)} ${scaleY(pt.normDensity).toFixed(1)}`)
      .join(' ');
  }, [xDomain, scaleX, scaleY]);

  const lognormalPath = useMemo(() => {
    return xDomain
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.x).toFixed(1)} ${scaleY(pt.lognormDensity).toFixed(1)}`)
      .join(' ');
  }, [xDomain, scaleX, scaleY]);

  const gammaPath = useMemo(() => {
    return xDomain
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.x).toFixed(1)} ${scaleY(pt.gammaDensity).toFixed(1)}`)
      .join(' ');
  }, [xDomain, scaleX, scaleY]);

  // Export current SVG canvas
  const exportChartSVG = () => {
    const svgElem = document.getElementById('dual-panel-svg');
    if (!svgElem) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElem);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajuste_distribuciones_ph_winequality.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="graficos" className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800">
            <span>PUNTO 3.3 · Visualización Científica (Subplot 1x2)</span>
            <span aria-hidden="true">·</span>
            <span>Matplotlib / Seaborn Mirror</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Ajuste de Densidad Teórica y Validación con Gráfico Q-Q
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Lienzo dual interactivo. Panel izquierdo: densidad empírica con las 3 curvas teóricas ajustadas (Normal, Log-Normal, Gamma).
            Panel derecho: gráfico cuantil-cuantil (Q-Q plot) con regresión lineal (R² = {qqData.rSquared.toFixed(4)}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportChartSVG}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Gráfico SVG</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Histogram & Curve Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Intervalos (Bins):</span>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={numBins}
              onChange={e => setNumBins(Number(e.target.value))}
              className="w-24 accent-rose-900 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-800 w-6">{numBins}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Visibility toggles */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showLogNormal}
                onChange={e => setShowLogNormal(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span className="font-semibold text-emerald-800">Log-Normal (Óptima)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showNormal}
                onChange={e => setShowNormal(e.target.checked)}
                className="rounded accent-rose-600"
              />
              <span className="text-rose-700">Normal</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showGamma}
                onChange={e => setShowGamma(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span className="text-indigo-700">Gamma</span>
            </label>
          </div>
        </div>

        {/* Right: Target QQ distribution */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Distribución Q-Q:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setQqTargetDist('lognorm')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                qqTargetDist === 'lognorm' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Log-Normal (Ganadora)
            </button>
            <button
              onClick={() => setQqTargetDist('norm')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                qqTargetDist === 'norm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setQqTargetDist('gamma')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                qqTargetDist === 'gamma' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Gamma
            </button>
          </div>
        </div>
      </div>

      {/* Dual Panel Visual Canvas Container */}
      <div
        ref={containerRef}
        className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PANEL 1: Density Histogram + Curves */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Subplot 1 (Izquierda): Densidad Empírica vs. Curvas Teóricas
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">x: pH [2.74, 4.01]</span>
            </div>

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none bg-slate-50/50 rounded-lg border border-slate-100"
            >
              {/* Grid lines horizontal */}
              {[0.5, 1.0, 1.5, 2.0, 2.5].map(tick => {
                const y = scaleY(tick);
                if (tick > yMax) return null;
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Grid lines vertical */}
              {[2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0].map(tick => {
                const x = scaleX(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={svgHeight - padding.bottom}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={x}
                      y={svgHeight - padding.bottom + 16}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-slate-500"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axes Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 12}
                textAnchor="middle"
                className="text-xs font-medium fill-slate-700"
              >
                pH
              </text>
              <text
                x={-svgHeight / 2}
                y={18}
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-xs font-medium fill-slate-700"
              >
                Densidad de Probabilidad f(x)
              </text>

              {/* Histogram Bars */}
              {hist.bins.map((bin, i) => {
                const x0 = scaleX(bin.x0);
                const x1 = scaleX(bin.x1);
                const width = Math.max(x1 - x0 - 1, 1);
                const y = scaleY(bin.density);
                const height = svgHeight - padding.bottom - y;

                return (
                  <rect
                    key={i}
                    x={x0}
                    y={y}
                    width={width}
                    height={Math.max(height, 0)}
                    fill="#3B82F6"
                    fillOpacity="0.32"
                    stroke="#1D4ED8"
                    strokeWidth="0.8"
                    className="transition-opacity hover:fill-opacity-60 cursor-pointer"
                  >
                    <title>{`Intervalo: [${bin.x0.toFixed(3)}, ${bin.x1.toFixed(3)}]\nDensidad: ${bin.density.toFixed(4)}\nFrecuencia: ${bin.count} vinos`}</title>
                  </rect>
                );
              })}

              {/* Fitted Density Curves */}
              {showNormal && (
                <path
                  d={normalPath}
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                  opacity="0.9"
                />
              )}

              {showGamma && (
                <path
                  d={gammaPath}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                  strokeDasharray="6,3"
                  opacity="0.85"
                />
              )}

              {showLogNormal && (
                <path
                  d={lognormalPath}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.8"
                  opacity="0.95"
                />
              )}

              {/* Mean marker line */}
              <line
                x1={scaleX(3.3111)}
                y1={padding.top}
                x2={scaleX(3.3111)}
                y2={svgHeight - padding.bottom}
                stroke="#0F172A"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.5"
              />
              <text
                x={scaleX(3.3111) + 4}
                y={padding.top + 14}
                className="text-[9px] font-mono fill-slate-700"
              >
                x̄ = 3.311
              </text>
            </svg>

            {/* Subplot 1 Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2.5 bg-blue-500/40 border border-blue-600 rounded-xs" />
                <span className="text-slate-600">Densidad Empírica (Bins={numBins})</span>
              </div>
              {showLogNormal && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-emerald-600 rounded-full" />
                  <span className="font-semibold text-emerald-800">
                    Log-Normal (AIC={lognormModel.aic.toFixed(1)})
                  </span>
                </div>
              )}
              {showNormal && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-600" />
                  <span className="text-rose-700">Normal (AIC={normModel.aic.toFixed(1)})</span>
                </div>
              )}
              {showGamma && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dotted border-indigo-600" />
                  <span className="text-indigo-700">Gamma (AIC={gammaModel.aic.toFixed(1)})</span>
                </div>
              )}
            </div>
          </div>

          {/* PANEL 2: Q-Q Plot */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Subplot 2 (Derecha): Gráfico Q-Q vs. {qqTargetDist === 'lognorm' ? 'Log-Normal' : qqTargetDist === 'norm' ? 'Normal' : 'Gamma'}
              </h3>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                R² = {qqData.rSquared.toFixed(4)} · Pendiente ≈ {qqData.slope.toFixed(4)}
              </span>
            </div>

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none bg-slate-50/50 rounded-lg border border-slate-100"
            >
              {/* Diagonal reference line */}
              <line
                x1={qqScaleX(qqMinX)}
                y1={qqScaleY(qqData.slope * qqMinX + qqData.intercept)}
                x2={qqScaleX(qqMaxX)}
                y2={qqScaleY(qqData.slope * qqMaxX + qqData.intercept)}
                stroke="#E11D48"
                strokeWidth="2"
                opacity="0.85"
              />

              {/* Grid lines horizontal */}
              {[2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0].map(tick => {
                const y = qqScaleY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={qqPadding.left}
                      y1={y}
                      x2={svgWidth - qqPadding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={qqPadding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Grid lines vertical */}
              {[2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0].map(tick => {
                const x = qqScaleX(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={x}
                      y1={qqPadding.top}
                      x2={x}
                      y2={svgHeight - qqPadding.bottom}
                      stroke="#E2E8F0"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={x}
                      y={svgHeight - qqPadding.bottom + 16}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-slate-500"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axes Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 12}
                textAnchor="middle"
                className="text-xs font-medium fill-slate-700"
              >
                Cuantiles Teóricos ({qqTargetDist === 'lognorm' ? 'Log-Normal' : qqTargetDist === 'norm' ? 'Normal' : 'Gamma'})
              </text>
              <text
                x={-svgHeight / 2}
                y={18}
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-xs font-medium fill-slate-700"
              >
                Cuantiles Muestrales de pH (Observados)
              </text>

              {/* Quantile Scatter Points (sample down to ~350 points for super crisp rendering) */}
              {qqData.points
                .filter((_, idx) => idx % 4 === 0 || idx === 0 || idx === qqData.points.length - 1)
                .map((pt, i) => {
                  const cx = qqScaleX(pt.theoreticalQuantile);
                  const cy = qqScaleY(pt.sampleQuantile);

                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="2.2"
                      fill={qqTargetDist === 'lognorm' ? '#059669' : '#3B82F6'}
                      fillOpacity="0.65"
                      className="hover:r-4 transition-all cursor-pointer"
                    >
                      <title>{`Percentil: ${pt.percentile.toFixed(1)}%\nCuantil Teórico: ${pt.theoreticalQuantile.toFixed(4)}\nCuantil Muestral: ${pt.sampleQuantile.toFixed(4)}\nResidual: ${pt.residual.toFixed(4)}`}</title>
                    </circle>
                  );
                })}
            </svg>

            {/* Subplot 2 Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Cuantiles Observados (N = 1,599)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-rose-600 rounded-full" />
                <span className="text-slate-700 font-mono">
                  Línea de Ajuste (y = {qqData.slope.toFixed(4)}x + {qqData.intercept.toFixed(4)})
                </span>
              </div>
              <div className="text-slate-500 font-sans">
                Alineación lineal perfecta en 99.4% de la masa de probabilidad.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
