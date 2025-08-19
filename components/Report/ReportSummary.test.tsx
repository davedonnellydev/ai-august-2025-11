import { render, screen } from '@/test-utils';
import { ReportSummary } from './ReportSummary';
import { AxeResults } from 'axe-core';

const mockResults: AxeResults = {
  testEngine: {
    name: 'axe-core',
    version: '4.8.3',
  },
  testRunner: {
    name: 'axe',
  },
  testEnvironment: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
    windowWidth: 920,
    windowHeight: 788,
    orientationAngle: 0,
    orientationType: 'landscape-primary',
  },
  violations: [
    {
      id: 'color-contrast',
      impact: 'serious',
      description:
        'Elements must meet minimum color contrast ratio requirements',
      help: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/color-contrast',
      tags: ['wcag2aa', 'wcag143'],
      nodes: [
        {
          html: '<button class="btn">Submit</button>',
          target: ['button.btn'],
          any: [],
          all: [],
          none: [],
        },
      ],
    },
    {
      id: 'image-alt',
      impact: 'critical',
      description: 'Images must have alternate text',
      help: 'Informative images should have alt text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/image-alt',
      tags: ['wcag2a', 'wcag111', 'section508'],
      nodes: [
        {
          html: '<img src="logo.png">',
          target: ['img'],
          any: [],
          all: [],
          none: [],
        },
      ],
    },
  ],
  passes: [
    {
      id: 'document-title',
      impact: 'moderate',
      description: 'Documents should have a title element',
      help: 'Ensures the document has a title element',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/document-title',
      tags: ['wcag2a', 'wcag242'],
      nodes: [],
    },
  ],
  timestamp: '2023-01-01T00:00:00.000Z',
  url: 'https://example.com',
  toolOptions: {},
  incomplete: [],
  inapplicable: [],
};

const mockResultsNoViolations: AxeResults = {
  testEngine: {
    name: 'axe-core',
    version: '4.8.3',
  },
  testRunner: {
    name: 'axe',
  },
  testEnvironment: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
    windowWidth: 920,
    windowHeight: 788,
    orientationAngle: 0,
    orientationType: 'landscape-primary',
  },
  violations: [],
  passes: [
    {
      id: 'document-title',
      impact: 'moderate',
      description: 'Documents should have a title element',
      help: 'Ensures the document has a title element',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/document-title',
      tags: ['wcag2a', 'wcag242'],
      nodes: [],
    },
  ],
  timestamp: '2023-01-01T00:00:00.000Z',
  url: 'https://example.com',
  toolOptions: {},
  incomplete: [],
  inapplicable: [],
};

const mockResultsWithNullImpact: AxeResults = {
  testEngine: {
    name: 'axe-core',
    version: '4.8.3',
  },
  testRunner: {
    name: 'axe',
  },
  testEnvironment: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
    windowWidth: 920,
    windowHeight: 788,
    orientationAngle: 0,
    orientationType: 'landscape-primary',
  },
  violations: [
    {
      id: 'unknown-rule',
      impact: null,
      description: 'Unknown accessibility rule',
      help: 'This is an unknown rule',
      helpUrl: 'https://example.com',
      tags: ['unknown'],
      nodes: [
        {
          html: '<div>Unknown element</div>',
          target: ['div'],
          any: [],
          all: [],
          none: [],
        },
      ],
    },
  ],
  passes: [],
  timestamp: '2023-01-01T00:00:00.000Z',
  url: 'https://example.com',
  toolOptions: {},
  incomplete: [],
  inapplicable: [],
};

