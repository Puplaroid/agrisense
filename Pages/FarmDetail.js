import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput,
    Dimensions,
    Picker,
} from "react-native";

import Header from "../components/Header";
import AvgWaterLevel from "./AvgWaterLevel";
import MethaneGraph from "./MethaneGraph";
import TempGraph from "./TempGraph";
import LightGraph from "./LightGraph";
import HumidityGraph from "./HumidityGraph";
import TotalWaterGraph from "./TotalWaterGraph";
import ShowCarbonFootprint from "./ShowCarbonFootprint";

import { useNavigation } from "@react-navigation/native";

export default function FarmDetail({ route }) {
    const navigation = useNavigation();
    const { farmID } = route.params;
    const [farmDetail, setFarmDetail] = useState(null);
    const [addressData, setAddressData] = useState({});
    const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false);
    const [FarmField, setFarmField] = useState([]);
    const [fieldId, setFieldId] = useState(null);
    const [emissionData, setEmissionData] = useState([]);

    // Handle input changes for address
    const [newAddress, setNewAddress] = useState({
        house_no: "",
        street: "",
        village: "",
        sub_district: "",
        district: "",
        province: "",
        postcode: "",
        latitude: "",
        longitude: "",
    });

    const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
    const [inputField, setInputField] = useState({
        name: "",
        area: "",
        latitude: "",
        longitude: "",
    });

    
    
    
    const handleUpdate = () => {
        fetchFarmDetail();
        fetchFarmAddress();
        fetchFarmField();
        fetchFarmDevice();
    };


    const [isAddDeviceModalVisible, setIsAddDeviceModalVisible] = useState(false);
    const generateNextDeviceId = (devices = []) => {
        if (!devices || devices.length === 0) return "D-102"; // Default start
    
        const ids = devices
            .map((device) => {
                if (device && device.device_id) {
                    const idPart = parseInt(device.device_id.split("-")[1]); // Extract numeric part
                    return !isNaN(idPart) ? idPart : null; // Ensure valid number or null
                }
                return null; // Return null for invalid or missing device_id
            })
            .filter((id) => id !== null); // Filter out null values
    
        if (ids.length === 0) return "D-102"; // If no valid IDs, return default
    
        const maxId = Math.max(...ids); // Find the highest number
        return `D-${maxId + 1}`; // Increment and return the next ID
    };
    
    const [device, setDevice] = useState([]); // Initially empty array
    const [inputDevice, setInputDevice] = useState({
        device_id: generateNextDeviceId(device || []), // Default ID until `device` is loaded
        name: "",
        type: "",
        latitude: "",
        longitude: ""
    });

    // Update inputDevice once device data is available
    useEffect(() => {
        if (device.length > 0) {
            setInputDevice((prev) => ({
                ...prev,
                device_id: generateNextDeviceId(device), // Generate next ID
            }));
        }
    }, [device]);





    const gotoFieldDetail = (fieldId) => {
        console.log("Send Field ID:", fieldId);
        navigation.navigate("FieldDetail", { fieldId });
    };
    const gotoDeviceDetail = (deviceId) => {
        console.log("Send Device ID:", deviceId);
        navigation.navigate("DeviceDetail", { deviceId });
    }



    // Fetch Farm Details
    const fetchFarmDetail = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/farm/info/${farmID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFarmDetail(data);

            } else {
                Alert.alert("Error", data.message || "Failed to fetch farm details.");
            }
        } catch (error) {
            console.error("Error fetching farm detail:", error);
            Alert.alert("Error", "Something went wrong while fetching farm details.");
        }
    };

    // Fetch Farm Address
    const fetchFarmAddress = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/farm/address/${farmID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setAddressData(data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch farm address.");
            }
        } catch (error) {
            console.error("Error fetching farm address:", error);
            Alert.alert("Error", "Something went wrong while fetching farm address.");
        }
    };

    const fetchFarmField = async () => {

        try {
            const response = await fetch(`http://3.27.146.110/field/${farmID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFarmField(data);

                
                console.log("Farm Field:", data);
                console.log("Field ID[0]:", data[3]?.id);
                setFieldId(data[0]?.id);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch farm address.");
            }
        } catch (error) {
            console.error("Error fetching farm address:", error);
            Alert.alert("Error", "Something went wrong while fetching farm address.");
        }
    };

    const fetchFarmDevice = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/device/${farmID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setDevice(data);
                console.log("Farm Device:", data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch device.");
            }
        } catch (error) {
            console.error("Error fetching device:", error);
            Alert.alert("Error", "Something went wrong while fetching device.");
        }
    };

    
    
    const fetchEmissionData = async () => {
        
        console.log("Field ID in fetchEmissionData:", fieldId);
        
        try {
            const response = await fetch(`http://3.27.146.110/field/emissiondata/${fieldId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setEmissionData(data);
                console.log("Emission data:", data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch emission data.");
            }
        } catch (error) {
            console.error("Error fetching emission data:", error);
            Alert.alert("Error", "Something went wrong while fetching emission data.");
        }
    };

    useEffect(() => {
        if (fieldId) {
            fetchEmissionData(); // Call only when fieldId is available
            const interval = setInterval(() => {
                fetchEmissionData();
            }, 5000); // Fetch data every 5 seconds
            return () => clearInterval(interval); // Clear interval on unmount
        }
    }, [fieldId]);

    useEffect(() => {
        fetchFarmDetail();
        fetchFarmAddress();
        fetchFarmField();
        fetchFarmDevice();
    }, []);


    const handlePostAddAddressData = async () => {
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const bodyContent = JSON.stringify({
                ...newAddress,
                farm_id: farmID, // Pass the farm ID
                create_at: new Date().toISOString(), // Add timestamp
            });

            console.log("newAddress", newAddress);

            console.log("bodyContent", bodyContent);

            const response = await fetch("http://3.27.146.110/farm/address", {
                method: "POST",
                headers: headersList,
                body: bodyContent,
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Success", "Address added successfully!");
                setAddressData((prev) => [...prev, data]); // Append the new address
                handleUpdate();
                setIsAddAddressModalVisible(false); // Close modal
            } else {
                throw new Error("Failed to add address.");
            }
        } catch (error) {
            console.error("Error adding address:", error);
            Alert.alert("Error", "Failed to add address.");
        }
    };

    const handlePostAddFieldData = async () => {
        if (
            !inputField.name ||
            !inputField.area ||
            isNaN(inputField.latitude) ||
            isNaN(inputField.longitude)
        ) {
            Alert.alert("Error", "Please fill in all fields with valid data.");
            return;
        }

        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const bodyContent = JSON.stringify({
                ...inputField,
                farm_id: farmID, // Attach farm_id to link the field
                create_at: new Date().toISOString(),
            });

            const response = await fetch("http://3.27.146.110/field/create", {
                method: "POST",
                headers: headersList,
                body: bodyContent,
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Success", "Field added successfully!");
                setFarmField((prev) => [...prev, data]); // Add the new field to the list
                // console.log("field Id after add:", FarmField[0]?.id);
                // fieldId = FarmField[0]?.id;
                handleUpdate();
                setIsAddFieldModalVisible(false); // Close modal
            } else {
                throw new Error("Failed to add field.");
            }
        } catch (error) {
            console.error("Error adding field:", error);
            Alert.alert("Error", "Failed to add field.");
        }
    };

    const handlePostAddDeviceData = async () => {

        const bodyContent = JSON.stringify({
            ...inputDevice, // Include existing addressData properties
            farm_id: farmID, // Include the farmer ID
        });

        console.log("Farm ID for fetch device:", farmID);
        console.log("inputDevice", inputDevice);
        console.log("bodyContent", bodyContent);

        try {
            const response = await fetch("http://3.27.146.110/device/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: bodyContent,
            });

            if (response.ok) {
                const newDevice = await response.json();
                setDevice((prev) => [...prev, newDevice]); // Add new device to the list
                handleUpdate();
                Alert.alert("Success", "Device added successfully!");
                setIsAddDeviceModalVisible(false); // Close modal
            } else {
                throw new Error("Failed to add device");
            }
        } catch (error) {
            console.error("Error adding device:", error);
            Alert.alert("Error", "Failed to add device. Please try again.");
        }
    };


    const handleAddField = () => {
        setIsAddFieldModalVisible(true);
    };

    const handleInputAddressChange = (field, value) => {
        setNewAddress((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputFieldChange = (field, value) => {
        setInputField((prev) => ({
            ...prev,
            [field]: field === "area" || field === "latitude" || field === "longitude" ? parseFloat(value) || "" : value,
        }));
    };

    const handleInputDeviceChange = (field, value) => {
        setInputDevice((prev) => ({ ...prev, [field]: value }));
    };

    const gotoWaterGateControl = () => {
        navigation.navigate("WaterGateControl", { farmID });
    }






    if (!farmDetail) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>Loading farm details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innercontainer}>
                <Header />
                <Text style={styles.header}>Farm Details</Text>
                <View style={styles.card}>
                    <Text style={styles.title}>Farm ID: {farmDetail[0]?.id || "N/A"}</Text>
                    <Text>Description: {farmDetail[0]?.description || "N/A"}</Text>
                    <Text>Area: {farmDetail[0]?.area || "N/A"} acres</Text>
                    <Text>Total Rice Harvest: {farmDetail[0]?.totalRiceHarvest || "N/A"} tons</Text>
                    <Text>
                        Created At:{" "}
                        {farmDetail[0]?.create_at
                            ? new Date(farmDetail[0]?.create_at).toLocaleString()
                            : "N/A"}
                    </Text>
                </View>

                {addressData.length === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsAddAddressModalVisible(true)}>
                        <Text style={styles.addButtonText}>Add Address</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Address</Text>
                        <Text>House No: {addressData[0]?.house_no}</Text>
                        <Text>Street: {addressData[0]?.street}</Text>
                        <Text>Village: {addressData[0]?.village}</Text>
                        <Text>Sub-district: {addressData[0]?.sub_district}</Text>
                        <Text>District: {addressData[0]?.district}</Text>
                        <Text>Province: {addressData[0]?.province}</Text>
                        <Text>Postcode: {addressData[0]?.postcode}</Text>
                        <Text>Latitude: {addressData[0]?.latitude}</Text>
                        <Text>Longitude: {addressData[0]?.longitude}</Text>
                        <Text>
                            Created At:{" "}
                            {addressData[0]?.create_at
                                ? new Date(addressData[0]?.create_at).toLocaleString()
                                : "N/A"}
                        </Text>
                    </View>
                )}

                <Modal visible={isAddAddressModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Address</Text>

                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="House No"
                                    value={newAddress.house_no}
                                    onChangeText={(text) => handleInputAddressChange("house_no", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Street"
                                    value={newAddress.street}
                                    onChangeText={(text) => handleInputAddressChange("street", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Village"
                                    value={newAddress.village}
                                    onChangeText={(text) => handleInputAddressChange("village", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Sub-district"
                                    value={newAddress.sub_district}
                                    onChangeText={(text) => handleInputAddressChange("sub_district", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="District"
                                    value={newAddress.district}
                                    onChangeText={(text) => handleInputAddressChange("district", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Province"
                                    value={newAddress.province}
                                    onChangeText={(text) => handleInputAddressChange("province", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Postcode"
                                    value={newAddress.postcode}
                                    onChangeText={(text) => handleInputAddressChange("postcode", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={newAddress.latitude}
                                    onChangeText={(text) => handleInputAddressChange("latitude", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={newAddress.longitude}
                                    onChangeText={(text) => handleInputAddressChange("longitude", text)}
                                />
                            </ScrollView>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.submitButton} onPress={handlePostAddAddressData}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddAddressModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


                {FarmField.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Fields</Text>
                        {FarmField.map((farm, index) => (
                            <TouchableOpacity
                                key={farm.id}
                                style={styles.fieldCard}
                                onPress={() => gotoFieldDetail(farm.id)} // Navigate to field detail
                                activeOpacity={0.8} // Highlight effect on press
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.fieldTitle}>Field {index + 1}</Text>
                                    <Text style={styles.fieldText}>Name: {farm.name}</Text>
                                    <Text style={styles.fieldText}>Area: {farm.area} acres</Text>
                                    <Text style={styles.fieldText}>
                                        Created At:{" "}
                                        {farm.create_at
                                            ? new Date(farm.create_at).toLocaleString()
                                            : "N/A"}
                                    </Text>
                                    <Text style={styles.fieldText}>Latitude: {farm.latitude}</Text>
                                    <Text style={styles.fieldText}>Longitude: {farm.longitude}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
                            <Text style={styles.addButtonText}>Add Field</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptySection}>
                        <Text style={styles.emptyText}>No Fields Available</Text>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
                            <Text style={styles.addButtonText}>Add Field</Text>
                        </TouchableOpacity>
                    </View>
                )}


                <Modal visible={isAddFieldModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Field</Text>

                            {/* Field Input Fields */}
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    value={inputField.name}
                                    onChangeText={(text) => handleInputFieldChange("name", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Area (in acres)"
                                    value={inputField.area}
                                    onChangeText={(text) => handleInputFieldChange("area", text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={inputField.latitude}
                                    onChangeText={(text) => handleInputFieldChange("latitude", text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={inputField.longitude}
                                    onChangeText={(text) => handleInputFieldChange("longitude", text)}
                                    keyboardType="numeric"
                                />
                            </ScrollView>

                            {/* Modal Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.submitButton} onPress={handlePostAddFieldData}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddFieldModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


                {device && device.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Devices</Text>
                        {device.map((dev, index) => (
                            <TouchableOpacity
                                key={dev.id || dev.device_id} // Ensure a unique key
                                style={styles.deviceCard}
                                onPress={() => gotoDeviceDetail(dev.id)} // Navigate to device detail
                                activeOpacity={0.8}
                                accessibilityLabel={`Device ${index + 1}`}
                                accessibilityRole="button"
                            >
                                <View style={styles.card}>
                                    <Text style={styles.deviceTitle}>Device {index + 1}</Text>
                                    <Text style={styles.deviceText}>Name: {dev.name}</Text>
                                    <Text style={styles.deviceText}>Type: {dev.type}</Text>
                                    <Text style={styles.deviceText}>Latitude: {dev.latitude}</Text>
                                    <Text style={styles.deviceText}>Longitude: {dev.longitude}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddDeviceModalVisible(true)}>
                            <Text style={styles.addButtonText}>Add Device</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptySection}>
                        <Text style={styles.emptyText}>No Devices Available</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddDeviceModalVisible(true)}>
                            <Text style={styles.addButtonText}>Add Device</Text>
                        </TouchableOpacity>
                    </View>
                )}



                <Modal visible={isAddDeviceModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Device</Text>

                            {/* Device Input Fields */}
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Device ID"
                                    value={inputDevice.device_id}
                                    editable={false} // Auto-generated Device ID
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    value={inputDevice.name}
                                    onChangeText={(text) => handleInputDeviceChange("name", text)}
                                />
                                <View>
                                    <Text style={styles.label}>Device Type</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={inputDevice.type}
                                            onValueChange={(itemValue) => handleInputDeviceChange("type", itemValue)}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="Select Device Type" value="" />
                                            <Picker.Item label="Pump" value="Pump" />
                                            <Picker.Item label="Pipe" value="Pipe" />
                                            <Picker.Item label="Sensor" value="Sensor" />
                                        </Picker>
                                    </View>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={inputDevice.latitude}
                                    onChangeText={(text) => handleInputDeviceChange("latitude", text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={inputDevice.longitude}
                                    onChangeText={(text) => handleInputDeviceChange("longitude", text)}
                                    keyboardType="numeric"
                                />
                            </ScrollView>

                            {/* Modal Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.submitButton} onPress={handlePostAddDeviceData}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddDeviceModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.addButton} onPress={gotoWaterGateControl}>
                    <Text style={styles.addButtonText}>Water Gate Control</Text>
                </TouchableOpacity>






                <View style={styles.section}>
                    <ShowCarbonFootprint data={emissionData} />
                </View>
                <View style={styles.GraphSection}>
                    {/* <AvgWaterLevel data={emissionData} /> */}
                    <MethaneGraph data={emissionData} />
                </View>
                <View style={styles.GraphSection}>
                    <TotalWaterGraph data={emissionData} />
                    <TempGraph data={emissionData} />
                </View>
                <View style={styles.GraphSection}>
                    <LightGraph data={emissionData} />
                    <HumidityGraph data={emissionData} />
                </View>





            </View>
        </ScrollView>
    );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isMobile = Dimensions.get("window").width < 768;


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    innercontainer: {
        flex: 1,
        maxHeight: SCREEN_HEIGHT * 0.9,
        padding: 10,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 30, // Rounded edges
        alignItems: "center",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Shadow for Android
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#007bff",
    },
    inputContainer: {
        paddingBottom: 15,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#f2f2f2",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: "#6c757d",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15, // More rounded edges
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    section: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "#333",
    },
    fieldCard: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: "column",
    },
    cardContent: {
        flexDirection: "column",
    },
    fieldTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#007bff",
    },
    fieldText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },
    deviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#007bff",
    },
    deviceText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },
    addButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    emptySection: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
        marginBottom: 15,
    },
    noDataText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginBottom: 15,
    },
    GraphSection: {
        flexDirection: isMobile ? "column" : "row",
        // justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
    },
    pickerContainer: {
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        marginBottom: 10,
    },
});
