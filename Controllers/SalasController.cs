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
                if (string.IsNullOrWhiteSpace(request.DocenteAtual) ||
                    string.IsNullOrWhiteSpace(request.Turma) ||
                    string.IsNullOrWhiteSpace(request.HorarioInicio) ||
                    string.IsNullOrWhiteSpace(request.HorarioFim))
                {
                    return BadRequest(new { message = "Informe docente, turma e horário de uso." });
                }

                if (!TimeOnly.TryParse(request.HorarioInicio, out var horarioInicio) ||
                    !TimeOnly.TryParse(request.HorarioFim, out var horarioFim))
                {
                    return BadRequest(new { message = "Informe um horário válido." });
                }

                if (horarioFim <= horarioInicio)
                {
                    return BadRequest(new { message = "O horário final deve ser maior que o inicial." });
                }

                // Regra para Ocupar
                sala.EstaOcupada = true;
                sala.DocenteAtual = request.DocenteAtual.Trim();
                sala.Turma = request.Turma.Trim();
                sala.HorarioInicio = request.HorarioInicio.Trim();
                sala.HorarioFim = request.HorarioFim.Trim();
                sala.HorarioUso = DateTime.Now;
            }
            else
            {
                // Regra para Liberar
                sala.EstaOcupada = false;
                sala.DocenteAtual = null;
                sala.Turma = null;
                sala.HorarioInicio = null;
                sala.HorarioFim = null;
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