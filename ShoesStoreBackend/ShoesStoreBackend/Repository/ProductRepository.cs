using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Repository;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }
    public IQueryable<Product> Query()
    {
        return _context.Products.AsQueryable();
    }
    public Product? GetById(int id)
    {
        return _context.Products
            .AsTracking()
            .FirstOrDefault(x => x.Id == id);
    }
    public List<ProductSize> GetSizes(int productId)
    {
        return _context.ProductSizes
            .Where(x => x.ProductId == productId)
            .ToList();
    }
    public async Task Add(Product product)
    {
        await _context.Products.AddAsync(product);
    }
    public async Task AddImage(ProductImage image)
    {
        await _context.ProductImages.AddAsync(image);
    }
    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .AsTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }
    public List<ProductImage> GetImages(int productId)
    {
        return _context.ProductImages
            .Where(x => x.ProductId == productId)
            .ToList();
    }
    public async Task AddSize(ProductSize size)
    {
        await _context.ProductSizes.AddAsync(size);
    }
    public void RemoveSizes(List<ProductSize> sizes)
    {
        _context.ProductSizes.RemoveRange(sizes);
    }
    public void RemoveImages(List<ProductImage> images)
    {
        _context.ProductImages.RemoveRange(images);
    }
    public async Task Delete(Product product)
    {
        _context.Products.Remove(product);

        await _context.SaveChangesAsync();
    }
    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}