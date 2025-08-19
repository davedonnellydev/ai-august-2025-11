import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { MODEL } from '@/app/config/constants';
import { ServerRateLimiter } from '@/app/lib/utils/api-helpers';

export async function POST(request: NextRequest) {

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Server-side rate limiting
    if (!ServerRateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { violations, totalViolations, url } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!violations || violations.length === 0) {
      return NextResponse.json(
        { error: 'No violations to analyze' },
        { status: 400 }
      );
    }

    const Fix = z.object({
      rank: z.number(),
      description: z.string(),
    });
    const Step = z.object({
      order: z.number(),
      description: z.string(),
    });
    const AiInsights = z.object({
      topFixes: z.array(Fix),
      nextSteps: z.array(Step),
      priorityActions: z.object({
        high: z.string(),
        medium: z.string(),
        low: z.string(),
      }),
      estimatedEffort: z.string(),
    });

    // Create a comprehensive prompt for the AI
    const instructions = `You are an accessibility expert. You will be given data on accessibility violations for a website. Analyze the given accessibility violations and provide actionable advice.

Please provide a structured response in the following JSON format:
{
  "topFixes": [
    "5 specific, actionable fixes that developers can implement immediately",
    "Each fix should be clear and specific to the violations found"
  ],
  "nextSteps": [
    "3-4 strategic next steps for improving accessibility",
    "Focus on long-term improvements and best practices"
  ],
  "priorityActions": [
    "High: Most critical issues to fix first",
    "Medium: Important but less urgent issues",
    "Low: Minor issues that can be addressed later"
  ],
  "estimatedEffort": "Low/Medium/High based on the complexity and number of violations"
}

Focus on practical, implementable solutions. Be specific about what elements need to be changed and why.`;

    const input = `URL: ${url}
Total Violations: ${totalViolations}

Violations:
${violations
  .map(
    (v: any, i: number) =>
      `${i + 1}. ${v.id} (${v.impact} impact): ${v.description}
   Help: ${v.help}
   Tags: ${v.tags.join(', ')}
   Elements affected: ${v.nodeCount}
   Nodes: [${v.nodes.map((node: any, i: number) => {
     return `{
        index: ${i},
        impact: ${node.impact},
        failureSummary: ${node.failureSummary},
        html: ${node.html},
        targets: [${node.target.join(',')}]
   },`;
   })}]`
  )
  .join('\n\n')}
    `;

    const response = await openai.responses.parse({
      model: MODEL,
      instructions,
      input,
      text: {
        format: zodTextFormat(AiInsights, 'ai_insights'),
      },
    });

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_parsed || 'Response parsed',
      originalInput: body,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    // OpenAI API error
    const errorMessage =
      error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
