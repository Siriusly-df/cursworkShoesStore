using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Repository;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Product> GetProducts(List<int> ids)
    {
        return _context.Products
            .Where(x => ids.Contains(x.Id))
            .ToList();
    }

    public ProductSize? GetProductSize(int id)
    {
        return _context.ProductSizes
            .FirstOrDefault(x => x.Id == id);
    }
}