using ShoeStore.Api.Models;

public interface IOrderRepository
{
    void AddOrder(Order order);
    void AddOrderItem(OrderItem item);

    ProductSize? GetProductSize(int id);
    List<Order> GetAllWithItems();
    Order? GetById(int id);
    void Save();
}