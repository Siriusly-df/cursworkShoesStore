using Microsoft.AspNetCore.Mvc;
using ShoeStore.Api.DTOs;
using ShoeStore.Api.Services;

namespace ShoeStore.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var result = _authService.Register(dto);

        if (result.Error != null)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var result = _authService.Login(dto);

        if (result.Error != null)
            return BadRequest(result);

        Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
        });

        return Ok(result);
    }

    [HttpPost("refresh")]
    public IActionResult Refresh()
    {
        var token = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return Unauthorized();

        var result = _authService.Refresh(token);

        if (result == null)
            return Unauthorized();

        return Ok(result);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var token = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(token))
            _authService.Logout(token);

        Response.Cookies.Delete("refreshToken");

        return Ok(new { success = true });
    }
}