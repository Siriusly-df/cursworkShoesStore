namespace ShoeStore.Api.DTOs
{
    public class AuthResultDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public object User { get; set; } = new();
        public string? Error { get; set; }
    }

    public class UpdateProfileDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Password { get; set; }
    }
}