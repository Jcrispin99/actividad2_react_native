import { StyleSheet, Text, View } from 'react-native';

/**
 * TODO (Integrante 2 - Marvin): pintar los libros ordenados
 * por `orden` reutilizando el componente LibroCard.
 */
export default function PantallaRuta() {
  return (
    <View style={estilos.centrado}>
      <Text>Ruta de aprendizaje (pendiente)</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
