// app.js
// Vista/Cliente (V de MVC en el frontend): se comunica con el backend mediante
// la Fetch API y actualiza el DOM dinámicamente. No usa ningún framework.

// URL base de la API. Si el backend corre en otro host/puerto, cambiar acá.
const API_URL = 'http://localhost:5000/libros';

// Referencias al DOM
const formLibro = document.getElementById('formLibro');
const formTitulo = document.getElementById('formTitulo');
const inputId = document.getElementById('libroId');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const inputAnio = document.getElementById('anio');
const inputGenero = document.getElementById('genero');
const inputEstado = document.getElementById('estado');

const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const btnRefrescar = document.getElementById('btnRefrescar');

const cuerpoTabla = document.getElementById('cuerpoTabla');
const sinLibros = document.getElementById('sinLibros');
const alerta = document.getElementById('alerta');

// Estado local: si estamos editando, guardamos el modo
let modoEdicion = false;

// -------------------- Utilidades de UI --------------------

function mostrarAlerta(mensaje, tipo = 'exito') {
  alerta.textContent = mensaje;
  alerta.className = `alerta ${tipo}`;
  alerta.classList.remove('oculto');

  setTimeout(() => {
    alerta.classList.add('oculto');
  }, 3500);
}

function limpiarFormulario() {
  formLibro.reset();
  inputId.value = '';
  modoEdicion = false;
  formTitulo.textContent = 'Agregar nuevo libro';
  btnGuardar.textContent = 'Guardar libro';
  btnCancelar.classList.add('oculto');
}

function activarModoEdicion(libro) {
  modoEdicion = true;
  inputId.value = libro._id;
  inputTitulo.value = libro.titulo;
  inputAutor.value = libro.autor;
  inputAnio.value = libro.anio;
  inputGenero.value = libro.genero === 'Sin especificar' ? '' : libro.genero;
  inputEstado.value = libro.estado;

  formTitulo.textContent = `Editando: ${libro.titulo}`;
  btnGuardar.textContent = 'Actualizar libro';
  btnCancelar.classList.remove('oculto');

  // Llevar la vista al formulario
  formLibro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// -------------------- Llamadas a la API (Fetch) --------------------

async function obtenerLibros() {
  try {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    if (!respuesta.ok || !data.exito) {
      throw new Error(data.mensaje || 'Error al obtener los libros');
    }

    renderizarTabla(data.datos);
  } catch (error) {
    console.error(error);
    mostrarAlerta(
      'No se pudo conectar con el servidor. ¿Está corriendo el backend? (' + error.message + ')',
      'error'
    );
  }
}

async function crearLibro(libro) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(libro),
  });

  const data = await respuesta.json();

  if (!respuesta.ok || !data.exito) {
    throw new Error(data.mensaje || 'Error al crear el libro');
  }

  return data;
}

async function actualizarLibro(id, libro) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(libro),
  });

  const data = await respuesta.json();

  if (!respuesta.ok || !data.exito) {
    throw new Error(data.mensaje || 'Error al actualizar el libro');
  }

  return data;
}

async function eliminarLibro(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  const data = await respuesta.json();

  if (!respuesta.ok || !data.exito) {
    throw new Error(data.mensaje || 'Error al eliminar el libro');
  }

  return data;
}

// -------------------- Renderizado --------------------

function renderizarTabla(libros) {
  cuerpoTabla.innerHTML = '';

  if (!libros || libros.length === 0) {
    sinLibros.classList.remove('oculto');
    return;
  }

  sinLibros.classList.add('oculto');

  libros.forEach((libro) => {
    const fila = document.createElement('tr');

    const pillClase = libro.estado === 'disponible' ? 'estado-disponible' : 'estado-prestado';

    fila.innerHTML = `
      <td>${libro._id.slice(-6)}</td>
      <td>${escapeHtml(libro.titulo)}</td>
      <td>${escapeHtml(libro.autor)}</td>
      <td>${libro.anio}</td>
      <td>${escapeHtml(libro.genero || 'Sin especificar')}</td>
      <td><span class="estado-pill ${pillClase}">${libro.estado}</span></td>
      <td class="acciones-celda">
        <button class="btn btn-editar" data-id="${libro._id}">Editar</button>
        <button class="btn btn-eliminar" data-id="${libro._id}">Eliminar</button>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });

  // Delegar eventos de los botones recién creados
  document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', () => manejarClickEditar(btn.dataset.id, libros));
  });

  document.querySelectorAll('.btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', () => manejarClickEliminar(btn.dataset.id));
  });
}

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// -------------------- Manejadores de eventos --------------------

formLibro.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const libro = {
    titulo: inputTitulo.value.trim(),
    autor: inputAutor.value.trim(),
    anio: Number(inputAnio.value),
    genero: inputGenero.value.trim() || 'Sin especificar',
    estado: inputEstado.value,
  };

  // Validación básica en el frontend (la validación fuerte vive en el backend)
  if (!libro.titulo || !libro.autor || !libro.anio) {
    mostrarAlerta('Por favor completá título, autor y año.', 'error');
    return;
  }

  try {
    btnGuardar.disabled = true;

    if (modoEdicion) {
      await actualizarLibro(inputId.value, libro);
      mostrarAlerta('Libro actualizado correctamente ✅');
    } else {
      await crearLibro(libro);
      mostrarAlerta('Libro agregado correctamente ✅');
    }

    limpiarFormulario();
    await obtenerLibros();
  } catch (error) {
    console.error(error);
    mostrarAlerta(error.message, 'error');
  } finally {
    btnGuardar.disabled = false;
  }
});

btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

btnRefrescar.addEventListener('click', () => {
  obtenerLibros();
});

async function manejarClickEditar(id, librosActuales) {
  const libro = librosActuales.find((l) => l._id === id);
  if (libro) {
    activarModoEdicion(libro);
  }
}

async function manejarClickEliminar(id) {
  const confirmado = confirm('¿Seguro que querés eliminar este libro? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  try {
    await eliminarLibro(id);
    mostrarAlerta('Libro eliminado correctamente 🗑️');
    await obtenerLibros();
  } catch (error) {
    console.error(error);
    mostrarAlerta(error.message, 'error');
  }
}

// -------------------- Inicialización --------------------

document.addEventListener('DOMContentLoaded', () => {
  obtenerLibros();
});
