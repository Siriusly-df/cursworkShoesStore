namespace ShoeStore.Api.Models;

public class ProductSize
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Size { get; set; }
    public int Stock { get; set; }
}