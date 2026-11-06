import React, { useState } from 'react';
import { DistributionFitResult, PRECOMPUTED_DISTRIBUTIONS, PRECOMPUTED_2PARAM_DISTRIBUTIONS } from '../utils/statistics';
import { Award, Check, TrendingDown, ArrowUpRight, HelpCircle } from 'lucide-react';

interface Punto3DistributionComparisonProps {
  use2Param: boolean;
  onToggleParamMode: (use2Param: boolean) => void;
}

export const Punto3DistributionComparison: React.FC<Punto3DistributionComparisonProps> = ({
  use2Param,
  onToggleParamMode
}) => {
  const models = use2Param ? PRECOMPUTED_2PARAM_DISTRIBUTIONS : PRECOMPUTED_DISTRIBUTIONS;

  return (
    <section className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800">
            <span>PUNTO 3.2 · Estimación por Máxima Verosimilitud (MLE)</span>
            <span aria-hidden="true">·</span>
            <span>Comparación de Criterios de Información</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Tabla Comparativa de Modelos Teóricos Ajustados (Normal vs. Log-Normal vs. Gamma)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Ajuste de parámetros mediante optimización MLE. La distribución que minimiza el AIC y BIC y maximiza
            la Log-Verosimilitud representa el modelo estocástico óptimo de acuerdo con el principio de parsimonia.
          </p>
        </div>

        {/* Parametrization toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => onToggleParamMode(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              !use2Param ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ajuste General (3 Parámetros)
          </button>
          <button
            onClick={() => onToggleParamMode(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              use2Param ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Soporte Canónico (floc=0)
          </button>
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Distribución Teórica</th>
                <th className="py-3 px-4 whitespace-nowrap">Parámetros Estimados (MLE)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Log-Likelihood (ln L)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Estadístico K-S (D)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">p-valor K-S</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">AIC (Akaike)</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">BIC (Bayesiano)</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Veredicto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map(model => {
                const isBest = model.isBestFit;

                return (
                  <tr
                    key={model.id}
                    className={isBest ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50/60'}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: model.color }}
                        />
                        <div>
                          <div className={`text-xs ${isBest ? 'font-bold text-emerald-950' : 'font-semibold text-slate-900'}`}>
                            {model.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            k = {model.k} parámetros libres
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800">
                      {model.paramString}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      <span className={isBest ? 'font-bold text-emerald-700' : ''}>
                        {model.logLikelihood.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      <span className={isBest ? 'font-bold text-emerald-700' : ''}>
                        {model.ksStat.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      <span className={isBest ? 'font-bold text-emerald-700' : ''}>
                        {model.ksPValue.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className={isBest ? 'font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded' : 'text-slate-800'}>
                        {model.aic.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className={isBest ? 'font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded' : 'text-slate-800'}>
                        {model.bic.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isBest ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Mejor Ajuste</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Subóptimo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Insight footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Principio de Decisión:</span>
            <span>Menor AIC/BIC = mayor parsimonia. Mayor Log-Likelihood = mejor ajuste de densidad. Menor K-S = menor discrepancia acumulada.</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 font-semibold shrink-0">
            ΔAIC (LogNormal vs Normal) = -4.96 unidades
          </div>
        </div>
      </div>

      {/* Model Parameter Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map(m => (
          <div
            key={m.id}
            className={`p-4 rounded-xl border transition-colors ${
              m.isBestFit
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">{m.fullName}</span>
              {m.isBestFit && (
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider font-mono">
                  Ganadora
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-600 bg-slate-100/70 p-2 rounded mb-3 overflow-x-auto">
              {m.formula}
            </div>

            <div className="space-y-1.5">
              {m.parameters.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-sans">{p.name} ({p.symbol}):</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-800">
                    {p.value.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
