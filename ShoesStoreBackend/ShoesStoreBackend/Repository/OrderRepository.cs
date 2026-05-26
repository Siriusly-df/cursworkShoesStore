using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using Microsoft.EntityFrameworkCore;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;


    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public void AddOrder(Order order)
    {
        _context.Orders.Add(order);
    }

    public void AddOrderItem(OrderItem item)
    {
        _context.OrderItems.Add(item);
    }

    public ProductSize? GetProductSize(int id)
    {
        return _context.ProductSizes
            .Include(x => x.Product)
            .FirstOrDefault(x => x.Id == id);
    }

    public List<Order> GetAllWithItems()
    {
        return _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.ProductSize)
                    .ThenInclude(ps => ps.Product)
            .ToList();
    }
    public Order? GetById(int id)
    {
        return _context.Orders
            .FirstOrDefault(x => x.Id == id);
    }

    public List<Order> GetByUserId(int userId)
    {
        return _context.Orders
            .Where(x => x.UserId == userId)
            .ToList();
    }

    public void Remove(Order order)
    {
        _context.Orders.Remove(order);
    }

    public void RemoveRange(IEnumerable<Order> orders)
    {
        _context.Orders.RemoveRange(orders);
    }

    public void Save()
    {
        _context.SaveChanges();
    }
}