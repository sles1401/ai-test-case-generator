import type { Language, SpecificTestType, TestCase, TestingType } from '../types/testCase';

interface DomainDetection {
  domain: 'auth' | 'ecommerce' | 'search' | 'upload' | 'api' | 'generic';
  featureTitle: string;
  subject: string;
}

function detectDomain(rawInput: string, language: Language): DomainDetection {
  const text = rawInput.toLowerCase();

  if (
    /\b(login|log in|sign in|signin|auth|authentication|password|mfa|2fa|otp|sso|oauth|forgot password|reset password|session|masuk|kata sandi|autentikasi|ingat saya|terkunci)\b/.test(
      text
    )
  ) {
    return {
      domain: 'auth',
      featureTitle:
        language === 'id'
          ? 'Autentikasi Pengguna & Kontrol Akses'
          : 'User Authentication & Access Control',
      subject: language === 'id' ? 'autentikasi pengguna' : 'user authentication',
    };
  }

  if (
    /\b(cart|checkout|payment|stripe|paypal|credit card|order|promo|coupon|discount|shipping|billing|refund|ecommerce|keranjang|pembayaran|kartu kredit|pesanan|kupon|diskon|stok)\b/.test(
      text
    )
  ) {
    return {
      domain: 'ecommerce',
      featureTitle:
        language === 'id'
          ? 'Checkout E-Commerce & Pemrosesan Pesanan'
          : 'E-Commerce Checkout & Order Processing',
      subject: language === 'id' ? 'alur checkout & pembayaran' : 'checkout & payment flow',
    };
  }

  if (
    /\b(search|filter|sort|pagination|autocomplete|facet|query|results|catalog|pencarian|cari|urutkan|paginasi|katalog)\b/.test(
      text
    )
  ) {
    return {
      domain: 'search',
      featureTitle:
        language === 'id'
          ? 'Pencarian, Penyaringan & Paginasi Hasil'
          : 'Search, Filtering & Results Pagination',
      subject: language === 'id' ? 'pencarian dan filter' : 'search and filtering',
    };
  }

  if (
    /\b(upload|file|attachment|import|avatar|image|pdf|csv|drag and drop|document|unggah|berkas|lampiran|dokumen|gambar)\b/.test(
      text
    )
  ) {
    return {
      domain: 'upload',
      featureTitle:
        language === 'id'
          ? 'Unggah Berkas & Validasi Dokumen'
          : 'File Upload & Document Validation',
      subject: language === 'id' ? 'unggah berkas' : 'file upload',
    };
  }

  if (
    /\b(api|endpoint|webhook|rest|graphql|payload|rate limit|bearer|jwt|status code)\b/.test(
      text
    )
  ) {
    return {
      domain: 'api',
      featureTitle:
        language === 'id'
          ? 'Validasi Endpoint API & Payload'
          : 'API Endpoint & Payload Validation',
      subject: language === 'id' ? 'integrasi API' : 'API integration',
    };
  }

  const cleaned = rawInput
    .replace(/^(as a|sebagai|given|when|then|user story:|requirement:|kebutuhan:|ac:)/i, '')
    .trim()
    .split(/[.!?\n]/)[0]
    .trim();

  const fallbackSubject = language === 'id' ? 'alur fitur target' : 'target feature workflow';
  const shortSubject =
    cleaned.length > 5 && cleaned.length <= 60
      ? cleaned
      : cleaned.length > 60
        ? `${cleaned.slice(0, 57).trim()}...`
        : fallbackSubject;

  return {
    domain: 'generic',
    featureTitle:
      language === 'id'
        ? 'Verifikasi Fungsional & Non-Fungsional Fitur'
        : 'Feature Functional & Non-Functional Verification',
    subject: shortSubject,
  };
}

