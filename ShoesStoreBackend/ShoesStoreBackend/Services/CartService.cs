using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Services;

public class CartService
{
    private readonly ICartRepository _repo;

    public CartService(ICartRepository repo)
    {
        _repo = repo;
    }

    public object GetCartItems(List<CartDto> items)
    {
        var ids = items.Select(x => x.ProductId).ToList();

        var products = _repo.GetProducts(ids);

        var result = items.Select(i =>
        {
            var product = products.FirstOrDefault(x => x.Id == i.ProductId);

            if (product == null) return null;

            var size = _repo.GetProductSize(i.ProductSizeId);

            if (size == null) return null;

            return new
            {
                productId = product.Id,
                productSizeId = size.Id,
                name = product.Name,
                price = product.Price,
                image = product.Image,
                size = size.Size,   
                qty = i.Qty
            };
        }).Where(x => x != null);

        return result;
    }
}