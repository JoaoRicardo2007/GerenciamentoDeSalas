using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SenaiControl.Data;
using SenaiControl.Models;
using SenaiControl.DTOs;

namespace SenaiControl.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalasController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalasController(AppDbContext context)
    {
        _context = context;
    }

    // LISTAR: Retorna todas as salas para popular a planta interativa
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sala>>> GetSalas()
    {
        return await _context.Salas.ToListAsync();
    }

    // ATUALIZAR STATUS: Ocupa ou libera a sala validando a senha
    [HttpPut("{id}/status")]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] StatusSalaRequest request)
    {
        var sala = await _context.Salas.FindAsync(id);

        if (sala == null) 
            return NotFound(new { message = "Sala não encontrada." });

        // Validação simples de senha (definida no Seed Data ou padrão '1234')
        if (sala.SenhaAcesso != request.Senha)
            return Unauthorized(new { message = "Senha incorreta." });

        try 
        {
            if (request.Ocupar)
            {
                // Regra para Ocupar
                sala.EstaOcupada = true;
                sala.DocenteAtual = request.DocenteAtual;
                sala.HorarioUso = DateTime.Now;
            }
            else
            {
                // Regra para Liberar
                sala.EstaOcupada = false;
                sala.DocenteAtual = null;
                sala.HorarioUso = null;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status atualizado com sucesso!", sala });
        }
        catch (Exception)
        {
            return StatusCode(500, "Erro interno ao salvar os dados.");
        }
    }
}