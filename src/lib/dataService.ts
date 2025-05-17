import { supabase } from './supabase';
import { Database } from './database.types';

export type Resource = Database['public']['Tables']['resources']['Row'];
export type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
export type Collection = Database['public']['Tables']['collections']['Row'];
export type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
export type CollectionWithResourceCount = Collection & { resource_count: number };

export async function saveResource(resource: Omit<ResourceInsert, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'search_vector'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save resources');
  }

  const { data, error } = await supabase
    .from('resources')
    .insert({
      ...resource,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving resource:', error);
    throw error;
  }

  return data;
}

export async function getResources() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get resources');
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }

  return data;
}

export async function getRecentResources(limit: number = 10) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get recent resources');
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent resources:', error);
    throw error;
  }

  return data;
}

export async function deleteResource(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to delete resources');
  }

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

export async function updateResource(id: string, updates: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update resources');
  }

  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating resource:', error);
    throw error;
  }

  return data;
}

export async function getCollections() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get collections');
  }

  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      resource_count:resource_collections(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }

  // Transform the data to flatten the resource_count
  return data.map(collection => ({
    ...collection,
    resource_count: collection.resource_count[0].count
  }));
}

export async function getCollection(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get collection');
  }

  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      resource_count:resource_collections(count)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }

  return {
    ...data,
    resource_count: data.resource_count[0].count
  };
}

export async function createCollection(data: Omit<CollectionInsert, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create collections');
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .insert({
      ...data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating collection:', error);
    throw error;
  }

  return collection;
}

export async function updateCollection(id: string, data: Partial<Omit<Collection, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update collections');
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating collection:', error);
    throw error;
  }

  return collection;
}

export async function deleteCollection(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to delete collections');
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
}

export async function addResourceToCollection(collectionId: string, resourceId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to add resources to collections');
  }

  // First verify that the collection belongs to the user
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single();

  if (collectionError || !collection) {
    throw new Error('Collection not found or access denied');
  }

  const { error } = await supabase
    .from('resource_collections')
    .insert({
      collection_id: collectionId,
      resource_id: resourceId,
    });

  if (error) {
    console.error('Error adding resource to collection:', error);
    throw error;
  }
}

export async function removeResourceFromCollection(collectionId: string, resourceId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to remove resources from collections');
  }

  // First verify that the collection belongs to the user
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single();

  if (collectionError || !collection) {
    throw new Error('Collection not found or access denied');
  }

  const { error } = await supabase
    .from('resource_collections')
    .delete()
    .eq('collection_id', collectionId)
    .eq('resource_id', resourceId);

  if (error) {
    console.error('Error removing resource from collection:', error);
    throw error;
  }
}

export async function getCollectionResources(collectionId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get collection resources');
  }

  // First verify that the collection belongs to the user
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single();

  if (collectionError || !collection) {
    throw new Error('Collection not found or access denied');
  }

  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      resource_collections!inner(collection_id)
    `)
    .eq('resource_collections.collection_id', collectionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching collection resources:', error);
    throw error;
  }

  return data;
} 