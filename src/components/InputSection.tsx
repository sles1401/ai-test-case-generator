import { Eraser, FileText, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import type { OutputFormat, TestingType } from '../types/testCase';

interface InputSectionProps {
  requirement: string;
  testingType: TestingType;
  outputFormat: OutputFormat;
  isGenerating: boolean;
  onRequirementChange: (value: string) => void;
  onTestingTypeChange: (value: TestingType) => void;
  onOutputFormatChange: (value: OutputFormat) => void;
  onClearInput: () => void;
  onGenerate: () => void;
}

const EXAMPLE_PROMPTS = [
  {
    label: 'Login & Auth',
    text: 'As a registered user, I want to log in using my email and password with an optional "Remember Me" toggle, so that I can securely access my dashboard. Account should lock after 5 failed attempts.',
  },
  {
    label: 'Checkout & Promo',
    text: 'As a shopper, I want to apply a promo code and complete checkout with a credit card, so that my order is confirmed and inventory is updated. Declined cards must preserve the cart.',
  },
  {
    label: 'File Upload',
    text: 'As a user, I want to upload PDF or PNG documents up to 10MB via drag-and-drop, so that my verification documents are attached to my profile.',
  },
];

const TESTING_TYPES: TestingType[] = [
  'All Types',
  'Positive',
  'Negative',
  'Boundary',
  'Security',
];

const OUTPUT_FORMATS: OutputFormat[] = ['Standard Table', 'BDD Gherkin Syntax'];

export function InputSection({
  requirement,
  testingType,
  outputFormat,
  isGenerating,
  onRequirementChange,
  onTestingTypeChange,
  onOutputFormatChange,
  onClearInput,
  onGenerate,
}: InputSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (requirement.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
      {/* Section Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <label
              htmlFor="requirements-input"
              className="block text-sm font-semibold text-slate-900"
            >
              Requirements / User Story / Acceptance Criteria
            </label>
            <p className="text-xs text-slate-500">
              Paste your Jira story, PRD snippet, or acceptance criteria below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearInput}
          disabled={!requirement || isGenerating}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear Input
        </button>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="requirements-input"
          rows={5}
          value={requirement}
          onChange={(e) => onRequirementChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder={`Example:\nAs a registered user, I want to log in with my email and password so I can access my dashboard.\n- Valid credentials redirect to /dashboard within 2s\n- Invalid password shows a generic error message\n- Account locks for 15 minutes after 5 failed attempts`}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Try sample:</span>
            {EXAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                disabled={isGenerating}
                onClick={() => onRequirementChange(sample.text)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
              >
                {sample.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            {requirement.length} chars · <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-500">Ctrl</kbd>+<kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-500">Enter</kbd> to generate
          </span>
        </div>
      </div>

      {/* Configuration Row + Primary Action */}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Testing Type */}
          <div>
            <label
              htmlFor="testing-type"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              Testing Type
            </label>
            <select
              id="testing-type"
              value={testingType}
              disabled={isGenerating}
              onChange={(e) => onTestingTypeChange(e.target.value as TestingType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-2xs transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {TESTING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Output Format */}
          <div>
            <label
              htmlFor="output-format"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              Output Format
            </label>
            <select
              id="output-format"
              value={outputFormat}
              disabled={isGenerating}
              onChange={(e) => onOutputFormatChange(e.target.value as OutputFormat)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-2xs transition-colors focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {OUTPUT_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!requirement.trim() || isGenerating}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:shadow-none sm:h-[42px]"
        >
          <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </div>
    </section>
  );
}
