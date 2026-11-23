export type Language = 'en' | 'id';

export type TestingType = 'All Types' | 'Positive' | 'Negative' | 'Boundary' | 'Security';

export type SpecificTestType = Exclude<TestingType, 'All Types'>;

export type OutputFormat = 'Standard Table' | 'BDD Gherkin Syntax';

export interface TestCase {
  id: string;
  title: string;
  type: SpecificTestType;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  gherkin: {
    tags: string[];
    scenario: string;
    given: string[];
    when: string[];
    then: string[];
  };
}

export interface GenerationSession {
  id: string;
  requirement: string;
  testingType: TestingType;
  outputFormat: OutputFormat;
  language?: Language;
  testCases: TestCase[];
  featureTitle: string;
  createdAt: string;
}