function buildAuthCases(lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: 'Verifikasi login berhasil dengan kredensial valid dan akun aktif',
        type: 'Positive',
        preconditions: 'Pengguna memiliki akun terdaftar yang terverifikasi dan berada di halaman Login.',
        steps: [
          'Buka halaman login aplikasi.',
          'Masukkan alamat email terdaftar yang valid pada kolom Email.',
          'Masukkan kata sandi yang sesuai pada kolom Kata Sandi.',
          'Klik tombol "Masuk".',
        ],
        expectedResult:
          'Pengguna terautentikasi, menerima token sesi yang valid, dan diarahkan ke dashboard utama dalam 2 detik.',
        gherkin: {
          tags: ['@positive', '@smoke', '@auth'],
          scenario: 'Login berhasil dengan kredensial yang valid',
          given: [
            'pengguna memiliki akun terdaftar dan terverifikasi',
            'pengguna berada di halaman Login',
          ],
          when: [
            'pengguna memasukkan email valid dan kata sandi yang sesuai',
            'pengguna mengklik tombol "Masuk"',
          ],
          then: [
            'sistem mengautentikasi pengguna dan menerbitkan token sesi',
            'pengguna diarahkan ke dashboard',
          ],
        },
      },
      {
        id: 'TC-002',
        title: 'Verifikasi opsi "Ingat Saya" mempertahankan sesi setelah browser ditutup',
        type: 'Positive',
        preconditions: 'Pengguna berada di halaman Login dengan cookie browser aktif.',
        steps: [
          'Masukkan email dan kata sandi yang valid.',
          'Centang kotak "Ingat Saya".',
          'Klik "Masuk" dan pastikan dashboard terbuka.',
          'Tutup tab browser lalu buka kembali URL aplikasi.',
        ],
        expectedResult:
          'Pengguna tetap terautentikasi dan langsung masuk ke dashboard tanpa diminta login ulang.',
        gherkin: {
          tags: ['@positive', '@session'],
          scenario: 'Mempertahankan sesi autentikasi saat Ingat Saya dipilih',
          given: ['pengguna berada di halaman Login dengan cookie browser aktif'],
          when: [
            'pengguna login dengan kredensial valid dan mencentang "Ingat Saya"',
            'pengguna membuka kembali aplikasi di sesi browser baru',
          ],
          then: ['pengguna tetap masuk dan melihat dashboard'],
        },
      },
      {
        id: 'TC-003',
        title: 'Verifikasi login gagal dengan kata sandi salah dan menampilkan pesan error umum',
        type: 'Negative',
        preconditions: 'Pengguna memiliki akun terdaftar dan berada di halaman Login.',
        steps: [
          'Masukkan alamat email terdaftar yang valid.',
          'Masukkan kata sandi yang salah.',
          'Klik tombol "Masuk".',
        ],
        expectedResult:
          'Autentikasi ditolak. Pesan error umum ("Email atau kata sandi tidak valid") tampil tanpa membocorkan kolom mana yang salah.',
        gherkin: {
          tags: ['@negative', '@auth'],
          scenario: 'Menolak percobaan login dengan kata sandi salah',
          given: ['pengguna terdaftar berada di halaman Login'],
          when: [
            'pengguna memasukkan email valid dan kata sandi salah',
            'pengguna mengirimkan formulir login',
          ],
          then: [
            'login ditolak dengan HTTP 401',
            'UI menampilkan pesan "Email atau kata sandi tidak valid"',
          ],
        },
      },
      {
        id: 'TC-004',
        title: 'Verifikasi error validasi saat mengirim kolom email kosong atau format salah',
        type: 'Negative',
        preconditions: 'Pengguna berada di halaman Login.',
        steps: [
          'Biarkan kolom Email kosong atau isi dengan "format-email-salah".',
          'Biarkan kolom Kata Sandi kosong.',
          'Klik tombol "Masuk".',
        ],
        expectedResult:
          'Pengiriman formulir diblokir di sisi klien dan pesan validasi inline menyoroti kolom Email dan Kata Sandi.',
        gherkin: {
          tags: ['@negative', '@validation'],
          scenario: 'Memblokir pengiriman formulir dengan kredensial kosong atau tidak valid',
          given: ['pengguna berada di halaman Login'],
          when: [
            'pengguna memasukkan email tidak valid "format-email-salah" dan mengosongkan kata sandi',
            'pengguna mengklik "Masuk"',
          ],
          then: [
            'tidak ada permintaan autentikasi yang dikirim ke server',
            'pesan validasi inline muncul pada kedua kolom',
          ],
        },
      },
      {
        id: 'TC-005',
        title: 'Verifikasi batas panjang kata sandi (min 8 karakter, maks 128 karakter)',
        type: 'Boundary',
        preconditions: 'Pengguna berada di halaman Login atau Pembaruan Kata Sandi.',
        steps: [
          'Coba kirim kata sandi 7 karakter (di bawah batas minimum).',
          'Coba kirim kata sandi 8 karakter (tepat batas minimum).',
          'Coba kirim kata sandi 128 karakter (tepat batas maksimum).',
          'Coba kirim kata sandi 129 karakter (melebihi batas maksimum).',
        ],
        expectedResult:
          'Input 7 dan 129 karakter ditolak dengan pesan batas panjang yang jelas; input 8 dan 128 karakter diterima.',
        gherkin: {
          tags: ['@boundary', '@validation'],
          scenario: 'Menerapkan batas panjang minimum dan maksimum kata sandi',
          given: ['pengguna berada pada formulir autentikasi'],
          when: ['pengguna menguji kata sandi sepanjang 7, 8, 128, dan 129 karakter'],
          then: [
            'kata sandi 8 dan 128 karakter diterima',
            'kata sandi 7 dan 129 karakter ditolak dengan pesan validasi panjang',
          ],
        },
      },
      {
        id: 'TC-006',
        title: 'Verifikasi penguncian akun dan pembatasan laju setelah 5 kali gagal berturut-turut',
        type: 'Security',
        preconditions: 'Akun aktif; proteksi brute-force diaktifkan (batas: 5 percobaan).',
        steps: [
          'Kirim kata sandi salah untuk email valid sebanyak 5 kali berturut-turut.',
          'Amati respons pada percobaan gagal ke-5.',
          'Coba login ke-6 menggunakan kata sandi yang benar segera setelahnya.',
        ],
        expectedResult:
          'Akun dikunci sementara (atau dibatasi dengan HTTP 429) selama masa tunggu, dan kredensial valid tetap ditolak hingga masa tunggu berakhir.',
        gherkin: {
          tags: ['@security', '@brute-force'],
          scenario: 'Mengunci akun sementara setelah 5 kali gagal login berturut-turut',
          given: ['akun pengguna aktif dengan kebijakan penguncian 5 percobaan'],
          when: [
            '5 percobaan login gagal dikirim berturut-turut',
            'percobaan login ke-6 dilakukan dengan kredensial valid',
          ],
          then: [
            'sistem mengembalikan HTTP 429 Too Many Requests',
            'akun tetap terkunci hingga jeda waktu berakhir',
          ],
        },
      },
      {
        id: 'TC-007',
        title: 'Verifikasi perlindungan terhadap payload SQL Injection dan XSS pada input login',
        type: 'Security',
        preconditions: 'Aplikasi berjalan dengan sanitasi input dan query berparameter.',
        steps: [
          'Masukkan `\' OR \'1\'=\'1` ke kolom Email dan teks acak di Kata Sandi.',
          'Kirim formulir dan periksa respons.',
          'Masukkan `<script>alert(1)</script>` di kolom Email lalu kirim.',
        ],
        expectedResult:
          'Payload diperlakukan sebagai string literal, tidak ada skrip yang dieksekusi, tidak ada error database yang bocor, dan login ditolak.',
        gherkin: {
          tags: ['@security', '@injection'],
          scenario: 'Menyaring payload SQLi dan XSS pada kolom login',
          given: ['pengguna berada di halaman Login'],
          when: ['pengguna mengirimkan payload SQL injection atau XSS pada input Email'],
          then: [
            'input di-escape dengan aman dan ditolak',
            'tidak ada skrip dieksekusi dan tidak ada stack trace dikembalikan',
          ],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: 'Verify successful login with valid credentials and active account',
      type: 'Positive',
      preconditions: 'User has a registered, verified account and is on the Login page.',
      steps: [
        'Navigate to the application login screen.',
        'Enter a valid registered email address in the Email field.',
        'Enter the corresponding valid password in the Password field.',
        'Click the "Sign In" button.',
      ],
      expectedResult:
        'User is authenticated, receives a valid session token, and is redirected to the main dashboard within 2 seconds.',
      gherkin: {
        tags: ['@positive', '@smoke', '@auth'],
        scenario: 'Successful login with valid credentials',
        given: [
          'the user has a registered and verified account',
          'the user is on the Login page',
        ],
        when: [
          'the user enters a valid email and matching password',
          'the user clicks the "Sign In" button',
        ],
        then: [
          'the system authenticates the user and issues a session token',
          'the user is redirected to the dashboard',
        ],
      },
    },
    {
      id: 'TC-002',
      title: 'Verify "Remember Me" persists session across browser restarts',
      type: 'Positive',
      preconditions: 'User is on the Login page with cookies enabled.',
      steps: [
        'Enter valid email and password.',
        'Check the "Remember Me" checkbox.',
        'Click "Sign In" and confirm dashboard loads.',
        'Close the browser tab and reopen the application URL.',
      ],
      expectedResult:
        'User remains authenticated and lands directly on the dashboard without being prompted to log in again.',
      gherkin: {
        tags: ['@positive', '@session'],
        scenario: 'Persist authenticated session when Remember Me is selected',
        given: ['the user is on the Login page with browser cookies enabled'],
        when: [
          'the user logs in with valid credentials and checks "Remember Me"',
          'the user reopens the application in a new browser session',
        ],
        then: ['the user remains signed in and sees the dashboard'],
      },
    },
    {
      id: 'TC-003',
      title: 'Verify login fails gracefully with invalid password and displays generic error',
      type: 'Negative',
      preconditions: 'User has a registered account and is on the Login page.',
      steps: [
        'Enter a valid registered email address.',
        'Enter an incorrect password.',
        'Click the "Sign In" button.',
      ],
      expectedResult:
        'Authentication is denied. A generic error message ("Invalid email or password") is displayed without revealing which field was incorrect.',
      gherkin: {
        tags: ['@negative', '@auth'],
        scenario: 'Reject login attempt with incorrect password',
        given: ['a registered user is on the Login page'],
        when: [
          'the user enters a valid email and an incorrect password',
          'the user submits the login form',
        ],
        then: [
          'login is denied with HTTP 401',
          'the UI displays "Invalid email or password"',
        ],
      },
    },
    {
      id: 'TC-004',
      title: 'Verify validation errors when submitting empty or malformed email fields',
      type: 'Negative',
      preconditions: 'User is on the Login page.',
      steps: [
        'Leave the Email field empty or enter "invalid-email-format".',
        'Leave the Password field empty.',
        'Click the "Sign In" button.',
      ],
      expectedResult:
        'Form submission is blocked client-side and inline validation messages highlight the Email and Password fields.',
      gherkin: {
        tags: ['@negative', '@validation'],
        scenario: 'Block form submission with empty or malformed credentials',
        given: ['the user is on the Login page'],
        when: [
          'the user enters a malformed email "invalid-email-format" and leaves password blank',
          'the user clicks "Sign In"',
        ],
        then: [
          'no authentication request is sent to the server',
          'inline validation errors are displayed for both fields',
        ],
      },
    },
    {
      id: 'TC-005',
      title: 'Verify password field boundary lengths (min 8 chars, max 128 chars)',
      type: 'Boundary',
      preconditions: 'User is on the Login or Password Update page.',
      steps: [
        'Attempt submission with a 7-character password (below minimum).',
        'Attempt submission with an 8-character password (exact minimum).',
        'Attempt submission with a 128-character password (exact maximum).',
        'Attempt submission with a 129-character password (above maximum).',
      ],
      expectedResult:
        '7-char and 129-char inputs are rejected with clear length constraint messages; 8-char and 128-char inputs are accepted.',
      gherkin: {
        tags: ['@boundary', '@validation'],
        scenario: 'Enforce minimum and maximum password length boundaries',
        given: ['the user is on the authentication form'],
        when: ['the user tests passwords of length 7, 8, 128, and 129 characters'],
        then: [
          'passwords of 8 and 128 characters are accepted',
          'passwords of 7 and 129 characters are rejected with length validation errors',
        ],
      },
    },
    {
      id: 'TC-006',
      title: 'Verify account lockout and rate limiting after 5 consecutive failed attempts',
      type: 'Security',
      preconditions: 'User account is active; brute-force protection is enabled (threshold: 5).',
      steps: [
        'Submit an incorrect password for a valid email 5 times consecutively.',
        'Observe the response on the 5th failed attempt.',
        'Attempt a 6th login using the correct password immediately after.',
      ],
      expectedResult:
        'Account is temporarily locked (or rate-limited with HTTP 429) for the configured cooldown period, and even valid credentials are rejected until cooldown expires.',
      gherkin: {
        tags: ['@security', '@brute-force'],
        scenario: 'Lock account temporarily after 5 consecutive failed logins',
        given: ['the user account is active with a 5-attempt lockout policy'],
        when: [
          '5 consecutive failed login attempts are submitted',
          'a 6th login attempt is made with valid credentials',
        ],
        then: [
          'the system returns HTTP 429 Too Many Requests',
          'the account remains locked until the cooldown window expires',
        ],
      },
    },
    {
      id: 'TC-007',
      title: 'Verify protection against SQL injection and XSS payloads in login inputs',
      type: 'Security',
      preconditions: 'Application is running with input sanitization and parameterized queries.',
      steps: [
        'Enter `\' OR \'1\'=\'1` into the Email field and any string in Password.',
        'Submit the form and inspect the response.',
        'Enter `<script>alert(1)</script>` in the Email field and submit.',
      ],
      expectedResult:
        'Payloads are treated strictly as literal strings, no script executes, no database error is exposed, and login is rejected.',
      gherkin: {
        tags: ['@security', '@injection'],
        scenario: 'Sanitize SQLi and XSS payloads in login fields',
        given: ['the user is on the Login page'],
        when: ['the user submits SQL injection or XSS payloads in the Email input'],
        then: [
          'the input is safely escaped and rejected',
          'no script executes and no stack trace is returned',
        ],
      },
    },
  ];
}

