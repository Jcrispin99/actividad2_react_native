import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { useLibros } from '../../hooks/useLibros';

import type {
  EstadoLibro,
  NivelLibro,
  CategoriaRuta,
} from '../../db/database';

/**
 * Pantalla para registrar un nuevo libro en la base de datos.
 * Utiliza el hook useLibros para persistir la información en SQLite.
 */
export default function PantallaNuevoLibro() {
  const { crearLibro } = useLibros();

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [tecnologia, setTecnologia] = useState('');

  const [nivel, setNivel] =
    useState<NivelLibro>('basico');

  const [estado, setEstado] =
    useState<EstadoLibro>('pendiente');

  const [categoriaRuta, setCategoriaRuta] =
    useState<CategoriaRuta>('General');

  const [notas, setNotas] = useState('');
  const [orden, setOrden] = useState('');
 

  /**
   * Guarda un nuevo libro en SQLite.
   */
  const guardarLibro = async () => {
    try {
      // Validación mínima
      if (!titulo.trim() || !autor.trim()) {
        Alert.alert(
          'Campos obligatorios',
          'Debes completar el título y el autor.',
        );
        return;
      }

      // Validar campos con valores restringidos
      const nivelesValidos: NivelLibro[] = ['basico', 'intermedio', 'avanzado'];
      const estadosValidos: EstadoLibro[] = ['pendiente', 'leyendo', 'completado'];

      if (!nivelesValidos.includes(nivel)) {
        Alert.alert(
          'Valor de Nivel inválido',
          `Nivel debe ser uno de: ${nivelesValidos.join(', ')}`,
        );
        return;
      }

      if (!estadosValidos.includes(estado)) {
        Alert.alert(
          'Valor de Estado inválido',
          `Estado debe ser uno de: ${estadosValidos.join(', ')}`,
        );
        return;
      }

      const categoriasValidas: CategoriaRuta[] = ['Frontend', 'Backend', 'Mobile', 'Data Science', 'General'];
      if (!categoriasValidas.includes(categoriaRuta)) {
        Alert.alert(
          'Valor de Categoría inválido',
          `Categoría debe ser uno de: ${categoriasValidas.join(', ')}`,
        );
        return;
      }

      await crearLibro({
        titulo,
        autor,
        tecnologia,
        nivel,
        estado,
        notas,
        orden: Number(orden) || 0,
        categoriaRuta,
      });

      Alert.alert(
        'Éxito',
        'Libro creado correctamente.',
      );

      // Regresa a la pantalla anterior
      router.back();
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo guardar el libro.',
      );

      console.error(error);
    }
  };

  const rellenarEjemplo = () => {
    setTitulo('Clean Code');
    setAutor('Robert C. Martin');
    setTecnologia('General');
    setNivel('intermedio');
    setEstado('pendiente');
    setCategoriaRuta('Backend');
    setNotas('Libro de referencia sobre buenas prácticas de programación.');
    setOrden('1');
  };

  const generarEjemplos = async (cantidad = 3) => {
    try {
      const muestras = Array.from({ length: cantidad }).map((_, i) => ({
        titulo: `Libro de ejemplo ${i + 1}`,
        autor: `Autor ${i + 1}`,
        tecnologia: ['React', 'Node', 'TypeScript'][i % 3],
        nivel: (['basico', 'intermedio', 'avanzado'][i % 3] as NivelLibro),
        estado: (['pendiente', 'leyendo', 'completado'][i % 3] as EstadoLibro),
        categoriaRuta: (['Frontend', 'Backend', 'Mobile', 'Data Science', 'General'][i % 5] as CategoriaRuta),
        notas: `Notas de ejemplo para el libro ${i + 1}`,
        orden: i + 1,
      }));

      for (const m of muestras) {
        // crearLibro espera el tipo con orden numérico
        await crearLibro({ ...m, orden: Number(m.orden) });
      }

      Alert.alert('Éxito', `Se generaron ${cantidad} libros de prueba.`);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron generar los libros de prueba.');
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.tituloPantalla}>
        Nuevo libro
      </Text>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Título</Text>

        <TextInput
          style={estilos.input}
          placeholder="Ej: Clean Code"
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Autor</Text>

        <TextInput
          style={estilos.input}
          placeholder="Ej: Robert C. Martin"
          value={autor}
          onChangeText={setAutor}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Tecnología</Text>

        <TextInput
          style={estilos.input}
          placeholder="Ej: React"
          value={tecnologia}
          onChangeText={setTecnologia}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Nivel</Text>

        <TextInput
          style={estilos.input}
          placeholder="basico | intermedio | avanzado"
          value={nivel}
          onChangeText={(texto) =>
            setNivel(texto as NivelLibro)
          }
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Estado</Text>

        <TextInput
          style={estilos.input}
          placeholder="pendiente | leyendo | completado"
          value={estado}
          onChangeText={(texto) =>
            setEstado(texto as EstadoLibro)
          }
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Ruta de Aprendizaje (Categoría)</Text>

        <TextInput
          style={estilos.input}
          placeholder="Frontend | Backend | Mobile | Data Science | General"
          value={categoriaRuta}
          onChangeText={(texto) =>
            setCategoriaRuta(texto as CategoriaRuta)
          }
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Notas</Text>

        <TextInput
          style={[estilos.input, estilos.inputNotas]}
          placeholder="Escribe observaciones sobre el libro"
          multiline
          numberOfLines={4}
          value={notas}
          onChangeText={setNotas}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>
          Orden de ruta
        </Text>

        <TextInput
          style={estilos.input}
          placeholder="Ej: 1"
          keyboardType="numeric"
          value={orden}
          onChangeText={setOrden}
        />
      </View>

      <TouchableOpacity
        style={estilos.botonGuardar}
        onPress={guardarLibro}
      >
        <Text style={estilos.textoBoton}>
          Guardar libro
        </Text>
      </TouchableOpacity>

      <View style={estilos.contenedorBotones}>
        <TouchableOpacity
          style={[estilos.botonSecundario, { marginRight: 8 }]}
          onPress={rellenarEjemplo}
        >
          <Text style={estilos.textoBotonSecundario}>
            Rellenar ejemplo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botonSecundario}
          onPress={() => generarEjemplos(3)}
        >
          <Text style={estilos.textoBotonSecundario}>
            Generar 3 libros
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: 20,
    paddingBottom: 40,
  },

  tituloPantalla: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  grupoCampo: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },

  inputNotas: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  botonGuardar: {
    marginTop: 12,
    backgroundColor: '#222222',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  contenedorBotones: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  botonSecundario: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  textoBotonSecundario: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
  },

  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContenido: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  modalOpcion: {
    paddingVertical: 12,
  },

  modalCancelar: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

});