namespace ShoeStore.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public string Material { get; set; } = null!;
    public string Image { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Gender { get; set; } = null!;
    public string Season { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public List<ProductImage> Images { get; set; } = new();
}