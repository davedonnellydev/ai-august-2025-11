'use client';

import { Stack, Container, Group, Button, Text, Alert } from '@mantine/core';
import { IconDownload, IconShare, IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { ReportSummary } from './ReportSummary';
import { IssuesTable } from './IssuesTable';
import { AIInsights } from './AIInsights';

import { AxeResults } from '../../types/accessibility';

interface ReportViewProps {
  results: AxeResults;
}

export function ReportView({ results }: ReportViewProps) {
  const router = useRouter();

  const downloadReport = () => {
    const reportData = {
      summary: {
        url: results.url,
        timestamp: results.timestamp,
        totalViolations: results.violations.length,
        totalPasses: results.passes.length,
        violationsByImpact: results.violations.reduce(
          (acc, violation) => {
            const impact = violation.impact || 'unknown';
            acc[impact] = (acc[impact] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      violations: results.violations,
      passes: results.passes,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Accessibility Report',
          text: `Accessibility report for ${results.url}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Report URL copied to clipboard!');
      } catch (err) {
        alert('Failed to copy URL. Please copy manually from the address bar.');
      }
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header Actions */}
        <Group justify="space-between" align="center">
          <Button
            variant="light"
            leftSection={<IconArrowLeft size="1rem" />}
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>

          <Group>
            <Button
              variant="light"
              leftSection={<IconDownload size="1rem" />}
              onClick={downloadReport}
            >
              Download Report
            </Button>
            <Button
              variant="light"
              leftSection={<IconShare size="1rem" />}
              onClick={shareReport}
            >
              Share Report
            </Button>
          </Group>
        </Group>

        {/* Page Info */}
        <div>
          <Text size="lg" fw={500} mb="xs">
            URL: {results.url}
          </Text>
          <Text size="sm" c="dimmed">
            Analyzed on {new Date(results.timestamp).toLocaleString()}
          </Text>
        </div>

        {/* Summary Section */}
        <ReportSummary results={results} />

        {/* Issues Table */}
        <IssuesTable results={results} />

        {/* AI Insights */}
        <AIInsights results={results} />

        {/* Footer */}
        <Alert color="blue" title="Need Help?">
          <Text size="sm" mb="sm">
            This report was generated using axe-core accessibility testing
            engine. For more information about accessibility standards, visit{' '}
            <a
              href="https://www.w3.org/WAI/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C Web Accessibility Initiative
            </a>
            .
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
}
