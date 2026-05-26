using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.Models;

namespace ShoeStore.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Кросівки", Image = "/uploads/categories/sneakers.jpg" },
            new Category { Id = 2, Name = "Чоботи", Image = "/uploads/categories/boots.jpg" },
            new Category { Id = 3, Name = "Туфлі", Image = "/uploads/categories/dress-shoes.jpg" },
            new Category { Id = 4, Name = "Босоніжки", Image = "/uploads/categories/sandals.jpg" }
        );
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}