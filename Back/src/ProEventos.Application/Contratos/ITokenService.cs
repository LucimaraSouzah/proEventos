using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface ITokenService
    {
        Task<string> CreateToken(UserUpdateDto userUpdateDto);
    }
}