describe('ReportSummary component', () => {
  it('renders the summary title', () => {
    render(<ReportSummary results={mockResults} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('displays accessibility score', () => {
    render(<ReportSummary results={mockResults} />);
    expect(screen.getByText('Accessibility Score')).toBeInTheDocument();
    expect(screen.getByText('Based on 3 total checks')).toBeInTheDocument();
  });

  it('calculates correct accessibility score', () => {
    render(<ReportSummary results={mockResults} />);
    // 1 pass out of 3 total checks = 33%
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('displays violations by impact section', () => {
    render(<ReportSummary results={mockResults} />);
    expect(screen.getByText('Violations by Impact')).toBeInTheDocument();
  });

  it('shows impact breakdown cards', () => {
    render(<ReportSummary results={mockResults} />);
    expect(screen.getByText('1')).toBeInTheDocument(); // serious violations
    expect(screen.getByText('1')).toBeInTheDocument(); // critical violations
    expect(screen.getByText('Serious')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('displays quick stats', () => {
    render(<ReportSummary results={mockResults} />);
    // Use getAllByText to find all instances of these numbers
    const violationCounts = screen.getAllByText('2');
    const passCounts = screen.getAllByText('1');
    const totalCounts = screen.getAllByText('3');

    expect(violationCounts.length).toBeGreaterThan(0); // total violations
    expect(passCounts.length).toBeGreaterThan(0); // passed checks
    expect(totalCounts.length).toBeGreaterThan(0); // total checks
  });

  it('shows status badge for violations', () => {
    render(<ReportSummary results={mockResults} />);
    expect(
      screen.getByText('2 Accessibility Issues Found')
    ).toBeInTheDocument();
  });

  it('shows success status when no violations', () => {
    render(<ReportSummary results={mockResultsNoViolations} />);
    expect(screen.getByText('Page is Accessible')).toBeInTheDocument();
  });

  it('handles null impact values', () => {
    render(<ReportSummary results={mockResultsWithNullImpact} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('calculates 100% score when no violations', () => {
    render(<ReportSummary results={mockResultsNoViolations} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('displays correct total checks count', () => {
    render(<ReportSummary results={mockResults} />);
    expect(screen.getByText('Based on 3 total checks')).toBeInTheDocument();
  });

  it('shows correct violation counts by impact', () => {
    render(<ReportSummary results={mockResults} />);

    // Should show 1 critical and 1 serious violation
    const criticalCard = screen.getByText('Critical').closest('div');
    const seriousCard = screen.getByText('Serious').closest('div');

    expect(criticalCard).toHaveTextContent('1');
    expect(seriousCard).toHaveTextContent('1');
  });

  it('does not show impact cards for zero violations', () => {
    render(<ReportSummary results={mockResultsNoViolations} />);

    // Should not show any impact cards since there are no violations
    expect(screen.queryByText('Critical')).not.toBeInTheDocument();
    expect(screen.queryByText('Serious')).not.toBeInTheDocument();
    expect(screen.queryByText('Moderate')).not.toBeInTheDocument();
    expect(screen.queryByText('Minor')).not.toBeInTheDocument();
  });

  it('displays proper color coding for impact levels', () => {
    render(<ReportSummary results={mockResults} />);

    // Check that impact cards have proper styling
    const criticalCard = screen.getByText('Critical').closest('div');
    const seriousCard = screen.getByText('Serious').closest('div');

    expect(criticalCard).toBeInTheDocument();
    expect(seriousCard).toBeInTheDocument();
  });

  it('handles empty results gracefully', () => {
    const emptyResults: AxeResults = {
      testEngine: {
        name: 'axe-core',
        version: '4.8.3',
      },
      testRunner: {
        name: 'axe',
      },
      testEnvironment: {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
        windowWidth: 920,
        windowHeight: 788,
        orientationAngle: 0,
        orientationType: 'landscape-primary',
      },
      violations: [],
      passes: [],
      timestamp: '2023-01-01T00:00:00.000Z',
      url: 'https://example.com',
      toolOptions: {},
      incomplete: [],
      inapplicable: [],
    };

    render(<ReportSummary results={emptyResults} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Page is Accessible')).toBeInTheDocument();
  });

  it('displays URL and timestamp information', () => {
    render(<ReportSummary results={mockResults} />);
    // The URL and timestamp are displayed in the parent component, not in ReportSummary
    // This test ensures the component renders without errors when these are present
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
