import { Redirect } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import CustomSpinner from "./components/CustomSpinner";
export default function App() {
  const [loading, setLoading] = useState(true);
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  useEffect(() => {
    handleLoading();
  }, []);
  return (
    <SafeAreaView className="h-full bg-primary">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-psemibold text-white">
            TUF Scanner
          </Text>
          <CustomSpinner />
          <View className="mt-4">
            <Text className="text-white font-pregular">Sudarshan</Text>
          </View>
        </View>
      ) : (
        <Redirect href="/scan_screen" />
      )}
    </SafeAreaView>
  );
}
