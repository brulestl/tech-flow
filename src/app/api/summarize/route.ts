import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function extractContent(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const doc = new JSDOM(html)
    const reader = new Readability(doc.window.document)
    const article = reader.parse()
    return article?.textContent || ''
  } catch (error) {
    console.error('Error extracting content:', error)
    return ''
  }
}

export async function POST(request: Request) {
  try {
    const { url, title, type } = await request.json()

    // Skip summarization for certain types
    if (type === 'code' || type === 'other') {
      return NextResponse.json({ summary: null })
    }

    let content = ''
    
    // Extract content based on type
    if (type === 'article') {
      content = await extractContent(url)
    } else if (type === 'video') {
      // For videos, we might want to use the video description or metadata
      // For now, we'll use the title as context
      content = title
    }

    if (!content) {
      return NextResponse.json({ summary: null })
    }

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise, informative summaries. Keep summaries to 1-2 sentences and focus on the key points."
        },
        {
          role: "user",
          content: `Please summarize this content in 1-2 sentences:\n\n${content}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const summary = completion.choices[0]?.message?.content || null

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
} 