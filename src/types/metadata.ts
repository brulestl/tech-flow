export interface MetadataResponse {
  title: string
  description: string
  image: string | null
  content?: string
  error?: string
}

export interface SocialMetadataResponse extends MetadataResponse {
  source_type: 'twitter' | 'instagram' | 'generic'
  source_url: string
  created_at: string
  metadata?: {
    author?: {
      name?: string
      username?: string
      profile_image?: string
    }
    media?: Array<{
      type: string
      url: string
    }>
  }
} 