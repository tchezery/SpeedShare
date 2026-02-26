import { useState, useEffect } from 'react'
import { X, Folder, File as FileIcon, Download, ChevronRight, ChevronDown, FileJson, FileCode, FileImage, FileText } from 'lucide-react'
import { FileNode } from '../types/dtos'
import { fileService } from '../services/fileService'
import Button from './Button'

interface FileBrowserModalProps {
  code: string
  onClose: () => void
  onDownload: (asZip: boolean) => void
}

// Helper to render file icons based on extension
const getFileIcon = (name: string, className: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'json': return <FileJson className={className} color="#f1c40f" />
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx': return <FileCode className={className} color="#3498db" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg': return <FileImage className={className} color="#e74c3c" />
    case 'txt':
    case 'md': return <FileText className={className} color="#95a5a6" />
    default: return <FileIcon className={className} color="#bdc3c7" />
  }
}

const FileRow = ({ node, level, onToggle }: { node: FileNode, level: number, onToggle: (path: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isFolder = node.type === 'folder'
  
  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen)
      onToggle(node.path)
    }
  }

  const paddingLeft = `${level * 1.5}rem`

  return (
    <>
      <div 
        className={`
          flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer text-sm font-mono
          ${isOpen ? 'text-white' : 'text-[#cccccc]'}
        `}
        style={{ paddingLeft }}
        onClick={handleToggle}
      >
        <div className="w-5 flex-shrink-0 mr-1 flex items-center justify-center">
          {isFolder && (
            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </div>
        <div className="mr-2">
          {isFolder ? (
            <Folder className={`w-4 h-4 ${isOpen ? 'text-blue-400' : 'text-blue-300'}`} />
          ) : (
            getFileIcon(node.name, "w-4 h-4")
          )}
        </div>
        <span className="truncate flex-1">{node.name}</span>
        {!isFolder && node.size && (
          <span className="text-xs text-gray-500 ml-4">
            {(node.size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileRow key={child.path} node={child} level={level + 1} onToggle={onToggle} />
          ))}
        </div>
      )}
    </>
  )
}

export default function FileBrowserModal({ code, onClose, onDownload }: FileBrowserModalProps) {
  const [structure, setStructure] = useState<FileNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const topLevelChildren = structure?.children ?? []
  const isSingleFile = !loading && topLevelChildren.length === 1 && topLevelChildren[0].type === 'file'

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const data = await fileService.getFileInfo(code)
        setStructure(data)
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar a estrutura de arquivos.')
      } finally {
        setLoading(false)
      }
    }
    fetchStructure()
  }, [code])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#1e1e1e] rounded-lg w-full max-w-3xl h-[600px] flex flex-col shadow-2xl overflow-hidden border border-[#333]">
        
        {/* VSCode Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#1e1e1e]">
          <div className="flex items-center space-x-2">
            <span className="text-[#cccccc] text-xs uppercase tracking-wider font-semibold">Explorer</span>
          </div>
          <div className="flex items-center space-x-2">
             <div className="text-[#cccccc] text-xs mr-4 bg-[#007acc] px-2 py-0.5 rounded text-white">
               CODE: {code}
             </div>
             <button onClick={onClose} className="text-[#cccccc] hover:text-white">
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* VSCode Content */}
        <div className="flex-1 overflow-auto p-2 font-mono">
          {loading ? (
             <div className="flex items-center justify-center h-full text-[#cccccc]">
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#007acc] mr-2"></div>
               Carregando estrutura...
             </div>
          ) : (
            <>
              {error && (
                <div className="mb-2 p-2 bg-red-900/30 text-red-200 text-xs border border-red-700/50 rounded">
                  ERRO: {error}
                </div>
              )}
              <div className="select-none">
                {structure && (
                  structure.name === 'root' && structure.children ? (
                    structure.children.map(child => (
                      <FileRow key={child.path} node={child} level={0} onToggle={() => {}} />
                    ))
                  ) : (
                    <FileRow node={structure} level={0} onToggle={() => {}} />
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#252526] border-t border-[#1e1e1e] flex justify-end items-center space-x-3">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] h-8 text-sm"
          >
            Cancel
          </Button>
          {isSingleFile && (
            <Button
              onClick={() => onDownload(true)}
              variant="ghost"
              className="text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] h-8 text-sm px-4 rounded-sm flex items-center border border-[#555]"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar como ZIP
            </Button>
          )}
          <Button
            onClick={() => onDownload(false)}
            className="bg-[#007acc] hover:bg-[#0062a3] text-white h-8 text-sm px-4 rounded-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            {isSingleFile ? 'Download' : 'Download ZIP'}
          </Button>
        </div>
      </div>
    </div>
  )
}
