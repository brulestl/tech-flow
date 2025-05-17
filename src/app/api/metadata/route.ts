import { NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import { MetadataResponse } from '@/types/metadata'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL content' },
        { status: response.status }
      )
    }

    const html = await response.text()
    const dom = new JSDOM(html, { url })
    const doc = dom.window.document

    // Extract metadata using various methods
    const metadata: MetadataResponse = {
      title: '',
      description: '',
      image: null
    }

    // Try to get title from various sources
    metadata.title = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      ''

    // Try to get description from various sources
    metadata.description =
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      ''

    // Try to get image from various sources
    metadata.image =
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:image:src"]')?.getAttribute('content') ||
      null

    // If we don't have a good description, try to extract content using Readability
    if (!metadata.description) {
      const reader = new Readability(doc)
      const article = reader.parse()
      if (article) {
        metadata.content = article.textContent
        // Use the first paragraph as description if we don't have one
        if (!metadata.description && article.textContent) {
          metadata.description = article.textContent.split('\n')[0].trim()
        }
      }
    }

    // Clean up the description (remove extra whitespace, etc.)
    if (metadata.description) {
      metadata.description = metadata.description
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300) // Limit description length
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error extracting metadata:', error)
    return NextResponse.json(
      { error: 'Failed to extract metadata' },
      { status: 500 }
    )
  }
} 