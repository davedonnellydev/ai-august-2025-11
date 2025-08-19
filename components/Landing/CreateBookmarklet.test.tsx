import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { CreateBookmarklet } from './CreateBookmarklet';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('CreateBookmarklet component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component title and description', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText('Create Bookmarklet')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Generate a bookmarklet to check accessibility on any webpage'
      )
    ).toBeInTheDocument();
  });

  it('renders the bookmarklet button', () => {
    render(<CreateBookmarklet />);
    expect(
      screen.getByText('Accessibility Checker Bookmarklet')
    ).toBeInTheDocument();
  });

  it('displays instructions for right-clicking', () => {
    render(<CreateBookmarklet />);
    expect(
      screen.getByText(
        /Right-click the button above and select "Bookmark Link..."/
      )
    ).toBeInTheDocument();
  });

  it('shows the bookmarklet code section', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText(/Bookmarklet Code/)).toBeInTheDocument();
  });

  it('has copy code and show/hide code buttons', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText('Copy Code')).toBeInTheDocument();
    expect(screen.getByText('Show Code')).toBeInTheDocument();
  });

  it('displays usage instructions', () => {
    render(<CreateBookmarklet />);
    expect(
      screen.getByText(/After adding the bookmarklet to your bookmarks bar/)
    ).toBeInTheDocument();
  });

  it('shows alert with usage information', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText('How to use this tool')).toBeInTheDocument();
    expect(
      screen.getByText(
        /This tool creates a bookmarklet that you can add to your browser's bookmarks bar/
      )
    ).toBeInTheDocument();
  });

  it('toggles code visibility when show/hide button is clicked', async () => {
    render(<CreateBookmarklet />);

    const toggleButton = screen.getByText('Show Code');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Hide Code')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Hide Code'));

    await waitFor(() => {
      expect(screen.getByText('Show Code')).toBeInTheDocument();
    });
  });

  it('copies bookmarklet code to clipboard when copy button is clicked', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CreateBookmarklet />);

    const copyButton = screen.getByText('Copy Code');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
  });

  it('generates bookmarklet code on mount', () => {
    render(<CreateBookmarklet />);

    // The code should be generated and available in the component
    const codeSection = screen.getByText(/Bookmarklet Code/);
    expect(codeSection).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CreateBookmarklet />);

    const bookmarkletButton = screen.getByText(
      'Accessibility Checker Bookmarklet'
    );
    expect(bookmarkletButton).toHaveAttribute('role', 'button');
    expect(bookmarkletButton).toHaveAttribute('tabIndex', '0');
  });
});
