import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, Lock, FileText, Heart, Code } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { formatMinPrice } from '../utils/pricing'

export default function Transparency() {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const sections = [
    {
      icon: <FileText className="h-6 w-6 text-gray-900" />,
      title: "Sobre o Projeto",
      content: (
        <>
          <p className="mb-4">
            O Speed Share foi criado para resolver um problema real: pessoas que precisam 
            guardar documentos temporariamente, especialmente quando estão usando computadores 
            de terceiros e não podem salvar arquivos localmente.
          </p>
          <p>
            Nossa missão é fornecer uma solução simples, segura e acessível, sem complicações 
            desnecessárias. Acreditamos que tecnologia deve ser para todos, não apenas para 
            quem pode pagar muito.
          </p>
        </>
      )
    },
    {
      icon: <Code className="h-6 w-6 text-gray-900" />,
      title: "Como Funciona",
      content: (
        <>
          <p className="mb-4">
            Quando você faz upload de um arquivo, ele é armazenado de forma segura em nossos 
            servidores. Você recebe um código único e um QR Code que pode usar para acessar 
            seus arquivos depois.
          </p>
          <ul className="space-y-2 mb-4">
            <li><strong className="text-gray-900">Usuários anônimos:</strong> Podem armazenar até 1GB por 7 dias gratuitamente.</li>
            <li><strong className="text-gray-900">Armazenamento adicional:</strong> Você pode pagar via PIX ou assistir anúncios para ganhar mais espaço.</li>
            <li><strong className="text-gray-900">Sistema de desconto:</strong> Quanto mais você usa, mais barato fica. Começando em  USD por GB, o preço diminui progressivamente até chegar a {formatMinPrice()} por GB.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Lock className="h-6 w-6 text-gray-900" />,
      title: "Privacidade e Segurança",
      content: (
        <>
          <p className="mb-4">
            Seus arquivos são armazenados com criptografia. Apenas quem tem o código de acesso 
            pode baixar os arquivos. Não compartilhamos seus dados com terceiros.
          </p>
          <ul className="space-y-2">
            <li><strong className="text-gray-900">Arquivos anônimos:</strong> São automaticamente deletados após 7 dias. Não guardamos informações pessoais.</li>
            <li><strong className="text-gray-900">Arquivos de usuários registrados:</strong> Seguem as configurações da sua conta, com opções de armazenamento mais longas.</li>
          </ul>
        </>
      )
    },
    {
      icon: <Heart className="h-6 w-6 text-gray-900" />,
      title: "Pagamentos e Anúncios",
      content: (
        <>
          <p className="mb-4">
            Oferecemos duas formas de obter armazenamento adicional:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
            <li>
              <strong className="text-gray-900">Pagamento via PIX:</strong> Rápido, seguro e direto. O preço diminui conforme você usa mais o serviço.
            </li>
            <li>
              <strong className="text-gray-900">Assistir anúncios:</strong> Uma forma alternativa para quem não pode pagar no momento. Cada anúncio assistido gera armazenamento adicional.
            </li>
          </ul>
          <p className="pt-4 border-t border-gray-100 text-sm">
            Acreditamos que todos devem ter acesso, independente da situação financeira. Por isso oferecemos ambas as opções.
          </p>
        </>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900 font-sans">
      <Header onLoginClick={handleLoginClick} />

      <main className="w-[95%] max-w-[1304px] mx-auto py-16 md:py-24">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-12 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Link>

        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Eye className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900">
              Transparência.
            </h1>
          </div>
          <p className="text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            Acreditamos que você merece saber exatamente como seu serviço funciona.
          </p>
        </div>

        <div className="space-y-8 mb-24">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-3xl p-10 card-shadow transition-transform hover:scale-[1.01] duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{section.title}</h2>
              </div>
              <div className="text-lg text-gray-500 font-medium leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}

          {/* Futuro */}
          <div className="bg-[#1d1d1f] rounded-3xl p-10 text-white card-shadow">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">O que vem por aí?</h2>
            <p className="text-lg font-medium opacity-80 leading-relaxed mb-4">
              Estamos constantemente trabalhando para melhorar o serviço. O backend ainda está 
              em desenvolvimento, então algumas funcionalidades podem mudar ou ser adicionadas 
              conforme avançamos.
            </p>
            <p className="text-lg font-medium opacity-80 leading-relaxed">
              Nossa prioridade é criar uma experiência simples, segura e acessível para todos.
            </p>
          </div>

          {/* Criador */}
          <div className="bg-white rounded-3xl p-10 card-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 tracking-tight">Criado por</h2>
            <p className="text-lg mb-2">
              <a 
                href="https://www.linkedin.com/in/tchezery" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
              >
                Tchézery Ribeiro
              </a>
            </p>
            <p className="text-gray-500 font-medium leading-relaxed">
              Este projeto foi criado com dedicação e atenção aos detalhes. Se você tiver 
              dúvidas, sugestões ou feedback, não hesite em entrar em contato através dos 
              canais disponíveis na página inicial.
            </p>
          </div>
        </div>

        <div className="text-left border-t border-gray-200 pt-16">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-[#0071e3] text-white rounded-full font-medium hover:bg-[#0077ed] transition-colors text-lg"
          >
            Voltar para Início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}