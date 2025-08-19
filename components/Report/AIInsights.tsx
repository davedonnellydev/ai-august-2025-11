'use client';

import { useEffect, useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  Badge,
  Collapse,
  LoadingOverlay,
  Divider,
} from '@mantine/core';
import {
  IconBrain,
  IconBulb,
  IconArrowRight,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';

import { AxeResults } from 'axe-core';
import { AIAnalysis } from '../../types/accessibility';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';

interface AIInsightsProps {
  results: AxeResults;
}

export function AIInsights({ results }: AIInsightsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(0);

  const { violations } = results;

  // Update remaining requests on component mount and after translations
  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  const analyzeWithAI = async () => {
    if (violations.length === 0) {
      setError('No violations to analyze');
      return;
    }

    // Check rate limit before proceeding
    if (ClientRateLimiter.getRemainingRequests() <= 0) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Prepare the data for AI analysis
      const analysisData = {
        violations: violations.map((v) => ({
          id: v.id,
          impact: v.impact || 'unknown',
          description: v.description,
          help: v.help,
          tags: v.tags,
          nodeCount: v.nodes.length,
          nodes: v.nodes,
        })),
        totalViolations: violations.length,
        url: results.url,
      };

      // Call the OpenAI API endpoint
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAiAnalysis(data.response);
      console.log(data);
      setIsExpanded(true);
      // Update remaining requests after successful translation
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze with AI'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  //   const getPriorityColor = (priority: string) => {
  //     switch (priority.toLowerCase()) {
  //       case 'high':
  //         return 'red';
  //       case 'medium':
  //         return 'orange';
  //       case 'low':
  //         return 'blue';
  //       default:
  //         return 'gray';
  //     }
  //   };

  if (violations.length === 0) {
    return (
      <Paper p="xl" withBorder>
        <Stack gap="md" align="center">
          <Title order={3}>
            <IconBrain
              size="1.5rem"
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            AI Insights
          </Title>
          <Text c="green" size="lg">
            🎉 No issues to analyze!
          </Text>
          <Text c="dimmed">Your page is already accessible.</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="xl" withBorder pos="relative">
      <LoadingOverlay visible={isAnalyzing} />

      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={3}>
            <IconBrain
              size="1.5rem"
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            AI Insights
          </Title>
          <Button
            variant="light"
            color="blue"
            leftSection={<IconBulb size="1rem" />}
            onClick={analyzeWithAI}
            disabled={isAnalyzing}
            loading={isAnalyzing}
          >
            {aiAnalysis ? 'Re-analyze' : 'Analyze with AI'}
          </Button>
        </Group>

        <Alert
          icon={<IconInfoCircle size="1rem" />}
          title="AI-Powered Analysis"
          color="blue"
        >
          Get intelligent suggestions for fixing accessibility issues,
          prioritized by impact and effort.
        </Alert>

        {error && (
          <Alert color="red" title="Analysis Failed">
            {error}
          </Alert>
        )}

        {aiAnalysis && (
          <Collapse in={isExpanded}>
            <Stack gap="lg">
              {/* Top 5 Fixes */}
              <div>
                <Title order={4} mb="md">
                  <IconCheck
                    size="1rem"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  />
                  Top 5 Quick Fixes
                </Title>
                <Stack gap="sm">
                  {aiAnalysis.topFixes.map((fix, index) => (
                    <Paper key={index} p="md" withBorder bg="green.0">
                      <Group gap="sm">
                        <Badge color="green" variant="light">
                          {fix.rank}
                        </Badge>
                        <Text size="sm" style={{ flex: 1 }}>
                          {fix.description}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </div>

              <Divider />

              {/* Next Steps */}
              <div>
                <Title order={4} mb="md">
                  <IconArrowRight
                    size="1rem"
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                  />
                  Suggested Next Steps
                </Title>
                <Stack gap="sm">
                  {aiAnalysis.nextSteps.map((step, index) => (
                    <Paper key={index} p="md" withBorder>
                      <Group gap="sm">
                        <Badge color="blue" variant="light">
                          Step {index + 1}
                        </Badge>
                        <Text size="sm" style={{ flex: 1 }}>
                          {step.description}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </div>

              <Divider />

              {/* Priority and Effort */}
              <Group gap="xl">
                <div>
                  <Title order={5} mb="sm">
                    Priority Order
                  </Title>
                  <Stack gap="xs">
                    <Paper p="md" withBorder>
                      <Group gap="sm">
                        <Badge color="red" variant="light" size="sm">
                          HIGH{' '}
                        </Badge>
                        <Text size="sm">{aiAnalysis.priorityActions.high}</Text>
                      </Group>
                    </Paper>
                    <Paper p="md" withBorder>
                      <Group gap="sm">
                        <Badge color="orange" variant="light" size="sm">
                          MEDIUM
                        </Badge>
                        <Text size="sm">
                          {aiAnalysis.priorityActions.medium}
                        </Text>
                      </Group>
                    </Paper>
                    <Paper p="md" withBorder>
                      <Group gap="sm">
                        <Badge color="blue" variant="light" size="sm">
                          LOW
                        </Badge>
                        <Text size="sm">{aiAnalysis.priorityActions.low}</Text>
                      </Group>
                    </Paper>
                  </Stack>
                </div>

                <div>
                  <Title order={5} mb="sm">
                    Estimated Effort
                  </Title>
                  <Badge
                    color={
                      aiAnalysis.estimatedEffort.includes('Low')
                        ? 'green'
                        : aiAnalysis.estimatedEffort.includes('Medium')
                          ? 'yellow'
                          : 'red'
                    }
                    variant="light"
                    size="lg"
                  >
                    {aiAnalysis.estimatedEffort}
                  </Badge>
                </div>
              </Group>
            </Stack>
            <Text p="md" m="md" size="xs" ta="center">
              You have {remainingRequests} remaining AI analyses.
            </Text>
          </Collapse>
        )}

        {!aiAnalysis && violations.length > 0 && (
          <Stack gap="md" align="center" py="xl">
            <IconBrain size={48} color="var(--mantine-color-gray-4)" />
            <Text c="dimmed" ta="center">
              Click "Analyze with AI" to get intelligent suggestions for fixing
              your accessibility issues. You have {remainingRequests} remaining
              AI analyses.
            </Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
