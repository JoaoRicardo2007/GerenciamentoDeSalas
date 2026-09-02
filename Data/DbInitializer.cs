using System.Data;
using Microsoft.EntityFrameworkCore;
using SenaiControl.Models;

namespace SenaiControl.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();
        GarantirColunasAdicionais(context);
        GarantirSalasIniciais(context);
    }

    private static void GarantirColunasAdicionais(AppDbContext context)
    {
        AdicionarColunaSeNecessario(context, "Turma", "TEXT NULL");
        AdicionarColunaSeNecessario(context, "HorarioInicio", "TEXT NULL");
        AdicionarColunaSeNecessario(context, "HorarioFim", "TEXT NULL");
    }

    private static void AdicionarColunaSeNecessario(AppDbContext context, string nomeColuna, string definicaoSql)
    {
        if (ColunaExiste(context, nomeColuna)) return;

        if (nomeColuna == "Turma")
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Salas ADD COLUMN Turma TEXT NULL;");
            return;
        }

        if (nomeColuna == "HorarioInicio")
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Salas ADD COLUMN HorarioInicio TEXT NULL;");
            return;
        }

        if (nomeColuna == "HorarioFim")
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Salas ADD COLUMN HorarioFim TEXT NULL;");
        }
    }

    private static bool ColunaExiste(AppDbContext context, string nomeColuna)
    {
        var connection = context.Database.GetDbConnection();
        var deveFechar = connection.State != ConnectionState.Open;

        if (deveFechar)
        {
            connection.Open();
        }

        try
        {
            using var command = connection.CreateCommand();
            command.CommandText = "PRAGMA table_info(Salas);";
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                var nome = reader["name"]?.ToString();
                if (string.Equals(nome, nomeColuna, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }
        finally
        {
            if (deveFechar)
            {
                connection.Close();
            }
        }
    }

    private static void GarantirSalasIniciais(AppDbContext context)
    {
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
            new() { Bloco = "Senai Lab", Pavimento = "Térreo", Nome = "Biblioteca", Tipo = "Biblioteca", EstaOcupada = false },

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

        var adicionadas = false;

        foreach (var sala in salas)
        {
            var existe = context.Salas.Any(x =>
                x.Bloco == sala.Bloco &&
                x.Pavimento == sala.Pavimento &&
                x.Nome == sala.Nome);

            if (!existe)
            {
                context.Salas.Add(sala);
                adicionadas = true;
            }
        }

        if (adicionadas)
        {
            context.SaveChanges();
        }
    }
}