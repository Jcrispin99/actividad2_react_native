import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';

import { useLibros } from '../../hooks/useLibros';
import LibroCard from '../../components/LibroCard';

/**
 * Pantalla Biblioteca.
 * Muestra todos los libros almacenados en SQLite
 * y permite navegar a crear o editar libros.
 */
export default function PantallaBiblioteca() {
  const { libros, cargando, error, recargar } = useLibros();

  // Al volver a esta pantalla (recibir foco) recargamos la lista
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  /**
   * Navega al formulario de creación.
   */
  const irANuevoLibro = () => {
    router.push('/libro/nuevo');
  };

  /**
   * Navega a la pantalla de edición.
   */
  const abrirLibro = (id: number) => {
    router.push(`/libro/${id}`);
  };

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error !== null) {
    return (
      <View style={estilos.centrado}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <Text style={estilos.tituloPantalla}>
          Biblioteca
        </Text>

        <TouchableOpacity
          style={estilos.botonNuevo}
          onPress={irANuevoLibro}
        >
          <Text style={estilos.textoBoton}>
            + Nuevo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(libro) => String(libro.id)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LibroCard libro={item} onPress={() => abrirLibro(item.id)} />
        )}
        ListEmptyComponent={
          <View style={estilos.centrado}>
            <Text>No hay libros todavía.</Text>
          </View>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  tituloPantalla: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  botonNuevo: {
    backgroundColor: '#222222',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  textoBoton: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  lista: {
    padding: 16,
  },
});