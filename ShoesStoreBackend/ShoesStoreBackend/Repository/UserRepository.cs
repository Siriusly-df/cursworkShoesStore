using ShoeStore.Api.Data;
using ShoeStore.Api.Models;
using ShoeStore.Api.Repository.Interfaces;

namespace ShoeStore.Api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool ExistsByEmail(string email)
        {
            return _context.Users.Any(x => x.Email == email);
        }

        public User? GetByEmail(string email)
        {
            return _context.Users
                .FirstOrDefault(x => x.Email == email);
        }

        public User? GetByRefreshToken(string token)
        {
            return _context.Users
                .FirstOrDefault(x => x.RefreshToken == token);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
        }
        public void Delete(User user)
        {
            _context.Users.Remove(user);
        }

        public User? GetById(int id)
        {
            return _context.Users
                .FirstOrDefault(x => x.Id == id);
        }
        public bool ExistsByEmailForUser(string email, int userId)
        {
            return _context.Users.Any(x => x.Email == email && x.Id != userId);
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}