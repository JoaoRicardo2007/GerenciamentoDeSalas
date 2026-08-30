namespace SenaiControl.Models;

public class Sala
{
    public int Id { get; set; }
    public string Bloco { get; set; } = string.Empty;
    public string Pavimento { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty; // Sala, Lab, Galpão
    public bool EstaOcupada { get; set; }
    public string? DocenteAtual { get; set; }
    public DateTime? HorarioUso { get; set; }
    public string SenhaAcesso { get; set; } = "1234";
}