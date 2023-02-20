using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PalestranteController : ControllerBase
{
    private readonly IPalestranteService _palestranteService;
    private readonly IWebHostEnvironment _hostEnvironment;

    private readonly IAccountService _accountService;

    public PalestranteController(IPalestranteService palestranteService, IWebHostEnvironment hostEnvironment, IAccountService accountService)
    {
        _hostEnvironment = hostEnvironment;
        _palestranteService = palestranteService;
        _accountService = accountService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll([FromQuery] PageParams pageParams)
    {
        try
        {
            var palestrantes = await _palestranteService.GetAllPalestrantesAsync(pageParams, true);
            if (palestrantes == null) return NoContent();

            Response.AddPagination(palestrantes.CurrentPage, palestrantes.PageSize, palestrantes.TotalCount, palestrantes.TotalPages);

            return Ok(palestrantes);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar palestrantes. Erro: {ex.Message}");
        }

    }

    [HttpGet()]
    public async Task<IActionResult> GetPalestrantes()
    {
        try
        {
            var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), true);

            if (palestrante == null) return NoContent();

            return Ok(palestrante);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar palestrantes. Erro: {ex.Message}");
        }

    }

    [HttpPost]
    public async Task<IActionResult> Post(PalestranteAddDto model)
    {
        try
        {
            var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), false);

            if (palestrante == null)
                palestrante = await _palestranteService.AddPalestrantes(User.GetUserId(), model);

            return Ok(palestrante);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.InnerException.Message);
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar palestrante. Erro: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, PalestranteUpdateDto model)
    {
        try
        {
            var palestrante = await _palestranteService.UpdatePalestrante(User.GetUserId(), model);
            if (palestrante == null) return NoContent();

            return Ok(palestrante);
        }
        catch (Exception ex)
        {

            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar palestrante. Erro: {ex.Message}");
        }
    }
}
