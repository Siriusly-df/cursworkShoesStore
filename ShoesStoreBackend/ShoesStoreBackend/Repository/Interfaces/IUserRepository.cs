using ShoeStore.Api.Models;

public interface IUserRepository
{
    bool ExistsByEmail(string email);
    bool ExistsByEmailForUser(string email, int userId);
    User? GetByEmail(string email);
    User? GetByRefreshToken(string token);
    User? GetById(int id);
    void Delete(User user);
    void Add(User user);
    void Update(User user);
    void Save();
}