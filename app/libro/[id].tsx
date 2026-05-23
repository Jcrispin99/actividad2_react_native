import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * TODO (Integrante 3 - Diego): cargar el libro por id,
 * permitir edición (actualizarLibro) y borrado (eliminarLibro).
 */
export default function PantallaEditarLibro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={estilos.centrado}>
      <Text>Editar libro #{id} (pendiente)</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
