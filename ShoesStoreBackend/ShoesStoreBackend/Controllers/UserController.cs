using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoeStore.Api.DTOs;
using ShoeStore.Api.Services;
using System.Security.Claims;

namespace ShoeStore.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var result = _userService.GetMe(int.Parse(userId));

        if (result == null)
            return Unauthorized();

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("delete")]
    public IActionResult DeleteAccount()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        _userService.DeleteUser(int.Parse(userId));

        return Ok(new { success = true });
    }

    [HttpPut("me")]
    public IActionResult UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var success = _userService.UpdateProfile(userId, dto, out var message);

        if (!success)
            return BadRequest(new { success = false, message });

        return Ok(new { success = true, message });
    }
}