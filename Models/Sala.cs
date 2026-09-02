using System.ComponentModel.DataAnnotations;

namespace SenaiControl.Models;

public class Sala
{
    public int Id { get; set; }
    
    [Required]
    public string Bloco { get; set; } = string.Empty;
    
    [Required]
    public string Pavimento { get; set; } = string.Empty;
    
    [Required]
    public string Nome { get; set; } = string.Empty;
    
    public string Tipo { get; set; } = string.Empty; // Sala, Laboratório, Oficina
    
    public bool EstaOcupada { get; set; } // Nome padronizado
    
    public string? DocenteAtual { get; set; }

    public string? Turma { get; set; }

    public string? HorarioInicio { get; set; }

    public string? HorarioFim { get; set; }
    
    public DateTime? HorarioUso { get; set; } // Nome padronizado

    [Required]
    public string SenhaAcesso { get; set; } = "1234";
}