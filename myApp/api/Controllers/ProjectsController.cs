using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using SmallAngularApi.Models;

namespace SmallAngularApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProjectsController : ControllerBase
{
    private readonly string _connectionString;

    public ProjectsController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration["ConnectionStrings:DefaultConnection"]
            ?? "Host=db;Database=postgres;Username=postgres;Password=postgres";
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Project>>> Get()
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand("SELECT id, name FROM \"Projects\" ORDER BY id;", connection);
        await using var reader = await command.ExecuteReaderAsync();

        var projects = new List<Project>();
        while (await reader.ReadAsync())
        {
            projects.Add(new Project
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1)
            });
        }

        return Ok(projects);
    }

    [HttpPost]
    public async Task<ActionResult<Project>> Post([FromBody] Project project)
    {
        if (string.IsNullOrWhiteSpace(project?.Name))
        {
            return BadRequest("Project name is required.");
        }

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand("INSERT INTO \"Projects\" (name) VALUES (@name) RETURNING id;", connection);
        command.Parameters.AddWithValue("@name", project.Name);

        var id = (int)await command.ExecuteScalarAsync();

        project.Id = id;

        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand("DELETE FROM \"Projects\" WHERE id = @id;", connection);
        command.Parameters.AddWithValue("@id", id);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        if (rowsAffected == 0)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Project project)
    {
        if (string.IsNullOrWhiteSpace(project?.Name))
        {
            return BadRequest("Project name is required.");
        }

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand("UPDATE \"Projects\" SET name = @name WHERE id = @id;", connection);
        command.Parameters.AddWithValue("@name", project.Name);
        command.Parameters.AddWithValue("@id", id);

        var rowsAffected = await command.ExecuteNonQueryAsync();
        if (rowsAffected == 0)
        {
            return NotFound();
        }

        return NoContent();
    }
}
