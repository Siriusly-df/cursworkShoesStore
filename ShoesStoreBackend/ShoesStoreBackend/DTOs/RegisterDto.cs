using System.ComponentModel.DataAnnotations;

namespace ShoeStore.Api.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Ім'я обов'язкове")]
    [MinLength(2, ErrorMessage = "Ім'я має містити мінімум 2 символи")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email обов'язковий")]
    [EmailAddress(ErrorMessage = "Невірний формат email")]
    [StringLength(100, ErrorMessage = "Email не може перевищувати 100 символів")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Пароль обов'язковий")]
    [MinLength(6, ErrorMessage = "Пароль має містити мінімум 6 символів")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Телефон обов'язковий")]
    public string Phone { get; set; } = string.Empty;
}