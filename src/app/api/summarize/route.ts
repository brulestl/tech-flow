import 'openai/shims/node'
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
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const prompt = `Summarize the following content in 1-2 sentences: ${content}`
    
    const completion = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 60
    })

    const summary = completion.choices[0].text.trim()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
} 