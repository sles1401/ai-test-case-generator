import { useEffect, useState } from 'react';
import { Beaker, Globe, Menu, Sparkles } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { LoadingState } from './components/LoadingState';
import { ResultsSection } from './components/ResultsSection';
import { Sidebar } from './components/Sidebar';
import { TRANSLATIONS } from './i18n/translations';
import type {
  GenerationSession,
  Language,
  OutputFormat,
  TestCase,
  TestingType,
} from './types/testCase';
import { generateMockTestCases } from './utils/testCaseGenerator';

const STORAGE_KEY = 'testcase_generator_history_v1';
const LANG_STORAGE_KEY = 'testcase_generator_lang_v1';

function loadSavedSessions(): GenerationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'id' ? 'id' : 'en';
  } catch {
    return 'en';
  }
}

export function App() {
  const [language, setLanguage] = useState<Language>(loadSavedLanguage);
  const [sessions, setSessions] = useState<GenerationSession[]>(loadSavedSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [requirement, setRequirement] = useState('');
  const [testingType, setTestingType] = useState<TestingType>('All Types');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('Standard Table');

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<TestCase[]>([]);
  const [featureTitle, setFeatureTitle] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore storage quota errors
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // Ignore storage quota errors
    }
  }, [language]);

  const handleLanguageChange = (nextLang: Language) => {
    if (nextLang === language) return;
    setLanguage(nextLang);

    // If results are currently displayed, re-render them in the newly selected language
    if (hasGenerated && requirement.trim() && !isGenerating) {
      const { featureTitle: nextTitle, testCases } = generateMockTestCases(
        requirement.trim(),
        testingType,
        nextLang
      );
      setFeatureTitle(nextTitle);
      setGeneratedCases(testCases);
    }
  };

  const handleGenerate = () => {
    const trimmed = requirement.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);

    setTimeout(() => {
      const { featureTitle: nextTitle, testCases } = generateMockTestCases(
        trimmed,
        testingType,
        language
      );

      const newSession: GenerationSession = {
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `sess-${Date.now()}`,
        requirement: trimmed,
        testingType,
        outputFormat,
        language,
        testCases,
        featureTitle: nextTitle,
        createdAt: new Date().toISOString(),
      };

      setFeatureTitle(nextTitle);
      setGeneratedCases(testCases);
      setHasGenerated(true);
      setIsGenerating(false);
      setActiveSessionId(newSession.id);
      setSessions((prev) => [newSession, ...prev].slice(0, 30));
    }, 1500);
  };

  const handleClearInput = () => {
    setRequirement('');
    setActiveSessionId(null);
  };

  const handleSelectSession = (session: GenerationSession) => {
    setRequirement(session.requirement);
    setTestingType(session.testingType);
    setOutputFormat(session.outputFormat);
    if (session.language) {
      setLanguage(session.language);
    }
    setFeatureTitle(session.featureTitle);
    setGeneratedCases(session.testCases);
    setHasGenerated(true);
    setIsGenerating(false);
    setActiveSessionId(session.id);
  };

  const handleClearHistory = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      {/* Left Collapsible Sidebar */}
      <Sidebar
        language={language}
        sessions={sessions}
        activeSessionId={activeSessionId}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSelectSession={handleSelectSession}
        onClearHistory={handleClearHistory}
      />

      {/* Main Central Dashboard */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open history sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25">
                <Beaker className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                    {t.appTitle}
                  </h1>
                  <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase ring-1 ring-indigo-600/15 sm:inline-flex">
                    {t.appBadge}
                  </span>
                </div>
                <p className="hidden text-xs text-slate-500 sm:block">
                  {t.appSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bilingual Switcher (EN / ID) */}
            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5"
            >
              <Globe className="mr-1 ml-2 h-3.5 w-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white text-indigo-600 shadow-2xs ring-1 ring-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
                  language === 'id'
                    ? 'bg-white text-indigo-600 shadow-2xs ring-1 ring-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ID
              </button>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 md:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              {t.engineStatus}
            </span>
          </div>
        </header>

        {/* Scrollable Workspace Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Top Main Area: Input Form */}
            <InputSection
              language={language}
              requirement={requirement}
              testingType={testingType}
              outputFormat={outputFormat}
              isGenerating={isGenerating}
              onRequirementChange={setRequirement}
              onTestingTypeChange={setTestingType}
              onOutputFormatChange={setOutputFormat}
              onClearInput={handleClearInput}
              onGenerate={handleGenerate}
            />

            {/* Bottom Main Area: Loading State OR Results */}
            {isGenerating ? (
              <LoadingState language={language} />
            ) : (
              hasGenerated && (
                <ResultsSection
                  language={language}
                  featureTitle={featureTitle}
                  testCases={generatedCases}
                  outputFormat={outputFormat}
                />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
