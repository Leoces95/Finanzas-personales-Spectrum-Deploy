using FinanzasPersonales.Models;

namespace FinanzasPersonales.Data;

// Almacén en memoria: los datos se pierden al reiniciar la aplicación.
public static class AlmacenMovimientos
{
    private static readonly List<Movimiento> _movimientos = new();
    private static readonly object _candado = new();
    private static int _siguienteId = 1;

    public static List<Movimiento> Listar()
    {
        lock (_candado)
        {
            return _movimientos.OrderByDescending(m => m.Fecha).ThenByDescending(m => m.Id).ToList();
        }
    }

    public static Movimiento? Buscar(int id)
    {
        lock (_candado)
        {
            return _movimientos.FirstOrDefault(m => m.Id == id);
        }
    }

    public static Movimiento Crear(Movimiento nuevo)
    {
        lock (_candado)
        {
            nuevo.Id = _siguienteId++;
            _movimientos.Add(nuevo);
            return nuevo;
        }
    }

    public static bool Actualizar(int id, Movimiento datos)
    {
        lock (_candado)
        {
            var existente = _movimientos.FirstOrDefault(m => m.Id == id);
            if (existente is null) return false;

            existente.Fecha = datos.Fecha;
            existente.Descripcion = datos.Descripcion;
            existente.Categoria = datos.Categoria;
            existente.Tipo = datos.Tipo;
            existente.Monto = datos.Monto;
            return true;
        }
    }

    public static bool Eliminar(int id)
    {
        lock (_candado)
        {
            return _movimientos.RemoveAll(m => m.Id == id) > 0;
        }
    }
}
