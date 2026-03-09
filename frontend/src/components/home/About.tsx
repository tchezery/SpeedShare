import { Github, Mail, Instagram, Linkedin } from 'lucide-react'

export default function About() {
  return (
    <div id="projeto" className="mb-24 scroll-mt-20">
      <div className="bg-white rounded-3xl p-8 md:p-12 card-shadow">
        <h2 className="text-4xl font-semibold mb-8 text-gray-900 tracking-tight">O Speed Share</h2>
        <div className="max-w-3xl space-y-6 text-xl text-gray-500 font-medium leading-relaxed">
          <p>
            O Speed Share foi criado para ajudar pessoas que precisam armazenar 
            documentos temporariamente, especialmente quando estão usando computadores 
            de terceiros e não podem salvar arquivos localmente.
          </p>
          <p>
            Nossa missão é fornecer uma solução simples, segura e acessível para 
            guardar seus arquivos importantes, com a opção de expandir o armazenamento 
            conforme sua necessidade.
          </p>
          <div className="pt-8 mt-8 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Criado por
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                              <a 
                                href="https://www.linkedin.com/in/tchezery" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg text-gray-900 font-medium hover:text-blue-600 transition-colors"
                              >
                                Tchézery Ribeiro
                              </a>              <div className="flex gap-6 flex-wrap">
                <a
                  href="https://www.linkedin.com/in/tchezery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#0077b5] transition-colors group"
                >
                  <Linkedin className="h-5 w-5 text-[#0077b5] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/tchezery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#24292e] transition-colors group"
                >
                  <Github className="h-5 w-5 text-[#24292e] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="mailto:tchezeryribeiro@gmail.com"
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#ea4335] transition-colors group"
                >
                  <Mail className="h-5 w-5 text-[#ea4335] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Email</span>
                </a>
                <a
                  href="https://instagram.com/tchesery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#e4405f] transition-colors group"
                >
                  <Instagram className="h-5 w-5 text-[#e4405f] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
