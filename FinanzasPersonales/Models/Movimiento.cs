using System.ComponentModel.DataAnnotations;

namespace FinanzasPersonales.Models;

public class Movimiento
{
    public int Id { get; set; }

    [Required]
    public DateOnly Fecha { get; set; }

    [Required, StringLength(60, MinimumLength = 1)]
    public string Descripcion { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string Categoria { get; set; } = string.Empty;

    // "ingreso" o "gasto"
    [Required, RegularExpression("^(ingreso|gasto)$", ErrorMessage = "El tipo debe ser 'ingreso' o 'gasto'.")]
    public string Tipo { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor que cero.")]
    public decimal Monto { get; set; }
}
