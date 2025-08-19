import { render, screen } from '@/test-utils';

describe('Simple render test', () => {
  it('renders a simple div', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
