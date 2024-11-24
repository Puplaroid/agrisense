import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Picker,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Header from "../components/Header";


export default function WaterGateControlDetail({ route }) {
    const { deviceId } = route.params; // Extract `deviceId` passed via navigation
    const [gateData, setGateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    console.log("Device ID in WaterGateControlDetail:", deviceId);

 

    const fetchWaterGateData = async () => {
        try {
            const headersList = {
                Accept: "*/*",
            };

            const response = await fetch(
                `http://3.27.146.110/device/watergatecontrol/info/${deviceId}`,
                {
                    method: "GET",
                    headers: headersList,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Water Gate Data:", data);
                setGateData(data[0]); // Assuming the API always returns an array
                console.log("Water Gate Data2:", gateData);

            } else {
                throw new Error("Failed to fetch water gate data.");
            }
        } catch (error) {
            console.error("Error fetching water gate data:", error);
            Alert.alert("Error", "Could not fetch water gate data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGateData = async () => {
        setUpdating(true);
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const response = await fetch("http://3.27.146.110/device/watergatecontrol", {
                method: "PUT",
                headers: headersList,
                body: JSON.stringify(gateData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setGateData(updatedData);
                fetchWaterGateData(); // Refresh the data
                Alert.alert("Success", "Water gate data updated successfully!");
            } else {
                throw new Error("Failed to update water gate data.");
            }
        } catch (error) {
            console.error("Error updating water gate data:", error);
            Alert.alert("Error", "Could not update water gate data. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchWaterGateData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!gateData) {
        return (
            <View style={styles.container}>
                <Header />
                <Text style={styles.noDataText}>No water gate data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header />
            <Text style={styles.title}>Water Gate Control Detail</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Name: {gateData.name} </Text>
                {/* <TextInput
                    style={styles.input}
                    value={gateData.name}
                    onChangeText={(text) => setGateData({ ...gateData, name: text })}
                /> */}

                <Text style={styles.label}>Flow Direction: {gateData.flow_direction} </Text>
                {/* <Picker
                    selectedValue={gateData.flow_direction}
                    style={styles.input}
                    onValueChange={(itemValue) => setGateData({ ...gateData, flow_direction: itemValue })}
                >
                    <Picker.Item label="IN" value="IN" />
                    <Picker.Item label="OUT" value="OUT" />
                </Picker> */}

                <Text style={styles.label}>Status:</Text>
                <Picker
                    selectedValue={gateData.status}
                    style={styles.input}
                    onValueChange={(itemValue) => setGateData({ ...gateData, status: itemValue })}
                >
                    <Picker.Item label="ON" value="ON" />
                    <Picker.Item label="OFF" value="OFF" />
                    <Picker.Item label="FAULT" value="FAULT" />
                </Picker>

                <Text style={styles.label}>Flow Rate: {gateData.flow_rate}</Text>
                {/* <TextInput
                    style={styles.input}
                    value={gateData.flow_rate.toString()}
                    onChangeText={(text) =>
                        setGateData({ ...gateData, flow_rate: parseFloat(text) })
                    }
                    keyboardType="numeric"
                /> */}

                <Text style={styles.label}>Auto Mode:</Text>
                <Picker
                    selectedValue={gateData.auto_mode}
                    style={styles.input}
                    onValueChange={(itemValue) => setGateData({ ...gateData, auto_mode: itemValue })}
                >
                    <Picker.Item label="ON" value="ON" />
                    <Picker.Item label="OFF" value="OFF" />
                </Picker>
            </View>

            <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateGateData}
                disabled={updating}
            >
                <Text style={styles.buttonText}>
                    {updating ? "Updating..." : "Update Water Gate"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#007bff",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    updateButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    noDataText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
});
