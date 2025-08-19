import { render, screen } from '@/test-utils';
import { CreateBookmarklet } from './CreateBookmarklet';

describe('CreateBookmarklet component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the accessibility checker title', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText(/Website/)).toBeInTheDocument();
    expect(screen.getByText('Accessibility Checker')).toBeInTheDocument();
  });

  it('renders the bookmarklet button', () => {
    render(<CreateBookmarklet />);
    expect(
      screen.getByText(/Accessibility Checker Bookmarklet/)
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

  it('shows the bookmarklet code when generated', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText(/Bookmarklet Code/)).toBeInTheDocument();
  });

  it('has a copy code button', () => {
    render(<CreateBookmarklet />);
    expect(screen.getByText('Copy Code')).toBeInTheDocument();
  });

  it('displays usage instructions', () => {
    render(<CreateBookmarklet />);
    expect(
      screen.getByText(/After adding the bookmarklet to your bookmarks bar/)
    ).toBeInTheDocument();
  });
});
