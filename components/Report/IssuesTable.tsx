'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Table,
  TextInput,
  Select,
} from '@mantine/core';

import { AxeResults } from 'axe-core';

interface IssuesTableProps {
  results: AxeResults;
}

export function IssuesTable({ results }: IssuesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<string>('all');

  const { violations } = results;

  if (violations.length === 0) {
    return (
      <Paper p="xl" withBorder>
        <Stack gap="md" align="center">
          <Title order={3}>Issues</Title>
          <Text c="green" size="lg">
            🎉 No accessibility issues found!
          </Text>
          <Text c="dimmed">This page appears to be fully accessible.</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="xl" withBorder>
      <Stack gap="lg">
        <Title order={3}>Issues ({violations.length})</Title>

        {/* TextInput and Select */}
        <TextInput
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <Select
          placeholder="Filter by impact"
          value={impactFilter}
          onChange={(value) => setImpactFilter(value || 'all')}
          data={[
            { value: 'all', label: 'All Impacts' },
            { value: 'critical', label: 'Critical' },
            { value: 'serious', label: 'Serious' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'minor', label: 'Minor' },
          ]}
        />

        {/* Basic Table */}
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Issue</Table.Th>
              <Table.Th>Impact</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {violations.map((violation) => (
              <Table.Tr key={violation.id}>
                <Table.Td>
                  <Text fw={600}>{violation.id}</Text>
                  <Text size="sm" c="dimmed">
                    {violation.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{violation.impact}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
}
