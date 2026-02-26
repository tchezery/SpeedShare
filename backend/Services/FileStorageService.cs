using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

using backend.Models;
using backend.Data;
using System.Reflection.PortableExecutable;
using System.Data;

namespace backend.Services;

public class FileStorageService
{
    private readonly AppDbContext _context;

    public FileStorageService(AppDbContext context)
    {
        _context = context;
    }

    private async Task<string> ComputeHashAsync(IFormFile file)
    {
        using var sha = SHA256.Create();
        using var stream = file.OpenReadStream();
        var hash = await sha.ComputeHashAsync(stream);
        return Convert.ToHexString(hash).ToLower();
    }

    public async Task<FileBlob> GetOrCreateBlobAsync(IFormFile file)
    {
        var hash = await ComputeHashAsync(file);

        var existing = await _context.FileBlob
            .FirstOrDefaultAsync(b => b.Hash == hash);

        if (existing != null && System.IO.File.Exists(existing.StoragePath))
        {
            return existing;
        }

        var folder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "blob", hash[..2]);

        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }
        
        var path = Path.Combine(folder, hash);

        using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

        var blob = new FileBlob
        {
            Hash = hash,
            StoragePath = path,
            Size = file.Length
        };

        _context.FileBlob.Add(blob);
        await _context.SaveChangesAsync();

        return blob;
    } 

    public async Task<FileNode?> GetFileTreeAsync(string code)
    {
        var root = await _context.FileNode
            .FirstOrDefaultAsync(n => n.Name == code && n.ParentId == null);

        if (root == null)
        {
            return null;
        }

        await LoadChildrenRecursive(root);
        return root;
    }

    private async Task LoadChildrenRecursive(FileNode node)
    {
        node.Children = await _context.FileNode
            .Where(n => n.ParentId == node.Id)
            .ToListAsync();

        foreach (var child in node.Children)
        {
            await LoadChildrenRecursive(child);
        }
    }
}