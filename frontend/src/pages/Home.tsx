import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import QRCodeModal from '../components/QRCodeModal'
import StorageUpgradeModal from '../components/StorageUpgradeModal'
import FileBrowserModal from '../components/FileBrowserModal'

import Hero from '../components/home/Hero'
import ActionGrid from '../components/home/ActionGrid'
import QuickLinks from '../components/home/QuickLinks'
import HowItWorks from '../components/home/HowItWorks'
import About from '../components/home/About'
import Footer from '../components/Footer'

import { fileService } from '../services/fileService'
import { useStorage } from '../context/StorageContext'
import { useNotification } from '../context/NotificationContext'
import { copyToClipboard } from '../utils/clipboard'

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adsWatched, watchAd, subscribe, share } = useStorage()
  const { showNotification } = useNotification()

  const [showQRModal, setShowQRModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showFileBrowser, setShowFileBrowser] = useState(false)
  
  const [uploadCode, setUploadCode] = useState<string | null>(null)
  const [downloadCode, setDownloadCode] = useState<string | null>(null)
  const [expirationDate, setExpirationDate] = useState<Date | null>(null)
  
  // Simular preço atual (será calculado pelo backend baseado no uso)
  const [currentPrice] = useState(1.0) // $1 USD inicial
  const [isUSD] = useState(true) // Começa em USD, depois muda para BRL

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      handleCodeSubmit(code)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleUploadComplete = (_files: File[], code: string) => {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 7) // 7 dias
    setExpirationDate(expiration)
    setUploadCode(code)
    setShowQRModal(true)
  }

  // Called when user enters code in the input
  const handleCodeSubmit = async (code: string) => {
    setDownloadCode(code)
    setShowFileBrowser(true)
  }

  // Called when user clicks 'Download' inside the modal
  const performDownload = async () => {
    if (!downloadCode) return

    try {
      const { blob, filename } = await fileService.downloadFolderZip(downloadCode)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `arquivo-${downloadCode}` 
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      // Optional: Close modal after download starts?
      // setShowFileBrowser(false) 
    } catch (error) {
      console.error('Download failed:', error)
      showNotification('Erro ao baixar arquivo. Verifique se o código está correto e não expirou.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900 font-sans">
      <Header onLoginClick={handleLoginClick} />

      <main>
        {/* Hero Section */}
        <section className="w-[95%] max-w-[1304px] mx-auto pt-8 pb-16 md:pt-12 md:pb-24">
          <Hero />

          {/* Upload and Download Sections - Side by Side */}
          <ActionGrid 
            onUploadComplete={handleUploadComplete}
            onDownload={handleCodeSubmit}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />

          {/* Quick Links */}
          <QuickLinks />

          {/* Info Sections */}
          <HowItWorks />

          {/* About Section */}
          <About />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* QR Code Modal */}
      {showQRModal && uploadCode && expirationDate && (
        <QRCodeModal
          code={uploadCode}
          expirationDate={expirationDate}
          onClose={() => {
            setShowQRModal(false)
            setUploadCode(null)
            setExpirationDate(null)
          }}
        />
      )}

      {/* File Browser Modal (VSCode Style) */}
      {showFileBrowser && downloadCode && (
        <FileBrowserModal
          code={downloadCode}
          onClose={() => {
            setShowFileBrowser(false)
            setDownloadCode(null)
          }}
          onDownload={performDownload}
        />
      )}

      {/* Storage Upgrade Modal */}
      {showUpgradeModal && (
        <StorageUpgradeModal
          currentPrice={currentPrice}
          isUSD={isUSD}
          adsWatched={adsWatched}
          onClose={() => setShowUpgradeModal(false)}
          onPay={() => {
            // Aqui você implementaria a lógica de pagamento
            alert('Redirecionando para pagamento PIX...')
            setShowUpgradeModal(false)
          }}
          onWatchAd={async () => {
             const storageGained = await watchAd();
             showNotification(`Anúncio assistido! Você ganhou ${storageGained >= 1 ? storageGained.toFixed(1) + 'GB' : (storageGained * 1024).toFixed(0) + 'MB'} adicional.`, 'success');
             setShowUpgradeModal(false);
          }}
          onSubscribe={() => {
            subscribe();
            showNotification('Obrigado por se inscrever! Você ganhou +1GB.', 'success');
            setShowUpgradeModal(false);
            // navigate('/register') // Removed navigation to keep them in context, or we can keep it. User said "fizer a inscrição", implies doing it.
            // If we navigate, we lose the modal. Let's assume the button actions "simulates" it or we handle it here.
            // For now, I'll update the context.
          }}
          onShare={async () => {
            if (navigator.share) {
              navigator.share({
                title: 'Document Storage',
                text: 'Conheça o Document Storage - Guarde seus documentos com segurança!',
                url: window.location.href
              }).then(() => {
                share();
                showNotification('Obrigado por compartilhar! Você ganhou +1GB.', 'success');
                setShowUpgradeModal(false);
              }).catch(() => {
                 // User cancelled share
              });
            } else {
              // Fallback: copiar link
              await copyToClipboard(window.location.href);
              share();
              showNotification('Link copiado! Obrigado por compartilhar. Você ganhou +1GB.', 'success');
              setShowUpgradeModal(false);
            }
          }}
        />
      )}
    </div>
  )
}

