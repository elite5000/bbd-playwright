export type PlaywrightJsonReport = {
  config: any;
  suites: Suite[];
  errors: any[];
  stats: PlaywrightStats;
};

export type Suite = {
  title: string;
  file: string;
  column: number;
  line: number;
  specs: Spec[];
};

export type Spec = {
  title: string;
  ok: boolean;
  tags: string[];
  tests: PlaywrightTest[];
  id: string;
  file: string;
  line: number;
  column: number;
};

export type PlaywrightTest = {
  title?: string;
  timeout: number;
  annotations: any[];
  expectedStatus: string;
  projectId: string;
  projectName: string;
  results: PlaywrightTestResult[];
  status: string;
  id: string;
  file: string;
  line: number;
  column: number;
};

export type PlaywrightTestResult = {
  steps?: Array<{
    title: string;
    error?: any;
    // Add other fields as needed
  }>;

  workerIndex: number;
  parallelIndex: number;
  status: string;
  duration: number;
  error?: any;
  errors: any[];
  stdout: any[];
  stderr: any[];
  retry: number;
  startTime: string;
  annotations: any[];
  attachments: any[];
  errorLocation?: {
    file: string;
    column: number;
    line: number;
  };
};

export type PlaywrightStats = {
  startTime: string;
  duration: number;
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
};


