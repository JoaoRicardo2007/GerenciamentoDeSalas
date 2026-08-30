using SenaiControl.Models;

namespace SenaiControl.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Salas.Any()) return;

        var salas = new Sala[]
        {
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Oficina Mecânica", Tipo = "Galpão", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Lab Info 01", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "B", Pavimento = "2º Andar", Nome = "Sala 204", Tipo = "Teórica", EstaOcupada = false }
        };

        context.Salas.AddRange(salas);
        context.SaveChanges();
    }
}