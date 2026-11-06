import React, { useState } from 'react';
import { VariableStats } from '../utils/statistics';
import { Check, ShieldAlert, Sparkles, Activity, Layers, Ban } from 'lucide-react';

interface Punto2JustificationPHProps {
  statsList: VariableStats[];
}

export const Punto2JustificationPH: React.FC<Punto2JustificationPHProps> = ({ statsList }) => {
  const [activeComparison, setActiveComparison] = useState<'residualSugar' | 'chlorides' | 'citricAcid'>('residualSugar');

  const phStat = statsList.find(s => s.key === 'pH');
  const compStat = statsList.find(s => s.key === activeComparison);

  return (
    <section id="justificacion" className="scroll-mt-20">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800">
          <span>PUNTO 2.3 · Justificación Teórica y Empírica</span>
          <span aria-hidden="true">·</span>
          <span>Criterios Fisicoquímicos y Matemáticos</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          ¿Por qué el pH es la Variable Continua Óptima para Ajustar una Distribución Teórica?
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          El ajuste paramétrico de funciones continuas de densidad de probabilidad por Máxima Verosimilitud (MLE)
          exige condiciones matemáticas estrictas de soporte, simetría y regularidad. El pH satisface con creces
          los tres pilares fundamentales.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pillar 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              1. Naturaleza Estrictamente Continua
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El pH se define formalmente como el potencial logarítmico negativo de la actividad de iones de hidrógeno:
              <span className="block my-2 py-1.5 px-2 bg-slate-50 font-mono text-center text-slate-800 rounded border border-slate-200">
                pH = -log₁₀(a_H⁺)
              </span>
              Emerge del equilibrio termodinámico continuo de disociación de múltiples ácidos orgánicos débiles
              (tartárico pKₐ₁=2.98, málico pKₐ₁=3.40, láctico pKₐ=3.86). En el vino tinto opera en un soporte físico natural
              acotado en [2.74, 4.01] medido mediante electrometría potenciométrica de electrodo de vidrio, sin pasos discretos.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Soporte estrictamente continuo en ℝ⁺</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              2. Simetría y Estabilidad de Momentos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Presenta una simetría empírica excepcional: asimetría de Fisher-Pearson γ₁ = +0.1937 (|γ₁| &lt; 0.5 define simetría casi pura)
              y curtosis en exceso γ₂ = +0.8069 (mesocúrtica moderada).
              <span className="block my-2 py-1.5 px-2 bg-slate-50 font-mono text-center text-slate-800 rounded border border-slate-200">
                x̄ = 3.3111 ≈ Me = 3.3100 (Δ = 0.0011)
              </span>
              A diferencia de <span className="font-mono text-slate-800">chlorides</span> (γ₁=5.68, γ₂=41.72) o{' '}
              <span className="font-mono text-slate-800">residual sugar</span> (γ₁=4.54, γ₂=28.62), no presenta colas ultra-pesadas
              ni valores atípicos que desestabilicen los gradientes de verosimilitud.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Distribución unimodal campaneiforme</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Ban className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              3. Ausencia de Ceros o Censura
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              En las variables de concentración analítica es frecuente la censura a izquierda por límite de detección. Por ejemplo,{' '}
              <span className="font-mono text-slate-800">citric acid</span> presenta 132 vinos con concentración 0.0 g/dm³ (8.25% de la muestra),
              lo que crea una masa puntual discontinua incompatible con densidades continuas sin modelos *zero-inflated*.
              <span className="block my-2 py-1.5 px-2 bg-slate-50 font-mono text-center text-slate-800 rounded border border-slate-200">
                pH_min = 2.74 &gt;&gt; 0 (Cero Censura)
              </span>
              El pH está biológicamente alejado de cero; no existen ceros estructurales ni censura instrumental.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Condiciones de regularidad MLE garantizadas</span>
          </div>
        </div>
      </div>

      {/* Interactive Contrast Console: pH vs Pathological Variables */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Contraste Empírico: pH frente a Variables Problemáticas
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona una variable alternativa para cotejar cómo su comportamiento desaconseja el modelado teórico univariado.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveComparison('residualSugar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeComparison === 'residualSugar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              vs. Azúcar Residual
            </button>
            <button
              onClick={() => setActiveComparison('chlorides')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeComparison === 'chlorides'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              vs. Cloruros
            </button>
            <button
              onClick={() => setActiveComparison('citricAcid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeComparison === 'citricAcid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              vs. Ácido Cítrico
            </button>
          </div>
        </div>

        {phStat && compStat && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* pH Card */}
            <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-bold text-xs text-emerald-950 font-mono uppercase">
                    pH (Variable Seleccionada)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800">
                  Idoneidad: 10/10
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Media</span>
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{phStat.mean.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Mediana</span>
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{phStat.median.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Asimetría</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono tabular-nums">+{phStat.skewness.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Curtosis</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono tabular-nums">+{phStat.kurtosis.toFixed(4)}</span>
                </div>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>Comportamiento ejemplar:</strong> Distribución cuasi-simétrica con media y mediana virtualmente coincidentes
                (diferencia de apenas 0.0011 unidades). Permite la convergencia analítica y numérica de algoritmos de optimización
                como BFGS o Nelder-Mead en el cálculo de Máxima Verosimilitud (MLE).
              </p>
            </div>

            {/* Compared Pathological Card */}
            <div className="p-4 bg-rose-50/50 rounded-lg border border-rose-200/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="font-bold text-xs text-rose-950 font-mono uppercase">
                    {compStat.name} ({compStat.labelSpanish})
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-rose-800">
                  {activeComparison === 'citricAcid' ? 'Truncamiento a Izquierda' : 'Colas Leptocúrticas'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Media</span>
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{compStat.mean.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Mediana</span>
                  <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{compStat.median.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Asimetría</span>
                  <span className="text-xs font-bold text-rose-700 font-mono tabular-nums">+{compStat.skewness.toFixed(4)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-rose-100">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Curtosis</span>
                  <span className="text-xs font-bold text-rose-700 font-mono tabular-nums">+{compStat.kurtosis.toFixed(4)}</span>
                </div>
              </div>

              <p className="text-xs text-rose-950 leading-relaxed">
                {activeComparison === 'residualSugar' && (
                  <span>
                    <strong>Desviación severa:</strong> Curtosis de 28.62 y asimetría de 4.54 debida a vinos dulces extremos
                    (hasta 15.5 g/dm³ mientras la mediana es 2.2 g/dm³). Cualquier ajuste gaussiano o gamma estándar colapsaría en las colas.
                  </span>
                )}
                {activeComparison === 'chlorides' && (
                  <span>
                    <strong>La mayor patología del dataset:</strong> Curtosis de 41.72 con asimetría de 5.68. Los valores oscilan
                    desde 0.012 hasta 0.611 g/dm³, produciendo distorsiones inaceptables en estimadores de momentos y verosimilitud.
                  </span>
                )}
                {activeComparison === 'citricAcid' && (
                  <span>
                    <strong>Violación de soporte continuo:</strong> 132 vinos reportan exactamente 0.0 g/dm³. Esto genera una masa
                    de probabilidad concentrada en la frontera inferior, haciendo imposible modelar la variable mediante una PDF
                    estrictamente diferenciable sin añadir términos Dirac delta o modelos de umbral.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
