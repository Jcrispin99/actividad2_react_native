import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Libro } from '../db/database';

interface Props {
  libro: Libro;
  onPress: () => void;
}

export default function LibroCard({ libro, onPress }: Props) {
  const obtenerColorEstado = (estado: Libro['estado']) => {
    switch (estado) {
      case 'completado':
        return '#4ade80';
      case 'leyendo':
        return '#fbbf24';
      case 'pendiente':
      default:
        return '#9ca3af';
    }
  };

  return (
    <TouchableOpacity style={estilos.tarjeta} onPress={onPress}>
      <Text style={estilos.tituloLibro}>{libro.titulo}</Text>
      <Text style={estilos.textoSecundario}>Autor: {libro.autor}</Text>
      <Text style={estilos.textoSecundario}>Tecnología: {libro.tecnologia}</Text>
      
      <View style={estilos.filaEtiquetas}>
        <View style={estilos.etiquetaNivel}>
          <Text style={estilos.textoEtiquetaNivel}>Nivel: {libro.nivel}</Text>
        </View>
        <View style={[estilos.etiquetaEstado, { backgroundColor: obtenerColorEstado(libro.estado) }]}>
          <Text style={estilos.textoEtiquetaEstado}>{libro.estado}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tituloLibro: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  textoSecundario: {
    fontSize: 15,
    marginBottom: 4,
    color: '#4b5563',
  },
  filaEtiquetas: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  etiquetaNivel: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoEtiquetaNivel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  etiquetaEstado: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoEtiquetaEstado: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
