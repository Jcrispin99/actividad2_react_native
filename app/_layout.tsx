import { Stack } from 'expo-router';

/**
 * Stack raíz de la app.
 * TODO (Integrante 2 - Marvin): añadir cabeceras, opciones globales
 * y rutas modales si las necesitamos.
 */
export default function LayoutRaiz() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="libro/nuevo" options={{ title: 'Nuevo libro' }} />
      <Stack.Screen name="libro/[id]" options={{ title: 'Editar libro' }} />
    </Stack>
  );
}
