import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Header from "../components/Header";

export default function DeviceDetail({ route }) {
    const { deviceId } = route.params; // Extract device_id from navigation params
    const [deviceDetail, setDeviceDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch device details
    const fetchDeviceDetail = async () => {
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const response = await fetch(`http://3.27.146.110/device/info/${deviceId}`, {
                method: "GET",
                headers: headersList,
            });

            if (response.ok) {
                const data = await response.json();
                setDeviceDetail(data[0]); // Assume data is an array and we take the first object
            } else {
                throw new Error("Failed to fetch device details");
            }
        } catch (error) {
            console.error("Error fetching device details:", error);
            Alert.alert("Error", "Could not fetch device details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDeviceDetail();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!deviceDetail) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load device details.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.header}>Device Details</Text>
            <View style={styles.card}>
                <Text style={styles.deviceTitle}>Device ID: {deviceDetail.device_id || "N/A"}</Text>
                <Text style={styles.deviceText}>Name: {deviceDetail.name || "N/A"}</Text>
                <Text style={styles.deviceText}>Type: {deviceDetail.type || "N/A"}</Text>
                <Text style={styles.deviceText}>
                    Latitude: {deviceDetail.latitude !== undefined ? deviceDetail.latitude : "N/A"}
                </Text>
                <Text style={styles.deviceText}>
                    Longitude: {deviceDetail.longitude !== undefined ? deviceDetail.longitude : "N/A"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    header: {
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
        marginBottom: 20,
        width: "90%",
    },
    deviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    deviceText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
});
