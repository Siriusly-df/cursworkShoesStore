namespace ShoesStoreBackend.DTOs
{
    public class OrderDto
    {
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }
        public string? GuestPhone { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int ProductSizeId { get; set; }
        public int Quantity { get; set; }
    }

    public class AdminOrderItemDto
    {
        public string ProductName { get; set; }
        public int Size { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderFullDto
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<AdminOrderItemDto> Items { get; set; } = new();
    }
    public class UpdateOrderStatusDto
    {
        public string Status { get; set; }
    }
}
