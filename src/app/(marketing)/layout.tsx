import '@/styles/globals.css';
import NavBar from '@/components/marketing/NavBar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-background font-sans antialiased">
        <NavBar />
        {children}
        <MarketingFooter />
      </body>
    </html>
  );
}
