import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { TrendingUp } from 'lucide-react';

describe('MetricCard', () => {
  it('should render title and value', () => {
    const { getByText } = render(<MetricCard title="Total Leads" value={42} icon={TrendingUp} />);
    
    expect(getByText('Total Leads')).toBeInTheDocument();
    expect(getByText('42')).toBeInTheDocument();
  });

  it('should render trend when provided', () => {
    const { getByText } = render(
      <MetricCard 
        title="Sales" 
        value={100} 
        icon={TrendingUp} 
        trend={{ value: '+15%', positive: true }} 
      />
    );
    
    expect(getByText('+15%')).toBeInTheDocument();
  });

  it('should render negative trend', () => {
    const { getByText } = render(
      <MetricCard 
        title="Revenue" 
        value={1000} 
        icon={TrendingUp} 
        trend={{ value: '-5%', positive: false }}
      />
    );
    
    expect(getByText('-5%')).toBeInTheDocument();
  });
});