function buildEcommerceCases(lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: 'Verifikasi checkout end-to-end dengan kartu pembayaran dan alamat pengiriman valid',
        type: 'Positive',
        preconditions: 'Pengguna memiliki minimal 1 produk tersedia di keranjang dan berada di halaman Checkout.',
        steps: [
          'Konfirmasi alamat pengiriman dan pilih Pengiriman Reguler.',
          'Masukkan detail kartu kredit uji yang valid (nomor, kedaluwarsa, CVV).',
          'Klik "Buat Pesanan".',
        ],
        expectedResult:
          'Pembayaran diotorisasi, nomor konfirmasi pesanan dibuat, keranjang dikosongkan, dan email konfirmasi dikirim.',
        gherkin: {
          tags: ['@positive', '@smoke', '@checkout'],
          scenario: 'Menyelesaikan checkout dengan detail pembayaran dan pengiriman valid',
          given: [
            'pengguna memiliki produk tersedia di keranjang belanja',
            'pengguna berada di halaman Checkout',
          ],
          when: [
            'pengguna memasukkan alamat pengiriman dan kartu pembayaran yang valid',
            'pengguna mengklik "Buat Pesanan"',
          ],
          then: [
            'pembayaran diproses dengan sukses',
            'ID konfirmasi pesanan tampil dan keranjang dikosongkan',
          ],
        },
      },
      {
        id: 'TC-002',
        title: 'Verifikasi kode promo valid menghitung ulang subtotal, diskon, dan pajak secara akurat',
        type: 'Positive',
        preconditions: 'Subtotal keranjang Rp100.000; kode promo "HEMAT20" (diskon 20%) aktif.',
        steps: [
          'Buka panel ringkasan Keranjang.',
          'Masukkan "HEMAT20" di kolom Kode Promo lalu klik "Terapkan".',
          'Verifikasi baris diskon dan total terbaru.',
        ],
        expectedResult:
          'Diskon Rp20.000 diterapkan, subtotal menjadi Rp80.000, dan pajak dihitung ulang dari jumlah setelah diskon.',
        gherkin: {
          tags: ['@positive', '@pricing'],
          scenario: 'Menerapkan kode promo persentase yang valid saat checkout',
          given: ['subtotal keranjang adalah Rp100.000', 'kode promo "HEMAT20" aktif'],
          when: ['pengguna menerapkan kode promo "HEMAT20"'],
          then: [
            'baris diskon Rp20.000 muncul',
            'total pesanan mencerminkan subtotal setelah diskon ditambah pajak terbaru',
          ],
        },
      },
      {
        id: 'TC-003',
        title: 'Verifikasi kartu pembayaran ditolak mencegah pembuatan pesanan dan menjaga keranjang',
        type: 'Negative',
        preconditions: 'Pengguna berada di halaman Checkout dengan produk di keranjang.',
        steps: [
          'Masukkan nomor kartu uji yang diketahui ditolak.',
          'Klik "Buat Pesanan".',
        ],
        expectedResult:
          'Pesan penolakan gateway pembayaran tampil jelas, tidak ada pesanan tersimpan di database, dan isi keranjang tetap utuh.',
        gherkin: {
          tags: ['@negative', '@payment'],
          scenario: 'Menangani kartu kredit yang ditolak dengan baik saat checkout',
          given: ['pengguna berada di halaman Checkout dengan produk di keranjang'],
          when: ['pengguna mengirimkan kartu pembayaran yang ditolak'],
          then: [
            'UI menampilkan pesan error pembayaran ditolak dengan jelas',
            'tidak ada pesanan dibuat dan produk di keranjang tetap tersimpan',
          ],
        },
      },
      {
        id: 'TC-004',
        title: 'Verifikasi kode promo kedaluwarsa atau tidak valid mengembalikan pesan error yang tepat',
        type: 'Negative',
        preconditions: 'Pengguna berada di halaman Keranjang atau Checkout.',
        steps: [
          'Masukkan kode promo kedaluwarsa "EXPIRED2024".',
          'Klik "Terapkan".',
        ],
        expectedResult:
          'Sistem menolak kode dengan pesan "Kode promo tidak valid atau sudah kedaluwarsa" dan total pesanan tidak berubah.',
        gherkin: {
          tags: ['@negative', '@promo'],
          scenario: 'Menolak kode promo yang sudah kedaluwarsa saat checkout',
          given: ['pengguna berada di halaman Keranjang'],
          when: ['pengguna memasukkan kode promo kedaluwarsa "EXPIRED2024" dan klik "Terapkan"'],
          then: [
            'pesan error "Kode promo tidak valid atau sudah kedaluwarsa" ditampilkan',
            'total keranjang tetap tidak berubah',
          ],
        },
      },
      {
        id: 'TC-005',
        title: 'Verifikasi batas kuantitas produk (min: 1, maks: stok tersedia)',
        type: 'Boundary',
        preconditions: 'Produk memiliki stok 5 unit; pengguna berada di halaman Keranjang.',
        steps: [
          'Coba kurangi kuantitas produk menjadi 0 dengan tombol "-" atau input manual.',
          'Atur kuantitas menjadi 1 (batas minimum valid).',
          'Atur kuantitas menjadi 5 (tepat batas stok).',
          'Coba atur kuantitas menjadi 6 (melebihi stok).',
        ],
        expectedResult:
          'Kuantitas 0 memicu konfirmasi hapus atau reset ke 1; kuantitas 1 dan 5 berhasil; kuantitas 6 dibatasi ke 5 dengan pemberitahuan batas stok.',
        gherkin: {
          tags: ['@boundary', '@inventory'],
          scenario: 'Menerapkan batas minimum dan maksimum stok kuantitas di keranjang',
          given: ['produk dengan stok 5 unit berada di keranjang pengguna'],
          when: ['pengguna mencoba mengatur kuantitas 0, 1, 5, dan 6'],
          then: [
            'kuantitas 1 dan 5 diterima',
            'kuantitas 6 diblokir dengan pesan stok tidak mencukupi',
          ],
        },
      },
      {
        id: 'TC-006',
        title: 'Verifikasi integritas harga di sisi server mencegah manipulasi harga dari sisi klien',
        type: 'Security',
        preconditions: 'Pengguna memiliki produk seharga Rp50.000 di keranjang.',
        steps: [
          'Intersep permintaan API checkout menggunakan proxy atau DevTools.',
          'Ubah field harga satuan pada payload dari 50000 menjadi 100.',
          'Teruskan permintaan yang dimodifikasi ke server.',
        ],
        expectedResult:
          'Server mengabaikan harga dari klien, menghitung ulang total dari katalog resmi, atau menolak payload dengan HTTP 400.',
        gherkin: {
          tags: ['@security', '@integrity'],
          scenario: 'Mencegah manipulasi harga dari sisi klien saat checkout',
          given: ['pengguna memiliki item seharga Rp50.000 di sesi checkout'],
          when: ['permintaan checkout yang dimanipulasi mengubah harga item menjadi Rp100'],
          then: [
            'server menolak harga yang dimanipulasi atau menagih harga resmi Rp50.000',
          ],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: 'Verify end-to-end checkout with valid payment card and shipping address',
      type: 'Positive',
      preconditions: 'User has at least 1 in-stock item in cart and is on the Checkout page.',
      steps: [
        'Confirm shipping address and select Standard Shipping.',
        'Enter valid test credit card details (number, expiry, CVV).',
        'Click "Place Order".',
      ],
      expectedResult:
        'Payment is authorized, order confirmation number is generated, cart is cleared, and confirmation email is queued.',
      gherkin: {
        tags: ['@positive', '@smoke', '@checkout'],
        scenario: 'Complete checkout with valid payment and shipping details',
        given: [
          'the user has an in-stock item in their shopping cart',
          'the user is on the Checkout page',
        ],
        when: [
          'the user enters a valid shipping address and payment card',
          'the user clicks "Place Order"',
        ],
        then: [
          'the payment is processed successfully',
          'an order confirmation ID is displayed and the cart is emptied',
        ],
      },
    },
    {
      id: 'TC-002',
      title: 'Verify valid promo code recalculates subtotal, discount, and tax accurately',
      type: 'Positive',
      preconditions: 'Cart subtotal is $100.00; promo code "SAVE20" (20% off) is active.',
      steps: [
        'Navigate to the Cart summary panel.',
        'Enter "SAVE20" in the Promo Code field and click "Apply".',
        'Verify discount line item and updated total.',
      ],
      expectedResult:
        'A $20.00 discount is applied, subtotal updates to $80.00, and sales tax is recalculated on the discounted amount.',
      gherkin: {
        tags: ['@positive', '@pricing'],
        scenario: 'Apply valid percentage promo code at checkout',
        given: ['the cart subtotal is $100.00', 'promo code "SAVE20" is active'],
        when: ['the user applies promo code "SAVE20"'],
        then: [
          'a $20.00 discount line item appears',
          'the order total reflects the discounted subtotal plus recalculated tax',
        ],
      },
    },
    {
      id: 'TC-003',
      title: 'Verify declined payment card prevents order creation and preserves cart',
      type: 'Negative',
      preconditions: 'User is on the Checkout page with items in cart.',
      steps: [
        'Enter a known declined test card number.',
        'Click "Place Order".',
      ],
      expectedResult:
        'Payment gateway decline message is shown clearly, no order is created in the database, and cart items remain intact.',
      gherkin: {
        tags: ['@negative', '@payment'],
        scenario: 'Handle declined credit card gracefully during checkout',
        given: ['the user is on the Checkout page with items in their cart'],
        when: ['the user submits a declined payment card'],
        then: [
          'the UI displays a clear payment declined error',
          'no order is created and cart items are preserved',
        ],
      },
    },
    {
      id: 'TC-004',
      title: 'Verify expired or invalid promo code returns appropriate error message',
      type: 'Negative',
      preconditions: 'User is on the Cart or Checkout page.',
      steps: [
        'Enter an expired promo code "EXPIRED2024".',
        'Click "Apply".',
      ],
      expectedResult:
        'System rejects the code with "This promo code is invalid or expired" and leaves the order total unchanged.',
      gherkin: {
        tags: ['@negative', '@promo'],
        scenario: 'Reject expired promo code at checkout',
        given: ['the user is on the Cart page'],
        when: ['the user enters an expired promo code "EXPIRED2024" and clicks "Apply"'],
        then: [
          'an error message "This promo code is invalid or expired" is shown',
          'the cart total remains unchanged',
        ],
      },
    },
    {
      id: 'TC-005',
      title: 'Verify item quantity boundary limits (min: 1, max: available stock)',
      type: 'Boundary',
      preconditions: 'Product has 5 units in stock; user is on the Cart page.',
      steps: [
        'Attempt to decrease item quantity to 0 using the "-" control or manual input.',
        'Set item quantity to 1 (minimum valid).',
        'Set item quantity to 5 (exact stock limit).',
        'Attempt to set item quantity to 6 (exceeds stock).',
      ],
      expectedResult:
        'Quantity 0 prompts item removal or resets to 1; quantities 1 and 5 succeed; quantity 6 is capped at 5 with a stock limit notice.',
      gherkin: {
        tags: ['@boundary', '@inventory'],
        scenario: 'Enforce minimum and maximum stock quantity boundaries in cart',
        given: ['a product with 5 units in stock is in the user cart'],
        when: ['the user attempts to set quantities of 0, 1, 5, and 6'],
        then: [
          'quantities 1 and 5 are accepted',
          'quantity 6 is blocked with an insufficient stock message',
        ],
      },
    },
    {
      id: 'TC-006',
      title: 'Verify server-side price integrity prevents client-side price tampering',
      type: 'Security',
      preconditions: 'User has an item priced at $50.00 in cart.',
      steps: [
        'Intercept the checkout API request using a proxy or DevTools.',
        'Modify the unit price payload field from 50.00 to 0.01.',
        'Forward the tampered request to the server.',
      ],
      expectedResult:
        'Server ignores client-supplied pricing, recalculates totals from authoritative catalog prices, or rejects the tampered payload with HTTP 400.',
      gherkin: {
        tags: ['@security', '@integrity'],
        scenario: 'Prevent client-side price manipulation during checkout',
        given: ['the user has a $50.00 item in their checkout session'],
        when: ['a tampered checkout request sets the item price to $0.01'],
        then: [
          'the server rejects the tampered price or charges the authoritative $50.00 price',
        ],
      },
    },
  ];
}

