import React, { useState, useMemo } from 'react';
import { VariableStats } from '../utils/statistics';
import { VariableMeta } from '../data/variableDescriptions';
import { ArrowUpDown, Search, Download, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Punto2VariablesTableProps {
  statsList: VariableStats[];
  metaList: VariableMeta[];
  selectedKey: string;
  onSelectVariable: (key: string) => void;
}

type SortField = 'name' | 'mean' | 'std' | 'median' | 'min' | 'max' | 'skewness' | 'kurtosis' | 'zeroPercentage';
type SortOrder = 'asc' | 'desc';

export const Punto2VariablesTable: React.FC<Punto2VariablesTableProps> = ({
  statsList,
  metaList,
  selectedKey,
  onSelectVariable
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const metaMap = useMemo(() => {
    const map = new Map<string, VariableMeta>();
    metaList.forEach(m => map.set(m.key, m));
    return map;
  }, [metaList]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'skewness' || field === 'kurtosis' ? 'desc' : 'asc');
    }
  };

  const filteredAndSortedStats = useMemo(() => {
    let result = [...statsList];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.labelSpanish.toLowerCase().includes(q) ||
          s.unit.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA: number | string = a[sortField as keyof VariableStats] as number | string;
      let valB: number | string = b[sortField as keyof VariableStats] as number | string;

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [statsList, searchTerm, sortField, sortOrder]);

  const exportTableCSV = () => {
    const headers = [
      'Variable',
      'Nombre Español',
      'Unidad',
      'Media',
      'Desv_Est',
      'Mediana',
      'Minimo',
      'Maximo',
      'Asimetria_Skewness',
      'Curtosis_Kurtosis',
      'Muestras_Cero',
      'Porcentaje_Cero'
    ];
    const rows = statsList.map(s => [
      `"${s.name}"`,
      `"${s.labelSpanish}"`,
      `"${s.unit}"`,
      s.mean.toFixed(4),
      s.std.toFixed(4),
      s.median.toFixed(4),
      s.min.toFixed(4),
      s.max.toFixed(4),
      s.skewness.toFixed(4),
      s.kurtosis.toFixed(4),
      s.zeroCount,
      s.zeroPercentage.toFixed(2) + '%'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'estadisticas_descriptivas_winequality.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedStat = statsList.find(s => s.key === selectedKey) || statsList.find(s => s.key === 'pH');
  const selectedMeta = selectedStat ? metaMap.get(selectedStat.key) : undefined;

  return (
    <section id="punto2" className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-800">
            <span>PUNTO 2 · Análisis Univariado</span>
            <span aria-hidden="true">·</span>
            <span>N = 1,599 Vinos Tintos</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Estadísticas Descriptivas de las 11 Variables Fisicoquímicas
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Cálculo muestral insesgado de medidas de tendencia central, dispersión y momentos de orden superior
            (asimetría de Fisher-Pearson y curtosis en exceso). Haz clic en cualquier variable para inspeccionar su diagnóstico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar variables..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800"
            />
          </div>
          <button
            onClick={exportTableCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Variable Fisicoquímica</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mean')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Media (x̄)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('std')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Desv. Est. (s)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('median')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Mediana (Me)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('min')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Mínimo</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('max')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Máximo</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('skewness')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Asimetría (γ₁)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('kurtosis')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Curtosis (γ₂)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center select-none whitespace-nowrap">
                  <span>Diagnóstico Continuo</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedStats.map(stat => {
                const isSelected = stat.key === selectedKey;
                const isPH = stat.key === 'pH';

                return (
                  <tr
                    key={stat.key}
                    onClick={() => onSelectVariable(stat.key)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-50/70 font-medium'
                        : isPH
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {isPH && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Variable Óptima" />
                        )}
                        <div>
                          <div className={`font-mono text-xs ${isPH ? 'font-bold text-emerald-900' : 'text-slate-900'}`}>
                            {stat.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans">
                            {stat.labelSpanish} · <span className="font-mono text-[10px] text-slate-400">{stat.unit}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      {stat.mean.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      {stat.std.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-800">
                      {stat.median.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {stat.min.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {stat.max.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span
                        className={
                          Math.abs(stat.skewness) < 0.5
                            ? 'text-emerald-700 font-semibold'
                            : Math.abs(stat.skewness) < 1.5
                            ? 'text-slate-700'
                            : 'text-rose-700 font-semibold'
                        }
                      >
                        {stat.skewness > 0 ? `+${stat.skewness.toFixed(4)}` : stat.skewness.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span
                        className={
                          Math.abs(stat.kurtosis) < 1.0
                            ? 'text-emerald-700 font-semibold'
                            : Math.abs(stat.kurtosis) < 5.0
                            ? 'text-slate-700'
                            : 'text-rose-700 font-semibold'
                        }
                      >
                        {stat.kurtosis > 0 ? `+${stat.kurtosis.toFixed(4)}` : stat.kurtosis.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {stat.continuousScore === 'ideal' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Óptima</span>
                        </span>
                      ) : stat.continuousScore === 'problematica' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Patológica</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-500">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Moderada</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected variable inspector tray */}
        {selectedStat && selectedMeta && (
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 font-mono">
                    {selectedStat.name}
                  </span>
                  <span className="text-xs text-slate-500">({selectedStat.labelSpanish})</span>
                  {selectedMeta.chemicalFormula && (
                    <span className="text-xs text-slate-400 font-mono">
                      Fórmula: {selectedMeta.chemicalFormula}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 max-w-3xl">
                  {selectedMeta.chemicalRole} {selectedStat.diagnostics}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md">
                  <span className="text-slate-400 block text-[10px] uppercase">Diferencia Media - Mediana</span>
                  <span className="font-bold text-slate-800">
                    {Math.abs(selectedStat.mean - selectedStat.median).toFixed(4)}
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md">
                  <span className="text-slate-400 block text-[10px] uppercase">Rango Intercuartil (IQR)</span>
                  <span className="font-bold text-slate-800">{selectedStat.iqr.toFixed(4)}</span>
                </div>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-md">
                  <span className="text-slate-400 block text-[10px] uppercase">Valores Cero (0.0)</span>
                  <span className={selectedStat.zeroCount > 0 ? 'font-bold text-rose-600' : 'text-slate-700'}>
                    {selectedStat.zeroCount} ({selectedStat.zeroPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
