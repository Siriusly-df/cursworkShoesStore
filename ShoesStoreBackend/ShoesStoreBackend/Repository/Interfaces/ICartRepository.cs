using ShoeStore.Api.Models;

namespace ShoeStore.Api.Repository.Interfaces;

public interface ICartRepository
{
    List<Product> GetProducts(List<int> ids);

    ProductSize? GetProductSize(int id);
}