import React from 'react';
import { Download, FileCode, Wine, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onDownloadScript: () => void;
  onDownloadCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDownloadScript, onDownloadCsv }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-rose-900 text-rose-50 flex items-center justify-center font-bold shadow-sm">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                Red Wine Quality
              </span>
              <span className="text-xs text-slate-500 font-mono tracking-tight block">
                Cortez et al. (2009) · Puntos 2 y 3
              </span>
            </div>
          </div>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#punto2" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Estadísticas
            </a>
            <a href="#justificacion" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Justificación pH
            </a>
            <a href="#punto3" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Normalidad y MLE
            </a>
            <a href="#graficos" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Gráficos (1x2)
            </a>
            <a href="#codigo-python" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Script Python
            </a>
            <a href="#conclusion" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Conclusión
            </a>
          </nav>

          {/* Zone 3: Primary action button group */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="Descargar dataset winequality-red.csv"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Dataset</span>
            </button>
            <button
              onClick={onDownloadScript}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-md shadow-sm transition-colors whitespace-nowrap"
              title="Descargar script Python con pandas, scipy y matplotlib"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Descargar .py</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
