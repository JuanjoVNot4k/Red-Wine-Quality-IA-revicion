import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroOverview } from './components/HeroOverview';
import { Punto2VariablesTable } from './components/Punto2VariablesTable';
import { Punto2JustificationPH } from './components/Punto2JustificationPH';
import { Punto3NormalityTests } from './components/Punto3NormalityTests';
import { Punto3DistributionComparison } from './components/Punto3DistributionComparison';
import { Punto3Visualizations } from './components/Punto3Visualizations';
import { PythonScriptLab, PYTHON_SCRIPT_CODE } from './components/PythonScriptLab';
import { FormalConclusion } from './components/FormalConclusion';
import { DEFAULT_WINE_RECORDS, WineRecord } from './data/wineData';
import { PHYSICOCHEMICAL_VARIABLES_META } from './data/variableDescriptions';
import { calculateDescriptiveStats, VariableStats } from './utils/statistics';

export default function App() {
  const [wineRecords, setWineRecords] = useState<WineRecord[]>(DEFAULT_WINE_RECORDS);
  const [isCustomData, setIsCustomData] = useState<boolean>(false);
  const [selectedVarKey, setSelectedVarKey] = useState<string>('pH');
  const [use2Param, setUse2Param] = useState<boolean>(false);

  // Compute descriptive statistics for all 11 physicochemical continuous variables
  const statsList: VariableStats[] = useMemo(() => {
    return PHYSICOCHEMICAL_VARIABLES_META.map(meta => {
      const rawValues = wineRecords.map(r => r[meta.key as keyof WineRecord] as number);
      return calculateDescriptiveStats(
        rawValues,
        meta.key,
        meta.name,
        meta.labelSpanish,
        meta.unit,
        meta.chemicalRole
      );
    });
  }, [wineRecords]);

  // Extract pH values
  const phValues = useMemo(() => {
    return wineRecords.map(r => r.pH);
  }, [wineRecords]);

  // Download Python script
  const handleDownloadScript = () => {
    const blob = new Blob([PYTHON_SCRIPT_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analisis_wine_quality.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download CSV dataset
  const handleDownloadCsv = () => {
    const headers = [
      '"fixed acidity"',
      '"volatile acidity"',
      '"citric acid"',
      '"residual sugar"',
      '"chlorides"',
      '"free sulfur dioxide"',
      '"total sulfur dioxide"',
      '"density"',
      '"pH"',
      '"sulphates"',
      '"alcohol"',
      '"quality"'
    ];

    const rows = wineRecords.map(r => [
      r.fixedAcidity,
      r.volatileAcidity,
      r.citricAcid,
      r.residualSugar,
      r.chlorides,
      r.freeSulfurDioxide,
      r.totalSulfurDioxide,
      r.density,
      r.pH,
      r.sulphates,
      r.alcohol,
      r.quality
    ].join(';'));

    const csvContent = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'winequality-red.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle custom CSV upload
  const handleUploadCustomCsv = (content: string, filename: string) => {
    try {
      const lines = content.trim().split(/\r?\n/);
      if (lines.length < 2) return;

      const delimiter = lines[0].includes(';') ? ';' : ',';
      const parsedRecords: WineRecord[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(delimiter).map(v => parseFloat(v.replace(/"/g, '').trim()));
        if (parts.length >= 11 && !isNaN(parts[0])) {
          parsedRecords.push({
            fixedAcidity: parts[0],
            volatileAcidity: parts[1],
            citricAcid: parts[2],
            residualSugar: parts[3],
            chlorides: parts[4],
            freeSulfurDioxide: parts[5],
            totalSulfurDioxide: parts[6],
            density: parts[7],
            pH: parts[8],
            sulphates: parts[9],
            alcohol: parts[10],
            quality: parts[11] ?? 5
          });
        }
      }

      if (parsedRecords.length > 10) {
        setWineRecords(parsedRecords);
        setIsCustomData(true);
      }
    } catch (e) {
      console.error('Error parsing uploaded CSV', e);
    }
  };

  const handleResetDefaultData = () => {
    setWineRecords(DEFAULT_WINE_RECORDS);
    setIsCustomData(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        onDownloadScript={handleDownloadScript}
        onDownloadCsv={handleDownloadCsv}
      />

      <HeroOverview
        onDownloadScript={handleDownloadScript}
        onDownloadCsv={handleDownloadCsv}
        onUploadCustomCsv={handleUploadCustomCsv}
        isCustomData={isCustomData}
        onResetDefaultData={handleResetDefaultData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* PUNTO 2.1 & 2.2: Tabla descriptiva */}
        <Punto2VariablesTable
          statsList={statsList}
          metaList={PHYSICOCHEMICAL_VARIABLES_META}
          selectedKey={selectedVarKey}
          onSelectVariable={setSelectedVarKey}
        />

        {/* PUNTO 2.3: Justificación formal del pH */}
        <Punto2JustificationPH statsList={statsList} />

        {/* PUNTO 3.1: Evaluación de normalidad */}
        <Punto3NormalityTests />

        {/* PUNTO 3.2: Comparación MLE de modelos teóricos */}
        <Punto3DistributionComparison
          use2Param={use2Param}
          onToggleParamMode={setUse2Param}
        />

        {/* PUNTO 3.3: Visualización 1x2 (Densidad + Q-Q Plot) */}
        <Punto3Visualizations
          phValues={phValues}
          use2Param={use2Param}
        />

        {/* PUNTO 3.3: Script en Python reproducible */}
        <PythonScriptLab
          onDownloadScript={handleDownloadScript}
          onDownloadCsv={handleDownloadCsv}
        />

        {/* PUNTO 3.4: Conclusión formal e interpretación */}
        <FormalConclusion />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Red Wine Quality Dataset</span>
            <span aria-hidden="true">·</span>
            <span>Cortez, Cerdeira, Almeida, Matos, & Reis (2009)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Punto 2 & Punto 3 Estadísticos</span>
            <span aria-hidden="true">·</span>
            <span>Python (pandas, scipy.stats, matplotlib, seaborn)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
