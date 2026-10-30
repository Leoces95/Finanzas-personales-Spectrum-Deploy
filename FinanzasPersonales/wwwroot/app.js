const API = "api/movimientos";

const form = document.getElementById("form-movimiento");
const campoId = document.getElementById("movimiento-id");
const campoFecha = document.getElementById("fecha");
const campoDescripcion = document.getElementById("descripcion");
const campoCategoria = document.getElementById("categoria");
const campoTipo = document.getElementById("tipo");
const campoMonto = document.getElementById("monto");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const tituloForm = document.getElementById("titulo-form");
const filtro = document.getElementById("filtro");
const cuerpo = document.getElementById("lista-movimientos");
const sinMovimientos = document.getElementById("sin-movimientos");

let movimientos = [];

/* --- CRUD contra la API --- */

async function cargar() {
  try {
    const resp = await fetch(API);
    if (!resp.ok) throw new Error(resp.status);
    movimientos = await resp.json();
  } catch {
    movimientos = [];
    alert("No se pudo cargar el registro desde el servidor.");
  }
  render();
}

async function enviar(url, metodo, cuerpoJson) {
  const resp = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: cuerpoJson ? JSON.stringify(cuerpoJson) : undefined,
  });
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp;
}

async function eliminar(id) {
  const m = movimientos.find((x) => x.id === id);
  if (!m || !confirm(`¿Borrar "${m.descripcion}" del registro?`)) return;
  try {
    await enviar(`${API}/${id}`, "DELETE");
    if (Number(campoId.value) === id) salirDeEdicion();
    await cargar();
  } catch (e) {
    alert("No se pudo borrar: " + e.message);
  }
}

/* --- Edición en el formulario --- */

function entrarEnEdicion(id) {
  const m = movimientos.find((x) => x.id === id);
  if (!m) return;
  campoId.value = m.id;
  campoFecha.value = m.fecha;
  campoDescripcion.value = m.descripcion;
  campoCategoria.value = m.categoria;
  campoTipo.value = m.tipo;
  campoMonto.value = m.monto;
  tituloForm.textContent = "Corregir asiento";
  btnGuardar.textContent = "Guardar cambios";
  btnCancelar.hidden = false;
  campoDescripcion.focus();
}

function salirDeEdicion() {
  form.reset();
  campoId.value = "";
  campoFecha.value = hoy();
  tituloForm.textContent = "Nuevo asiento";
  btnGuardar.textContent = "Anotar";
  btnCancelar.hidden = true;
}

/* --- Vista --- */

function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function pesos(valor) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function celda(texto, clase) {
  const td = document.createElement("td");
  td.textContent = texto;
  if (clase) td.className = clase;
  return td;
}

function boton(texto, accion) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = texto;
  b.addEventListener("click", accion);
  return b;
}

function render() {
  cuerpo.innerHTML = "";
  let entradas = 0;
  let salidas = 0;

  movimientos.forEach((m) => {
    if (m.tipo === "ingreso") entradas += m.monto;
    else salidas += m.monto;
  });

  const visibles = movimientos.filter((m) => filtro.value === "todos" || m.tipo === filtro.value);

  visibles.forEach((m) => {
    const tr = document.createElement("tr");
    tr.append(
      celda(m.fecha, "fecha"),
      celda(m.descripcion),
      celda(m.categoria, "cat"),
      celda((m.tipo === "gasto" ? "− " : "+ ") + pesos(m.monto), "valor " + m.tipo)
    );

    const acciones = document.createElement("td");
    acciones.className = "botones";
    acciones.append(
      boton("editar", () => entrarEnEdicion(m.id)),
      boton("borrar", () => eliminar(m.id))
    );
    tr.appendChild(acciones);
    cuerpo.appendChild(tr);
  });

  document.getElementById("total-ingresos").textContent = pesos(entradas);
  document.getElementById("total-gastos").textContent = pesos(salidas);
  document.getElementById("saldo").textContent = pesos(entradas - salidas);
  sinMovimientos.style.display = visibles.length ? "none" : "block";
}

/* --- Eventos --- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = {
    fecha: campoFecha.value,
    descripcion: campoDescripcion.value.trim(),
    categoria: campoCategoria.value,
    tipo: campoTipo.value,
    monto: parseFloat(campoMonto.value),
  };
  if (!datos.fecha || !datos.descripcion || !(datos.monto > 0)) return;

  try {
    if (campoId.value) await enviar(`${API}/${campoId.value}`, "PUT", datos);
    else await enviar(API, "POST", datos);
    salirDeEdicion();
    await cargar();
  } catch (err) {
    alert("No se pudo guardar: " + err.message);
  }
});

btnCancelar.addEventListener("click", salirDeEdicion);
filtro.addEventListener("change", render);

salirDeEdicion();
cargar();
