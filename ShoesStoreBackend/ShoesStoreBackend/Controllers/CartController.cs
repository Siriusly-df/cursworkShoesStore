using Microsoft.AspNetCore.Mvc;
using ShoeStore.Api.Services;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly CartService _service;

    public CartController(CartService service)
    {
        _service = service;
    }

    [HttpPost("items")]
    public IActionResult GetCartItems([FromBody] List<CartDto> items)
    {
        var result = _service.GetCartItems(items);
        return Ok(result);
    }
}