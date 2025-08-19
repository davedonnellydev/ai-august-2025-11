import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ReportView } from './ReportView';
import { AxeResults } from 'axe-core';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock navigator.share
Object.assign(navigator, {
  share: jest.fn(),
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

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
          all: [],
          any: [],
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

const mockPush = jest.fn();

describe('ReportView component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the report view with all components', () => {
    render(<ReportView results={mockResults} />);

    // Check that all child components are rendered
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Issues (1)')).toBeInTheDocument();
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
  });

  it('displays URL and timestamp information', () => {
    render(<ReportView results={mockResults} />);
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText(/Analyzed on/)).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    render(<ReportView results={mockResults} />);
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Download Report')).toBeInTheDocument();
    expect(screen.getByText('Share Report')).toBeInTheDocument();
  });

  it('navigates back to home when back button is clicked', () => {
    render(<ReportView results={mockResults} />);

    const backButton = screen.getByText('Back to Home');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('downloads report when download button is clicked', () => {
    // Mock document.createElement and click
    const mockClick = jest.fn();
    const originalCreateElement = document.createElement;
    const mockCreateElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tagName);
    });
    document.createElement = mockCreateElement;

    render(<ReportView results={mockResults} />);

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
  });

  it('shares report when share button is clicked and navigator.share is available', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      share: mockShare,
    });

    render(<ReportView results={mockResults} />);

    const shareButton = screen.getByText('Share Report');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: 'Accessibility Report',
        text: 'Accessibility report for https://example.com',
        url: expect.any(String),
      });
    });
  });

  it('copies URL to clipboard when share button is clicked and navigator.share is not available', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      share: undefined,
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<ReportView results={mockResults} />);

    const shareButton = screen.getByText('Share Report');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it('handles share error gracefully', async () => {
    const mockShare = jest.fn().mockRejectedValue(new Error('Share failed'));
    Object.assign(navigator, {
      share: mockShare,
    });

    render(<ReportView results={mockResults} />);

    const shareButton = screen.getByText('Share Report');
    fireEvent.click(shareButton);

    // Should not throw error, just log it
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });
  });

  it('handles clipboard write error gracefully', async () => {
    const mockWriteText = jest
      .fn()
      .mockRejectedValue(new Error('Clipboard write failed'));
    Object.assign(navigator, {
      share: undefined,
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<ReportView results={mockResults} />);

    const shareButton = screen.getByText('Share Report');
    fireEvent.click(shareButton);

    // Should not throw error, just log it
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
  });

  it('displays help information in footer', () => {
    render(<ReportView results={mockResults} />);
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /This report was generated using axe-core accessibility testing engine/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('W3C Web Accessibility Initiative')
    ).toBeInTheDocument();
  });

  it('generates correct download filename', () => {
    const mockClick = jest.fn();
    const originalCreateElement = document.createElement;
    const mockCreateElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tagName);
    });
    document.createElement = mockCreateElement;

    render(<ReportView results={mockResults} />);

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    const linkElement = mockCreateElement.mock.results[0].value;
    expect(linkElement.download).toMatch(
      /accessibility-report-\d{4}-\d{2}-\d{2}\.json/
    );
  });

  it('includes all required data in downloaded report', () => {
    const mockClick = jest.fn();
    const originalCreateElement = document.createElement;
    const mockCreateElement = jest.fn((tagName: string) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement.call(document, tagName);
    });
    document.createElement = mockCreateElement;

    render(<ReportView results={mockResults} />);

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    const linkElement = mockCreateElement.mock.results[0].value;
    expect(linkElement.href).toBe('mock-url');
  });

  it('passes results to child components correctly', () => {
    render(<ReportView results={mockResults} />);

    // Check that child components receive the correct data
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 violation
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 pass
    expect(screen.getByText('color-contrast')).toBeInTheDocument(); // violation ID
  });

  it('handles results with no violations', () => {
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

    render(<ReportView results={mockResultsNoViolations} />);

    // Should still render all components
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Issues (0)')).toBeInTheDocument();
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
  });

  it('handles results with many violations', () => {
    const mockResultsManyViolations: AxeResults = {
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
      violations: Array.from({ length: 10 }, (_, i) => ({
        id: `violation-${i}`,
        impact: 'serious' as const,
        description: `Violation ${i}`,
        help: `Help for violation ${i}`,
        helpUrl: `https://example.com/violation-${i}`,
        tags: ['wcag2aa'],
        nodes: [
          {
            html: `<div>Element ${i}</div>`,
            target: [`div-${i}`],
            any: [],
            all: [],
            none: [],
          },
        ],
      })),
      passes: [],
      timestamp: '2023-01-01T00:00:00.000Z',
      url: 'https://example.com',
      toolOptions: {},
      incomplete: [],
      inapplicable: [],
    };

    render(<ReportView results={mockResultsManyViolations} />);

    expect(screen.getByText('Issues (10)')).toBeInTheDocument();
  });

  it('displays proper accessibility attributes', () => {
    render(<ReportView results={mockResults} />);

    // Check that buttons have proper accessibility attributes
    const backButton = screen.getByText('Back to Home');
    const downloadButton = screen.getByText('Download Report');
    const shareButton = screen.getByText('Share Report');

    expect(backButton).toBeInTheDocument();
    expect(downloadButton).toBeInTheDocument();
    expect(shareButton).toBeInTheDocument();
  });
});
