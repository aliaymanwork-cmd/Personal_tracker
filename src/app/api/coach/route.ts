import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();
    const key = process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'Add GEMINI_API_KEY in your Vercel environment variables.' }, { status: 503 });
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const ai = new GoogleGenerativeAI(key);
    const model = ai.getGenerativeModel({ model: modelName, systemInstruction: 'You are Pulse, a careful general wellness and nutrition coach. Give practical, concise suggestions based only on provided logged data. Clearly label estimates. Never diagnose, prescribe, shame, or recommend extreme calorie restriction. Mention professional care for medical concerns.' });
    const result = await model.generateContent(`Logged data (may be incomplete): ${JSON.stringify(context || {})}
User question: ${String(prompt || '').slice(0, 3000)}
Respond in concise, friendly Markdown. If nutrition values are estimated, say so.`);
    return NextResponse.json({ answer: result.response.text() });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'AI request failed';
    return NextResponse.json({ error: message.includes('404') ? 'The configured Gemini model may not be available to your API key. Set GEMINI_MODEL to a model enabled in Google AI Studio.' : 'Could not get a coach response. Check your Gemini API key and model settings.' }, { status: 500 });
  }
}
