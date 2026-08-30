using Microsoft.EntityFrameworkCore;
using SenaiControl.Data;

var builder = WebApplication.CreateBuilder(args);

// Banco de Dados SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=senai.db"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Inicializa o Banco
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbInitializer.Initialize(context);
}

app.UseDefaultFiles(); // Procura index.html em wwwroot
app.UseStaticFiles();
app.MapControllers();

app.Run();