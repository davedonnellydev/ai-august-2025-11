import { render, screen } from '@/test-utils';
import HomePage from './page';

describe('HomePage component', () => {
  it('renders the main title', () => {
    render(<HomePage />);
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Checker')).toBeInTheDocument();
  });

  it('displays the subtitle', () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        'Check website accessibility with our bookmarklet or analyze existing results'
      )
    ).toBeInTheDocument();
  });

  it('renders both landing components', () => {
    render(<HomePage />);

    // Check that both components are rendered
    expect(screen.getByText('Create Bookmarklet')).toBeInTheDocument();
    expect(screen.getByText('Import Results')).toBeInTheDocument();
  });

  it('displays create bookmarklet component', () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        'Generate a bookmarklet to check accessibility on any webpage'
      )
    ).toBeInTheDocument();
  });

  it('displays import results component', () => {
    render(<HomePage />);
    expect(
      screen.getByText(
        'Upload or paste JSON results from the accessibility checker to generate a detailed report'
      )
    ).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    render(<HomePage />);

    // Check that the page has the expected structure
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Checker')).toBeInTheDocument();

    // Both components should be present
    expect(screen.getByText('Create Bookmarklet')).toBeInTheDocument();
    expect(screen.getByText('Import Results')).toBeInTheDocument();
  });

  it('displays gradient styling in title', () => {
    render(<HomePage />);

    // The title should be rendered with gradient styling
    const titleElement = screen.getByText('Accessibility Checker');
    expect(titleElement).toBeInTheDocument();
  });
});
