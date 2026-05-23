import { StyleSheet, Text, View } from 'react-native';

/**
 * TODO (Integrante 3 - Diego): formulario de alta usando
 * crearLibro() de useLibros.
 */
export default function PantallaNuevoLibro() {
  return (
    <View style={estilos.centrado}>
      <Text>Formulario de nuevo libro (pendiente)</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
