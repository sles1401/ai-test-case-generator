import type { Language, OutputFormat, SpecificTestType, TestingType } from '../types/testCase';

export interface Translations {
  appTitle: string;
  appBadge: string;
  appSubtitle: string;
  engineStatus: string;
  engineReadyShort: string;
  sidebar: {
    title: string;
    sessionsSaved: (count: number) => string;
    expandTooltip: string;
    collapseTooltip: string;
    emptyTitle: string;
    emptyDescription: string;
    casesCount: (count: number) => string;
    clearHistory: string;
    justNow: string;
    minutesAgo: (mins: number) => string;
    hoursAgo: (hours: number) => string;
  };
  input: {
    label: string;
    helper: string;
    clearInput: string;
    placeholder: string;
    trySample: string;
    charsLabel: (count: number) => string;
    shortcutHint: string;
    testingTypeLabel: string;
    outputFormatLabel: string;
    generateButton: string;
    generatingButton: string;
    samples: { label: string; text: string }[];
  };
  loading: {
    messages: string[];
  };
  results: {
    title: string;
    scenarioCount: (filtered: number, total: number) => string;
    copyToClipboard: string;
    copied: string;
    exportCsv: string;
    exportExcel: string;
    downloadMarkdown: string;
    searchPlaceholder: string;
    noMatchesTitle: (query: string) => string;
    noMatchesSubtitle: string;
    resetFilter: string;
    columns: {
      id: string;
      title: string;
      type: string;
      preconditions: string;
      steps: string;
      expectedResult: string;
    };
  };
  testingTypes: Record<TestingType, string>;
  specificTypes: Record<SpecificTestType, string>;
  outputFormats: Record<OutputFormat, string>;
  exportMeta: {
    suitePrefix: string;
    generatedLabel: string;
    totalLabel: string;
    sheetFallback: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'AI Test Case Generator',
    appBadge: 'QA Studio',
    appSubtitle: 'Transform user stories & acceptance criteria into structured QA test suites',
    engineStatus: 'Interactive QA Engine',
    engineReadyShort: 'Ready',
    sidebar: {
      title: 'History & Saved Tests',
      sessionsSaved: (count) => `${count} ${count === 1 ? 'session' : 'sessions'} saved`,
      expandTooltip: 'Expand sidebar',
      collapseTooltip: 'Collapse sidebar',
      emptyTitle: 'No saved runs yet',
      emptyDescription:
        'Generated test suites are automatically saved locally for quick access.',
      casesCount: (count) => `${count} cases`,
      clearHistory: 'Clear History',
      justNow: 'Just now',
      minutesAgo: (mins) => `${mins}m ago`,
      hoursAgo: (hours) => `${hours}h ago`,
    },
    input: {
      label: 'Requirements / User Story / Acceptance Criteria',
      helper: 'Paste your Jira story, PRD snippet, or acceptance criteria below.',
      clearInput: 'Clear Input',
      placeholder: `Example:\nAs a registered user, I want to log in with my email and password so I can access my dashboard.\n- Valid credentials redirect to /dashboard within 2s\n- Invalid password shows a generic error message\n- Account locks for 15 minutes after 5 failed attempts`,
      trySample: 'Try sample:',
      charsLabel: (count) => `${count} chars`,
      shortcutHint: 'to generate',
      testingTypeLabel: 'Testing Type',
      outputFormatLabel: 'Output Format',
      generateButton: 'Generate Test Cases',
      generatingButton: 'Generating...',
      samples: [
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
      ],
    },
    loading: {
      messages: [
        'Analyzing requirements...',
        'Identifying edge cases & risk areas...',
        'Drafting test scenarios...',
        'Structuring test steps & assertions...',
      ],
    },
    results: {
      title: 'Generated Test Cases',
      scenarioCount: (filtered, total) => {
        const countPart = filtered !== total ? `${filtered} of ${total}` : `${filtered}`;
        return `${countPart} ${filtered === 1 ? 'scenario' : 'scenarios'}`;
      },
      copyToClipboard: 'Copy to Clipboard',
      copied: 'Copied!',
      exportCsv: 'Export to CSV',
      exportExcel: 'Export to Excel',
      downloadMarkdown: 'Download Markdown',
      searchPlaceholder: 'Filter generated test cases by keyword, ID, or type...',
      noMatchesTitle: (query) => `No test cases match "${query}"`,
      noMatchesSubtitle: 'Try clearing your search filter or using a different keyword.',
      resetFilter: 'Reset Filter',
      columns: {
        id: 'ID',
        title: 'Scenario Title',
        type: 'Type',
        preconditions: 'Pre-conditions',
        steps: 'Test Steps',
        expectedResult: 'Expected Result',
      },
    },
    testingTypes: {
      'All Types': 'All Types',
      Positive: 'Positive',
      Negative: 'Negative',
      Boundary: 'Boundary',
      Security: 'Security',
    },
    specificTypes: {
      Positive: 'Positive',
      Negative: 'Negative',
      Boundary: 'Boundary',
      Security: 'Security',
    },
    outputFormats: {
      'Standard Table': 'Standard Table',
      'BDD Gherkin Syntax': 'BDD Gherkin Syntax',
    },
    exportMeta: {
      suitePrefix: 'Test Suite',
      generatedLabel: 'Generated',
      totalLabel: 'Total Scenarios',
      sheetFallback: 'Test Cases',
    },
  },
  id: {
    appTitle: 'AI Test Case Generator',
    appBadge: 'QA Studio',
    appSubtitle: 'Ubah user story & kriteria penerimaan menjadi test suite QA yang terstruktur',
    engineStatus: 'Mesin QA Interaktif',
    engineReadyShort: 'Siap',
    sidebar: {
      title: 'Riwayat & Tes Tersimpan',
      sessionsSaved: (count) => `${count} sesi tersimpan`,
      expandTooltip: 'Buka sidebar',
      collapseTooltip: 'Tutup sidebar',
      emptyTitle: 'Belum ada riwayat tersimpan',
      emptyDescription:
        'Test suite yang dihasilkan otomatis tersimpan secara lokal untuk akses cepat.',
      casesCount: (count) => `${count} kasus`,
      clearHistory: 'Hapus Riwayat',
      justNow: 'Baru saja',
      minutesAgo: (mins) => `${mins}m lalu`,
      hoursAgo: (hours) => `${hours}j lalu`,
    },
    input: {
      label: 'Kebutuhan / User Story / Kriteria Penerimaan',
      helper: 'Tempel Jira story, cuplikan PRD, atau kriteria penerimaan di bawah ini.',
      clearInput: 'Bersihkan Input',
      placeholder: `Contoh:\nSebagai pengguna terdaftar, saya ingin masuk menggunakan email dan kata sandi agar dapat mengakses dashboard.\n- Kredensial valid mengarahkan ke /dashboard dalam 2 detik\n- Kata sandi salah menampilkan pesan error umum\n- Akun terkunci 15 menit setelah 5 kali percobaan gagal`,
      trySample: 'Coba contoh:',
      charsLabel: (count) => `${count} karakter`,
      shortcutHint: 'untuk membuat',
      testingTypeLabel: 'Tipe Pengujian',
      outputFormatLabel: 'Format Output',
      generateButton: 'Buat Test Case',
      generatingButton: 'Membuat...',
      samples: [
        {
          label: 'Login & Autentikasi',
          text: 'Sebagai pengguna terdaftar, saya ingin masuk menggunakan email dan kata sandi dengan opsi "Ingat Saya", agar dapat mengakses dashboard dengan aman. Akun harus terkunci setelah 5 kali percobaan gagal.',
        },
        {
          label: 'Checkout & Promo',
          text: 'Sebagai pembeli, saya ingin menggunakan kode promo dan menyelesaikan checkout dengan kartu kredit, agar pesanan terkonfirmasi dan stok diperbarui. Kartu yang ditolak tidak boleh menghapus isi keranjang.',
        },
        {
          label: 'Unggah Berkas',
          text: 'Sebagai pengguna, saya ingin mengunggah dokumen PDF atau PNG hingga 10MB melalui drag-and-drop, agar dokumen verifikasi tersimpan di profil saya.',
        },
      ],
    },
    loading: {
      messages: [
        'Menganalisis kebutuhan...',
        'Mengidentifikasi edge case & area risiko...',
        'Menyusun skenario pengujian...',
        'Menstrukturkan langkah tes & ekspektasi...',
      ],
    },
    results: {
      title: 'Hasil Test Case',
      scenarioCount: (filtered, total) => {
        const countPart = filtered !== total ? `${filtered} dari ${total}` : `${filtered}`;
        return `${countPart} skenario`;
      },
      copyToClipboard: 'Salin ke Clipboard',
      copied: 'Tersalin!',
      exportCsv: 'Ekspor ke CSV',
      exportExcel: 'Ekspor ke Excel',
      downloadMarkdown: 'Unduh Markdown',
      searchPlaceholder: 'Filter test case berdasarkan kata kunci, ID, atau tipe...',
      noMatchesTitle: (query) => `Tidak ada test case yang cocok dengan "${query}"`,
      noMatchesSubtitle: 'Coba hapus filter pencarian atau gunakan kata kunci lain.',
      resetFilter: 'Reset Filter',
      columns: {
        id: 'ID',
        title: 'Judul Skenario',
        type: 'Tipe',
        preconditions: 'Pra-kondisi',
        steps: 'Langkah Pengujian',
        expectedResult: 'Hasil yang Diharapkan',
      },
    },
    testingTypes: {
      'All Types': 'Semua Tipe',
      Positive: 'Positif',
      Negative: 'Negatif',
      Boundary: 'Batas (Boundary)',
      Security: 'Keamanan',
    },
    specificTypes: {
      Positive: 'Positif',
      Negative: 'Negatif',
      Boundary: 'Boundary',
      Security: 'Keamanan',
    },
    outputFormats: {
      'Standard Table': 'Tabel Standar',
      'BDD Gherkin Syntax': 'Sintaks BDD Gherkin',
    },
    exportMeta: {
      suitePrefix: 'Test Suite',
      generatedLabel: 'Dibuat pada',
      totalLabel: 'Total Skenario',
      sheetFallback: 'Test Case',
    },
  },
};
