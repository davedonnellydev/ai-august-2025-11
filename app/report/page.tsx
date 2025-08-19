'use client';

import { useEffect, useState } from 'react';
import { Container, Text, Alert, Button } from '@mantine/core';
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ReportView } from '../../components/Report/ReportView';

import { AxeResults } from 'axe-core';

export default function ReportPage() {
  const [results, setResults] = useState<AxeResults | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem('accessibilityResults');
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResults(parsed);
      } catch (err) {
        // Failed to parse stored results
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading results...</Text>
      </Container>
    );
  }

  if (!results) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconInfoCircle size="1rem" />}
          title="No Results Found"
          color="yellow"
          mb="lg"
        >
          No accessibility results were found. Please go back and import your
          results first.
        </Alert>
        <Button
          leftSection={<IconArrowLeft size="1rem" />}
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return <ReportView results={results} />;
}
