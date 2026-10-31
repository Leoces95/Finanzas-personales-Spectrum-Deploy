using FinanzasPersonales.Data;
using FinanzasPersonales.Models;
using Microsoft.AspNetCore.Mvc;

namespace FinanzasPersonales.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovimientosController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Movimiento>> Get() => AlmacenMovimientos.Listar();

    [HttpGet("{id:int}")]
    public ActionResult<Movimiento> Get(int id)
    {
        var movimiento = AlmacenMovimientos.Buscar(id);
        return movimiento is null ? NotFound() : movimiento;
    }

    [HttpPost]
    public ActionResult<Movimiento> Post(Movimiento nuevo)
    {
        var creado = AlmacenMovimientos.Crear(nuevo);
        return CreatedAtAction(nameof(Get), new { id = creado.Id }, creado);
    }

    [HttpPut("{id:int}")]
    public IActionResult Put(int id, Movimiento datos)
    {
        return AlmacenMovimientos.Actualizar(id, datos) ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return AlmacenMovimientos.Eliminar(id) ? NoContent() : NotFound();
    }
}
