import React from 'react';
import { Scale, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export const Punto3NormalityTests: React.FC = () => {
  return (
    <section id="punto3" className="scroll-mt-20">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800">
          <span>PUNTO 3.1 · Evaluación Formal de Normalidad</span>
          <span aria-hidden="true">·</span>
          <span>Pruebas de Bondad de Ajuste</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Pruebas Estadísticas de Hipótesis sobre la Normalidad del pH
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Contraste de la hipótesis nula H₀: «La variable pH sigue una distribución normal» frente a H₁: «La variable pH no sigue una distribución normal»,
          evaluando el impacto del tamaño muestral (N = 1,599) en la potencia de las pruebas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shapiro-Wilk Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs">
                S-W
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Prueba de Shapiro-Wilk</h3>
                <span className="text-[11px] text-slate-500 font-mono">scipy.stats.shapiro(df['pH'])</span>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Rechaza H₀ (p &lt; 0.05)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                Estadístico W
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                0.993486
              </span>
              <span className="block text-[10px] text-emerald-700 font-sans mt-0.5">
                Cercanía extrema a 1.0 (99.35%)
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                p-valor
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-rose-700">
                1.7122 × 10⁻⁶
              </span>
              <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                p = 0.0000017 &lt; α = 0.05
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            El estadístico W mide la correlación entre los cuantiles muestrales y los pesos óptimos normalizados.
            Aunque W = 0.9935 indica una forma central sumamente parecida a una campana de Gauss, el p-valor resulta
            estrictamente inferior a 0.05 debido al alto tamaño de muestra N = 1,599.
          </p>
        </div>

        {/* D'Agostino-Pearson Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs">
                D-P
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Prueba de D'Agostino-Pearson</h3>
                <span className="text-[11px] text-slate-500 font-mono">scipy.stats.normaltest(df['pH'])</span>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Rechaza H₀ (p &lt; 0.05)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                Estadístico K² (Omnibus)
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                33.6847
              </span>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                z₁ = 3.14 (sesgo) · z₂ = 4.88 (curt)
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                p-valor
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-rose-700">
                4.8469 × 10⁻⁸
              </span>
              <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                Distribución χ² con 2 g.l.
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Combina las transformaciones normalizadas del sesgo (asimetría = 0.1937) y la curtosis (exceso = 0.8069).
            El valor K² = 33.68 se sitúa holgadamente en la región crítica de la distribución χ²(2) (valor crítico en α=0.05 es 5.991),
            confirmando desviación en los momentos superiores.
          </p>
        </div>
      </div>

      {/* Critical Methodological Interpretation Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Interpretación Epistemológica: El Efecto del Gran Tamaño Muestral (N = 1,599)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              En estadística inferencial, las pruebas de normalidad como Shapiro-Wilk y D'Agostino-Pearson son
              <strong> ultra-sensibles a divergencias infinitesimales</strong> cuando el tamaño muestral N supera las 500 observaciones.
              Para N = 1,599, cualquier mínima asimetría (como γ₁ = 0.1937 generada por la naturaleza físico-química del pH)
              produce un p-valor menor a 0.05, rechazando la normalidad perfecta estricta.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Esto <strong>no significa que los datos sean caóticos</strong>; de hecho, W = 0.9935 demuestra un ajuste casi impecable.
              Sin embargo, esta detección de una leve asimetría positiva en soporte físico positivo [2.74, 4.01] conduce a la
              necesidad de comparar la distribución Normal con modelos teóricos asimétricos continuos: la <strong>Distribución Log-Normal</strong> y
              la <strong>Distribución Gamma</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
