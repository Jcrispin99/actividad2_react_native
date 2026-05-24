import * as SQLite from 'expo-sqlite';

/**
 * Tipos del dominio "Libro".
 *
 * Las columnas en SQLite van en minúsculas (convención SQL),
 * pero el código JS/TS las maneja en camelCase a través de
 * mapearFilaALibro() para mantener una sola convención dentro
 * de la app.
 */

export type EstadoLibro = 'pendiente' | 'leyendo' | 'completado';

export type NivelLibro = 'basico' | 'intermedio' | 'avanzado';

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  tecnologia: string;
  nivel: NivelLibro;
  estado: EstadoLibro;
  notas: string;
  orden: number;
}

// Datos que llegan desde un formulario (sin id, ya que lo asigna SQLite).
export type LibroNuevo = Omit<Libro, 'id'>;

// Forma cruda de una fila tal como la devuelve expo-sqlite (columnas en minúsculas).
interface FilaLibro {
  id: number;
  titulo: string;
  autor: string;
  tecnologia: string;
  nivel: NivelLibro;
  estado: EstadoLibro;
  notas: string;
  orden: number;
}

// Nombre del archivo físico de la base de datos en el dispositivo.
const NOMBRE_BASE_DATOS = 'devruta.db';

// Singleton: una sola conexión reutilizada por toda la app
// para evitar abrir/cerrar la base en cada operación.
let conexion: SQLite.SQLiteDatabase | null = null;

/**
 * Devuelve la conexión a SQLite, abriéndola la primera vez
 * que se invoca. El resto de funciones del módulo se apoyan
 * en este helper para no duplicar la lógica de apertura.
 */
export async function obtenerConexion(): Promise<SQLite.SQLiteDatabase> {
  if (conexion === null) {
    conexion = await SQLite.openDatabaseAsync(NOMBRE_BASE_DATOS);
  }
  return conexion;
}

/**
 * Inicializa la base de datos: activa claves foráneas,
 * crea la tabla `libros` si todavía no existe e inserta
 * una ruta de aprendizaje semilla la primera vez que se
 * arranca la app. Debe llamarse una sola vez, idealmente
 * en el _layout raíz antes de renderizar las pantallas.
 */
export async function inicializarBaseDatos(): Promise<void> {
  const baseDatos = await obtenerConexion();

  // PRAGMA + DDL se ejecutan juntos con execAsync porque no
  // necesitan parámetros y permite varias sentencias seguidas.
  await baseDatos.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      tecnologia TEXT NOT NULL,
      nivel TEXT NOT NULL CHECK (nivel IN ('basico', 'intermedio', 'avanzado')),
      estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'leyendo', 'completado')),
      notas TEXT NOT NULL DEFAULT '',
      orden INTEGER NOT NULL DEFAULT 0
    );
  `);

  await sembrarDatosIniciales(baseDatos);
}

/**
 * Inserta una ruta de ejemplo SOLO la primera vez que la
 * tabla está vacía. Así, si el usuario ya añadió/borró cosas,
 * no se vuelve a "pisar" su contenido al reabrir la app.
 */
async function sembrarDatosIniciales(
  baseDatos: SQLite.SQLiteDatabase,
): Promise<void> {
  const filaConteo = await baseDatos.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM libros;',
  );

  if (filaConteo && filaConteo.total > 0) {
    return;
  }

  const librosSemilla: LibroNuevo[] = [
    {
      titulo: 'Eloquent JavaScript',
      autor: 'Marijn Haverbeke',
      tecnologia: 'JavaScript',
      nivel: 'basico',
      estado: 'completado',
      notas: 'Buena base del lenguaje antes de tocar frameworks.',
      orden: 1,
    },
    {
      titulo: 'You Don’t Know JS Yet',
      autor: 'Kyle Simpson',
      tecnologia: 'JavaScript',
      nivel: 'intermedio',
      estado: 'leyendo',
      notas: 'Profundiza en scope, closures y this.',
      orden: 2,
    },
    {
      titulo: 'Learning React Native',
      autor: 'Bonnie Eisenman',
      tecnologia: 'React Native',
      nivel: 'intermedio',
      estado: 'pendiente',
      notas: 'Para arrancar con apps móviles multiplataforma.',
      orden: 3,
    },
    {
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      tecnologia: 'Buenas prácticas',
      nivel: 'avanzado',
      estado: 'pendiente',
      notas: 'Lectura transversal a cualquier lenguaje.',
      orden: 4,
    },
  ];

  for (const libro of librosSemilla) {
    await baseDatos.runAsync(
      `INSERT INTO libros (titulo, autor, tecnologia, nivel, estado, notas, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        libro.titulo,
        libro.autor,
        libro.tecnologia,
        libro.nivel,
        libro.estado,
        libro.notas,
        libro.orden,
      ],
    );
  }
}

/**
 * Convierte una fila cruda devuelta por SQLite en el
 * objeto `Libro` que consume el resto de la app. Aquí
 * centralizamos cualquier transformación (por ejemplo,
 * normalizar nulls a strings vacíos) en un único lugar.
 */
export function mapearFilaALibro(fila: FilaLibro): Libro {
  return {
    id: fila.id,
    titulo: fila.titulo,
    autor: fila.autor,
    tecnologia: fila.tecnologia,
    nivel: fila.nivel,
    estado: fila.estado,
    notas: fila.notas ?? '',
    orden: fila.orden,
  };
}
