import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useLibros } from '../../hooks/useLibros';

import type {
  EstadoLibro,
  NivelLibro,
} from '../../db/database';

/**
 * Pantalla para editar o eliminar un libro existente.
 * El id se obtiene desde la ruta dinámica [id].
 */
export default function PantallaEditarLibro() {
  const { id } = useLocalSearchParams();

  const {
    obtenerLibroPorId,
    actualizarLibro,
    eliminarLibro,
  } = useLibros();

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [tecnologia, setTecnologia] = useState('');

  const [nivel, setNivel] =
    useState<NivelLibro>('basico');

  const [estado, setEstado] =
    useState<EstadoLibro>('pendiente');

  const [notas, setNotas] = useState('');
  const [orden, setOrden] = useState('');
 

  /**
   * Carga la información del libro actual
   * desde SQLite y rellena el formulario.
   */
  useEffect(() => {
    const cargarLibro = async () => {
      try {
        const libro = await obtenerLibroPorId(
          Number(id),
        );

        if (!libro) {
          Alert.alert(
            'Error',
            'No se encontró el libro.',
          );

          router.back();
          return;
        }

        setTitulo(libro.titulo);
        setAutor(libro.autor);
        setTecnologia(libro.tecnologia);
        setNivel(libro.nivel);
        setEstado(libro.estado);
        setNotas(libro.notas);
        setOrden(String(libro.orden));
      } catch (error) {
        console.error(error);

        Alert.alert(
          'Error',
          'No se pudo cargar el libro.',
        );
      }
    };

    cargarLibro();
  }, [id, obtenerLibroPorId]);

  /**
   * Guarda los cambios realizados.
   */
  const guardarCambios = async () => {
    try {
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

      await actualizarLibro(Number(id), {
        titulo,
        autor,
        tecnologia,
        nivel,
        estado,
        notas,
        orden: Number(orden) || 0,
      });

      Alert.alert(
        'Éxito',
        'Libro actualizado correctamente.',
      );

      router.back();
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'No se pudo actualizar el libro.',
      );
    }
  };

  /**
   * Solicita confirmación y elimina el libro.
   */
  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar libro',
      '¿Seguro que deseas eliminar este libro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarLibro(Number(id));

              Alert.alert(
                'Eliminado',
                'Libro eliminado correctamente.',
              );

              router.back();
            } catch (error) {
              console.error(error);

              Alert.alert(
                'Error',
                'No se pudo eliminar el libro.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.tituloPantalla}>
        Editar libro
      </Text>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Título</Text>

        <TextInput
          style={estilos.input}
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Autor</Text>

        <TextInput
          style={estilos.input}
          value={autor}
          onChangeText={setAutor}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Tecnología</Text>

        <TextInput
          style={estilos.input}
          value={tecnologia}
          onChangeText={setTecnologia}
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Nivel</Text>

        <TextInput
          style={estilos.input}
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
          value={estado}
          onChangeText={(texto) =>
            setEstado(texto as EstadoLibro)
          }
        />
      </View>

      <View style={estilos.grupoCampo}>
        <Text style={estilos.label}>Notas</Text>

        <TextInput
          style={[estilos.input, estilos.inputNotas]}
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
          keyboardType="numeric"
          value={orden}
          onChangeText={setOrden}
        />
      </View>

      <TouchableOpacity
        style={estilos.botonGuardar}
        onPress={guardarCambios}
      >
        <Text style={estilos.textoBoton}>
          Guardar cambios
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilos.botonEliminar}
        onPress={confirmarEliminacion}
      >
        <Text style={estilos.textoBoton}>
          Eliminar libro
        </Text>
      </TouchableOpacity>
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

  botonEliminar: {
    marginTop: 12,
    backgroundColor: '#b00020',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
