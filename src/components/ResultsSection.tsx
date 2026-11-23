import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Table2,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, OutputFormat, SpecificTestType, TestCase } from '../types/testCase';
import {
  copyTestCasesToClipboard,
  downloadMarkdown,
  exportToCSV,
  exportToExcel,
} from '../utils/exporters';

interface ResultsSectionProps {
  language: Language;
  featureTitle: string;
  testCases: TestCase[];
  outputFormat: OutputFormat;
}

const TYPE_BADGE_STYLES: Record<SpecificTestType, string> = {
  Positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  Negative: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
  Boundary: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  Security: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20',
};

function highlightQuotedStrings(text: string): React.ReactNode {
  const parts = text.split(/("[^"]*")/g);
  return parts.map((part, idx) =>
    part.startsWith('"') && part.endsWith('"') ? (
      <span key={idx} className="text-amber-300">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function ResultsSection({
  language,
  featureTitle,
  testCases,
  outputFormat,
}: ResultsSectionProps) {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredTestCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return testCases;

    return testCases.filter((tc) => {
      const searchable = [
        tc.id,
        tc.title,
        tc.type,
        t.specificTypes[tc.type],
        tc.preconditions,
        tc.expectedResult,
        ...tc.steps,
        tc.gherkin.scenario,
        ...tc.gherkin.tags,
        ...tc.gherkin.given,
        ...tc.gherkin.when,
        ...tc.gherkin.then,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [testCases, searchQuery, t.specificTypes]);

  const handleCopy = async () => {
    try {
      await copyTestCasesToClipboard(featureTitle, filteredTestCases, outputFormat, language);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Top Bar: Summary + Actions & Export Panel */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {t.results.title}
            </h2>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-600/15">
              {t.results.scenarioCount(filteredTestCases.length, testCases.length)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{featureTitle}</p>
        </div>

        {/* Actions & Export Panel */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={filteredTestCases.length === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
              copied
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                {t.results.copied}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                {t.results.copyToClipboard}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => exportToCSV(filteredTestCases, language)}
            disabled={filteredTestCases.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Table2 className="h-3.5 w-3.5 text-slate-500" />
            {t.results.exportCsv}
          </button>

          <button
            type="button"
            onClick={() => exportToExcel(featureTitle, filteredTestCases, language)}
            disabled={filteredTestCases.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            {t.results.exportExcel}
          </button>

          <button
            type="button"
            onClick={() =>
              downloadMarkdown(featureTitle, filteredTestCases, outputFormat, language)
            }
            disabled={filteredTestCases.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Download className="h-3.5 w-3.5 text-indigo-600" />
            {t.results.downloadMarkdown}
          </button>
        </div>
      </div>

      {/* Quick Filter Search Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.results.searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-8 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear filter"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Body */}
      {filteredTestCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            {t.results.noMatchesTitle(searchQuery)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t.results.noMatchesSubtitle}</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.results.resetFilter}
          </button>
        </div>
      ) : outputFormat === 'Standard Table' ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <th className="w-24 px-5 py-3.5">{t.results.columns.id}</th>
                <th className="w-56 px-4 py-3.5">{t.results.columns.title}</th>
                <th className="w-28 px-4 py-3.5">{t.results.columns.type}</th>
                <th className="w-52 px-4 py-3.5">{t.results.columns.preconditions}</th>
                <th className="w-72 px-4 py-3.5">{t.results.columns.steps}</th>
                <th className="w-64 px-5 py-3.5">{t.results.columns.expectedResult}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTestCases.map((tc) => (
                <tr
                  key={tc.id}
                  className="align-top transition-colors hover:bg-indigo-50/25"
                >
                  <td className="px-5 py-4 font-mono text-xs font-semibold whitespace-nowrap text-indigo-600">
                    {tc.id}
                  </td>
                  <td className="px-4 py-4 font-medium leading-relaxed text-slate-900">
                    {tc.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_BADGE_STYLES[tc.type]}`}
                    >
                      {t.specificTypes[tc.type]}
                    </span>
                  </td>
                  <td className="px-4 py-4 leading-relaxed text-slate-600">
                    {tc.preconditions}
                  </td>
                  <td className="px-4 py-4 leading-relaxed text-slate-700">
                    <ol className="list-decimal space-y-1 pl-4">
                      {tc.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </td>
                  <td className="px-5 py-4 leading-relaxed text-slate-700">
                    {tc.expectedResult}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* BDD Gherkin Syntax Highlighted View */
        <div className="p-5 sm:p-6">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  generated-suite.feature
                </span>
              </div>
              <span className="rounded bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-medium text-indigo-300 ring-1 ring-indigo-500/30">
                Gherkin BDD
              </span>
            </div>

            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-slate-200">
              <code>
                <span className="font-semibold text-violet-400">Feature:</span>{' '}
                <span className="font-semibold text-white">{featureTitle}</span>
                {'\n\n'}
                {filteredTestCases.map((tc, tcIdx) => (
                  <div key={tc.id} className={tcIdx > 0 ? 'mt-5' : ''}>
                    <div className="text-emerald-400/90">
                      {'  '}
                      {tc.gherkin.tags.join(' ')}
                    </div>
                    <div>
                      {'  '}
                      <span className="font-semibold text-violet-400">Scenario:</span>{' '}
                      <span className="text-sky-300">{tc.id}</span>
                      <span className="text-slate-400"> - </span>
                      <span className="font-medium text-white">
                        {tc.gherkin.scenario}
                      </span>
                    </div>
                    {tc.gherkin.given.map((line, idx) => (
                      <div key={`g-${idx}`}>
                        {'    '}
                        <span className="font-semibold text-indigo-400">
                          {idx === 0 ? 'Given' : 'And'}
                        </span>{' '}
                        {highlightQuotedStrings(line)}
                      </div>
                    ))}
                    {tc.gherkin.when.map((line, idx) => (
                      <div key={`w-${idx}`}>
                        {'    '}
                        <span className="font-semibold text-indigo-400">
                          {idx === 0 ? 'When' : 'And'}
                        </span>{' '}
                        {highlightQuotedStrings(line)}
                      </div>
                    ))}
                    {tc.gherkin.then.map((line, idx) => (
                      <div key={`t-${idx}`}>
                        {'    '}
                        <span className="font-semibold text-indigo-400">
                          {idx === 0 ? 'Then' : 'And'}
                        </span>{' '}
                        {highlightQuotedStrings(line)}
                      </div>
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
