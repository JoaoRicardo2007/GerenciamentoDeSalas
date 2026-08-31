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
            // O campo Pavimento aqui guarda o nome da oficina (galpão) —
            // é o mesmo mecanismo usado no Bloco A para agrupar por andar,
            // então o front-end já exibe cada oficina como um grupo com
            // suas salas dentro, sem precisar de nenhuma mudança lá.

            // Oficina de Manutenção
            new() { Bloco = "Galpões", Pavimento = "Oficina de Manutenção", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Manutenção", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Manutenção", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },

            // Oficina de Automotiva
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Sala D", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Sala E", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Sala F", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Automotiva", Nome = "Laboratório de Automotiva", Tipo = "Laboratório", EstaOcupada = false },

            // Oficina de Usinagem
            new() { Bloco = "Galpões", Pavimento = "Oficina de Usinagem", Nome = "Laboratório de Informática 1", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Usinagem", Nome = "Laboratório de Informática 2", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Usinagem", Nome = "Laboratório Tridimensional", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Usinagem", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },

            // Oficina de Metalurgia (era a "Automotiva" duplicada)
            new() { Bloco = "Galpões", Pavimento = "Oficina de Metalurgia", Nome = "Setor de Simuladores de Solda", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Metalurgia", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Metalurgia", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },

            // Oficina de Ajustagem
            new() { Bloco = "Galpões", Pavimento = "Oficina de Ajustagem", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Ajustagem", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Ajustagem", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Ajustagem", Nome = "Laboratório de Motocicleta", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpões", Pavimento = "Oficina de Ajustagem", Nome = "Laboratório de Colorimetria 02", Tipo = "Laboratório", EstaOcupada = false },

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