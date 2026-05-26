using ShoeStore.Api.DTOs;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Services;

public class UserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo)
    {
        _repo = repo;
    }

    public object? GetMe(int userId)
    {
        var user = _repo.GetById(userId);

        if (user == null)
            return null;

        return new
        {
            user.Id,
            user.Name,
            user.Email,
            user.Phone,
            user.Role,
            user.CreatedAt
        };
    }

    public void DeleteUser(int userId)
    {
        var user = _repo.GetById(userId);

        if (user == null) return;

        _repo.Delete(user);
        _repo.Save();
    }

    public bool UpdateProfile(int userId, UpdateProfileDto dto, out string message)
    {
        var user = _repo.GetById(userId);

        if (user == null)
        {
            message = "Користувача не знайдено";
            return false;
        }

        var name = dto.Name?.Trim();
        var email = dto.Email?.Trim().ToLower();
        var phone = dto.Phone?.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            message = "Ім'я не може бути порожнім";
            return false;
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            message = "Email не може бути порожнім";
            return false;
        }

        if (string.IsNullOrWhiteSpace(phone))
        {
            message = "Номер телефонe не може бути порожнім";
            return false;
        }

        if (_repo.ExistsByEmailForUser(email, userId))
        {
            message = "Email вже використовується";
            return false;
        }

        if (!string.IsNullOrWhiteSpace(dto.Password) && dto.Password.Length < 6)
        {
            message = "Пароль мінімум 6 символів";
            return false;
        }

        user.Name = name;
        user.Email = email;
        user.Phone = phone;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        _repo.Update(user);
        _repo.Save();

        message = "Профіль оновлено";
        return true;
    }
}