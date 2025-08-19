'use client';
import { CreateBookmarklet } from '../components/Landing/CreateBookmarklet';
import { ImportResults } from '../components/Landing/ImportResults';
import { Title, Text, Grid, Container } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="xl" py="xl">
      <Title ta="center" mt={50} mb={50}>
        Website{' '}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'blue', to: 'green' }}
        >
          Accessibility Checker
        </Text>
      </Title>

      <Text ta="center" size="lg" c="dimmed" mb={50}>
        Check website accessibility with our bookmarklet or analyze existing
        results
      </Text>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <CreateBookmarklet />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ImportResults />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
