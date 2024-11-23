import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Dimensions,
} from "react-native";

import Header from "../components/Header";
import HomeScreen from "./HomeScreen";
import WaterLevel from "./WaterLevel";
import MethaneGraph from "./MethaneGraph";
import TempGraph from "./TempGraph";
import LightGraph from "./LightGraph";
import HumidityGraph from "./HumidityGraph";
import TotalWaterGraph from "./TotalWaterGraph";
import ShowCarbonFootprint from "./ShowCarbonFootprint";


export default function FieldDetail({ route }) {
    const { fieldId } = route.params; // Extract field ID from navigation params
    const [fieldDetail, setFieldDetail] = useState(null);
    const [riceFieldData, setRiceFieldData] = useState([]); // To store rice field data
    const [loading, setLoading] = useState(true);
    const [isAddRiceModalVisible, setIsAddRiceModalVisible] = useState(false);
    // const [isMobile, setIsMobile] = useState(Dimensions.get("window").width < 768);


    const [newRiceData, setNewRiceData] = useState({
        rice_variety: "",
        planting_start_date: "",
        harvest_date: "",
    });

    const [fertilizationData, setFertilizationData] = useState([]); // To store fertilization data
    const [isAddFertilizationModalVisible, setIsAddFertilizationModalVisible] = useState(false);

    const [newFertilizationData, setNewFertilizationData] = useState({
        fertilization_date: "",
        fertilizer_type: "",
        quantity_applied: "",
        nitrogen_content: "",
        phosphorus_content: "",
        potassium_content: "",
        fertilization_method: "",
    });

    const [emissionData, setEmissionData] = useState([]);

    // // Refresh the value of `isMobile` every second
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const { width } = Dimensions.get("window");
    //         setIsMobile(width < 768);
    //         //   console.log("isMobile refreshed:", width < 768);
    //     }, 1000); // Refresh every 1 second

    //     return () => clearInterval(interval); // Cleanup the interval on unmount
    // }, []);


    // Fetch field details
    const fetchFieldDetail = async () => {
        console.log("Fetching field detail for ID:", fieldId);
        try {
            const response = await fetch(`http://3.27.146.110/field/info/${fieldId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFieldDetail(data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch field details.");
            }
        } catch (error) {
            console.error("Error fetching field detail:", error);
            Alert.alert("Error", "Something went wrong while fetching field details.");
        }
    };

    // Fetch rice field data
    const fetchRiceFieldData = async () => {
        console.log("Fetching rice field data for field ID:", fieldId);
        try {
            const response = await fetch(`http://3.27.146.110/field/ricefielddata/${fieldId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRiceFieldData(data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch rice field data.");
            }
        } catch (error) {
            console.error("Error fetching rice field data:", error);
            Alert.alert("Error", "Something went wrong while fetching rice field data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFertilizationData = async () => {
        console.log("Fetching fertilization data for field ID:", fieldId);
        try {
            const response = await fetch(`http://3.27.146.110/field/fertilizationdata/${fieldId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFertilizationData(data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch fertilization data.");
            }
        } catch (error) {
            console.error("Error fetching fertilization data:", error);
            Alert.alert("Error", "Something went wrong while fetching fertilization data.");
        }
    };

    const fetchEmissionData = async () => {
        console.log("Fetching emissiondata data for field ID:", fieldId);
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



    // Add new rice field data
    const handleAddRiceFieldData = async () => {
        console.log("Adding rice field data:", newRiceData);
        try {
            const response = await fetch("http://3.27.146.110/field/ricefielddata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newRiceData,
                    field_id: fieldId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Success", "Rice field data added successfully!");
                setRiceFieldData((prev) => [...prev, data]); // Append the new data
                handleUpdate(); // Refresh the data
                setIsAddRiceModalVisible(false); // Close modal
            } else {
                Alert.alert("Error", "Failed to add rice field data.");
            }
        } catch (error) {
            console.error("Error adding rice field data:", error);
            Alert.alert("Error", "Something went wrong while adding rice field data.");
        }
    };


    const handleAddFertilizationData = async () => {
        console.log("Adding fertilization data:", newFertilizationData);
        try {
            const response = await fetch("http://3.27.146.110/field/fertilizationdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newFertilizationData,
                    field_id: fieldId, // Pass the field ID
                }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Success", "Fertilization data added successfully!");
                setFertilizationData((prev) => [...prev, data]); // Append the new data
                handleUpdate(); // Refresh the data
                setIsAddFertilizationModalVisible(false); // Close modal
            } else {
                Alert.alert("Error", "Failed to add fertilization data.");
            }
        } catch (error) {
            console.error("Error adding fertilization data:", error);
            Alert.alert("Error", "Something went wrong while adding fertilization data.");
        }
    };


    useEffect(() => {
        fetchFieldDetail();
        fetchRiceFieldData();
        fetchFertilizationData();
        fetchEmissionData();
    }, []);

    const handleUpdate = () => {
        fetchFieldDetail();
        fetchRiceFieldData();
        fetchFertilizationData(); // Call this whenever data changes
        fetchEmissionData();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!fieldDetail) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load field details. Please try again later.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.innercontainer}>
                <Header />
                <Text style={styles.header}>Field Details</Text>
                <View style={styles.card}>
                    <Text style={styles.fieldTitle}>Field ID: {fieldDetail[0]?.id || "N/A"}</Text>
                    <Text style={styles.fieldText}>Name: {fieldDetail[0]?.name || "N/A"}</Text>
                    <Text style={styles.fieldText}>Area: {fieldDetail[0]?.area || "N/A"} acres</Text>
                    <Text style={styles.fieldText}>
                        Created At:{" "}
                        {fieldDetail[0]?.create_at
                            ? new Date(fieldDetail[0]?.create_at).toLocaleString()
                            : "N/A"}
                    </Text>
                    <Text style={styles.fieldText}>Latitude: {fieldDetail[0]?.latitude || "N/A"}</Text>
                    <Text style={styles.fieldText}>Longitude: {fieldDetail[0]?.longitude || "N/A"}</Text>
                </View>

                {/* Rice Field Data Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rice Field Data</Text>
                    {riceFieldData.length > 0 ? (
                        riceFieldData.map((data, index) => (
                            <View key={data.id} style={styles.card}>
                                <Text style={styles.fieldText}>Rice Variety: {data.rice_variety}</Text>
                                <Text style={styles.fieldText}>
                                    Planting Start Date:{" "}
                                    {data.planting_start_date
                                        ? new Date(data.planting_start_date).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                                <Text style={styles.fieldText}>
                                    Harvest Date:{" "}
                                    {data.harvest_date
                                        ? new Date(data.harvest_date).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No rice field data available.</Text>
                    )}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddRiceModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>Add Rice Field Data</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal for Adding Rice Field Data */}
                <Modal visible={isAddRiceModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Rice Field Data</Text>
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Rice Variety"
                                    value={newRiceData.rice_variety}
                                    onChangeText={(text) =>
                                        setNewRiceData((prev) => ({ ...prev, rice_variety: text }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Planting Start Date (YYYY-MM-DD)"
                                    value={newRiceData.planting_start_date}
                                    onChangeText={(text) =>
                                        setNewRiceData((prev) => ({ ...prev, planting_start_date: text }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Harvest Date (YYYY-MM-DD)"
                                    value={newRiceData.harvest_date}
                                    onChangeText={(text) =>
                                        setNewRiceData((prev) => ({ ...prev, harvest_date: text }))
                                    }
                                />
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={handleAddRiceFieldData}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddRiceModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


                {/* Fertilization Data Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fertilization Data</Text>
                    {fertilizationData && fertilizationData.length > 0 ? (
                        fertilizationData.map((data, index) => (
                            <View key={data.id} style={styles.card}>
                                <Text style={styles.fieldText}>Fertilizer Type: {data.fertilizer_type || "N/A"}</Text>
                                <Text style={styles.fieldText}>
                                    Application Date:{" "}
                                    {data.harvest_date
                                        ? new Date(data.harvest_date).toLocaleDateString()
                                        : "N/A"}
                                </Text>
                                <Text style={styles.fieldText}>Quantity Applied: {data.quantity_applied || "N/A"} kg</Text>
                                <Text style={styles.fieldText}>Nitrogen Content: {data.nitrogen_content || "N/A"}%</Text>
                                <Text style={styles.fieldText}>Phosphorus Content: {data.phosphorus_content || "N/A"}%</Text>
                                <Text style={styles.fieldText}>Potassium Content: {data.potassium_content || "N/A"}%</Text>
                                <Text style={styles.fieldText}>
                                    Fertilization Method: {data.fertilization_method || "N/A"}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No fertilization data available.</Text>
                    )}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddFertilizationModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>Add Fertilization Data</Text>
                    </TouchableOpacity>
                </View>


                <Modal visible={isAddFertilizationModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Fertilization Data</Text>
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Fertilization Date (YYYY-MM-DD)"
                                    value={newFertilizationData.fertilization_date}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            fertilization_date: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Fertilizer Type"
                                    value={newFertilizationData.fertilizer_type}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            fertilizer_type: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Quantity Applied (kg)"
                                    value={newFertilizationData.quantity_applied}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            quantity_applied: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nitrogen Content (%)"
                                    value={newFertilizationData.nitrogen_content}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            nitrogen_content: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phosphorus Content (%)"
                                    value={newFertilizationData.phosphorus_content}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            phosphorus_content: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Potassium Content (%)"
                                    value={newFertilizationData.potassium_content}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            potassium_content: text,
                                        }))
                                    }
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Fertilization Method"
                                    value={newFertilizationData.fertilization_method}
                                    onChangeText={(text) =>
                                        setNewFertilizationData((prev) => ({
                                            ...prev,
                                            fertilization_method: text,
                                        }))
                                    }
                                />
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.submitButton} onPress={handleAddFertilizationData}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddFertilizationModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


                {/* Emission Data Section */}
                <View style={styles.GraphSection}>
                    <WaterLevel data={emissionData} />
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
        marginVertical: 10,
        paddingHorizontal: 10,
        flexDirection: isMobile ? "column" : "row",
    },
});
