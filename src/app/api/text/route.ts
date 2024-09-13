import { NextResponse, NextRequest } from "next/server";
import { Groq } from 'groq-sdk';

export async function POST(req: NextRequest) {
    try {
        const { inputText } = await req.json();

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a highly efficient text-summarizer AI. Provide a concise summary that captures the main points and key arguments.`
                },
                {
                    role: "user",
                    content: `summarize the following text:\n\n${inputText}`
                }
            ],
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,  // Set to false unless you're handling streamed responses
            stop: null
        });

        const summary = chatCompletion.choices[0]?.message?.content || "No Summary Found";
        return NextResponse.json({ summary });
    } catch (error) {
        console.error('Error:', error); 
        return NextResponse.json({ error: 'An error occurred while summarizing the text.' }, { status: 500 });
    }
}
