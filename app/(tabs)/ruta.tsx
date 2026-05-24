import { useCallback, useMemo } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
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

  const rutasAgrupadas = useMemo(() => {
    const grupos: Record<string, typeof libros> = {};
    libros.forEach(libro => {
      const categoria = libro.categoriaRuta || 'General';
      if (!grupos[categoria]) grupos[categoria] = [];
      grupos[categoria].push(libro);
    });

    return Object.keys(grupos).map(key => ({
      title: `Ruta de ${key}`,
      data: grupos[key].sort((a, b) => a.orden - b.orden)
    }));
  }, [libros]);

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

      <SectionList
        sections={rutasAgrupadas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={estilos.headerSeccion}>
            <Text style={estilos.textoHeaderSeccion}>{title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View style={estilos.itemRuta}>
            <View style={estilos.timelineContainer}>
              <View style={estilos.circuloOrden}>
                <Text style={estilos.textoOrden}>{item.orden}</Text>
              </View>
              {index !== section.data.length - 1 && <View style={estilos.lineaConectora} />}
            </View>

            <View style={estilos.tarjetaContainer}>
              <LibroCard libro={item} onPress={() => abrirLibro(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={estilos.centrado}>
            <Text>No hay rutas disponibles. Añade libros desde crear libro.</Text>
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
  headerSeccion: {
    backgroundColor: '#1f2937', // Un azul/gris oscuro tipo Platzi
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  textoHeaderSeccion: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
