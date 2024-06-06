import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
  baseURL: 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const prompt = '';
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo-instruct'),
      maxTokens: 400,
      prompt: prompt,
    });

    return new Response(
      JSON.stringify({
        success: true,
        text,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('An unexpected error occurred', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to generate text',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
