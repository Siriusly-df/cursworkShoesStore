namespace ShoeStore.Api.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductSizeId { get; set; }
    public ProductSize ProductSize { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

