import * as XLSX from 'xlsx';
import type { OutputFormat, TestCase } from '../types/testCase';

export function formatGherkinFeature(featureTitle: string, testCases: TestCase[]): string {
  const lines: string[] = [`Feature: ${featureTitle}`, ''];

  testCases.forEach((tc) => {
    lines.push(`  ${tc.gherkin.tags.join(' ')}`);
    lines.push(`  Scenario: ${tc.id} - ${tc.gherkin.scenario}`);

    tc.gherkin.given.forEach((step, idx) => {
      lines.push(`    ${idx === 0 ? 'Given' : 'And'} ${step}`);
    });
    tc.gherkin.when.forEach((step, idx) => {
      lines.push(`    ${idx === 0 ? 'When' : 'And'} ${step}`);
    });
    tc.gherkin.then.forEach((step, idx) => {
      lines.push(`    ${idx === 0 ? 'Then' : 'And'} ${step}`);
    });

    lines.push('');
  });

  return lines.join('\n').trimEnd();
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

export function formatMarkdownDocument(
  featureTitle: string,
  testCases: TestCase[],
  outputFormat: OutputFormat
): string {
  const header = `# Test Suite: ${featureTitle}\n\nGenerated: ${new Date().toLocaleString()}\nTotal Scenarios: ${testCases.length}\n\n`;

  if (outputFormat === 'BDD Gherkin Syntax') {
    return `${header}\`\`\`gherkin\n${formatGherkinFeature(featureTitle, testCases)}\n\`\`\`\n`;
  }

  const tableHeader =
    '| ID | Scenario Title | Type | Pre-conditions | Test Steps | Expected Result |\n' +
    '| --- | --- | --- | --- | --- | --- |\n';

  const tableRows = testCases
    .map((tc) => {
      const steps = tc.steps.map((s, i) => `${i + 1}. ${s}`).join('<br>');
      return `| ${escapeMarkdownCell(tc.id)} | ${escapeMarkdownCell(tc.title)} | ${escapeMarkdownCell(tc.type)} | ${escapeMarkdownCell(tc.preconditions)} | ${escapeMarkdownCell(steps)} | ${escapeMarkdownCell(tc.expectedResult)} |`;
    })
    .join('\n');

  return `${header}${tableHeader}${tableRows}\n`;
}

export async function copyTestCasesToClipboard(
  featureTitle: string,
  testCases: TestCase[],
  outputFormat: OutputFormat
): Promise<void> {
  const content =
    outputFormat === 'BDD Gherkin Syntax'
      ? formatGherkinFeature(featureTitle, testCases)
      : formatMarkdownDocument(featureTitle, testCases, 'Standard Table');

  await navigator.clipboard.writeText(content);
}

function escapeCSV(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' | ');
  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(testCases: TestCase[], filename = 'test-cases.csv'): void {
  const headers = [
    'ID',
    'Scenario Title',
    'Type',
    'Pre-conditions',
    'Test Steps',
    'Expected Result',
  ];

  const rows = testCases.map((tc) => [
    escapeCSV(tc.id),
    escapeCSV(tc.title),
    escapeCSV(tc.type),
    escapeCSV(tc.preconditions),
    escapeCSV(tc.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')),
    escapeCSV(tc.expectedResult),
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

export function exportToExcel(
  featureTitle: string,
  testCases: TestCase[],
  filename = 'test-cases.xlsx'
): void {
  const worksheetData = testCases.map((tc) => ({
    ID: tc.id,
    'Scenario Title': tc.title,
    Type: tc.type,
    'Pre-conditions': tc.preconditions,
    'Test Steps': tc.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n'),
    'Expected Result': tc.expectedResult,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 40 },
    { wch: 14 },
    { wch: 36 },
    { wch: 52 },
    { wch: 46 },
  ];

  const workbook = XLSX.utils.book_new();
  const safeSheetName = featureTitle.replace(/[\\/?*[\]]/g, '').slice(0, 31) || 'Test Cases';
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
  XLSX.writeFile(workbook, filename);
}

export function downloadMarkdown(
  featureTitle: string,
  testCases: TestCase[],
  outputFormat: OutputFormat,
  filename = 'test-cases.md'
): void {
  const content = formatMarkdownDocument(featureTitle, testCases, outputFormat);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  triggerDownload(blob, filename);
}
