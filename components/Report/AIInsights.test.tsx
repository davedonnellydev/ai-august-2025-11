import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { AIInsights } from './AIInsights';
import { AxeResults } from 'axe-core';

// Mock fetch
global.fetch = jest.fn();

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
          any: [],
          all: [],
          none: [],
          html: '<button class="btn">Submit</button>',
          target: ['button.btn'],
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
          any: [],
          all: [],
          none: [],
          html: '<img src="logo.png">',
          target: ['img'],
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

const mockResultsNoViolations: AxeResults = {
  violations: [],
  passes: [
    {
      id: 'document-title',
      impact: 'moderate',
      description: 'Documents should have a title element',
      help: 'Ensures the document has a title element',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/document-title',
      tags: ['wcag2a', 'wcag242'],
      nodes: [
        {
          all: [],
          any: [],
          none: [],
          target: [`#flylighter-previous-capture-close`],
          html: '<button id="flylighter-previous-capture-close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"></path></svg></button>',
        },
      ],
    },
  ],
  timestamp: '2023-01-01T00:00:00.000Z',
  url: 'https://example.com',
  toolOptions: {},
  incomplete: [],
  inapplicable: [],
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
};

const mockAIResponse = {
  topFixes: [
    { rank: 1, description: 'Add alt text to all images' },
    { rank: 2, description: 'Improve color contrast ratios' },
    { rank: 3, description: 'Add proper button labels' },
  ],
  nextSteps: [
    { description: 'Implement automated accessibility testing' },
    { description: 'Train development team on accessibility standards' },
    { description: 'Create accessibility guidelines document' },
  ],
  priorityActions: {
    high: 'Fix critical image alt text issues',
    medium: 'Improve color contrast',
    low: 'Add button labels',
  },
  estimatedEffort: 'Medium',
};

describe('AIInsights component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component title', () => {
    render(<AIInsights results={mockResults} />);
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
  });

  it('displays AI analysis information', () => {
    render(<AIInsights results={mockResults} />);
    expect(screen.getByText('AI-Powered Analysis')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Get intelligent suggestions for fixing accessibility issues/
      )
    ).toBeInTheDocument();
  });

  it('shows analyze with AI button', () => {
    render(<AIInsights results={mockResults} />);
    expect(screen.getByText('Analyze with AI')).toBeInTheDocument();
  });

  it('shows success message when no violations', () => {
    render(<AIInsights results={mockResultsNoViolations} />);
    expect(screen.getByText('🎉 No issues to analyze!')).toBeInTheDocument();
    expect(
      screen.getByText('Your page is already accessible.')
    ).toBeInTheDocument();
  });

  it('calls AI API when analyze button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      });
    });
  });

  it('shows loading state during analysis', async () => {
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ response: mockAIResponse }),
              }),
            100
          )
        )
    );

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    // Should show loading state - the button text changes to "Re-analyze" after analysis
    await waitFor(() => {
      expect(screen.getByText('Re-analyze')).toBeInTheDocument();
    });
  });

  it('displays AI analysis results after successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Top 5 Quick Fixes')).toBeInTheDocument();
      expect(screen.getByText('Suggested Next Steps')).toBeInTheDocument();
      expect(screen.getByText('Priority Order')).toBeInTheDocument();
      expect(screen.getByText('Estimated Effort')).toBeInTheDocument();
    });
  });

  it('displays top fixes from AI response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Add alt text to all images')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Improve color contrast ratios')
      ).toBeInTheDocument();
      expect(screen.getByText('Add proper button labels')).toBeInTheDocument();
    });
  });

  it('displays next steps from AI response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Implement automated accessibility testing')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Train development team on accessibility standards')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Create accessibility guidelines document')
      ).toBeInTheDocument();
    });
  });

  it('displays priority actions from AI response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Fix critical image alt text issues')
      ).toBeInTheDocument();
      expect(screen.getByText('Improve color contrast')).toBeInTheDocument();
      expect(screen.getByText('Add button labels')).toBeInTheDocument();
    });
  });

  it('displays estimated effort from AI response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('handles non-ok API response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
      expect(
        screen.getByText('API request failed: Bad Request')
      ).toBeInTheDocument();
    });
  });

  it('changes button text after analysis', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Re-analyze')).toBeInTheDocument();
    });
  });

  it('sends correct data to API', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('color-contrast'),
      });
    });
  });

  it('handles empty violations array', () => {
    const emptyViolationsResults: AxeResults = {
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

    render(<AIInsights results={emptyViolationsResults} />);
    expect(screen.getByText('🎉 No issues to analyze!')).toBeInTheDocument();
  });

  it('shows placeholder content before analysis', () => {
    render(<AIInsights results={mockResults} />);
    expect(
      screen.getByText(/Click "Analyze with AI" to get intelligent suggestions/)
    ).toBeInTheDocument();
  });

  it('expands analysis results after successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: mockAIResponse }),
    });

    render(<AIInsights results={mockResults} />);

    const analyzeButton = screen.getByText('Analyze with AI');
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      // Results should be expanded and visible
      expect(screen.getByText('Top 5 Quick Fixes')).toBeInTheDocument();
      expect(
        screen.queryByText(
          /Click "Analyze with AI" to get intelligent suggestions/
        )
      ).not.toBeInTheDocument();
    });
  });
});