function buildSearchCases(lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: 'Verifikasi pencarian kata kunci tepat dan parsial menampilkan data yang relevan',
        type: 'Positive',
        preconditions: 'Database berisi data contoh yang cocok dengan kata kunci pencarian.',
        steps: [
          'Fokuskan kursor ke kolom pencarian.',
          'Ketik kata kunci yang tersedia (misalnya "Wireless") lalu tekan Enter.',
          'Periksa daftar hasil dan jumlah hasil yang ditampilkan.',
        ],
        expectedResult:
          'Semua item yang cocok ditampilkan sesuai relevansi, dan penghitung total mencerminkan jumlah data yang ditemukan.',
        gherkin: {
          tags: ['@positive', '@search'],
          scenario: 'Mengembalikan hasil relevan untuk kueri kata kunci yang valid',
          given: ['katalog berisi data yang cocok dengan "Wireless"'],
          when: ['pengguna mencari "Wireless"'],
          then: ['data yang cocok ditampilkan beserta jumlah hasil yang akurat'],
        },
      },
      {
        id: 'TC-002',
        title: 'Verifikasi kombinasi beberapa filter dan pengurutan memperbarui hasil secara akurat',
        type: 'Positive',
        preconditions: 'Pengguna berada di halaman hasil pencarian.',
        steps: [
          'Pilih filter kategori dan filter status.',
          'Ubah urutan menjadi "Terbaru".',
          'Verifikasi parameter URL dan daftar yang dirender.',
        ],
        expectedResult:
          'Hanya item yang memenuhi semua filter yang ditampilkan berurutan dari terbaru, dan parameter URL mencerminkan filter aktif.',
        gherkin: {
          tags: ['@positive', '@filters'],
          scenario: 'Menerapkan kombinasi filter dan pengurutan pada hasil pencarian',
          given: ['pengguna sedang melihat hasil pencarian'],
          when: [
            'pengguna memilih filter kategori dan status',
            'pengguna mengurutkan berdasarkan "Terbaru"',
          ],
          then: ['hasil cocok dengan seluruh kriteria dalam urutan kronologis menurun'],
        },
      },
      {
        id: 'TC-003',
        title: 'Verifikasi tampilan kosong muncul saat kueri pencarian tidak menemukan data',
        type: 'Negative',
        preconditions: 'Pengguna berada di halaman pencarian.',
        steps: [
          'Masukkan string acak yang tidak ada "zzxxccvv9988" ke kolom pencarian.',
          'Jalankan pencarian dan amati area hasil.',
        ],
        expectedResult:
          'Pesan kondisi kosong yang informatif ("Hasil tidak ditemukan") tampil bersama tombol "Reset Filter".',
        gherkin: {
          tags: ['@negative', '@empty-state'],
          scenario: 'Menampilkan kondisi kosong saat tidak ada data yang cocok',
          given: ['pengguna berada di halaman pencarian'],
          when: ['pengguna mencari istilah yang tidak cocok "zzxxccvv9988"'],
          then: ['pesan kondisi kosong dan tombol "Reset Filter" ditampilkan'],
        },
      },
      {
        id: 'TC-004',
        title: 'Verifikasi batas panjang input pencarian dan kondisi batas paginasi',
        type: 'Boundary',
        preconditions: 'Dataset berisi 25 data; ukuran halaman adalah 10.',
        steps: [
          'Uji kueri 1 karakter dan kueri 256 karakter.',
          'Navigasi ke Halaman 1, Halaman 3 (halaman terakhir dengan 5 item), dan coba Halaman 4.',
        ],
        expectedResult:
          'Kueri panjang ditangani dengan aman; Halaman 3 menampilkan 5 item dengan tombol "Berikutnya" nonaktif; Halaman 4 ditangani tanpa error.',
        gherkin: {
          tags: ['@boundary', '@pagination'],
          scenario: 'Menangani batas panjang kueri dan batas halaman paginasi',
          given: ['dataset memiliki 25 item dengan ukuran halaman 10'],
          when: ['pengguna membuka halaman 3 dan meminta halaman 4'],
          then: [
            'halaman 3 menampilkan 5 item dengan tombol Berikutnya nonaktif',
            'halaman 4 yang tidak valid tidak menyebabkan UI crash',
          ],
        },
      },
      {
        id: 'TC-005',
        title: 'Verifikasi karakter khusus dan injeksi SQL/HTML pada kueri pencarian dinetralkan',
        type: 'Security',
        preconditions: 'Pengguna berada di halaman pencarian.',
        steps: [
          'Cari `<img src=x onerror=alert(1)>` dan `%_; DROP TABLE users;--`.',
          'Periksa rendering DOM dari istilah pencarian yang ditampilkan ulang.',
        ],
        expectedResult:
          'Istilah pencarian di-escape sebagai HTML aman di UI, diparameterisasi di backend, dan tidak ada eksekusi skrip atau error 500.',
        gherkin: {
          tags: ['@security', '@xss'],
          scenario: 'Menetralkan XSS dan SQL injection pada bilah pencarian',
          given: ['pengguna berada di halaman pencarian'],
          when: ['pengguna mengirimkan payload XSS atau wildcard SQL di input pencarian'],
          then: ['kueri di-escape dengan aman dan tidak ada skrip yang berjalan'],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: 'Verify exact and partial keyword search returns relevant matching records',
      type: 'Positive',
      preconditions: 'Database contains seeded records matching the search keyword.',
      steps: [
        'Focus the search input bar.',
        'Type a known keyword (e.g., "Wireless") and press Enter.',
        'Inspect the returned result cards and result count.',
      ],
      expectedResult:
        'All matching items are displayed, ranked by relevance, and the total match counter reflects the returned dataset.',
      gherkin: {
        tags: ['@positive', '@search'],
        scenario: 'Return relevant results for valid keyword query',
        given: ['the catalog contains records matching "Wireless"'],
        when: ['the user searches for "Wireless"'],
        then: ['matching records are displayed with an accurate result count'],
      },
    },
    {
      id: 'TC-002',
      title: 'Verify combining multiple filters with sorting updates results accurately',
      type: 'Positive',
      preconditions: 'User is on the search results page.',
      steps: [
        'Select a category filter and a status filter.',
        'Change sort order to "Newest First".',
        'Verify URL query params and rendered list.',
      ],
      expectedResult:
        'Only items matching all active filters are shown in descending date order, and URL parameters reflect the active filter state.',
      gherkin: {
        tags: ['@positive', '@filters'],
        scenario: 'Apply combined filters and sorting to search results',
        given: ['the user is viewing search results'],
        when: [
          'the user selects category and status filters',
          'the user sorts by "Newest First"',
        ],
        then: ['results match all selected criteria in descending chronological order'],
      },
    },
    {
      id: 'TC-003',
      title: 'Verify empty state UI appears when search query matches zero records',
      type: 'Negative',
      preconditions: 'User is on the search page.',
      steps: [
        'Enter a non-existent random string "zzxxccvv9988" into the search bar.',
        'Trigger search and observe the results area.',
      ],
      expectedResult:
        'A helpful empty-state message ("No results found") is displayed along with a "Clear Filters" action.',
      gherkin: {
        tags: ['@negative', '@empty-state'],
        scenario: 'Display empty state when no records match query',
        given: ['the user is on the search page'],
        when: ['the user searches for non-matching term "zzxxccvv9988"'],
        then: ['an empty-state message and a "Clear Filters" button are displayed'],
      },
    },
    {
      id: 'TC-004',
      title: 'Verify search input length and pagination boundary conditions',
      type: 'Boundary',
      preconditions: 'Dataset contains 25 records; page size is 10.',
      steps: [
        'Test a 1-character search query and a 256-character search query.',
        'Navigate to Page 1, Page 3 (last page with 5 items), and attempt Page 4.',
      ],
      expectedResult:
        'Long queries are safely truncated or validated; Page 3 displays 5 items with "Next" disabled; requesting Page 4 falls back cleanly.',
      gherkin: {
        tags: ['@boundary', '@pagination'],
        scenario: 'Handle query length and pagination page boundaries',
        given: ['the dataset has 25 items with a page size of 10'],
        when: ['the user navigates to page 3 and requests page 4'],
        then: [
          'page 3 shows 5 items with the Next button disabled',
          'invalid page 4 does not crash the UI',
        ],
      },
    },
    {
      id: 'TC-005',
      title: 'Verify special characters and SQL/HTML injection in search query are neutralized',
      type: 'Security',
      preconditions: 'User is on the search page.',
      steps: [
        'Search for `<img src=x onerror=alert(1)>` and `%_; DROP TABLE users;--`.',
        'Inspect DOM rendering of the echoed search term.',
      ],
      expectedResult:
        'Search term is HTML-escaped in the UI, parameterized in the backend query, and no script execution or 500 error occurs.',
      gherkin: {
        tags: ['@security', '@xss'],
        scenario: 'Neutralize XSS and SQL injection in search bar',
        given: ['the user is on the search page'],
        when: ['the user submits XSS or SQL wildcard payloads in the search input'],
        then: ['the query is safely escaped and no script executes'],
      },
    },
  ];
}

