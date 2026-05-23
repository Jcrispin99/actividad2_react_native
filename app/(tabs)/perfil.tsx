import { StyleSheet, Text, View } from 'react-native';

/**
 * TODO (Integrante 3 - Diego): perfil del usuario editable
 * + contadores de libros por estado usando useLibros.
 */
export default function PantallaPerfil() {
  return (
    <View style={estilos.centrado}>
      <Text>Perfil y estadísticas (pendiente)</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
