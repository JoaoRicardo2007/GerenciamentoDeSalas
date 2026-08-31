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
           // ================= GALPÕES =================
            new() { Bloco = "Galpões", Pavimento = "Térreo", Nome = "Oficina de Mecânica", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Térreo", Nome = "Oficina de Automotiva", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Térreo", Nome = "Oficina de Usinagem", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Térreo", Nome = "Oficina de Automotiva", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Térreo", Nome = "Oficina de Ajustagem", Tipo = "Oficina", EstaOcupada = false },

            // ================= SENAI LAB =================
            new() { Bloco = "Senai Lab", Pavimento = "Térreo", Nome = "Laboratório de Inovação", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Senai Lab", Pavimento = "Térreo", Nome = "WebConferência", Tipo = "Laboratório", EstaOcupada = false },

            // ================= BLOCO A - TÉRREO =================
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 1", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 2 (Laboratorio de Informatica)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 3", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 4 (Laboratorio de Metrologia)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 5 (Laboratorio de Eletrohidraulica)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "Térreo", Nome = "Sala 6 (Laboratorio de Pneumatica)", Tipo = "Laboratório", EstaOcupada = false },

            // ================= BLOCO A - 1º ANDAR =================
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 7", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 8", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 9", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 10", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 11", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 12 (Laboratorio de Informatica)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 13", Tipo = "Teórica", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "1º Andar", Nome = "Sala 14", Tipo = "Teórica", EstaOcupada = false },

            // ================= BLOCO A - 2º ANDAR =================
            new() { Bloco = "A", Pavimento = "2º Andar", Nome = "Sala 15 (Laboratorio de Seguranca no Trabalho)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "A", Pavimento = "2º Andar", Nome = "Sala 16", Tipo = "Teórica", EstaOcupada = false }
        };

        context.Salas.AddRange(salas);
        context.SaveChanges();
    }
}