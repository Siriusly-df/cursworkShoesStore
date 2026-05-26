using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repositories.Interfaces;

namespace ShoeStore.Api.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Category> GetAll()
        => _context.Categories.ToList();

    public Category? GetById(int id)
        => _context.Categories.FirstOrDefault(x => x.Id == id);

    public void Create(Category category)
        => _context.Categories.Add(category);

    public async Task SaveAsync()
        => await _context.SaveChangesAsync();
}