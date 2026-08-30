namespace SenaiControl.DTOs;

// Usamos 'record' por ser mais leve e ideal para transferência de dados (C# 9+)
public record StatusSalaRequest(
    string Senha, 
    string? DocenteAtual, 
    bool Ocupar
);