function buildUploadCases(lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: 'Verifikasi unggah berkas valid yang didukung dan sesuai batas ukuran berhasil',
        type: 'Positive',
        preconditions: 'Pengguna terautentikasi dan berada di komponen Unggah Berkas.',
        steps: [
          'Klik "Pilih Berkas" atau seret dan lepas berkas PDF/PNG berukuran 2MB yang valid.',
          'Tunggu indikator progres unggah mencapai 100%.',
          'Verifikasi pratinjau berkas atau baris berkas yang terunggah.',
        ],
        expectedResult:
          'Berkas berhasil diunggah, metadata (nama, ukuran) ditampilkan, dan berkas tersimpan di penyimpanan.',
        gherkin: {
          tags: ['@positive', '@upload'],
          scenario: 'Mengunggah berkas valid sesuai format dan batas ukuran yang diizinkan',
          given: ['pengguna berada di antarmuka Unggah Berkas'],
          when: ['pengguna mengunggah berkas PDF 2MB yang valid'],
          then: ['proses unggah mencapai 100% dan berkas muncul di daftar'],
        },
      },
      {
        id: 'TC-002',
        title: 'Verifikasi ekstensi berkas yang tidak didukung ditolak dengan pesan error jelas',
        type: 'Negative',
        preconditions: 'Format yang diizinkan adalah PDF, PNG, JPG.',
        steps: [
          'Coba unggah berkas `.exe` atau `.bat`.',
          'Amati umpan balik validasi.',
        ],
        expectedResult:
          'Proses unggah langsung diblokir dengan pesan error eksplisit yang mencantumkan format yang didukung.',
        gherkin: {
          tags: ['@negative', '@validation'],
          scenario: 'Menolak ekstensi berkas eksekusi yang tidak didukung',
          given: ['hanya unggahan PDF, PNG, dan JPG yang diizinkan'],
          when: ['pengguna mencoba mengunggah "payload.exe"'],
          then: ['unggahan ditolak dengan pesan tipe berkas tidak didukung'],
        },
      },
      {
        id: 'TC-003',
        title: 'Verifikasi batas ukuran berkas (0 byte, tepat maks 10MB, dan 10,1MB)',
        type: 'Boundary',
        preconditions: 'Ukuran maksimum berkas yang diizinkan adalah 10MB.',
        steps: [
          'Coba unggah berkas kosong berukuran 0 byte.',
          'Unggah berkas berukuran tepat 10,0MB.',
          'Coba unggah berkas berukuran 10,1MB.',
        ],
        expectedResult:
          'Berkas 0 byte dan 10,1MB ditolak dengan pesan validasi ukuran yang jelas; berkas 10,0MB berhasil diunggah.',
        gherkin: {
          tags: ['@boundary', '@upload'],
          scenario: 'Menerapkan batas ukuran berkas 0 byte dan maksimum 10MB',
          given: ['batas maksimum ukuran unggahan adalah 10MB'],
          when: ['pengguna mengunggah berkas 0 byte, 10MB, dan 10,1MB'],
          then: [
            'berkas 10MB diterima',
            'berkas 0 byte dan 10,1MB ditolak',
          ],
        },
      },
      {
        id: 'TC-004',
        title: 'Verifikasi pemalsuan MIME-type dan path traversal pada nama berkas diblokir',
        type: 'Security',
        preconditions: 'Inspeksi magic-byte sisi server dan sanitasi nama berkas aktif.',
        steps: [
          'Ubah nama skrip shell menjadi `avatar.png` lalu coba unggah.',
          'Unggah berkas bernama `../../etc/passwd.pdf`.',
        ],
        expectedResult:
          'Server menolak berkas palsu berdasarkan magic-byte dan membersihkan karakter path traversal dari nama berkas.',
        gherkin: {
          tags: ['@security', '@upload'],
          scenario: 'Memblokir berkas MIME palsu dan nama berkas path traversal',
          given: ['validasi magic-byte di sisi server aktif'],
          when: ['berkas palsu atau nama berkas path-traversal diunggah'],
          then: ['server menolak konten palsu dan mensterilkan nama berkas'],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: 'Verify successful upload of a valid supported file within size limit',
      type: 'Positive',
      preconditions: 'User is authenticated and on the File Upload component.',
      steps: [
        'Click "Choose File" or drag-and-drop a valid 2MB PDF/PNG file.',
        'Wait for the upload progress indicator to reach 100%.',
        'Verify the file preview or uploaded file row.',
      ],
      expectedResult:
        'File uploads successfully, metadata (name, size) is displayed, and the file is persisted in storage.',
      gherkin: {
        tags: ['@positive', '@upload'],
        scenario: 'Upload a valid file within allowed format and size limits',
        given: ['the user is on the File Upload interface'],
        when: ['the user uploads a valid 2MB PDF file'],
        then: ['the upload completes at 100% and the file appears in the list'],
      },
    },
    {
      id: 'TC-002',
      title: 'Verify unsupported file extension is rejected with clear error',
      type: 'Negative',
      preconditions: 'Allowed formats are PDF, PNG, JPG.',
      steps: [
        'Attempt to upload an `.exe` or `.bat` file.',
        'Observe validation feedback.',
      ],
      expectedResult:
        'Upload is blocked immediately with an explicit error listing supported formats.',
      gherkin: {
        tags: ['@negative', '@validation'],
        scenario: 'Reject unsupported executable file extensions',
        given: ['only PDF, PNG, and JPG uploads are permitted'],
        when: ['the user attempts to upload "payload.exe"'],
        then: ['the upload is rejected with an unsupported file type message'],
      },
    },
    {
      id: 'TC-003',
      title: 'Verify file size boundaries (0 bytes, exact max 10MB, and 10.1MB)',
      type: 'Boundary',
      preconditions: 'Maximum allowed file size is 10MB.',
      steps: [
        'Attempt to upload an empty 0-byte file.',
        'Upload a file of exactly 10.0MB.',
        'Attempt to upload a 10.1MB file.',
      ],
      expectedResult:
        '0-byte and 10.1MB files are rejected with clear size validation messages; the 10.0MB file succeeds.',
      gherkin: {
        tags: ['@boundary', '@upload'],
        scenario: 'Enforce 0-byte and 10MB maximum file size boundaries',
        given: ['the maximum upload size limit is 10MB'],
        when: ['the user uploads 0-byte, 10MB, and 10.1MB files'],
        then: [
          'the 10MB file is accepted',
          'the 0-byte and 10.1MB files are rejected',
        ],
      },
    },
    {
      id: 'TC-004',
      title: 'Verify MIME-type spoofing and path traversal in filename are blocked',
      type: 'Security',
      preconditions: 'Server-side magic-byte inspection and filename sanitization are enabled.',
      steps: [
        'Rename a shell script to `avatar.png` and attempt upload.',
        'Upload a file named `../../etc/passwd.pdf`.',
      ],
      expectedResult:
        'Server rejects the spoofed file based on magic bytes and strips/randomizes path traversal characters from filenames.',
      gherkin: {
        tags: ['@security', '@upload'],
        scenario: 'Block MIME-spoofed files and path traversal filenames',
        given: ['server-side magic-byte validation is active'],
        when: ['a spoofed file or path-traversal filename is uploaded'],
        then: ['the server rejects the spoofed content and sanitizes filenames'],
      },
    },
  ];
}

