import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
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

    // Create a comprehensive prompt for the AI
    const prompt = `You are an accessibility expert. Analyze the following accessibility violations and provide actionable advice.

URL: ${url}
Total Violations: ${totalViolations}

Violations:
${violations
  .map(
    (v: any, i: number) =>
      `${i + 1}. ${v.id} (${v.impact} impact): ${v.description}
   Help: ${v.help}
   Tags: ${v.tags.join(', ')}
   Elements affected: ${v.nodeCount}`
  )
  .join('\n\n')}

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
  "priorityOrder": [
    "High: Most critical issues to fix first",
    "Medium: Important but less urgent issues",
    "Low: Minor issues that can be addressed later"
  ],
  "estimatedEffort": "Low/Medium/High based on the complexity and number of violations"
}

Focus on practical, implementable solutions. Be specific about what needs to be changed and why.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an accessibility expert providing practical, actionable advice for fixing web accessibility issues. Always respond with valid JSON in the exact format requested.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    // Validate the response structure
    const requiredFields = [
      'topFixes',
      'nextSteps',
      'priorityOrder',
      'estimatedEffort',
    ];
    const missingFields = requiredFields.filter((field) => !aiAnalysis[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `AI response missing required fields: ${missingFields.join(', ')}`
      );
    }

    return NextResponse.json(aiAnalysis);
  } catch (error) {
    console.error('OpenAI API error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Failed to analyze with AI' },
      { status: 500 }
    );
  }
}
