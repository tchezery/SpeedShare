import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogIn, Menu, X, ChevronRight } from 'lucide-react'
import StorageIndicator from './StorageIndicator'

interface HeaderProps {
  onLoginClick?: () => void
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Bloquear rolagem quando menu estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleLogin = () => {
    setIsMenuOpen(false)
    if (onLoginClick) onLoginClick()
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isMenuOpen ? 'bg-white' : 'glass-effect border-b border-gray-200/50 backdrop-blur-md bg-white/70'
      }`}>
        <div className="w-[95%] max-w-[1304px] mx-auto">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link to="/" onClick={handleScrollToTop} className="flex items-center space-x-2 z-50">
              <img 
                src="/logo.png" 
                alt="Speed Share Logo" 
                className="w-8 h-8 object-contain rounded-lg transition-transform active:scale-95" 
              />
              <div className="flex items-baseline space-x-2">
                              <span className="text-lg font-semibold text-gray-900 tracking-tight">Speed Share</span>
                              {!isMenuOpen && (
                                <a 
                                  href="https://www.linkedin.com/in/tchezery" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hidden sm:block text-[10px] text-gray-400 font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
                                >
                                  by Tchézery Ribeiro
                                </a>
                              )}
                            </div>            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-gray-600">
              <Link to="/" onClick={handleScrollToTop} className="hover:text-gray-900 transition-colors">
                Início
              </Link>
              <Link to="/porque-somos-melhor" className="hover:text-gray-900 transition-colors">
                Porque Somos Melhor
              </Link>
              <Link to="/transparencia" className="hover:text-gray-900 transition-colors">
                Transparência
              </Link>

              <StorageIndicator />

              <button
                onClick={onLoginClick}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-xs active:scale-95 duration-200"
              >
                <span>Login</span>
              </button>
            </nav>
            
            {/* Mobile Actions */}
            <div className="flex items-center space-x-3 md:hidden z-50">
              <div className={`transition-opacity duration-200 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <StorageIndicator />
              </div>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-90 duration-200"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-40 bg-white md:hidden transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        style={{ top: '3rem' }} // Começa logo abaixo do header
      >
        <div className={`
          flex flex-col p-6 space-y-6 transition-all duration-500 delay-100
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        `}>
          <div className="flex flex-col space-y-1">
            <Link 
              to="/" 
              onClick={handleScrollToTop}
              className="flex items-center justify-between text-2xl font-semibold text-gray-900 py-3 border-b border-gray-100"
            >
              <span>Início</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link 
              to="/porque-somos-melhor" 
              className="flex items-center justify-between text-2xl font-semibold text-gray-900 py-3 border-b border-gray-100"
            >
              <span>Porque Somos Melhor</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link 
              to="/transparencia" 
              className="flex items-center justify-between text-2xl font-semibold text-gray-900 py-3 border-b border-gray-100"
            >
              <span>Transparência</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </div>

          <div className="pt-4 space-y-4">
             {/* Storage no Menu também, para destaque */}
             <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Seu Armazenamento</span>
                <StorageIndicator />
             </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              <LogIn size={20} />
              <span>Fazer Login</span>
            </button>
            
            <p className="text-center text-xs text-gray-400 pt-4">
              Speed Share Mobile v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
