import React, { useRef } from 'react';
import { Wine, FileCode, Download, Upload, CheckCircle2, Sparkles, Printer } from 'lucide-react';

interface HeroOverviewProps {
  onDownloadScript: () => void;
  onDownloadCsv: () => void;
  onUploadCustomCsv: (content: string, filename: string) => void;
  isCustomData: boolean;
  onResetDefaultData: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  onDownloadScript,
  onDownloadCsv,
  onUploadCustomCsv,
  isCustomData,
  onResetDefaultData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        onUploadCustomCsv(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-b border-slate-200 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800 mb-2">
              <span>Informe Estadístico Enológico</span>
              <span aria-hidden="true">·</span>
              <span>Cortez et al. (2009)</span>
              <span aria-hidden="true">·</span>
              <span>Puntos 2 y 3</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
              Modelado y Validación Distribucional del pH en Vinos Tintos
            </h1>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl text-pretty">
              Evaluación paramétrica y no paramétrica de las 11 variables fisicoquímicas continuas del dataset
              <em> Red Wine Quality</em>. Demostración formal de la idoneidad del pH frente a variables con colas pesadas o censura,
              y ajuste por Máxima Verosimilitud (MLE) de distribuciones teóricas (Normal, Log-Normal, Gamma).
            </p>

            {isCustomData && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs">
                <span>Dataset personalizado activo</span>
                <button
                  onClick={onResetDefaultData}
                  className="font-bold underline hover:text-amber-950"
                >
                  Restaurar original (1,599 filas)
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.txt"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Cargar otro archivo CSV de vinos"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Cargar CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Imprimir informe o guardar en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onDownloadScript}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
            >
              <FileCode className="w-4 h-4" />
              <span>Script Python (.py)</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Muestra Analizada
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">1,599</span>
              <span className="text-xs font-mono text-slate-500 uppercase">vinos</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-1">
              11 variables continuas evaluadas
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Variable Óptima (Punto 2)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">pH</span>
              <span className="text-xs font-mono text-slate-500">[2.74, 4.01]</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-1">
              Asimetría γ₁ = +0.1937 (cuasi-simétrica)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Modelo Ganador (Punto 3)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">Log-Normal</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-1">
              AIC = -1439.01 (Mínimo absoluto)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Alineación Q-Q (R²)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">0.9943</span>
              <span className="text-xs font-mono text-emerald-600 font-semibold">99.4%</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-1">
              Pendiente unitaria (slope ≈ 0.9997)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
