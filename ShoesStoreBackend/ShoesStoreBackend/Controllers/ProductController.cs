using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.Services;

namespace ShoeStore.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly ProductService _service;

    public ProductController(ProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll(
        [FromQuery] int? categoryId,
        [FromQuery] string? brand,
        [FromQuery] string? gender,
        [FromQuery] string? season,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sort
    )
    {
        var result = _service.GetAll(
            categoryId, brand, gender,
            season, minPrice, maxPrice, sort
        );

        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var result = _service.GetById(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromForm] ProductDto dto,
        [FromForm] IFormFile mainImage,
        [FromForm] List<IFormFile> extraImages
    )
    {
        var result = await _service.Create(dto, mainImage, extraImages);

        if (result == null)
            return BadRequest("Image is required");

        return Ok(new
        {
            result.Id,
            result.Name,
            result.Price,
            result.Image
        });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts(string search)
    {
        var result = await _service.Search(search);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.Delete(id);

        if (!deleted)
            return NotFound();

        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromForm] ProductDto dto,
        [FromForm] IFormFile? mainImage,
        [FromForm] List<IFormFile>? extraImages
    )
    {
        var result = await _service.Update(id, dto, mainImage, extraImages);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
}