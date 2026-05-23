import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { useLibros } from '../../hooks/useLibros';

/**
 * Pantalla Biblioteca (stub mínimo para que la app arranque
 * y se pueda verificar que el hook lee de SQLite).
 *
 * TODO (Integrante 2 - Marvin): sustituir esta lista plana
 * por LibroCard y darle estilos.
 */
export default function PantallaBiblioteca() {
  const { libros, cargando, error } = useLibros();

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
    <FlatList
      data={libros}
      keyExtractor={(libro) => String(libro.id)}
      contentContainerStyle={estilos.lista}
      renderItem={({ item }) => (
        <View style={estilos.fila}>
          <Text style={estilos.titulo}>{item.titulo}</Text>
          <Text>
            {item.tecnologia} · {item.nivel} · {item.estado}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={estilos.centrado}>
          <Text>No hay libros todavía.</Text>
        </View>
      }
    />
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  lista: { padding: 16 },
  fila: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  titulo: { fontSize: 16, fontWeight: '600' },
});
