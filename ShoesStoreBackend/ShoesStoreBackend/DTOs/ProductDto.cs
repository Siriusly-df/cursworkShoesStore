public class ProductDto
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Material { get; set; }
    public string Description { get; set; }
    public string Brand { get; set; }
    public int CategoryId { get; set; }
    public string Gender { get; set; }
    public string Season { get; set; }
    public string Sizes { get; set; }
    public string? DeletedImageIds { get; set; }
}

public class ProductSizeDto
{
    public int Size { get; set; }
    public int Stock { get; set; }
}

public class ProductSearchDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; }
    public string Gender { get; set; }
    public string Season { get; set; }
    public string Brand { get; set; }
}

public class ProductResultDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Material { get; set; }
    public string Description { get; set; }
    public string Brand { get; set; }
    public int CategoryId { get; set; }
    public string Gender { get; set; }
    public string Season { get; set; }

    public List<ProductSizeDto> Sizes { get; set; }
    public List<ProductImageDto> Images { get; set; }
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }
}