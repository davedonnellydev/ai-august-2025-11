'use client';

import { useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Button,
  Textarea,
  FileInput,
  Stack,
  Alert,
  Group,
  Divider,
} from '@mantine/core';
import {
  IconUpload,
  IconFileText,
  IconClipboard,
  IconArrowRight,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { AxeResults } from 'axe-core';

export function ImportResults() {
  const [jsonInput, setJsonInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateAndProcessJson = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      // Basic validation that this looks like axe-core results
      if (
        !parsed.violations ||
        !parsed.passes ||
        !Array.isArray(parsed.violations) ||
        !Array.isArray(parsed.passes)
      ) {
        throw new Error(
          'Invalid format: Expected axe-core results with violations and passes arrays'
        );
      }

      return parsed as AxeResults;
    } catch (err) {
      throw new Error(
        `Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) {
        return;
      }

      setIsProcessing(true);
      setError('');

      try {
        const text = await file.text();
        const results = validateAndProcessJson(text);

        // Store results in localStorage for now (we'll implement proper state management later)
        localStorage.setItem('accessibilityResults', JSON.stringify(results));

        // Navigate to report page
        router.push('/report');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process file');
      } finally {
        setIsProcessing(false);
      }
    },
    [validateAndProcessJson, router]
  );

  const handleJsonSubmit = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const results = validateAndProcessJson(jsonInput);

      // Store results in localStorage for now
      localStorage.setItem('accessibilityResults', JSON.stringify(results));

      // Navigate to report page
      router.push('/report');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON data');
    } finally {
      setIsProcessing(false);
    }
  }, [jsonInput, validateAndProcessJson, router]);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setError('');
    } catch (err) {
      setError('Failed to read from clipboard. Please paste manually.');
    }
  }, []);

  return (
    <Paper p="xl" withBorder>
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">
            <IconFileText
              size="1.5rem"
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Import Results
          </Title>
          <Text c="dimmed" size="sm">
            Upload or paste JSON results from the accessibility checker to
            generate a detailed report
          </Text>
        </div>

        <Alert
          icon={<IconInfoCircle size="1rem" />}
          title="How to get results"
          color="blue"
        >
          Use the bookmarklet on any webpage to generate accessibility results,
          then upload the JSON file or paste the results here.
        </Alert>

        <div>
          <Title order={4} mb="md">
            Upload JSON File
          </Title>
          <FileInput
            placeholder="Choose JSON file or drag and drop"
            accept=".json"
            value={file}
            onChange={(newFile) => {
              setFile(newFile);
              if (newFile) {
                handleFileUpload(newFile);
              }
            }}
            leftSection={<IconUpload size="1rem" />}
            disabled={isProcessing}
          />
        </div>

        <Divider label="or" labelPosition="center" />

        <div>
          <Title order={4} mb="md">
            Paste JSON Results
          </Title>
          <Group mb="sm">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconClipboard size="1rem" />}
              onClick={handlePasteFromClipboard}
              disabled={isProcessing}
            >
              Paste from Clipboard
            </Button>
          </Group>

          <Textarea
            placeholder="Paste your JSON results here..."
            value={jsonInput}
            onChange={(event) => setJsonInput(event.currentTarget.value)}
            minRows={8}
            disabled={isProcessing}
          />

          <Button
            fullWidth
            mt="md"
            leftSection={<IconArrowRight size="1rem" />}
            onClick={handleJsonSubmit}
            disabled={!jsonInput.trim() || isProcessing}
            loading={isProcessing}
          >
            Generate Report
          </Button>
        </div>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
