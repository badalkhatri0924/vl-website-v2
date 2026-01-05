import { NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/sanity/writeClient'
import { config } from '@/lib/sanity/config'

export async function GET() {
  try {
    const token = process.env.SANITY_WRITE_TOKEN
    
    if (!token) {
      return NextResponse.json({
        error: 'SANITY_WRITE_TOKEN is not set',
        tokenPresent: false,
      }, { status: 500 })
    }

    // Test basic connection
    const client = getWriteClient()
    
    // Try to fetch a simple document
    const testQuery = await client.fetch(`*[_type == "author"][0] {
      _id,
      name
    }`)

    return NextResponse.json({
      success: true,
      tokenPresent: true,
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 10) + '...',
      projectId: config.projectId,
      dataset: config.dataset,
      testQuery: testQuery,
      message: 'Sanity connection successful!',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}

