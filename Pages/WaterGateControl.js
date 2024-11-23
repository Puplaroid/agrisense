import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    TextInput,
    Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install this library if not already installed
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

export default function WaterGateControl({ route }) {
    const { farmID } = route.params; // Pass `farmId` to the page
    const [devices, setDevices] = useState([]);
    const [pumps, setPump] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [selectedFieldId, setSelectedFieldId] = useState("");
    const [inputGateData, setInputGateData] = useState({
        device_id: "",
        field_id: "",
        name: "",
        flow_direction: "IN",
        status: "ON",
        flow_rate: 0,
        open_time: "",
        close_time: "",
        auto_mode: "ON",
    });

    const navigation = useNavigation();

    // Fetch devices for the farm
    const fetchDevices = async () => {
        try {
            const headersList = {
                Accept: "*/*",
            };

            const response = await fetch(`http://3.27.146.110/device/${farmID}`, {
                method: "GET",
                headers: headersList,
            });

            if (response.ok) {
                const data = await response.json();
                const filteredPump = data.filter((device) => device.type === "Pump"); // Filter Pipe devices
                setDevices(data);
                setPump(filteredPump);

                console.log("Devices:", data);
                console.log("Pumps:", filteredPump);
            } else {
                throw new Error("Failed to fetch devices.");
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
            Alert.alert("Error", "Could not fetch device data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [field, setField] = useState([]);

    // Fetch devices for the farm
    const fetchField = async () => {
        try {
            const headersList = {
                Accept: "*/*",
            };

            const response = await fetch(`http://3.27.146.110/field/${farmID}`, {
                method: "GET",
                headers: headersList,
            });

            if (response.ok) {
                const data = await response.json();
                setField(data);
                console.log("Field:", data);
            } else {
                throw new Error("Failed to fetch devices.");
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
            Alert.alert("Error", "Could not fetch device data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [waterGateControl, setWaterGateControl] = useState([]);
    // Fetch devices for the farm
    const fetchWaterGateDevice = async () => {
        try {
            const headersList = {
                Accept: "*/*",
            };

            const response = await fetch(`http://3.27.146.110/device/watergatecontrol/${farmID}`, {
                method: "GET",
                headers: headersList,
            });

            if (response.ok) {
                const data = await response.json();
                setWaterGateControl(data);
                console.log("WaterGateControl:", data);
            } else {
                throw new Error("Failed to fetch devices.");
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
            Alert.alert("Error", "Could not fetch device data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const notUsedPumps = pumps.filter(
        (device) =>
            device.type === "Pump" &&
            !(waterGateControl || []).some((gate) => gate.device_id === device.id)
    );


    useEffect(() => {
        fetchDevices();
        fetchWaterGateDevice();
        fetchField();
        // filteredPumps();
    }, []);


    const handleDeviceChange = (deviceId) => {
        setSelectedDeviceId(deviceId);

        const selectedDevice = notUsedPumps.find((device) => device.device_id === deviceId);
        if (selectedDevice) {
            setSelectedFieldId(selectedDevice.field_id.toString()); // Automatically set the field based on device
            setInputGateData((prevState) => ({
                ...prevState,
                device_id: deviceId,
                field_id: selectedDevice.field_id,
            }));
        }
    };

    const handleFieldChange = (fieldId) => {
        setSelectedFieldId(fieldId);

        setInputGateData((prevState) => ({
            ...prevState,
            field_id: fieldId, // Update only the field_id in inputGateData
        }));
    };



    const gotoWaterGateControlDetail = (id) => {
        navigation.navigate("WaterGateControlDetail", { deviceId: id });
    };

    const renderDevice = ({ item }) => (
        <TouchableOpacity
            style={styles.deviceCard}
            activeOpacity={0.8}
            onPress={() => gotoWaterGateControlDetail(item.id)}
        >
            <Text style={styles.deviceTitle}>Device ID: {item.device_id}</Text>
            <Text style={styles.deviceText}>Name: {item.name}</Text>
            <Text style={styles.deviceText}>Latitude: {item.latitude}</Text>
            <Text style={styles.deviceText}>Longitude: {item.longitude}</Text>
        </TouchableOpacity>
    );

    const handleCreateGateControl = async () => {
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            console.log("Input Gate Data:", inputGateData);
            const bodyContent = JSON.stringify({
                ...inputGateData, // Include existing addressData properties
                device_id: selectedDeviceId,
                // farm_id: farmID, // Include the farmer ID
            });
            console.log("Body Content:", bodyContent);

            const response = await fetch("http://3.27.146.110/device/watergatecontrol", {
                method: "POST",
                headers: headersList,
                body: bodyContent,
            });

            if (response.ok) {
                Alert.alert("Success", "Water Gate Control created successfully!");
                setIsAddModalVisible(false);
                fetchDevices(); // Refresh devices list if needed
                fetchWaterGateDevice(); // Refresh water gate control list
            } else {
                throw new Error("Failed to create water gate control.");
            }
        } catch (error) {
            console.error("Error creating water gate control:", error);
            Alert.alert("Error", "Could not create water gate control. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innercontainer}>
                <Header />
                <Text style={styles.header}>Water Gate Control</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : waterGateControl.length > 0 ? (
                    <FlatList
                        data={waterGateControl}
                        keyExtractor={(item) => item.device_id}
                        renderItem={renderDevice}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <Text style={styles.noDataText}>No devices available.</Text>
                )}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Add Water Gate Control</Text>
                </TouchableOpacity>

                <Text style={styles.header}>Pump available</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : notUsedPumps.length > 0 ? (
                    <FlatList
                        data={notUsedPumps}
                        keyExtractor={(item) => item.device_id}
                        renderItem={renderDevice}
                        contentContainerStyle={styles.listContainer}
                    />
                ) : (
                    <Text style={styles.noDataText}>No pump available.</Text>
                )}

                {/* Add Water Gate Modal */}
                <Modal visible={isAddModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Water Gate Control</Text>
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <Text style={styles.label}>Select Device (Type: Pump):</Text>
                                <Picker
                                    selectedValue={selectedDeviceId}
                                    onValueChange={(value) => handleDeviceChange(value)}
                                    style={styles.input}
                                >
                                    <Picker.Item label="Select Device" value="" />
                                    {notUsedPumps.map((pump) => (
                                        <Picker.Item
                                            key={pump.device_id}
                                            label={`${pump.device_id} - ${pump.name}`}
                                            value={pump.id}
                                        />
                                    ))}
                                </Picker>

                                <Text style={styles.label}>Field ID:</Text>
                                <Picker
                                    selectedValue={selectedFieldId}
                                    onValueChange={(value) => handleFieldChange(value)}
                                    style={styles.input}
                                >
                                    <Picker.Item label="Select Field" value="" />
                                    {field.map((f) => (
                                        <Picker.Item
                                            key={f.id}
                                            label={`${f.id} - field ${f.name}`}
                                            value={f.id}
                                        />
                                    ))}
                                </Picker>

                                <Text style={styles.label}>Name:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    value={inputGateData.name}
                                    onChangeText={(text) =>
                                        setInputGateData({ ...inputGateData, name: text })
                                    }
                                />
                                <Text style={styles.label}>Flow Direction:</Text>
                                <Picker
                                    selectedValue={inputGateData.flow_direction}
                                    onValueChange={(value) =>
                                        setInputGateData({ ...inputGateData, flow_direction: value })
                                    }
                                    style={styles.input}
                                >
                                    <Picker.Item label="Select Flow Direction" value="" />
                                    <Picker.Item label="IN" value="IN" />
                                    <Picker.Item label="OUT" value="OUT" />
                                </Picker>

                                <Text style={styles.label}>Status:</Text>
                                <Picker
                                    selectedValue={inputGateData.status}
                                    onValueChange={(value) =>
                                        setInputGateData({ ...inputGateData, status: value })
                                    }
                                    style={styles.input}
                                >
                                    <Picker.Item label="Select Status" value="" />
                                    <Picker.Item label="ON" value="ON" />
                                    <Picker.Item label="OFF" value="OFF" />
                                    <Picker.Item label="FAULT" value="FAULT" />
                                </Picker>

                                <Text style={styles.label}>Auto Mode:</Text>
                                <Picker
                                    selectedValue={inputGateData.auto_mode}
                                    onValueChange={(value) =>
                                        setInputGateData({ ...inputGateData, auto_mode: value })
                                    }
                                    style={styles.input}
                                >
                                    <Picker.Item label="Select Auto Mode" value="" />
                                    <Picker.Item label="ON" value="ON" />
                                    <Picker.Item label="OFF" value="OFF" />
                                </Picker>

                                {/* <Text style={styles.label}>Flow Rate:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Flow Rate"
                                value={inputGateData.flow_rate.toString()}
                                onChangeText={(text) =>
                                    setInputGateData({
                                        ...inputGateData,
                                        flow_rate: parseFloat(text),
                                    })
                                }
                                keyboardType="numeric"
                            />
                            <Text style={styles.label}>Open Time:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Open Time (e.g., 10:00:00)"
                                value={inputGateData.open_time}
                                onChangeText={(text) =>
                                    setInputGateData({ ...inputGateData, open_time: text })
                                }
                            />
                            <Text style={styles.label}>Close Time:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Close Time (e.g., 11:00:00)"
                                value={inputGateData.close_time}
                                onChangeText={(text) =>
                                    setInputGateData({ ...inputGateData, close_time: text })
                                }
                            /> */}
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleCreateGateControl}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
}
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    innercontainer: {
        flex: 1,
        maxHeight: SCREEN_HEIGHT * 0.9,
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#007bff",
    },
    listContainer: {
        paddingBottom: 20,
    },
    deviceCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    deviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    deviceText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        height: "90%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        paddingBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 15,
        borderRadius: 10,
        flex: 1,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    noDataText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
});
