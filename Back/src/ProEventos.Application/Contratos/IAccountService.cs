using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface IAccountService
    {
        Task<bool> UserExists(string userName);
        Task<UserUpdateDto> GetUserByUserNameAsync (string userName);
        Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password);
        Task<UserDto> CreateAccountAsync (UserDto userDto);
        Task<UserUpdateDto> UpdateAccount (UserUpdateDto userUpdateDto);

    }
}