using System.ComponentModel.DataAnnotations;

namespace ShoeStore.Api.DTOs;

public class LoginDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Incorrect email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password required")]
    public string Password { get; set; } = string.Empty;
}