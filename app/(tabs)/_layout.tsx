import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * Layout de pestañas: Biblioteca, Ruta y Perfil.
 * Cada pestaña recibe un icono de Ionicons que cambia entre
 * variante rellena (activa) y outline (inactiva), patrón
 * estándar en apps móviles.
 *
 * TODO (Integrante 2 - Marvin): refinar estilos si hace falta.
 */
export default function LayoutTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ruta"
        options={{
          title: 'Ruta',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
