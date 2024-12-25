import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAnalytics } from "../../lib/api";
import DotSpinner from "../components/CustomSpinner";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({});
  const [newVouchers, setNewVouchers] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    getAnalytics().then((res) => {
      if (res.success) {
        setData(res.data);
        setLoading(false);
      }
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    getAnalytics().then((res) => {
      if (res.success) {
        setRefreshing(false);
        setLoading(false);
        setData(res.data);
      }
    });
  };

  const handleGenerateVouchers = () => {
    if (!newVouchers) {
      return Alert.alert(
        "Error",
        "Please enter the number of vouchers to generate"
      );
    }
    Alert.alert(
      "Confirm Generation",
      `Are you sure you want to generate ${newVouchers} vouchers?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Generate",
          onPress: () => setModalVisible(true),
        },
      ]
    );
  };
  const chartData = [
    {
      name: "Used Vouchers",
      population: data?.used || 0,
      color: "#f51720",
      legendFontColor: "#333",
      legendFontSize: 13,
      legendFontWeight: "bold",
    },
    {
      name: "Rem. Vouchers",
      population: data?.unused || 0,
      color: "#59981a",
      legendFontColor: "#333",
      legendFontSize: 13,
      legendFontWeight: "bold",
    },
  ];
  let totalVouchers = data?.used + data?.unused || 0;
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <DotSpinner color="#0000ff" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 h-full w-full bg-white p-4">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-center mb-4 text-gray-800">
          Voucher Analytics
        </Text>

        <View className="items-center">
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"16"}
            absolute
          />
        </View>

        <View className="mt-4">
          {chartData.map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <View
                className="h-4 w-4 rounded-full "
                style={{ backgroundColor: item.color }}
              />
              <Text className="ml-2 text-gray-700">{item.name}</Text>
            </View>
          ))}
        </View>

        <Text className="mt-6 font-pregular text-gray-800 text-center">
          Total Passes Available: {totalVouchers}
        </Text>

        {/* Voucher Generation */}
        <View className="mt-6">
          <Text className="text-gray-800 mb-2">Generate New Vouchers</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2"
            placeholder="Enter number of vouchers"
            keyboardType="numeric"
            value={newVouchers}
            onChangeText={setNewVouchers}
          />
          <TouchableOpacity
            className="mt-4 bg-blue-500 p-2 rounded-lg items-center"
            onPress={handleGenerateVouchers}
          >
            <Text className="text-white font-bold">Generate</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="bg-white w-4/5 p-5 rounded-xl">
              {loading ? (
                <DotSpinner color="#f51720" />
              ) : (
                <>
                  <Text className="font-pregular font-bold text-center mb-4">
                    Download Vouchers
                  </Text>
                  <Text className="text-gray-700 font-plight mb-4">
                    This feature will be available soon. Please check back
                    later!
                  </Text>
                  <TouchableOpacity
                    className="bg-green-500 px-4 py-2 rounded-lg items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white font-bold">Thanks</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
