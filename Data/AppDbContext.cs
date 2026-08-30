using Microsoft.EntityFrameworkCore;
using SenaiControl.Models;

namespace SenaiControl.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Sala> Salas => Set<Sala>();
}