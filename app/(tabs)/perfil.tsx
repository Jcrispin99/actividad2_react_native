import { useMemo, useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLibros } from '../../hooks/useLibros';
import { useFocusEffect } from 'expo-router';

/**
 * Pantalla de perfil y estadísticas.
 * Permite editar datos simples del usuario
 * y visualizar métricas de lectura.
 */
export default function PantallaPerfil() {
  const { libros, recargar } = useLibros();

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  // Datos básicos del perfil
  const [nombre, setNombre] = useState('Diego');
  const [objetivo, setObjetivo] = useState(
    'Convertirme en desarrollador full stack.',
  );

  /**
   * Estadísticas calculadas a partir de los libros.
   */
  const estadisticas = useMemo(() => {
    const pendientes = libros.filter(
      (libro) => libro.estado === 'pendiente',
    ).length;

    const leyendo = libros.filter(
      (libro) => libro.estado === 'leyendo',
    ).length;

    const completados = libros.filter(
      (libro) => libro.estado === 'completado',
    ).length;

    return {
      total: libros.length,
      pendientes,
      leyendo,
      completados,
    };
  }, [libros]);

  /**
   * Simula guardar datos del perfil.
   */
  const guardarPerfil = () => {
    Alert.alert(
      'Perfil actualizado',
      'Los datos del perfil fueron actualizados correctamente.',
    );
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.tituloPantalla}>
        Perfil y estadísticas
      </Text>

      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>
          Datos del usuario
        </Text>

        <View style={estilos.grupoCampo}>
          <Text style={estilos.label}>Nombre</Text>

          <TextInput
            style={estilos.input}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={estilos.grupoCampo}>
          <Text style={estilos.label}>
            Objetivo de aprendizaje
          </Text>

          <TextInput
            style={[estilos.input, estilos.inputNotas]}
            multiline
            numberOfLines={3}
            value={objetivo}
            onChangeText={setObjetivo}
          />
        </View>

        <TouchableOpacity
          style={estilos.botonGuardar}
          onPress={guardarPerfil}
        >
          <Text style={estilos.textoBoton}>
            Guardar perfil
          </Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>
          Estadísticas de lectura
        </Text>

        <View style={estilos.itemEstadistica}>
          <Text style={estilos.textoEstadistica}>
            Total de libros
          </Text>

          <Text style={estilos.valorEstadistica}>
            {estadisticas.total}
          </Text>
        </View>

        <View style={estilos.itemEstadistica}>
          <Text style={estilos.textoEstadistica}>
            Pendientes
          </Text>

          <Text style={estilos.valorEstadistica}>
            {estadisticas.pendientes}
          </Text>
        </View>

        <View style={estilos.itemEstadistica}>
          <Text style={estilos.textoEstadistica}>
            Leyendo
          </Text>

          <Text style={estilos.valorEstadistica}>
            {estadisticas.leyendo}
          </Text>
        </View>

        <View style={estilos.itemEstadistica}>
          <Text style={estilos.textoEstadistica}>
            Completados
          </Text>

          <Text style={estilos.valorEstadistica}>
            {estadisticas.completados}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
  },

  tituloPantalla: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    minHeight: 90,
    textAlignVertical: 'top',
  },

  botonGuardar: {
    marginTop: 10,
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

  itemEstadistica: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  textoEstadistica: {
    fontSize: 16,
  },

  valorEstadistica: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
