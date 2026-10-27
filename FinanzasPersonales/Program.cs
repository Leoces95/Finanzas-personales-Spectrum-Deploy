var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Comprobación de salud para IIS y Azure App Service
app.MapGet("/health", () => Results.Text("OK"));

app.Run();
