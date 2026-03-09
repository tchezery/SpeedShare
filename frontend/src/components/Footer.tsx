export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-gray-200 py-8 text-xs text-gray-500">
      <div className="w-[95%] max-w-[1304px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <p>
            Copyright © {new Date().getFullYear()} Speed Share. Todos os direitos reservados.
          </p>
          <div className="mt-2 md:mt-0 space-x-4">
            <a href="#" className="hover:underline">Política de Privacidade</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
