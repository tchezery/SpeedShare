import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Check, Download, Mail, MessageCircle, Calendar, Smartphone } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'
import { copyToClipboard } from '../utils/clipboard'

interface QRCodeModalProps {
  code: string
  expirationDate: Date
  onClose: () => void
}

export default function QRCodeModal({ code, expirationDate, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)

  const daysRemaining = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const formattedDate = expirationDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleCopy = async () => {
    const success = await copyToClipboard(code)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadTxt = () => {
    const content = `Código de Download: ${code}\nData de Expiração: ${formattedDate}\nDias Restantes: ${daysRemaining}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codigo-download-${code}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // const handleEmail = () => {
  //   const subject = encodeURIComponent('Código de Download - Document Storage')
  //   const body = encodeURIComponent(
  //     `Seu código de download é: ${code}\n\n` +
  //     `Data de Expiração: ${formattedDate}\n` +
  //     `Dias Restantes: ${daysRemaining}`
  //   )
  //   window.location.href = `mailto:?subject=${subject}&body=${body}`
  // }

  // const handleWhatsApp = () => {
  //   const message = encodeURIComponent(
  //     `Código de Download: ${code}\n` +
  //     `Data de Expiração: ${formattedDate}\n` +
  //     `Dias Restantes: ${daysRemaining}`
  //   )
  //   window.open(`https://wa.me/?text=${message}`, '_blank')
  // }

  // const handleSMS = () => {
  //   const message = encodeURIComponent(
  //     `Código de Download: ${code}\n` +
  //     `Data de Expiração: ${formattedDate}`
  //   )
  //   window.location.href = `sms:?body=${message}`
  // }

  // QR Code now points to the app with the code as a parameter
  const qrCodeValue = `${window.location.origin}/?code=${code}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 animate-slide-up card-shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 bg-white z-10 pb-2">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Upload Concluído</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
              <QRCodeSVG value={qrCodeValue} size={180} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Escaneie o QR Code para abrir no celular</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Seu código de download</p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-white px-4 py-3 rounded-xl font-mono text-xl font-bold text-center border border-gray-200 text-gray-900 tracking-wider">
                {code}
              </div>
              <button
                onClick={handleCopy}
                className={`p-3.5 rounded-xl transition-all duration-200 ${
                  copied 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-[#0071e3]" />
              <p className="text-sm font-semibold text-gray-900">Data de Expiração</p>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-1">{formattedDate}</p>
            <p className="text-sm text-gray-500 font-medium">
              {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">Compartilhar código:</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleDownloadTxt}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100 group"
                title="Baixar TXT"
              >
                <Download className="h-5 w-5 text-gray-400 group-hover:text-gray-900 mb-1 transition-colors" />
                <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">TXT</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group opacity-50 cursor-not-allowed"
                title="Email (Indisponível)"
              >
                <Mail className="h-5 w-5 text-gray-400 mb-1 transition-colors" />
                <span className="text-[10px] font-medium text-gray-500 transition-colors">Email</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group opacity-50 cursor-not-allowed"
                title="WhatsApp (Indisponível)"
              >
                <MessageCircle className="h-5 w-5 text-gray-400 mb-1 transition-colors" />
                <span className="text-[10px] font-medium text-gray-500 transition-colors">Whats</span>
              </button>
              <button
                disabled
                className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group opacity-50 cursor-not-allowed"
                title="SMS (Indisponível)"
              >
                <Smartphone className="h-5 w-5 text-gray-400 mb-1 transition-colors" />
                <span className="text-[10px] font-medium text-gray-500 transition-colors">SMS</span>
              </button>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Concluído
          </Button>
        </div>
      </div>
    </div>
  )
}

