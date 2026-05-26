using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;
using System.Text.Json;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using static System.Net.Mime.MediaTypeNames;

namespace ShoeStore.Api.Services;

public class ProductService
{
    private readonly IProductRepository _repo;

    public ProductService(IProductRepository repo)
    {
        _repo = repo;
    }

    public object GetAll(
        int? categoryId,
        string? brand,
        string? gender,
        string? season,
        decimal? minPrice,
        decimal? maxPrice,
        string? sort
    )
    {
        var query = _repo.Query();

        if (categoryId.HasValue)
            query = query.Where(x => x.CategoryId == categoryId);

        if (!string.IsNullOrEmpty(brand))
            query = query.Where(x => x.Brand == brand);

        if (!string.IsNullOrEmpty(gender))
            query = query.Where(x => x.Gender == gender);

        if (!string.IsNullOrEmpty(season))
            query = query.Where(x => x.Season == season);

        if (minPrice.HasValue)
            query = query.Where(x => x.Price >= minPrice);

        if (maxPrice.HasValue)
            query = query.Where(x => x.Price <= maxPrice);

        query = sort switch
        {
            "priceAsc" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
            _ => query
        };

        return query.Select(x => new
        {
            x.Id,
            x.Name,
            x.Price,
            x.Image,
            x.Gender,
            x.Season,
            x.Brand
        }).ToList();
    }

    public object? GetById(int id)
    {
        var product = _repo.GetById(id);

        if (product == null)
            return null;

        var sizes = _repo.GetSizes(id);

        var images = _repo.GetImages(id);

        return new
        {
            product.Id,
            product.Name,
            product.Price,
            product.Material,
            product.Image,
            product.Description,
            product.Gender,
            product.Season,
            product.Brand,
            product.CategoryId,

            Images = images.Select(x => new
            {
                x.Id,
                x.ImageUrl
            }),
            Sizes = sizes.Select(x => new
            {
                x.Id,
                x.Size,
                x.Stock
            }),
        };
    }
    public async Task<Product?> Create( ProductDto dto, IFormFile mainImage,List<IFormFile> extraImages)
    {
        if (mainImage == null)
            return null;

        var folder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot/uploads/products"
        );

        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        var mainName = Guid.NewGuid() + Path.GetExtension(mainImage.FileName);
        var mainPath = Path.Combine(folder, mainName);

        using (var stream = new FileStream(mainPath, FileMode.Create))
        {
            await mainImage.CopyToAsync(stream);
        }

        var product = new Product
        {
            Name = dto.Name,
            Price = dto.Price,
            Material = dto.Material,
            Description = dto.Description,
            Gender = dto.Gender,
            Season = dto.Season,
            Brand = dto.Brand,
            CategoryId = dto.CategoryId,
            Image = "/uploads/products/" + mainName
        };

        await _repo.Add(product);
        await _repo.Save(); 

        if (extraImages != null)
        {
            foreach (var img in extraImages)
            {
                if (img == null || img.Length == 0)
                    continue;

                var name = Guid.NewGuid() + Path.GetExtension(img.FileName);
                var path = Path.Combine(folder, name);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await img.CopyToAsync(stream);
                }

                await _repo.AddImage(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = "/uploads/products/" + name
                });
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.Sizes))
        {
            var sizes = JsonSerializer.Deserialize<List<ProductSizeDto>>(
                dto.Sizes,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (sizes != null)
            {
                foreach (var s in sizes)
                {

                    await _repo.AddSize(new ProductSize
                    {
                        ProductId = product.Id,
                        Size = s.Size,
                        Stock = s.Stock
                    });
                }
            }
        }

        await _repo.Save();
        return product;
    }

    public async Task<List<ProductSearchDto>> Search(string search)
    {
        var query = _repo.Query();

        var q = search?.ToLower().Trim();

        if (!string.IsNullOrEmpty(q))
        {
            var keywords = q.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            query = query.Where(p =>
                keywords.All(k => p.Name.ToLower().Contains(k))
            );
        }

        return await query
            .Select(p => new ProductSearchDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Image = p.Image,
                Gender = p.Gender,
                Season = p.Season,
                Brand = p.Brand
            })
            .ToListAsync();
    }

    public async Task<bool> Delete(int id)
    {
        var product = _repo.GetById(id);

        if (product == null)
            return false;

        await _repo.Delete(product);

        return true;
    }
    public async Task<ProductResultDto?> Update(int id, ProductDto dto, IFormFile? mainImage, List<IFormFile>? extraImages)
    {
        var product = await _repo.GetByIdAsync(id);

        if (product == null)
            return null;

        var sizes = JsonSerializer.Deserialize<List<ProductSizeDto>>(dto.Sizes,new JsonSerializerOptions {PropertyNameCaseInsensitive = true});
        var existingSizes = _repo.GetSizes(product.Id);

        _repo.RemoveSizes(existingSizes);

        foreach (var s in sizes)
        {
            await _repo.AddSize(new ProductSize
            {
                ProductId = product.Id,
                Size = s.Size,
                Stock = s.Stock
            });
        }

        product.Name = dto.Name;
        product.Price = dto.Price;
        product.Material = dto.Material;
        product.Description = dto.Description;
        product.Brand = dto.Brand;
        product.CategoryId = dto.CategoryId;
        product.Gender = dto.Gender;
        product.Season = dto.Season;

        var folder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot/uploads/products"
        );

        if (mainImage != null)
        {
            if (!string.IsNullOrEmpty(product.Image))
            {
                var oldPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot", product.Image.TrimStart('/')
                );

                if (File.Exists(oldPath))
                {
                    File.Delete(oldPath);
                }
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(mainImage.FileName);
            var path = Path.Combine(folder, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await mainImage.CopyToAsync(stream);
            product.Image = "/uploads/products/" + fileName;
        }

        if (extraImages != null && extraImages.Count > 0)
        {
            foreach (var img in extraImages)
            {
                if (img == null || img.Length == 0)
                    continue;

                var name = Guid.NewGuid() + Path.GetExtension(img.FileName);
                var path = Path.Combine(folder, name);

                using var stream = new FileStream(path, FileMode.Create);
                await img.CopyToAsync(stream);

                await _repo.AddImage(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = "/uploads/products/" + name
                });
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.DeletedImageIds))
        {
            var ids = JsonSerializer.Deserialize<List<int>>(dto.DeletedImageIds)
                      ?? new List<int>();

            var images = _repo.GetImages(product.Id)
                .Where(x => ids.Contains(x.Id))
                .ToList();

            foreach (var img in images)
            {
                var path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    img.ImageUrl.TrimStart('/')
                );

                if (File.Exists(path))
                    File.Delete(path);
            }

            _repo.RemoveImages(images);
        }

        await _repo.Save();

            var sizesDb = _repo.GetSizes(product.Id);
            var imagesDb = _repo.GetImages(product.Id);

            return new ProductResultDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Material = product.Material,
                Description = product.Description,
                Brand = product.Brand,
                CategoryId = product.CategoryId,
                Gender = product.Gender,
                Season = product.Season,

                Sizes = sizesDb.Select(s => new ProductSizeDto
                {
                    Size = s.Size,
                    Stock = s.Stock
                }).ToList(),

                Images = imagesDb.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl
                }).ToList()
            };
    }
}

