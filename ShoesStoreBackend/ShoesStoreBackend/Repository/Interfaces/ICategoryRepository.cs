using ShoeStore.Api.Models;

namespace ShoeStore.Api.Repositories.Interfaces;

public interface ICategoryRepository
{
    List<Category> GetAll();
    Category? GetById(int id);
    void Create(Category category);
    Task SaveAsync();
}