using ShoesStoreBackend.DTOs;
using ShoeStore.Api.Models;

namespace ShoesStoreBackend.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public void CreateOrder(OrderDto dto, int? userId)
        {
            var order = new Order();

            if (userId != null)
            {
                order.UserId = userId;
            }
            else
            {
                if (string.IsNullOrWhiteSpace(dto.GuestName) ||
                    string.IsNullOrWhiteSpace(dto.GuestEmail) ||
                    string.IsNullOrWhiteSpace(dto.GuestPhone))
                {
                    throw new Exception("Заповніть дані ");
                }

                order.GuestName = dto.GuestName.Trim();
                order.GuestEmail = dto.GuestEmail.Trim();
                order.GuestPhone = dto.GuestPhone.Trim();
            }

            _repo.AddOrder(order);
            _repo.Save(); 

            foreach (var item in dto.Items)
            {
                var size = _repo.GetProductSize(item.ProductSizeId);

                if (size == null)
                    continue;

                if (size.Stock < item.Quantity)
                    continue;

                size.Stock -= item.Quantity;

                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductSizeId = size.Id,
                    Quantity = item.Quantity,
                    Price = size.Product.Price
                };
                _repo.AddOrderItem(orderItem);
            }

            _repo.Save(); 
        }

        public List<OrderFullDto> GetAllOrders()
        {
            var orders = _repo.GetAllWithItems();

            return orders.Select(o => new OrderFullDto
            {
                Id = o.Id,

                UserName = o.User != null
                    ? o.User.Name
                    : o.GuestName,

                Email = o.User != null
                    ? o.User.Email
                    : o.GuestEmail,

                Phone = o.User != null
                    ? o.User.Phone
                    : o.GuestPhone,

                Status = o.Status.ToString(),

                CreatedAt = o.CreatedAt,

                Total = o.OrderItems.Sum(x => x.Price * x.Quantity),

                Items = o.OrderItems.Select(i => new AdminOrderItemDto
                {
                    ProductName = i.ProductSize.Product.Name,
                    Size = i.ProductSize.Size,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            }).ToList();
        }
        public bool UpdateStatus(int id, string status)
        {
            var order = _repo.GetById(id);

            if (order == null)
                return false;

            order.Status = status;

            _repo.Save();

            return true;
        }
        public List<OrderFullDto> GetUserOrders(int userId)
        {
            var orders = _repo.GetAllWithItems()
                .Where(o => o.UserId == userId)
                .ToList();

            return orders.Select(o => new OrderFullDto
            {
                Id = o.Id,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,

                Total = o.OrderItems.Sum(x => x.Price * x.Quantity),

                Items = o.OrderItems.Select(i => new AdminOrderItemDto
                {
                    ProductName = i.ProductSize.Product.Name,
                    Size = i.ProductSize.Size,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            }).ToList();
        }
    }
}