using PlasmaIA;
using static System.Runtime.InteropServices.JavaScript.JSType;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(
    "secrets.json",
    optional: false,
    reloadOnChange: true);


builder.Services.AddControllers();
builder.Services.AddControllers();

builder.Services.AddScoped<PlasmaBrain>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "PermitirTodo",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("PermitirTodo");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();