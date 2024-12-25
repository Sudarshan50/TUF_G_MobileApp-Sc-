import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { getVoucherDetails, validateVoucher } from "../../lib/api";
import DotSpinner from "../components/CustomSpinner";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setdata] = useState({});
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Request camera permission
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    setLoading(true);
    setModalVisible(true);
    setScanned(true);
    getVoucherDetails(data)
      .then((res) => {
        if (res.success) {
          setQrData(data);
          setdata(res.data);
        } else {
          Alert.alert(
            "Error",
            res.message,
            [
              {
                text: "Close",
                onPress: () => {
                  setQrData(null);
                  setScanned(false);
                  setModalVisible(false);
                },
                style: "cancel",
              },
            ],
            { cancelable: true }
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleValidation = () => {
    setLoading(true);
    validateVoucher(qrData)
      .then((res) => {
        if (res.success) {
          Alert.alert("Success", res.message);
          setModalVisible(false);
          setQrData(null);
          setScanned(false); // Reset scanner
        } else {
          Alert.alert("Error", res.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!permission) {
    return <View className="flex-1 bg-gray-100" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-gray-800 mb-4">
          We need your permission to use the camera.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 h-full w-full">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setQrData(null);
              setScanned(false);
              setModalVisible(false);
            }}
          />
        }
      >
        <Text className="text-center font-pextrabold"> TUF Gaming</Text>
        {!scanned && (
          <CameraView
            style={{
              height: 220,
              width: 300,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: "65%",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#FFA001",
            }}
            onBarcodeScanned={(d) => {
              handleBarCodeScanned(d);
            }}
          />
        )}
        <View>
          <Text className="text-lg text-gray-800 text-center mt-4">
            Scan the QR code
          </Text>
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
                <DotSpinner color="#0000ff" />
              ) : (
                <>
                  <Text className="text-lg font-bold text-center mb-4">
                    Voucher Details
                  </Text>
                  <Text className="text-gray-700 text-sm mb-4">
                    Pass Id:- {data?.ticketNumber}
                  </Text>
                  <Text className="text-gray-700 text-sm mb-4">
                    Created At:-{" "}
                    {new Date(data?.createdDate).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </Text>
                  <Text
                    className={`text-gray-700 font-pextrabold mb-4 text-center ${
                      !data?.isScanned ? "bg-blue-50" : "bg-red-100"
                    }`}
                  >
                    Status:- {data?.isScanned ? "Scanned" : "Not Scanned"}
                  </Text>
                  <View className={`flex-row justify-between`}>
                    {!data?.isScanned && (
                      <TouchableOpacity
                        className="bg-green-500 px-4 py-2 rounded-lg items-center"
                        onPress={handleValidation}
                      >
                        <Text className="text-white font-bold">Validate</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      className="bg-red-500 px-4 py-2 rounded-lg items-center"
                      onPress={() => {
                        setModalVisible(false);
                        setScanned(false); // Reset scanner
                      }}
                    >
                      <Text className="text-white font-bold">Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
