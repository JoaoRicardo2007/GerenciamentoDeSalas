namespace SenaiControl.DTOs;

// Usamos 'record' por ser mais leve e ideal para transferência de dados (C# 9+)
public record StatusSalaRequest(
    string Senha, 
    string? Turma,
    string? HorarioInicio,
    string? HorarioFim,
    string? DocenteAtual, 
    bool Ocupar
);