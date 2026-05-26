using ShoeStore.Api.Models;

public class Order
{
    public int Id { get; set; }
    public int? UserId { get; set; }      
    public User? User { get; set; }       
    public string? GuestEmail { get; set; }
    public string? GuestName { get; set; }
    public string? GuestPhone { get; set; }
    public string Status { get; set; } = "New";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> OrderItems { get; set; } = new();
}