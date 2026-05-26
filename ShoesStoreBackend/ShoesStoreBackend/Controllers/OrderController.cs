using Microsoft.AspNetCore.Mvc;
using ShoesStoreBackend.DTOs;
using ShoesStoreBackend.Services;
using System.Security.Claims;

namespace ShoesStoreBackend.Controllers;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly OrderService _service;

    public OrderController(OrderService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Create(OrderDto dto)
    {
        int? userId = null;

        var claim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim != null)
        {
            userId = int.Parse(claim.Value);
        }

        _service.CreateOrder(dto, userId);

        return Ok(new
        {
            success = true
        });
    }
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAllOrders());
    }

    [HttpPatch("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var result = _service.UpdateStatus(id, dto.Status);

        if (!result)
            return NotFound();

        return Ok(new { success = true });
    }
    [HttpGet("my")]
    public IActionResult GetMyOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        return Ok(_service.GetUserOrders(userId));
    }
}