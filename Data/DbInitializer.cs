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
            // ================= TÉRREO (PLACA) =================
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 01", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 02 (Lab. de Informática)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 03", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 04 (Lab. de Metrologia)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 05 (Lab. de Eletrohidráulica)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Sala 06 (Lab. de Pneumática)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "Térreo", Nome = "Setores Administrativos", Tipo = "Administrativo", EstaOcupada = false },

            // ================= 1º PAVIMENTO (PLACA) =================
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Biblioteca", Tipo = "Biblioteca", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala de Multimeios", Tipo = "Sala", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 07", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 08", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 09", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 10", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 11", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 12 (Lab. de Informática)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 13", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala 14", Tipo = "Sala Teórica", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "1º Pavimento", Nome = "Sala de Materiais", Tipo = "Administrativo", EstaOcupada = false },

            // ================= 2º PAVIMENTO (PLACA) =================
            new() { Bloco = "Principal", Pavimento = "2º Pavimento", Nome = "Miniauditório", Tipo = "Auditório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "2º Pavimento", Nome = "Arquivo", Tipo = "Administrativo", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "2º Pavimento", Nome = "Sala 15 (Lab. de Seg. do Trabalho)", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Principal", Pavimento = "2º Pavimento", Nome = "Sala 16", Tipo = "Sala Teórica", EstaOcupada = false },

            // ================= GALPÕES / ANOTAÇÕES DO CADERNO =================
            
            // Oficina de Manutenção
            new() { Bloco = "Galpão", Pavimento = "Oficina de Manutenção", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Manutenção", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Manutenção", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },

            // Oficina Automobilística
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Sala D", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Sala E", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Sala F", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina Automobilística", Nome = "Laboratório de Automotiva", Tipo = "Laboratório", EstaOcupada = false },

            // Oficina de Usinagem
            new() { Bloco = "Galpão", Pavimento = "Oficina de Usinagem", Nome = "Laboratório 1", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Usinagem", Nome = "Laboratório 2", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Usinagem", Nome = "Laboratório Tridimensional", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Usinagem", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },

            // Oficina de Metalurgia
            new() { Bloco = "Galpão", Pavimento = "Oficina de Metalurgia", Nome = "Setor de Simuladores de Solda", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Metalurgia", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Metalurgia", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },

            // Oficina de Ajustagem
            new() { Bloco = "Galpão", Pavimento = "Oficina de Ajustagem", Nome = "Sala A", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Ajustagem", Nome = "Sala B", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Ajustagem", Nome = "Sala C", Tipo = "Oficina", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Ajustagem", Nome = "Lab. de Motocicleta", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Galpão", Pavimento = "Oficina de Ajustagem", Nome = "Colorimetria 02", Tipo = "Laboratório", EstaOcupada = false },

            // Outras Áreas Anotadas
            new() { Bloco = "Diversos", Pavimento = "Térreo", Nome = "Lab. de Inovação", Tipo = "Laboratório", EstaOcupada = false },
            new() { Bloco = "Diversos", Pavimento = "Térreo", Nome = "Webconferência", Tipo = "Sala", EstaOcupada = false },
            new() { Bloco = "Diversos", Pavimento = "Térreo", Nome = "Pesquisa", Tipo = "Sala", EstaOcupada = false },
            new() { Bloco = "Diversos", Pavimento = "Térreo", Nome = "Estúdio Multimídia e Robótica", Tipo = "Laboratório", EstaOcupada = false }
        };

        context.Salas.AddRange(salas);
        context.SaveChanges();
    }
}