function buildApiCases(lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: 'Verifikasi permintaan API valid mengembalikan HTTP 200/201 dengan skema JSON sesuai',
        type: 'Positive',
        preconditions: 'Token Bearer valid dan payload permintaan yang diperlukan telah disiapkan.',
        steps: [
          'Kirim permintaan dengan header Authorization valid dan body JSON sesuai skema.',
          'Verifikasi kode status HTTP, header respons, dan struktur body JSON.',
        ],
        expectedResult:
          'Endpoint mengembalikan HTTP 200/201 dengan content-type `application/json` dan seluruh field skema wajib.',
        gherkin: {
          tags: ['@positive', '@api'],
          scenario: 'Mengembalikan respons sukses dan skema valid untuk permintaan terotorisasi',
          given: ['klien memiliki token Bearer yang valid'],
          when: ['permintaan sesuai skema dikirim ke endpoint API'],
          then: ['API merespons dengan HTTP 200 dan sesuai dengan skema JSON yang diharapkan'],
        },
      },
      {
        id: 'TC-002',
        title: 'Verifikasi field wajib yang hilang mengembalikan HTTP 400 dengan detail error terstruktur',
        type: 'Negative',
        preconditions: 'Token Bearer valid tersedia.',
        steps: [
          'Hilangkan satu field wajib dari body permintaan JSON.',
          'Kirim permintaan dan periksa respons error.',
        ],
        expectedResult:
          'API merespons dengan HTTP 400 Bad Request dan objek error terstruktur yang menyebutkan field yang hilang.',
        gherkin: {
          tags: ['@negative', '@api', '@validation'],
          scenario: 'Menolak payload tanpa field wajib dengan HTTP 400',
          given: ['klien mengirim permintaan API yang terautentikasi'],
          when: ['field wajib dihilangkan dari payload JSON'],
          then: ['API mengembalikan HTTP 400 dengan detail validasi per field'],
        },
      },
      {
        id: 'TC-003',
        title: 'Verifikasi rate limiting API menerapkan ambang batas dan mengembalikan header Retry-After',
        type: 'Boundary',
        preconditions: 'Batas laju dikonfigurasi sebesar 60 permintaan per menit.',
        steps: [
          'Kirim 60 permintaan valid dalam 1 menit dan pastikan semuanya berhasil.',
          'Kirim permintaan ke-61 dalam jendela waktu yang sama.',
        ],
        expectedResult:
          '60 permintaan pertama berhasil; permintaan ke-61 mengembalikan HTTP 429 Too Many Requests dengan header `Retry-After`.',
        gherkin: {
          tags: ['@boundary', '@rate-limit'],
          scenario: 'Menerapkan batas laju API pada 60 permintaan per menit',
          given: ['batas laju API adalah 60 permintaan per menit'],
          when: ['klien mengirim 61 permintaan dalam 60 detik'],
          then: ['permintaan ke-61 menerima HTTP 429 dengan header Retry-After'],
        },
      },
      {
        id: 'TC-004',
        title: 'Verifikasi permintaan tanpa autentikasi atau token kedaluwarsa mengembalikan HTTP 401',
        type: 'Security',
        preconditions: 'Endpoint mewajibkan autentikasi yang valid.',
        steps: [
          'Kirim permintaan tanpa header Authorization.',
          'Kirim permintaan dengan token JWT yang kedaluwarsa atau dimodifikasi.',
        ],
        expectedResult:
          'Kedua permintaan ditolak dengan HTTP 401 Unauthorized tanpa membocorkan detail internal sensitif.',
        gherkin: {
          tags: ['@security', '@auth'],
          scenario: 'Menolak token Bearer yang hilang atau kedaluwarsa dengan HTTP 401',
          given: ['endpoint API mewajibkan autentikasi Bearer'],
          when: ['permintaan dikirim tanpa token atau dengan JWT kedaluwarsa'],
          then: ['API merespons dengan HTTP 401 Unauthorized'],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: 'Verify valid API request returns HTTP 200/201 with expected JSON schema',
      type: 'Positive',
      preconditions: 'Valid Bearer token and required request payload are prepared.',
      steps: [
        'Send a request with valid Authorization header and schema-compliant JSON body.',
        'Verify HTTP status code, response headers, and JSON body structure.',
      ],
      expectedResult:
        'Endpoint returns HTTP 200/201 with `application/json` content-type and all required schema fields.',
      gherkin: {
        tags: ['@positive', '@api'],
        scenario: 'Return success response and valid schema for authorized request',
        given: ['the client holds a valid Bearer token'],
        when: ['a schema-compliant request is sent to the API endpoint'],
        then: ['the API responds with HTTP 200 and matches the expected JSON schema'],
      },
    },
    {
      id: 'TC-002',
      title: 'Verify missing required fields return HTTP 400 with structured field errors',
      type: 'Negative',
      preconditions: 'Valid Bearer token is available.',
      steps: [
        'Omit a mandatory field from the JSON request body.',
        'Send the request and inspect the error response.',
      ],
      expectedResult:
        'API responds with HTTP 400 Bad Request and a structured error object identifying the missing field.',
      gherkin: {
        tags: ['@negative', '@api', '@validation'],
        scenario: 'Reject payload missing mandatory fields with HTTP 400',
        given: ['the client sends an authenticated API request'],
        when: ['a required field is omitted from the JSON payload'],
        then: ['the API returns HTTP 400 with field-level validation details'],
      },
    },
    {
      id: 'TC-003',
      title: 'Verify API rate limiting enforces threshold and returns Retry-After header',
      type: 'Boundary',
      preconditions: 'Rate limit is configured to 60 requests per minute.',
      steps: [
        'Send 60 valid requests within 1 minute and confirm all succeed.',
        'Send the 61st request within the same window.',
      ],
      expectedResult:
        'First 60 requests succeed; 61st request returns HTTP 429 Too Many Requests with a `Retry-After` header.',
      gherkin: {
        tags: ['@boundary', '@rate-limit'],
        scenario: 'Enforce API rate limit at 60 requests per minute',
        given: ['the API rate limit is 60 requests per minute'],
        when: ['the client sends 61 requests within 60 seconds'],
        then: ['the 61st request receives HTTP 429 with a Retry-After header'],
      },
    },
    {
      id: 'TC-004',
      title: 'Verify unauthenticated or expired token requests return HTTP 401',
      type: 'Security',
      preconditions: 'Endpoint requires valid authentication.',
      steps: [
        'Send a request without an Authorization header.',
        'Send a request with an expired or tampered JWT token.',
      ],
      expectedResult:
        'Both requests are rejected with HTTP 401 Unauthorized and no sensitive internal details are leaked.',
      gherkin: {
        tags: ['@security', '@auth'],
        scenario: 'Reject missing or expired Bearer tokens with HTTP 401',
        given: ['the API endpoint requires Bearer authentication'],
        when: ['a request is sent with no token or an expired JWT'],
        then: ['the API responds with HTTP 401 Unauthorized'],
      },
    },
  ];
}

function buildGenericCases(subject: string, lang: Language): TestCase[] {
  if (lang === 'id') {
    return [
      {
        id: 'TC-001',
        title: `Verifikasi penyelesaian alur utama (happy-path) pada ${subject}`,
        type: 'Positive',
        preconditions: 'Pengguna terautentikasi dengan izin yang sesuai dan data uji yang valid.',
        steps: [
          `Buka halaman atau titik masuk untuk ${subject}.`,
          'Isi seluruh input valid yang memenuhi kriteria penerimaan.',
          'Kirim aksi dan amati umpan balik UI serta penyimpanan status.',
        ],
        expectedResult:
          'Aksi selesai tanpa error, konfirmasi keberhasilan tampil jelas, dan status terbaru tetap bertahan setelah halaman dimuat ulang.',
        gherkin: {
          tags: ['@positive', '@smoke'],
          scenario: `Eksekusi berhasil pada ${subject}`,
          given: [
            'pengguna terautentikasi dengan izin yang sesuai',
            `pengguna telah membuka ${subject}`,
          ],
          when: ['pengguna mengisi input valid dan mengirimkan aksi'],
          then: [
            'sistem memproses permintaan dengan sukses',
            'pesan konfirmasi tampil dan status tersimpan',
          ],
        },
      },
      {
        id: 'TC-002',
        title: `Verifikasi konsistensi status dan pembaruan UI setelah ${subject}`,
        type: 'Positive',
        preconditions: 'Status awal telah dicatat sebelum menjalankan alur kerja.',
        steps: [
          `Jalankan ${subject} dengan parameter standar yang valid.`,
          'Muat ulang browser lalu kembali ke tampilan ringkasan.',
        ],
        expectedResult:
          'Seluruh komponen UI terkait dan data backend mencerminkan status terbaru secara akurat tanpa cache usang.',
        gherkin: {
          tags: ['@positive', '@integration'],
          scenario: `Verifikasi persistensi status setelah ${subject}`,
          given: ['sistem berada dalam kondisi awal yang diketahui'],
          when: [`pengguna menyelesaikan ${subject}`, 'pengguna memuat ulang aplikasi'],
          then: ['status terbaru dirender secara akurat di seluruh tampilan'],
        },
      },
      {
        id: 'TC-003',
        title: `Verifikasi pesan validasi saat input wajib untuk ${subject} kosong atau tidak valid`,
        type: 'Negative',
        preconditions: `Pengguna telah membuka antarmuka ${subject}.`,
        steps: [
          'Kosongkan kolom wajib atau masukkan format data yang tidak didukung.',
          'Coba kirim atau picu aksi utama.',
        ],
        expectedResult:
          'Pengiriman dicegah, pesan validasi inline yang deskriptif tampil, dan tidak ada data parsial/rusak yang tersimpan.',
        gherkin: {
          tags: ['@negative', '@validation'],
          scenario: `Menolak input tidak valid atau kosong pada ${subject}`,
          given: [`pengguna berada di layar ${subject}`],
          when: ['pengguna mengirimkan kolom wajib yang kosong atau salah format'],
          then: [
            'pesan validasi inline ditampilkan',
            'tidak ada status tidak valid yang disimpan',
          ],
        },
      },
      {
        id: 'TC-004',
        title: `Verifikasi batas minimum dan maksimum input/data untuk ${subject}`,
        type: 'Boundary',
        preconditions: 'Batas nilai (panjang karakter atau rentang angka min/maks) telah ditentukan.',
        steps: [
          'Uji dengan nilai tepat di batas minimum (mis. 1 karakter / batas bawah).',
          'Uji dengan nilai tepat di batas maksimum.',
          'Uji dengan nilai di luar batas yang diizinkan (min - 1 dan maks + 1).',
        ],
        expectedResult:
          'Nilai tepat di batas min/maks diterima; nilai di luar batas ditolak dengan panduan yang jelas.',
        gherkin: {
          tags: ['@boundary', '@limits'],
          scenario: `Menerapkan batas nilai pada ${subject}`,
          given: [`pengguna berinteraksi dengan ${subject}`],
          when: ['pengguna mengirimkan nilai di batas, di bawah, dan di atas batas yang diizinkan'],
          then: [
            'nilai tepat pada batas berhasil diproses',
            'nilai di luar batas ditolak dengan pesan yang jelas',
          ],
        },
      },
      {
        id: 'TC-005',
        title: `Verifikasi otorisasi dan sanitasi input untuk ${subject}`,
        type: 'Security',
        preconditions: 'Kontrol akses berbasis peran (RBAC) dan proteksi XSS/injeksi aktif.',
        steps: [
          `Coba akses atau jalankan ${subject} menggunakan akun tanpa izin yang sesuai.`,
          'Masukkan `<script>alert("xss")</script>` ke kolom teks sebagai pengguna berwenang.',
        ],
        expectedResult:
          'Akses tidak sah mengembalikan HTTP 403 Forbidden; payload skrip disanitasi/di-escape dan tidak pernah dieksekusi.',
        gherkin: {
          tags: ['@security', '@rbac'],
          scenario: `Menerapkan otorisasi dan proteksi XSS pada ${subject}`,
          given: ['kontrol akses dan sanitasi input diaktifkan'],
          when: [
            `pengguna tidak berwenang mencoba ${subject}`,
            'payload XSS dimasukkan ke kolom teks',
          ],
          then: [
            'permintaan tidak sah menerima HTTP 403',
            'skrip yang disisipkan dinetralkan dan tidak pernah berjalan',
          ],
        },
      },
    ];
  }

  return [
    {
      id: 'TC-001',
      title: `Verify happy-path completion of ${subject}`,
      type: 'Positive',
      preconditions: 'User is authenticated with required permissions and valid test data.',
      steps: [
        `Navigate to the entry point for ${subject}.`,
        'Provide valid, complete inputs matching all acceptance criteria.',
        'Submit the action and observe UI feedback and state persistence.',
      ],
      expectedResult:
        'Action completes without errors, a clear success confirmation is shown, and updated state persists after page reload.',
      gherkin: {
        tags: ['@positive', '@smoke'],
        scenario: `Successful execution of ${subject}`,
        given: [
          'the user is authenticated with appropriate permissions',
          `the user has navigated to ${subject}`,
        ],
        when: ['the user provides valid inputs and submits the action'],
        then: [
          'the system processes the request successfully',
          'a confirmation message is displayed and state is persisted',
        ],
      },
    },
    {
      id: 'TC-002',
      title: `Verify state consistency and audit/UI update after ${subject}`,
      type: 'Positive',
      preconditions: 'Initial baseline state is recorded before executing the workflow.',
      steps: [
        `Perform ${subject} with standard valid parameters.`,
        'Refresh the browser and navigate back to the summary view.',
      ],
      expectedResult:
        'All dependent UI components and backend records reflect the updated state accurately without stale cache data.',
      gherkin: {
        tags: ['@positive', '@integration'],
        scenario: `Verify state persistence after ${subject}`,
        given: ['the system is in a known baseline state'],
        when: [`the user completes ${subject}`, 'the user reloads the application'],
        then: ['the updated state is rendered accurately across all views'],
      },
    },
    {
      id: 'TC-003',
      title: `Verify validation errors when required inputs for ${subject} are missing or invalid`,
      type: 'Negative',
      preconditions: `User has accessed the ${subject} interface.`,
      steps: [
        'Leave mandatory fields empty or enter unsupported data formats.',
        'Attempt to submit or trigger the primary action.',
      ],
      expectedResult:
        'Submission is prevented, descriptive inline validation messages are shown, and no partial/corrupt data is saved.',
      gherkin: {
        tags: ['@negative', '@validation'],
        scenario: `Reject invalid or missing inputs for ${subject}`,
        given: [`the user is on the ${subject} screen`],
        when: ['the user submits empty or malformed required fields'],
        then: [
          'inline validation errors are displayed',
          'no invalid state is persisted',
        ],
      },
    },
    {
      id: 'TC-004',
      title: `Verify minimum and maximum input/data boundaries for ${subject}`,
      type: 'Boundary',
      preconditions: 'Boundary limits (min/max character length or numeric range) are defined.',
      steps: [
        'Test with minimum allowed boundary value (e.g., 1 char / min limit).',
        'Test with maximum allowed boundary value.',
        'Test with values just outside the allowed boundaries (min - 1 and max + 1).',
      ],
      expectedResult:
        'Values at exact min/max boundaries are accepted; out-of-bounds values are gracefully rejected with clear guidance.',
      gherkin: {
        tags: ['@boundary', '@limits'],
        scenario: `Enforce boundary limits for ${subject}`,
        given: [`the user is interacting with ${subject}`],
        when: ['the user submits values at, below, and above the allowed limits'],
        then: [
          'exact boundary values succeed',
          'out-of-bounds values are rejected with clear messages',
        ],
      },
    },
    {
      id: 'TC-005',
      title: `Verify authorization and input sanitization for ${subject}`,
      type: 'Security',
      preconditions: 'Role-based access control and XSS/injection protections are active.',
      steps: [
        `Attempt to access or invoke ${subject} with an unauthorized user role.`,
        'Submit `<script>alert("xss")</script>` in text fields as an authorized user.',
      ],
      expectedResult:
        'Unauthorized access returns HTTP 403 Forbidden; script payloads are sanitized/escaped and never execute in the browser.',
      gherkin: {
        tags: ['@security', '@rbac'],
        scenario: `Enforce authorization and XSS protection on ${subject}`,
        given: ['access control and input sanitization are enabled'],
        when: [
          `an unauthorized user attempts ${subject}`,
          'an XSS payload is entered into text inputs',
        ],
        then: [
          'unauthorized requests receive HTTP 403',
          'injected scripts are neutralized and never execute',
        ],
      },
    },
  ];
}

