namespace ShoeStore.Api.Models.DTO;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Image { get; set; } = null!;
    public List<string> Brands { get; set; } = new();
}