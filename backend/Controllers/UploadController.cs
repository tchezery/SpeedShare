using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;

using backend.Data;
using backend.Models;
using backend.Services;
using System.Drawing;

[ApiController]
[Route("api/file")]
public class UploadController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly FileStorageService _fileStorageService;

    public UploadController(AppDbContext context, FileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    [HttpPost("uploadV2")]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
    public async Task<IActionResult> UploadV2(List<IFormFile> files, [FromForm] List<string> paths)
    {

        if (files == null || files.Count == 0)
        {
            return BadRequest("Nenhum arquivo identificado");
        }

        if (paths == null || paths.Count == 0)
        {
            return BadRequest("Arquivos e paths não correspondem");
        }

        long sizeLimit = 2147483648; // 2 GB
        long totalSize = files.Sum(f => f.Length);

        if (totalSize > sizeLimit)
        {
            return BadRequest($"O tamanho total dos arquivos excede o limite de 2 GB. Tamanho atual: {totalSize / 1024 / 1024} MB.");
        }

        string code = "";
        bool codeExists = true;
        var random = new Random();

        while (codeExists)
        {
            code = random.Next(1000, 10000).ToString();

            codeExists = await _context.FileNode
                .AnyAsync(n => n.Name == code && n.ParentId == null);
        }

        var root = new FileNode
        {
            Name = code,
            Type = "folder",
            ParentId = null,
            ExpiresAt = DateTime.UtcNow.AddDays(3)
        };

        _context.FileNode.Add(root);
        await _context.SaveChangesAsync();

        for (int i = 0; i < files.Count; i++)
        {
            var parts = paths[i]
                .Replace("\\", "/")
                .Split('/', StringSplitOptions.RemoveEmptyEntries);
                
            int? parentId = root.Id;

            // cria a estrturura de pastas
            for (int p = 0; p < parts.Length - 1; p++)
            {
                var folder = await GetOrCreateFolder(parts[p], parentId);
                parentId = folder.Id;
            }

            // salva o arquivo como blob
            var blob = await _fileStorageService.GetOrCreateBlobAsync(files[i]);

            // cria o node no banco
            var node = new FileNode
            {
                Name = parts[^1],
                Type = "file",
                ParentId = parentId,
                BlobId = blob.Id
            };

            _context.FileNode.Add(node);
        }

        await _context.SaveChangesAsync();
        
        return Ok(new
        {
            code = code
        });
    }

    private async Task<FileNode> GetOrCreateFolder(string name, int? parentId)
    {
        var folder = await _context.FileNode.FirstOrDefaultAsync(f => 
            f.Name == name &&
            f.ParentId == parentId &&
            f.Type == "folder"
        );

        if (folder != null)
        {
            return folder;
        }

        folder = new FileNode
        {
            Name = name,
            Type = "folder",
            ParentId = parentId
        };

        _context.FileNode.Add(folder);
        await _context.SaveChangesAsync();

        return folder;
    }

    [HttpGet("downloadV2/{code}")]
    public async Task<IActionResult> DownloadV2(string code, [FromQuery] bool zip = false)
    {
        var root = await _context.FileNode
            .FirstOrDefaultAsync(n => n.Name == code && n.ParentId == null);

        if (root == null)
        {
            return NotFound("Node não encontrado");
        }

        var children = await _context.FileNode
            .Where(n => n.ParentId == root.Id)
            .ToListAsync();

        // Arquivo único sem zip forçado → retorna o arquivo diretamente
        if (!zip && children.Count == 1 && children[0].Type == "file")
        {
            var fileNode = await _context.FileNode
                .Include(n => n.Blob)
                .FirstAsync(n => n.Id == children[0].Id);

            if (fileNode.Blob == null || !System.IO.File.Exists(fileNode.Blob.StoragePath))
            {
                return NotFound("Arquivo não encontrado no armazenamento.");
            }

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fileNode.Name, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var fileStream = System.IO.File.OpenRead(fileNode.Blob.StoragePath);
            return File(fileStream, contentType, fileNode.Name);
        }

        // Múltiplos arquivos ou zip forçado → retorna ZIP
        var memoryStream = new MemoryStream();

        using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
        {
            foreach (var child in children)
            {
                await AddNodeToZip(zipArchive, child, "");
            }
        }

        memoryStream.Position = 0;

        return File(
            memoryStream,
            "application/zip",
            $"DS-{root.Name}.zip"
        );
    }

    private async Task AddNodeToZip(ZipArchive zip, FileNode node, string currentPath)
    {
        var path = string.IsNullOrEmpty(currentPath) ? node.Name : $"{currentPath}/{node.Name}";

        if (node.Type == "file")
        {
            if (node.Blob == null)
            {
                node = await _context.FileNode
                    .Include(n => n.Blob)
                    .FirstAsync(n => n.Id == node.Id);
            }

            var entry = zip.CreateEntry(path);

            using var entryStream = entry.Open();

            if (!System.IO.File.Exists(node.Blob!.StoragePath)) return;
            
            using var fileStream = System.IO.File.OpenRead(node.Blob!.StoragePath);
            
            await fileStream.CopyToAsync(entryStream);
            return;
        }

        var children = await _context.FileNode
            .Where(n => n.ParentId == node.Id)
            .ToListAsync();

        foreach (var child in children)
        {
            await AddNodeToZip(zip, child, path);
        }
    }
}