function generateSupplementForType(
  type: SpecificTestType,
  subject: string,
  existingCount: number,
  lang: Language
): TestCase[] {
  const supplements: Record<SpecificTestType, Omit<TestCase, 'id'>[]> =
    lang === 'id'
      ? {
          Positive: [
            {
              title: `Verifikasi aksesibilitas dan navigasi khusus keyboard untuk ${subject}`,
              type: 'Positive',
              preconditions: 'Pengguna bernavigasi hanya menggunakan keyboard (Tab, Enter, Space).',
              steps: [
                `Tekan Tab melewati seluruh kontrol interaktif di ${subject}.`,
                'Picu aksi utama menggunakan Enter atau Space.',
              ],
              expectedResult:
                'Urutan fokus logis, indikator fokus terlihat jelas, dan alur kerja selesai dengan baik via keyboard.',
              gherkin: {
                tags: ['@positive', '@a11y'],
                scenario: `Menyelesaikan ${subject} dengan navigasi keyboard`,
                given: [`pengguna berada di tampilan ${subject}`],
                when: ['pengguna bernavigasi dan mengirim hanya dengan kontrol keyboard'],
                then: ['seluruh kontrol dapat dijangkau dan alur kerja berhasil'],
              },
            },
            {
              title: `Verifikasi eksekusi idempoten dan pencegahan klik ganda pada ${subject}`,
              type: 'Positive',
              preconditions: 'Pengguna berada di layar pengiriman.',
              steps: [
                'Klik ganda tombol kirim utama secara cepat.',
                'Periksa permintaan jaringan dan data yang terbentuk.',
              ],
              expectedResult:
                'Tombol masuk ke status loading/nonaktif setelah klik pertama, mencegah duplikasi pengiriman.',
              gherkin: {
                tags: ['@positive', '@idempotency'],
                scenario: `Mencegah pengiriman ganda saat ${subject}`,
                given: [`pengguna telah mengisi data valid untuk ${subject}`],
                when: ['pengguna mengklik tombol kirim dua kali dengan cepat'],
                then: ['hanya satu permintaan yang diproses dan tidak ada data duplikat'],
              },
            },
          ],
          Negative: [
            {
              title: `Verifikasi pemulihan error saat jaringan/API timeout selama ${subject}`,
              type: 'Negative',
              preconditions: 'Simulasi jaringan lambat atau offline diaktifkan.',
              steps: [
                `Jalankan ${subject} saat mensimulasikan 504 Gateway Timeout atau kondisi offline.`,
                'Amati banner error dan opsi coba lagi.',
              ],
              expectedResult:
                'Pengguna melihat pesan error yang dapat dicoba ulang tanpa kehilangan data formulir yang sudah diisi.',
              gherkin: {
                tags: ['@negative', '@resilience'],
                scenario: `Menangani timeout jaringan dengan baik selama ${subject}`,
                given: ['API backend tidak dapat dijangkau atau mengalami timeout'],
                when: [`pengguna mengirimkan ${subject}`],
                then: [
                  'pesan coba lagi yang ramah ditampilkan',
                  'data yang diisi pengguna tetap terjaga untuk dicoba ulang',
                ],
              },
            },
            {
              title: `Verifikasi pengiriman data duplikat atau konflik ditolak pada ${subject}`,
              type: 'Negative',
              preconditions: 'Data dengan kunci unik yang sama sudah ada di sistem.',
              steps: [
                `Kirim ${subject} dengan pengenal yang sudah terdaftar.`,
                'Periksa respons server dan pesan UI.',
              ],
              expectedResult:
                'Sistem mengembalikan HTTP 409 Conflict dan menampilkan pesan resolusi konflik yang jelas.',
              gherkin: {
                tags: ['@negative', '@conflict'],
                scenario: `Menolak data duplikat yang berkonflik pada ${subject}`,
                given: ['data dengan kunci unik yang sama sudah ada'],
                when: [`pengguna mengirimkan data duplikat untuk ${subject}`],
                then: ['sistem mengembalikan HTTP 409 dan menjelaskan konflik'],
              },
            },
          ],
          Boundary: [
            {
              title: `Verifikasi input spasi saja, karakter Unicode, dan emoji pada ${subject}`,
              type: 'Boundary',
              preconditions: 'Pengguna berada di formulir input.',
              steps: [
                'Masukkan string spasi saja ("   ") ke kolom wajib.',
                'Masukkan karakter Unicode multi-byte dan emoji (mis. "José 🚀 日本語").',
              ],
              expectedResult:
                'Input spasi saja dipangkas dan ditolak sebagai kosong; Unicode/emoji valid disimpan dan tampil tanpa rusak.',
              gherkin: {
                tags: ['@boundary', '@i18n'],
                scenario: `Menangani input spasi saja dan Unicode pada ${subject}`,
                given: [`pengguna berada di formulir ${subject}`],
                when: ['pengguna menguji string spasi saja dan Unicode multi-byte'],
                then: [
                  'input spasi saja ditolak',
                  'string Unicode terjaga tanpa kerusakan encoding',
                ],
              },
            },
            {
              title: `Verifikasi batas payload volume tinggi / jumlah item maksimum untuk ${subject}`,
              type: 'Boundary',
              preconditions: 'Sistem mendukung input massal atau banyak item.',
              steps: [
                'Berikan jumlah item/karakter maksimum yang didukung dalam satu operasi.',
                'Verifikasi performa rendering dan waktu respons.',
              ],
              expectedResult:
                'Sistem memproses payload batas maksimum sesuai SLA (< 3 detik) tanpa UI macet atau terpotong.',
              gherkin: {
                tags: ['@boundary', '@performance'],
                scenario: `Memproses ukuran payload maksimum untuk ${subject}`,
                given: [`sistem siap untuk ${subject}`],
                when: ['pengguna mengirimkan ukuran payload maksimum yang diizinkan'],
                then: ['operasi selesai sesuai SLA tanpa penurunan performa UI'],
              },
            },
          ],
          Security: [
            {
              title: `Verifikasi proteksi CSRF dan header keamanan HTTP pada endpoint ${subject}`,
              type: 'Security',
              preconditions: 'Aplikasi berjalan dengan token CSRF dan header keamanan.',
              steps: [
                'Periksa header permintaan pengubah status untuk token anti-CSRF atau kebijakan cookie SameSite.',
                'Coba kirim permintaan lintas-asal tanpa kredensial CSRF yang valid.',
              ],
              expectedResult:
                'Permintaan lintas-asal tanpa token CSRF yang valid ditolak dengan HTTP 403 Forbidden.',
              gherkin: {
                tags: ['@security', '@csrf'],
                scenario: `Menerapkan proteksi CSRF pada ${subject}`,
                given: ['proteksi CSRF aktif pada endpoint pengubah status'],
                when: ['permintaan lintas-asal dikirim tanpa token CSRF valid'],
                then: ['server menolak permintaan dengan HTTP 403 Forbidden'],
              },
            },
            {
              title: `Verifikasi data sensitif disamarkan di UI, log, dan respons jaringan untuk ${subject}`,
              type: 'Security',
              preconditions: 'Tab Network DevTools dan log aplikasi dapat diperiksa.',
              steps: [
                `Jalankan ${subject} yang melibatkan kolom sensitif (token, rahasia, PII).`,
                'Periksa payload jaringan, localStorage, dan output console.',
              ],
              expectedResult:
                'Kolom sensitif disamarkan di UI, tidak pernah dicatat ke console browser, dan hanya dikirim melalui TLS.',
              gherkin: {
                tags: ['@security', '@privacy'],
                scenario: `Mencegah paparan data sensitif selama ${subject}`,
                given: [`pengguna menjalankan ${subject} dengan kolom sensitif`],
                when: ['respons jaringan dan penyimpanan browser diperiksa'],
                then: ['tidak ada rahasia atau PII terbuka di log console atau penyimpanan klien'],
              },
            },
          ],
        }
      : {
          Positive: [
            {
              title: `Verify accessibility and keyboard-only navigation for ${subject}`,
              type: 'Positive',
              preconditions: 'User is navigating using keyboard only (Tab, Enter, Space).',
              steps: [
                `Tab through all interactive controls in ${subject}.`,
                'Trigger the primary action using Enter or Space.',
              ],
              expectedResult:
                'Focus order is logical, focus rings are visible, and the workflow completes cleanly via keyboard.',
              gherkin: {
                tags: ['@positive', '@a11y'],
                scenario: `Complete ${subject} using keyboard navigation`,
                given: [`the user is on the ${subject} view`],
                when: ['the user navigates and submits using only keyboard controls'],
                then: ['all controls are reachable and the workflow succeeds'],
              },
            },
            {
              title: `Verify concurrent/idempotent execution of ${subject}`,
              type: 'Positive',
              preconditions: 'User is on the submission screen.',
              steps: [
                'Double-click the primary submit button rapidly.',
                'Verify network requests and resulting records.',
              ],
              expectedResult:
                'Button enters loading/disabled state after first click, preventing duplicate submissions.',
              gherkin: {
                tags: ['@positive', '@idempotency'],
                scenario: `Prevent duplicate submission during ${subject}`,
                given: [`the user has filled valid data for ${subject}`],
                when: ['the user double-clicks the submit button rapidly'],
                then: ['only a single request is processed and no duplicate record is created'],
              },
            },
          ],
          Negative: [
            {
              title: `Verify graceful error recovery when network/API times out during ${subject}`,
              type: 'Negative',
              preconditions: 'Network throttling or offline simulation is enabled.',
              steps: [
                `Initiate ${subject} while simulating a 504 Gateway Timeout or offline state.`,
                'Observe the error banner and retry option.',
              ],
              expectedResult:
                'User sees a non-destructive retryable error message and entered form data is not lost.',
              gherkin: {
                tags: ['@negative', '@resilience'],
                scenario: `Handle network timeout gracefully during ${subject}`,
                given: ['the backend API is unreachable or timing out'],
                when: [`the user submits ${subject}`],
                then: [
                  'a friendly retry message is displayed',
                  'user-entered data remains preserved for retry',
                ],
              },
            },
            {
              title: `Verify duplicate or conflicting state submission is rejected for ${subject}`,
              type: 'Negative',
              preconditions: 'A conflicting record already exists in the system.',
              steps: [
                `Submit ${subject} with an identifier that already exists.`,
                'Inspect the server response and UI message.',
              ],
              expectedResult:
                'System returns HTTP 409 Conflict and displays a clear conflict resolution message.',
              gherkin: {
                tags: ['@negative', '@conflict'],
                scenario: `Reject conflicting duplicate data in ${subject}`,
                given: ['a record with the same unique key already exists'],
                when: [`the user submits duplicate data for ${subject}`],
                then: ['the system returns HTTP 409 and explains the conflict'],
              },
            },
          ],
          Boundary: [
            {
              title: `Verify Unicode, emoji, and whitespace-only boundary inputs in ${subject}`,
              type: 'Boundary',
              preconditions: 'User is on the input form.',
              steps: [
                'Enter whitespace-only strings ("   ") into required fields.',
                'Enter multi-byte Unicode characters and emojis (e.g., "José 🚀 日本語").',
              ],
              expectedResult:
                'Whitespace-only input is trimmed and rejected as empty; valid Unicode/emojis are stored and rendered without encoding corruption.',
              gherkin: {
                tags: ['@boundary', '@i18n'],
                scenario: `Handle whitespace-only and Unicode inputs in ${subject}`,
                given: [`the user is on the ${subject} form`],
                when: ['the user tests whitespace-only and multi-byte Unicode strings'],
                then: [
                  'whitespace-only inputs are rejected',
                  'Unicode strings are preserved without corruption',
                ],
              },
            },
            {
              title: `Verify high-volume payload / maximum list items boundary for ${subject}`,
              type: 'Boundary',
              preconditions: 'System supports bulk or multi-item input.',
              steps: [
                'Provide the maximum supported number of items/characters in a single operation.',
                'Verify rendering performance and response time.',
              ],
              expectedResult:
                'System processes the maximum boundary payload within SLA (< 3s) without UI freeze or truncation.',
              gherkin: {
                tags: ['@boundary', '@performance'],
                scenario: `Process maximum allowed payload size for ${subject}`,
                given: [`the system is ready for ${subject}`],
                when: ['the user submits the maximum allowed payload size'],
                then: ['the operation completes within SLA without UI degradation'],
              },
            },
          ],
          Security: [
            {
              title: `Verify CSRF protection and secure HTTP headers on ${subject} endpoints`,
              type: 'Security',
              preconditions: 'Application is deployed with CSRF tokens and security headers.',
              steps: [
                'Inspect state-changing request headers for anti-CSRF token or SameSite cookie policy.',
                'Attempt a cross-origin state-changing request without valid CSRF credentials.',
              ],
              expectedResult:
                'Cross-origin request without valid CSRF token is rejected with HTTP 403 Forbidden.',
              gherkin: {
                tags: ['@security', '@csrf'],
                scenario: `Enforce CSRF protection on ${subject}`,
                given: ['CSRF protection is enabled on state-changing endpoints'],
                when: ['a cross-origin request is sent without a valid CSRF token'],
                then: ['the server rejects the request with HTTP 403 Forbidden'],
              },
            },
            {
              title: `Verify sensitive data is masked in UI, logs, and network responses for ${subject}`,
              type: 'Security',
              preconditions: 'Browser DevTools Network tab and application logs are accessible.',
              steps: [
                `Execute ${subject} involving sensitive fields (tokens, secrets, PII).`,
                'Inspect network payloads, localStorage, and console output.',
              ],
              expectedResult:
                'Sensitive fields are masked in UI, never logged to browser console, and transmitted only over TLS.',
              gherkin: {
                tags: ['@security', '@privacy'],
                scenario: `Prevent sensitive data exposure during ${subject}`,
                given: [`the user executes ${subject} with sensitive fields`],
                when: ['network responses and browser storage are inspected'],
                then: ['no unmasked secrets or PII appear in console logs or client storage'],
              },
            },
          ],
        };

  return supplements[type].map((item, idx) => ({
    ...item,
    id: `TC-${String(existingCount + idx + 1).padStart(3, '0')}`,
  }));
}

