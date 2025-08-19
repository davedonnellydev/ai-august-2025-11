'use client';

import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  RingProgress,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconInfo,
  IconX,
} from '@tabler/icons-react';

import { AxeResults } from '../../types/accessibility';

interface ReportSummaryProps {
  results: AxeResults;
}

export function ReportSummary({ results }: ReportSummaryProps) {
  const { violations, passes } = results;

  // Group violations by impact
  const violationsByImpact = violations.reduce(
    (acc, violation) => {
      const impact = violation.impact || 'unknown';
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate totals
  const totalViolations = violations.length;
  const totalPasses = passes.length;
  const totalChecks = totalViolations + totalPasses;
  const accessibilityScore =
    totalChecks > 0 ? Math.round((totalPasses / totalChecks) * 100) : 100;

  // Impact colors and icons
  const impactConfig = {
    critical: { color: 'red', icon: IconX, label: 'Critical' },
    serious: { color: 'orange', icon: IconAlertTriangle, label: 'Serious' },
    moderate: { color: 'yellow', icon: IconAlertTriangle, label: 'Moderate' },
    minor: { color: 'blue', icon: IconInfo, label: 'Minor' },
    unknown: { color: 'gray', icon: IconInfo, label: 'Unknown' },
  };

  return (
    <Paper p="xl" withBorder>
      <Stack gap="lg">
        <Title order={3}>Summary</Title>

        {/* Overall Score */}
        <Group justify="space-between" align="center">
          <div>
            <Text size="lg" fw={500}>
              Accessibility Score
            </Text>
            <Text size="sm" c="dimmed">
              Based on {totalChecks} total checks
            </Text>
          </div>
          <RingProgress
            size={80}
            thickness={8}
            sections={[
              {
                value: accessibilityScore,
                color:
                  accessibilityScore >= 80
                    ? 'green'
                    : accessibilityScore >= 60
                      ? 'yellow'
                      : 'red',
              },
            ]}
            label={
              <Text ta="center" size="lg" fw={700}>
                {accessibilityScore}%
              </Text>
            }
          />
        </Group>

        {/* Impact Breakdown */}
        <div>
          <Text size="lg" fw={500} mb="md">
            Violations by Impact
          </Text>
          <Group gap="md">
            {Object.entries(impactConfig).map(([impact, config]) => {
              const count = violationsByImpact[impact] || 0;
              if (count === 0) return null;

              const IconComponent = config.icon;
              return (
                <Paper key={impact} p="md" withBorder style={{ minWidth: 120 }}>
                  <Stack gap="xs" align="center">
                    <IconComponent
                      size={24}
                      color={`var(--mantine-color-${config.color}-6)`}
                    />
                    <Text size="xl" fw={700} c={config.color}>
                      {count}
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                      {config.label}
                    </Text>
                  </Stack>
                </Paper>
              );
            })}
          </Group>
        </div>

        {/* Quick Stats */}
        <Group gap="xl">
          <div>
            <Text size="lg" fw={700} c="red">
              {totalViolations}
            </Text>
            <Text size="sm" c="dimmed">
              Total Violations
            </Text>
          </div>

          <div>
            <Text size="lg" fw={700} c="green">
              {totalPasses}
            </Text>
            <Text size="sm" c="dimmed">
              Passed Checks
            </Text>
          </div>

          <div>
            <Text size="lg" fw={700} c="blue">
              {totalChecks}
            </Text>
            <Text size="sm" c="dimmed">
              Total Checks
            </Text>
          </div>
        </Group>

        {/* Status Badge */}
        <Group justify="center">
          {totalViolations === 0 ? (
            <Badge
              size="lg"
              color="green"
              variant="light"
              leftSection={<IconCheck size="1rem" />}
            >
              Page is Accessible
            </Badge>
          ) : (
            <Badge
              size="lg"
              color="red"
              variant="light"
              leftSection={<IconX size="1rem" />}
            >
              {totalViolations} Accessibility Issue
              {totalViolations !== 1 ? 's' : ''} Found
            </Badge>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
