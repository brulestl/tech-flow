'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Loader2, Twitter, Github } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Connection {
  platform: string;
  connected: boolean;
  username?: string;
  icon: React.ReactNode;
}

const AccountConnections: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([
    {
      platform: 'x',
      connected: false,
      icon: <Twitter className="h-5 w-5" />
    },
    {
      platform: 'github',
      connected: false,
      icon: <Github className="h-5 w-5" />
    }
  ]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user) {
      checkConnections();
    }
  }, [user]);

  const checkConnections = async () => {
    if (!user) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const { data: connections, error } = await supabase
        .from('user_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setConnections([
        {
          platform: 'x',
          connected: !!connections?.twitter_username,
          username: connections?.twitter_username,
          icon: <Twitter className="h-5 w-5" />
        },
        {
          platform: 'github',
          connected: !!connections?.github_username,
          username: connections?.github_username,
          icon: <Github className="h-5 w-5" />
        }
      ]);
    } catch (error) {
      console.error('Error checking connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to check connection status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleConnect = async (platform: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to connect your accounts.',
        variant: 'destructive',
      });
      return;
    }

    setConnecting(platform);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: platform === 'x' ? 'twitter' : 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
          scopes: platform === 'x' ? 'tweet.read users.read offline.access' : 'read:user user:email'
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      toast({
        title: 'Connection Error',
        description: `Failed to connect to ${platform}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!user) return;

    setConnecting(platform);
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({
          [`${platform}_username`]: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await checkConnections();
      toast({
        title: 'Success',
        description: `Successfully disconnected from ${platform}.`,
      });
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      toast({
        title: 'Error',
        description: `Failed to disconnect from ${platform}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.platform} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {connection.icon}
                <div>
                  <h3 className="font-medium capitalize">{connection.platform}</h3>
                  {connection.username && (
                    <p className="text-sm text-muted-foreground">@{connection.username}</p>
                  )}
                </div>
              </div>
              <Button
                variant={connection.connected ? "outline" : "default"}
                onClick={() => connection.connected ? handleDisconnect(connection.platform) : handleConnect(connection.platform)}
                disabled={connecting === connection.platform}
                className={connection.connected ? "text-green-600 border-green-600 hover:bg-green-50" : ""}
              >
                {connecting === connection.platform ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {connection.connected ? 'Connected' : 'Connect Account'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountConnections; 