export function generateMockTestCases(
  requirementInput: string,
  testingType: TestingType,
  language: Language = 'en'
): { featureTitle: string; testCases: TestCase[] } {
  const detection = detectDomain(requirementInput, language);

  let pool: TestCase[];
  switch (detection.domain) {
    case 'auth':
      pool = buildAuthCases(language);
      break;
    case 'ecommerce':
      pool = buildEcommerceCases(language);
      break;
    case 'search':
      pool = buildSearchCases(language);
      break;
    case 'upload':
      pool = buildUploadCases(language);
      break;
    case 'api':
      pool = buildApiCases(language);
      break;
    default:
      pool = buildGenericCases(detection.subject, language);
      break;
  }

  let filtered: TestCase[];
  if (testingType === 'All Types') {
    filtered = pool;
  } else {
    filtered = pool.filter((tc) => tc.type === testingType);
    if (filtered.length < 3) {
      const needed = generateSupplementForType(
        testingType,
        detection.subject,
        filtered.length,
        language
      );
      filtered = [...filtered, ...needed].slice(0, 4);
    }
  }

  // Re-number IDs sequentially (TC-001, TC-002, ...)
  const normalized = filtered.map((tc, index) => ({
    ...tc,
    id: `TC-${String(index + 1).padStart(3, '0')}`,
  }));

  return {
    featureTitle: detection.featureTitle,
    testCases: normalized,
  };
}
