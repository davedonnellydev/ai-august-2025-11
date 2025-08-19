import { render, screen, fireEvent, waitFor } from '@/test-utils';
import ReportPage from './page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockResults = {
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
    },
  ],
  timestamp: '2023-01-01T00:00:00.000Z',
  url: 'https://example.com',
  toolOptions: {},
  incomplete: [],
  inapplicable: [],
};

const mockPush = jest.fn();

describe('ReportPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('shows loading state initially', () => {
    render(<ReportPage />);
    // The loading state is very brief, so we need to check for it immediately
    expect(screen.getByText('Loading results...')).toBeInTheDocument();
  });

  it('shows error when no results are found', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('No Results Found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'No accessibility results were found. Please go back and import your results first.'
        )
      ).toBeInTheDocument();
    });
  });

  it('shows back to home button when no results', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });
  });

  it('navigates back to home when back button is clicked', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<ReportPage />);

    await waitFor(() => {
      const backButton = screen.getByText('Back to Home');
      fireEvent.click(backButton);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('renders report view when results are found', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResults));

    render(<ReportPage />);

    await waitFor(() => {
      // Check that the ReportView component is rendered with the correct data
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('Issues (1)')).toBeInTheDocument();
      expect(screen.getByText('AI Insights')).toBeInTheDocument();
    });
  });

  it('handles invalid JSON in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('No Results Found')).toBeInTheDocument();
    });
  });

  it('handles missing required fields in results', async () => {
    const invalidResults = {
      // Missing required fields like violations and passes
      timestamp: '2023-01-01T00:00:00.000Z',
      url: 'https://example.com',
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidResults));

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('No Results Found')).toBeInTheDocument();
    });
  });

  it('passes correct data to ReportView component', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockResults));

    render(<ReportPage />);

    await waitFor(() => {
      // Verify that the data is correctly passed to child components
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
      expect(screen.getByText('color-contrast')).toBeInTheDocument();
    });
  });

  it('handles empty violations array', async () => {
    const emptyViolationsResults = {
      ...mockResults,
      violations: [],
    };

    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(emptyViolationsResults)
    );

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('Issues (0)')).toBeInTheDocument();
    });
  });

  it('handles empty passes array', async () => {
    const emptyPassesResults = {
      ...mockResults,
      passes: [],
    };

    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(emptyPassesResults)
    );

    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('Issues (1)')).toBeInTheDocument();
    });
  });

  it('displays proper error message styling', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<ReportPage />);

    await waitFor(() => {
      const alert = screen
        .getByText('No Results Found')
        .closest('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });
  });
});
