import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, router } from 'expo-router';

import { useLibros } from '../../hooks/useLibros';
import LibroCard from '../../components/LibroCard';

export default function PantallaRuta() {
  const { libros, cargando, error, recargar } = useLibros();

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

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
        <Text style={estilos.tituloPantalla}>Ruta de Aprendizaje</Text>
        <Text style={estilos.subtitulo}>Sigue tu camino paso a paso</Text>
      </View>

      <FlatList
        data={libros}
        keyExtractor={(libro) => String(libro.id)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={estilos.itemRuta}>
            <View style={estilos.timelineContainer}>
              <View style={estilos.circuloOrden}>
                <Text style={estilos.textoOrden}>{item.orden}</Text>
              </View>
              {index !== libros.length - 1 && <View style={estilos.lineaConectora} />}
            </View>

            <View style={estilos.tarjetaContainer}>
              <LibroCard libro={item} onPress={() => abrirLibro(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={estilos.centrado}>
            <Text>No hay libros en tu ruta. Añade algunos desde la biblioteca.</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tituloPantalla: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitulo: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  itemRuta: {
    flexDirection: 'row',
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  circuloOrden: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6', // Azul
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 16, // Alinear un poco con el inicio de la tarjeta
  },
  textoOrden: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lineaConectora: {
    width: 2,
    flex: 1,
    backgroundColor: '#cbd5e1',
    marginTop: -8, // Para conectar bien debajo del círculo
    marginBottom: -24, // Para extender hacia la siguiente tarjeta y sobrepasar el gap
    zIndex: 1,
  },
  tarjetaContainer: {
    flex: 1,
  },
});
