import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = 'AIzaSyCXRDfQzcosEwLSKfzBwnhWzB3-2US50hs';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch (error) {
    return null;
  }
}

async function giveTranscript(yturl: string): Promise<string | { error: string }> {
  try {
    const videoId = extractVideoId(yturl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    const videoDescription = response.data.items[0].snippet.description;
    return videoDescription;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return { error: 'Error fetching transcript' };
  }
}

async function giveSummary(yturl: string, prompt: string): Promise<string | { error: string }> {
  try {
    const transcript = await giveTranscript(yturl);

    if (typeof transcript === 'object' && 'error' in transcript) {
      throw new Error(transcript.error);
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: transcript as string },
        { role: 'system', content: `Summarize the video: ${prompt}` },
      ],
    });

    return chatCompletion.choices[0].message?.content || 'No summary available';
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { error: 'Error fetching summary' };
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { yturl, prompt } = await req.json();
    console.log("in CHATGPT/route.ts", yturl);

    const summary = await giveSummary(yturl, prompt);
    if (typeof summary === 'string') {
      return new NextResponse(JSON.stringify({ summary }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify(summary), { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in POST /api/chatgpt:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
