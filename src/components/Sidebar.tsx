import {
  Clock,
  FileCode2,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  Table2,
  Trash2,
  X,
} from 'lucide-react';
import type { GenerationSession } from '../types/testCase';

interface SidebarProps {
  sessions: GenerationSession[];
  activeSessionId: string | null;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onSelectSession: (session: GenerationSession) => void;
  onClearHistory: () => void;
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Sidebar({
  sessions,
  activeSessionId,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onSelectSession,
  onClearHistory,
}: SidebarProps) {
  const sidebarBody = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-200 select-none">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <History className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                History &amp; Saved Tests
              </h2>
              <p className="text-[11px] text-slate-400">
                {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} saved
              </p>
            </div>
          </div>
        )}

        {/* Desktop collapse button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:flex"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close history drawer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            {sessions.slice(0, 8).map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session)}
                  title={session.requirement}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {session.outputFormat === 'BDD Gherkin Syntax' ? (
                    <FileCode2 className="h-4 w-4" />
                  ) : (
                    <Table2 className="h-4 w-4" />
                  )}
                </button>
              );
            })}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-slate-500">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-300">No saved runs yet</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Generated test suites are automatically saved locally for quick access.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const snippet =
                session.requirement.length > 76
                  ? `${session.requirement.slice(0, 76).trim()}...`
                  : session.requirement;

              return (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSession(session);
                      onCloseMobile();
                    }}
                    className={`group w-full rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? 'border-indigo-500/60 bg-indigo-600/15 shadow-sm'
                        : 'border-slate-800/90 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <p
                      className={`line-clamp-2 text-xs leading-relaxed font-medium ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {snippet}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                            isActive
                              ? 'bg-indigo-500/25 text-indigo-200'
                              : 'bg-slate-700/70 text-slate-300'
                          }`}
                        >
                          {session.outputFormat === 'BDD Gherkin Syntax' ? (
                            <FileCode2 className="h-2.5 w-2.5" />
                          ) : (
                            <Table2 className="h-2.5 w-2.5" />
                          )}
                          {session.testCases.length} cases
                        </span>
                        <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                          {session.testingType}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-500">
                        {formatTimestamp(session.createdAt)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Clear History Footer */}
      {!isCollapsed && (
        <div className="shrink-0 border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={onClearHistory}
            disabled={sessions.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700/80 disabled:hover:bg-slate-800/60 disabled:hover:text-slate-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear History
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-slate-800 transition-all duration-200 lg:block ${
          isCollapsed ? 'w-16' : 'w-80'
        }`}
      >
        {sidebarBody}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 h-full w-80 max-w-[85vw] shadow-2xl">
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  );
}
