using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using ShoeStore.Api.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace ShoeStore.Api.Services;

public class CategoryService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public CategoryService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public List<CategoryDto> GetAll()
    {
        return _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Image = c.Image,
                Brands = _context.Products
                .Where(p => p.CategoryId == c.Id)
                .Select(p => p.Brand)
                .Distinct()
                .ToList()
            })
            .ToList();
    }

    public Category? GetById(int id)
    {
        return _context.Categories.FirstOrDefault(x => x.Id == id);
    }

    public async Task Create(string name, IFormFile image)
    {
        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/categories");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        var category = new Category
        {
            Name = name,
            Image = "/uploads/categories/" + fileName
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
    }
}