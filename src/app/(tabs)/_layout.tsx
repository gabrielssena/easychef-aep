import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#047857",
        tabBarInactiveTintColor: "#78716c",
        headerStyle: {
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#e7e5e4",
        },
        headerTitleStyle: {
          fontWeight: "900",
          color: "#1c1917",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
          headerTitle: "EasyChef",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "camera" : "camera-outline"} size={24} color={color} />
          ),
          headerTitle: "Escanear Geladeira",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Impacto",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={color} />
          ),
          headerTitle: "Seu Impacto ODS 12",
        }}
      />
    </Tabs>
  );
}
