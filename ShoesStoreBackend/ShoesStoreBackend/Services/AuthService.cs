using BCrypt.Net;
using ShoeStore.Api.DTOs;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Services;

public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly TokenService _tokenService;

    public AuthService(IUserRepository userRepo, TokenService tokenService)
    {
        _userRepo = userRepo;
        _tokenService = tokenService;
    }

    public AuthResultDto Register(RegisterDto dto)
    {
        if (_userRepo.ExistsByEmail(dto.Email))
        {
            return new AuthResultDto
            {
                Error = "Користувач вже існує"
            };
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User"
        };

        _userRepo.Add(user);
        _userRepo.Save();

        return new AuthResultDto
        {
            User = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }
        };
    }

    public AuthResultDto Login(LoginDto dto)
    {
        var user = _userRepo.GetByEmail(dto.Email);

        if (user == null)
        {
            return new AuthResultDto
            {
                Error = "Користувача не знайдено"
            };
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return new AuthResultDto
            {
                Error = "Невірний пароль"
            };
        }

        var accessToken = _tokenService.CreateAccessToken(user);
        var refreshToken = _tokenService.CreateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        _userRepo.Update(user);
        _userRepo.Save();

        return new AuthResultDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }
        };
    }

    public AuthResultDto? Refresh(string refreshToken)
    {
        var user = _userRepo.GetByRefreshToken(refreshToken);

        if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
            return null;

        var newAccessToken = _tokenService.CreateAccessToken(user);

        return new AuthResultDto
        {
            AccessToken = newAccessToken,
            RefreshToken = refreshToken,
            User = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }
        };
    }

    public void Logout(string refreshToken)
    {
        var user = _userRepo.GetByRefreshToken(refreshToken);

        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            _userRepo.Update(user);
            _userRepo.Save();
        }
    }
}