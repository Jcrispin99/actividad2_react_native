import { useCallback, useEffect, useState } from 'react';

import {
  inicializarBaseDatos,
  mapearFilaALibro,
  obtenerConexion,
  type Libro,
  type LibroNuevo,
} from '../db/database';

/**
 * Forma del objeto que devuelve el hook useLibros.
 * Se expone como interfaz para que las pantallas que lo
 * consumen puedan tipar con claridad lo que reciben.
 */
export interface UsoLibros {
  libros: Libro[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  crearLibro: (datos: LibroNuevo) => Promise<number>;
  actualizarLibro: (id: number, datos: LibroNuevo) => Promise<void>;
  eliminarLibro: (id: number) => Promise<void>;
  obtenerLibroPorId: (id: number) => Promise<Libro | null>;
}

/**
 * Hook personalizado que centraliza el CRUD de libros.
 *
 * Responsabilidades:
 *  - Inicializar la base de datos la primera vez que se monta.
 *  - Mantener en estado React la lista actual de libros.
 *  - Exponer funciones para crear, actualizar y borrar libros,
 *    refrescando el estado tras cada cambio para que las
 *    pantallas que lo consumen se re-rendericen.
 *
 * Las pantallas Biblioteca, Ruta y Perfil usan este hook
 * para no duplicar lógica de acceso a datos.
 */
export function useLibros(): UsoLibros {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lee todos los libros de SQLite y los vuelca al estado.
   * Se ordenan por `orden` ascendente para que la pantalla
   * "Ruta" muestre el camino de aprendizaje en su secuencia
   * correcta sin necesidad de reordenar en el cliente.
   */
  const obtenerLibros = useCallback(async (): Promise<void> => {
    try {
      const baseDatos = await obtenerConexion();
      const filas = await baseDatos.getAllAsync<Libro>(
        'SELECT id, titulo, autor, tecnologia, nivel, estado, notas, orden, categoriaRuta FROM libros ORDER BY orden ASC, id ASC;',
      );
      setLibros(filas.map(mapearFilaALibro));
    } catch (e) {
      console.error('Error en obtenerLibros:', e);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  /**
   * Inserta un nuevo libro y refresca el listado.
   * Devuelve el id generado por SQLite por si la pantalla
   * llamadora quiere navegar al detalle del recién creado.
   */
  const crearLibro = useCallback(
    async (datos: LibroNuevo): Promise<number> => {
      const baseDatos = await obtenerConexion();
      const resultado = await baseDatos.runAsync(
        `INSERT INTO libros (titulo, autor, tecnologia, nivel, estado, notas, orden, categoriaRuta)
         VALUES ($titulo, $autor, $tecnologia, $nivel, $estado, $notas, $orden, $categoriaRuta);`,
        {
          $titulo: datos.titulo,
          $autor: datos.autor,
          $tecnologia: datos.tecnologia,
          $nivel: datos.nivel,
          $estado: datos.estado,
          $notas: datos.notas,
          $orden: datos.orden,
          $categoriaRuta: datos.categoriaRuta,
        },
      );
      await obtenerLibros();
      return resultado.lastInsertRowId;
    },
    [obtenerLibros],
  );

  /**
   * Actualiza todos los campos editables de un libro.
   * Trabajamos con reemplazo completo (no parcial) porque
   * el formulario siempre envía el objeto entero, lo que
   * mantiene la sentencia simple y predecible.
   */
  const actualizarLibro = useCallback(
    async (id: number, datos: LibroNuevo): Promise<void> => {
      const baseDatos = await obtenerConexion();
      await baseDatos.runAsync(
        `UPDATE libros
         SET titulo = $titulo, autor = $autor, tecnologia = $tecnologia, nivel = $nivel, estado = $estado, notas = $notas, orden = $orden, categoriaRuta = $categoriaRuta
         WHERE id = $id;`,
        {
          $titulo: datos.titulo,
          $autor: datos.autor,
          $tecnologia: datos.tecnologia,
          $nivel: datos.nivel,
          $estado: datos.estado,
          $notas: datos.notas,
          $orden: datos.orden,
          $categoriaRuta: datos.categoriaRuta,
          $id: id,
        },
      );
      await obtenerLibros();
    },
    [obtenerLibros],
  );

  /**
   * Borra un libro por id y refresca el listado.
   * La confirmación al usuario se hace en la pantalla
   * (con Alert.alert) para mantener el hook libre de UI.
   */
  const eliminarLibro = useCallback(
    async (id: number): Promise<void> => {
      const baseDatos = await obtenerConexion();
      await baseDatos.runAsync('DELETE FROM libros WHERE id = $id;', { $id: id });
      await obtenerLibros();
    },
    [obtenerLibros],
  );

  /**
   * Recupera un libro concreto. Útil para la pantalla de
   * edición, que necesita precargar los valores del formulario
   * a partir del id que llega por parámetro de ruta.
   */
  const obtenerLibroPorId = useCallback(
    async (id: number): Promise<Libro | null> => {
      const baseDatos = await obtenerConexion();
      const fila = await baseDatos.getFirstAsync<Libro>(
        'SELECT id, titulo, autor, tecnologia, nivel, estado, notas, orden, categoriaRuta FROM libros WHERE id = $id;',
        { $id: id },
      );
      return fila ? mapearFilaALibro(fila) : null;
    },
    [],
  );

  // Inicialización: prepara la base y carga el primer listado.
  // Solo se ejecuta una vez gracias al array de dependencias vacío.
  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        await inicializarBaseDatos();
        if (activo) {
          await obtenerLibros();
        }
      } catch (excepcion) {
        if (activo) {
          setError(
            excepcion instanceof Error
              ? excepcion.message
              : 'Error desconocido al cargar la base de datos',
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    })();

    // Bandera "activo" para evitar setState si el componente
    // se desmonta antes de que termine la carga inicial.
    return () => {
      activo = false;
    };
  }, [obtenerLibros]);

  return {
    libros,
    cargando,
    error,
    recargar: obtenerLibros,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    obtenerLibroPorId,
  };
}
