export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string | null
          type: 'article' | 'video' | 'book' | 'course' | 'other'
          user_id: string
          created_at: string
          updated_at: string
          summary: string | null
          summary_status: 'pending' | 'processing' | 'completed' | 'failed'
          summary_updated_at: string | null
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url?: string | null
          type: 'article' | 'video' | 'book' | 'course' | 'other'
          user_id: string
          created_at?: string
          updated_at?: string
          summary?: string | null
          summary_status?: 'pending' | 'processing' | 'completed' | 'failed'
          summary_updated_at?: string | null
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string | null
          type?: 'article' | 'video' | 'book' | 'course' | 'other'
          user_id?: string
          created_at?: string
          updated_at?: string
          summary?: string | null
          summary_status?: 'pending' | 'processing' | 'completed' | 'failed'
          summary_updated_at?: string | null
          search_vector?: unknown | null
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      resource_collections: {
        Row: {
          resource_id: string
          collection_id: string
          created_at: string
        }
        Insert: {
          resource_id: string
          collection_id: string
          created_at?: string
        }
        Update: {
          resource_id?: string
          collection_id?: string
          created_at?: string
        }
      }
      resource_tags: {
        Row: {
          resource_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          resource_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          resource_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
    Functions: {
      search_resources: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          title: string
          description: string | null
          similarity: number
        }[]
      }
    }
  }
} 