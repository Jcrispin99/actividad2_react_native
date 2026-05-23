import { Tabs } from 'expo-router';

/**
 * Layout de pestañas: Biblioteca, Ruta y Perfil.
 * TODO (Integrante 2 - Marvin): añadir iconos y estilos.
 */
export default function LayoutTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Biblioteca' }} />
      <Tabs.Screen name="ruta" options={{ title: 'Ruta' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
