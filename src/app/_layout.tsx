import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          fontWeight: "900",
          color: "#1c1917",
        },
        headerTintColor: "#047857",
        headerBackTitle: "Voltar",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ title: "Receitas Sugeridas" }} />
      <Stack.Screen name="recipe/[id]" options={{ title: "Detalhes da Receita" }} />
    </Stack>
  );
}
