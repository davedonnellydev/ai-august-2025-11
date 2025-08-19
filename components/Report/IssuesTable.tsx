'use client';

import { useState, useMemo } from 'react';
import {
  Paper,
  Title,
  Text,
  Table,
  TextInput,
  Select,
  Group,
  Badge,
  Button,
  Stack,
  Collapse,
  Code,
  Anchor,
  ScrollArea,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconExternalLink,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

import { AxeResults } from 'axe-core';

interface IssuesTableProps {
  results: AxeResults;
}

export function IssuesTable({ results }: IssuesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { violations } = results;

  // Filter and search violations
  const filteredViolations = useMemo(() => {
    return violations.filter((violation) => {
      const matchesSearch =
        searchQuery === '' ||
        violation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        violation.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        violation.help.toLowerCase().includes(searchQuery.toLowerCase()) ||
        violation.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesImpact =
        impactFilter === 'all' || violation.impact === impactFilter;

      return matchesSearch && matchesImpact;
    });
  }, [violations, searchQuery, impactFilter]);

  const toggleRowExpansion = (violationId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(violationId)) {
      newExpanded.delete(violationId);
    } else {
      newExpanded.add(violationId);
    }
    setExpandedRows(newExpanded);
  };

  const getImpactColor = (impact: string | null | undefined) => {
    switch (impact) {
      case 'critical':
        return 'red';
      case 'serious':
        return 'orange';
      case 'moderate':
        return 'yellow';
      case 'minor':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getImpactLabel = (impact: string | null | undefined) => {
    if (!impact) {
      return 'Unknown';
    }
    return impact.charAt(0).toUpperCase() + impact.slice(1);
  };

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
        <Title order={3}>Issues ({filteredViolations.length})</Title>

        {/* Filters */}
        <Group gap="md">
          <TextInput
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            leftSection={<IconSearch size="1rem" />}
            style={{ flex: 1 }}
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
            leftSection={<IconFilter size="1rem" />}
          />
        </Group>

        {/* Issues Table */}
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Issue</Table.Th>
                <Table.Th>Impact</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Elements</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredViolations.map((violation) => {
                const isExpanded = expandedRows.has(violation.id);

                return (
                  <Table.Tr key={violation.id}>
                    <Table.Td>
                      <Stack gap="xs">
                        <Text fw={600} size="sm">
                          {violation.id}
                        </Text>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {violation.description}
                        </Text>
                        <Button
                          variant="subtle"
                          size="xs"
                          p={0}
                          onClick={() => toggleRowExpansion(violation.id)}
                          leftSection={
                            isExpanded ? (
                              <IconChevronDown size="1rem" />
                            ) : (
                              <IconChevronRight size="1rem" />
                            )
                          }
                        >
                          {isExpanded ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </Stack>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        color={getImpactColor(violation.impact)}
                        variant="light"
                      >
                        {getImpactLabel(violation.impact)}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <Group gap="xs">
                        {violation.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} size="xs" variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {violation.tags.length > 3 && (
                          <Badge size="xs" variant="outline">
                            +{violation.tags.length - 3}
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Text size="sm">{violation.nodes.length} affected</Text>
                    </Table.Td>

                    <Table.Td>
                      <Group gap="xs">
                        <Button
                          component="a"
                          href={violation.helpUrl}
                          target="_blank"
                          size="xs"
                          variant="light"
                          leftSection={<IconExternalLink size="1rem" />}
                        >
                          Help
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/* Expanded Row Details */}
        {filteredViolations.map((violation) => {
          const isExpanded = expandedRows.has(violation.id);
          if (!isExpanded) {
            return null;
          }

          return (
            <Collapse key={`${violation.id}-details`} in={isExpanded}>
              <Paper p="md" withBorder bg="gray.0">
                <Stack gap="md">
                  <div>
                    <Text fw={600} mb="xs">
                      Help Text
                    </Text>
                    <Text size="sm">{violation.help}</Text>
                  </div>

                  <div>
                    <Text fw={600} mb="xs">
                      Affected Elements
                    </Text>
                    <Stack gap="xs">
                      {violation.nodes.slice(0, 3).map((node, index) => (
                        <Paper key={index} p="xs" withBorder>
                          <Stack gap="xs">
                            <Text size="sm" fw={500}>
                              Selector
                            </Text>
                            <Code>{node.target.join(' ')}</Code>
                            <Text size="sm" fw={500}>
                              HTML
                            </Text>
                            <Code style={{ wordBreak: 'break-all' }}>
                              {node.html}
                            </Code>
                          </Stack>
                        </Paper>
                      ))}
                      {violation.nodes.length > 3 && (
                        <Text size="sm" c="dimmed">
                          ... and {violation.nodes.length - 3} more elements
                        </Text>
                      )}
                    </Stack>
                  </div>

                  <div>
                    <Text fw={600} mb="xs">
                      Learn More
                    </Text>
                    <Anchor href={violation.helpUrl} target="_blank" size="sm">
                      {violation.helpUrl}
                    </Anchor>
                  </div>
                </Stack>
              </Paper>
            </Collapse>
          );
        })}
      </Stack>
    </Paper>
  );
}
