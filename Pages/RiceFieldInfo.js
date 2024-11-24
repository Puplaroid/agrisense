import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";

import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";


export default function FarmerDataScreen({ route }) {
    
    const navigation = useNavigation();
    const farmerId = route.params; // Extract farmerId from the route params
    useEffect(() => {
        console.log("Received Farmer ID in FarmerDataScreen:", farmerId); // Use the farmerId as needed
    }, [farmerId]);


    const [farmerData, setFarmerData] = useState({});
    const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false);
    const [isAddFarmModalVisible, setIsAddFarmModalVisible] = useState(false);
    const [addressData, setAddressData] = useState({});
    const [farmerFarm, setFarmerFarm] = useState({});
    const [inputFarm, setInputFarm] = useState({
        description: "",
        area: "",
        totalRiceHarvest: "",
        create_at: new Date().toISOString(), // Set to current date and time
        farmer_id: farmerId, // Include the farmer ID
    });

    

    // Fetch farmer data function
    const fetchFarmerData = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/farmer/${farmerId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("Farmer data", data);

            if (response.ok) {
                setFarmerData(data);
                Alert.alert("Success", "Fetched farmer data successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to fetch farmer data.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    const fetchFarmerAddress = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/farmer/address/${farmerId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("setAddressData", data);

            if (response.ok) {
                setAddressData(data);
                Alert.alert("Success", "Fetched farmer data successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to fetch farmer data.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    const fetchFarmerFarm = async () => {
        try {
            const response = await fetch(`http://3.27.146.110/farm/${farmerId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            // console.log("setFarmerFarm", data);

            if (response.ok) {
                setFarmerFarm(data);
                Alert.alert("Success", "Fetched farmer data successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to fetch farmer data.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        }

        // setInterval(() => {
        //     fetchFarmerFarm();
        // }, 1000);
    };


    // Fetch farmer data on component mount
    useEffect(() => {
        fetchFarmerData();
        fetchFarmerAddress();
        fetchFarmerFarm();
    }, []);

    // console.log("farmerData", farmerData);
    // console.log("farmerData_L", farmerData.length);

    const handleInputAddressChange = (field, value) => {
        setAddressData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleInputFarmChange = (field, value) => {
        setInputFarm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddAddress = () => {
        setIsAddAddressModalVisible(true);
    }

    const handleAddFarm = () => {
        setIsAddFarmModalVisible(true);
    }


    const gotoFarmDatail = (farmID) => {
        navigation.navigate("FarmDetail", { farmID });
    }


    const handlePostAddAddressData = async () => {
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const bodyContent = JSON.stringify({
                ...addressData, // Include existing addressData properties
                create_at: new Date().toISOString(), // Set to current date and time
                farmer_id: farmerId, // Include the farmer ID
            });

            console.log("addressData", addressData);
            console.log("bodyContent addressData", bodyContent);

            const response = await fetch("http://3.27.146.110/farmer/address", {
                method: "POST",
                headers: headersList,
                body: bodyContent,
            });

            if (!response.ok) {
                throw new Error("Failed to post address data");
            }

            const data = await response.json();
            console.log("Response address data:", data);
            setAddressData(data);


            Alert.alert("Success", "Address data submitted successfully!");
            setIsAddAddressModalVisible(false); // Close the modal after submission
            fetchFarmerAddress();

        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    const handlePostAddFarmData = async () => {
        setErrorMessage("");
        if (inputFarm.description === "" || inputFarm.area === "" || inputFarm.totalRiceHarvest === "") {
            setErrorMessage("Please enter data.");
            return;
        }
        try {
            const headersList = {
                Accept: "*/*",
                "Content-Type": "application/json",
            };

            const bodyContent = JSON.stringify(inputFarm);

            console.log("inputFarm", inputFarm);
            console.log("bodyContent inputFarm", bodyContent);

            const response = await fetch("http://3.27.146.110/farm/create", {
                method: "POST",
                headers: headersList,
                body: bodyContent,
            });

            if (!response.ok) {
                throw new Error("Failed to post address data");
            }

            const data = await response.json();
            console.log("Response address data:", data);
            setFarmerFarm(data);


            Alert.alert("Success", "Address data submitted successfully!");
            setIsAddFarmModalVisible(false); // Close the modal after submission
            fetchFarmerFarm();

        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.inner_container}>
                <Header />
                {/* Farmer Section */}

                {farmerData.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Farmer</Text>
                        <Text>Username: {farmerData[0]?.username}</Text>
                        <Text>Email: {farmerData[0]?.email}</Text>
                        <Text>First Name: {farmerData[0]?.first_name}</Text>
                        <Text>Last Name: {farmerData[0]?.last_name}</Text>
                        <Text>Telephone: {farmerData[0]?.telephone}</Text>
                        <Text>
                            Created At:{" "}
                            {farmerData[0]?.create_at
                                ? new Date(farmerData[0].create_at).toLocaleString()
                                : "N/A"}
                        </Text>
                    </View>
                ) : (
                    <Text>Loading farmer data...</Text>
                )}



                {/* add address section */}
                {/* Button to Open Modal */}
                {addressData.length === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                        <Text style={styles.addButtonText}>Add Address</Text>
                    </TouchableOpacity>
                ) :
                    <View style={styles.section}>
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
                    </View>}

                {/* Modal for Address Input */}
                <Modal visible={isAddAddressModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Address</Text>

                            {/* Address Input Fields */}
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="House No"
                                    value={addressData.house_no}
                                    onChangeText={(text) => handleInputAddressChange("house_no", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Street"
                                    value={addressData.street}
                                    onChangeText={(text) => handleInputAddressChange("street", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Village"
                                    value={addressData.village}
                                    onChangeText={(text) => handleInputAddressChange("village", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Sub-district"
                                    value={addressData.sub_district}
                                    onChangeText={(text) => handleInputAddressChange("sub_district", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="District"
                                    value={addressData.district}
                                    onChangeText={(text) => handleInputAddressChange("district", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Province"
                                    value={addressData.province}
                                    onChangeText={(text) => handleInputAddressChange("province", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Postcode"
                                    value={addressData.postcode}
                                    onChangeText={(text) => handleInputAddressChange("postcode", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Latitude"
                                    value={addressData.latitude}
                                    onChangeText={(text) => handleInputAddressChange("latitude", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Longitude"
                                    value={addressData.longitude}
                                    onChangeText={(text) => handleInputAddressChange("longitude", text)}
                                />
                            </ScrollView>

                            {/* Modal Buttons */}
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


                {/* Farm Address Section */}

                {farmerFarm.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Farms</Text>
                        {farmerFarm.map((farm, index) => (
                            <TouchableOpacity
                                key={farm.id}
                                style={styles.farmSection}
                                onPress={() => gotoFarmDatail(farm.id)} // Wrap in arrow function
                            >
                                <Text style={styles.farmTitle}>Farm {index + 1}</Text>
                                <Text>Description: {farm.description}</Text>
                                <Text>Area: {farm.area} Rai</Text>
                                <Text>Total Rice Harvest: {farm.totalRiceHarvest} tons</Text>
                                <Text>
                                    Created At:{" "}
                                    {farm.create_at
                                        ? new Date(farm.create_at).toLocaleString()
                                        : "N/A"}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddFarm}>
                            <Text style={styles.addButtonText}>Add Farm</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddFarm}>
                        <Text style={styles.addButtonText}>Add Farm</Text>
                    </TouchableOpacity>
                )}



                {/* Modal for Address Input */}
                <Modal visible={isAddFarmModalVisible} animationType="fade" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Farm</Text>

                            {/* Address Input Fields */}
                            <ScrollView contentContainerStyle={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="description"
                                    value={inputFarm.description}
                                    onChangeText={(text) => handleInputFarmChange("description", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="area"
                                    value={inputFarm.area}
                                    onChangeText={(text) => handleInputFarmChange("area", text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="totalRiceHarvest"
                                    value={inputFarm.totalRiceHarvest}
                                    onChangeText={(text) => handleInputFarmChange("totalRiceHarvest", text)}
                                />
                            </ScrollView>

                            {/* Modal Buttons */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.submitButton} onPress={handlePostAddFarmData}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddFarmModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>



                {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Farm Address</Text>
                {Object.entries(farmAddress).map(([key, value]) => (
                    <Text key={key} style={styles.item}>
                        {key}: {value}
                    </Text>
                ))}
            </View> */}

                {/* Field Section */}
                {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Field</Text>
                {Object.entries(field).map(([key, value]) => (
                    <Text key={key} style={styles.item}>
                        {key}: {value}
                    </Text>
                ))}
            </View> */}

                {/* Rice Field Data Section */}
                {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rice Field Data</Text>
                {Object.entries(riceFieldData).map(([key, value]) => (
                    <Text key={key} style={styles.item}>
                        {key}: {value}
                    </Text>
                ))}
            </View> */}

                {/* Fertilization Data Section */}
                {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fertilization Data</Text>
                {Object.entries(fertilizationData).map(([key, value]) => (
                    <Text key={key} style={styles.item}>
                        {key}: {value}
                    </Text>
                ))}
            </View> */}

                {/* Emission Data Section */}
                {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emission Data</Text>
                {Object.entries(emissionData).map(([key, value]) => (
                    <Text key={key} style={styles.item}>
                        {key}: {value}
                    </Text>
                ))}
            </View> */}
                {/* </View> */}
            </View>
        </ScrollView >
    );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    inner_container: {
        backgroundColor: "#f9f9f9",
        padding: 10,
        maxHeight: SCREEN_HEIGHT * 0.9,
        flex: 1,
        marginBottom: 10,
    },
    section: {
        backgroundColor: "#fff",
        marginBottom: 10,
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    item: {
        fontSize: 14,
        marginBottom: 5,
        color: "#555",
    },
    addButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15, // Rounded edges
        width: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Add shadow for Android
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "#007bff", // Add accent color
    },
    inputContainer: {
        paddingBottom: 15,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: "#6c757d",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        flex: 1,
        marginLeft: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    farmSection: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    farmTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
});
