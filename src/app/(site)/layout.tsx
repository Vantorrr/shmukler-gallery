import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { CartProvider } from '@/lib/CartContext'
import { SplashScreen } from '@/components/SplashScreen'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SplashScreen />
      <div className="flex flex-col min-h-screen">
        <AnnouncementBanner />
        <Navigation />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
