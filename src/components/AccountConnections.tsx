'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Twitter, Instagram, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Provider } from '@supabase/supabase-js';

type SocialProvider = 'twitter' | 'instagram';

interface ProviderConnection {
  provider: SocialProvider;
  connected: boolean;
  username?: string;
}

interface Identity {
  provider: string;
  identity_data: {
    username?: string;
    preferred_username?: string;
  };
}

function AccountConnections() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [connections, setConnections] = useState<ProviderConnection[]>([
    { provider: 'twitter', connected: false },
    { provider: 'instagram', connected: false },
  ]);

  useEffect(() => {
    checkConnections();
  }, [user]);

  const checkConnections = async () => {
    if (!user) return;

    const { data: { user: userData }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user identities:', error);
      return;
    }

    const identities = userData?.identities as Identity[] | undefined;
    
    const updatedConnections = connections.map(conn => {
      const identity = identities?.find(id => id.provider === conn.provider);
      return {
        ...conn,
        connected: !!identity,
        username: identity?.identity_data?.username || identity?.identity_data?.preferred_username,
      };
    });

    setConnections(updatedConnections);
  };

  const handleConnect = async (provider: SocialProvider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      toast({
        title: 'Connection Error',
        description: `Failed to connect to ${provider}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async (provider: SocialProvider) => {
    try {
      // Note: This is a placeholder. You'll need to implement the actual disconnect logic
      // using Supabase Admin API or a custom RPC function
      toast({
        title: 'Disconnect Not Implemented',
        description: 'The disconnect functionality needs to be implemented with Supabase Admin API.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error(`Error disconnecting from ${provider}:`, error);
      toast({
        title: 'Disconnection Error',
        description: `Failed to disconnect from ${provider}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const getProviderIcon = (provider: SocialProvider) => {
    switch (provider) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: SocialProvider) => {
    switch (provider) {
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.map((connection) => (
            <div
              key={connection.provider}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getProviderIcon(connection.provider)}
                <div>
                  <p className="font-medium">{getProviderName(connection.provider)}</p>
                  {connection.connected ? (
                    <div className="flex items-center space-x-1 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Connected as @{connection.username}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
              </div>
              <Button
                variant={connection.connected ? "outline" : "default"}
                className={connection.connected ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""}
                onClick={() =>
                  connection.connected
                    ? handleDisconnect(connection.provider)
                    : handleConnect(connection.provider)
                }
              >
                {connection.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountConnections; 