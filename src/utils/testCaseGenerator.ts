import type { SpecificTestType, TestCase, TestingType } from '../types/testCase';

interface DomainDetection {
  domain: 'auth' | 'ecommerce' | 'search' | 'upload' | 'api' | 'generic';
  featureTitle: string;
  subject: string;
}

function detectDomain(rawInput: string): DomainDetection {
  const text = rawInput.toLowerCase();

  if (
    /\b(login|log in|sign in|signin|auth|authentication|password|mfa|2fa|otp|sso|oauth|forgot password|reset password|session)\b/.test(
      text
    )
  ) {
    return {
      domain: 'auth',
      featureTitle: 'User Authentication & Access Control',
      subject: 'user authentication',
    };
  }

  if (
    /\b(cart|checkout|payment|stripe|paypal|credit card|order|promo|coupon|discount|shipping|billing|refund|ecommerce)\b/.test(
      text
    )
  ) {
    return {
      domain: 'ecommerce',
      featureTitle: 'E-Commerce Checkout & Order Processing',
      subject: 'checkout & payment flow',
    };
  }

  if (
    /\b(search|filter|sort|pagination|autocomplete|facet|query|results|catalog)\b/.test(
      text
    )
  ) {
    return {
      domain: 'search',
      featureTitle: 'Search, Filtering & Results Pagination',
      subject: 'search and filtering',
    };
  }

  if (
    /\b(upload|file|attachment|import|avatar|image|pdf|csv|drag and drop|document)\b/.test(
      text
    )
  ) {
    return {
      domain: 'upload',
      featureTitle: 'File Upload & Document Validation',
      subject: 'file upload',
    };
  }

  if (
    /\b(api|endpoint|webhook|rest|graphql|payload|rate limit|bearer|jwt|status code)\b/.test(
      text
    )
  ) {
    return {
      domain: 'api',
      featureTitle: 'API Endpoint & Payload Validation',
      subject: 'API integration',
    };
  }

  const cleaned = rawInput
    .replace(/^(as a|given|when|then|user story:|requirement:|ac:)/i, '')
    .trim()
    .split(/[.!?\n]/)[0]
    .trim();

  const shortSubject =
    cleaned.length > 5 && cleaned.length <= 60
      ? cleaned
      : cleaned.length > 60
        ? `${cleaned.slice(0, 57).trim()}...`
        : 'target feature workflow';

  return {
    domain: 'generic',
    featureTitle: 'Feature Functional & Non-Functional Verification',
    subject: shortSubject,
  };
}

function buildAuthCases(): TestCase[] {
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

function buildEcommerceCases(): TestCase[] {
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

function buildSearchCases(): TestCase[] {
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

function buildUploadCases(): TestCase[] {
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

function buildApiCases(): TestCase[] {
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

function buildGenericCases(subject: string): TestCase[] {
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
  existingCount: number
): TestCase[] {
  const supplements: Record<SpecificTestType, Omit<TestCase, 'id'>[]> = {
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
  testingType: TestingType
): { featureTitle: string; testCases: TestCase[] } {
  const detection = detectDomain(requirementInput);

  let pool: TestCase[];
  switch (detection.domain) {
    case 'auth':
      pool = buildAuthCases();
      break;
    case 'ecommerce':
      pool = buildEcommerceCases();
      break;
    case 'search':
      pool = buildSearchCases();
      break;
    case 'upload':
      pool = buildUploadCases();
      break;
    case 'api':
      pool = buildApiCases();
      break;
    default:
      pool = buildGenericCases(detection.subject);
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
        filtered.length
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
