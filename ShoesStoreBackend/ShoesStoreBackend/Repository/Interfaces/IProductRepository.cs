using ShoeStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ShoeStore.Api.Repository.Interfaces;

public interface IProductRepository
{
    IQueryable<Product> Query();
    Task<Product?> GetByIdAsync(int id);
    Product? GetById(int id);
    List<ProductSize> GetSizes(int productId);
    Task Add(Product product);
    Task AddSize(ProductSize size);
    void RemoveSizes(List<ProductSize> sizes);
    Task AddImage(ProductImage image);
    List<ProductImage> GetImages(int productId);
    void RemoveImages(List<ProductImage> images);
    Task Delete(Product product);
    Task Save();
}