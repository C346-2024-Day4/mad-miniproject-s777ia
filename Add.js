import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import data from './Data';
import { LinearGradient } from "expo-linear-gradient";

const Add = ({ navigation }) => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = () => {
        // Clone the data deeply
        const clonedDataSource = JSON.parse(JSON.stringify(data.dataSource));
    
        // Validate required fields
        if (!type) {
            Alert.alert("Error", "Please select a type (Income or Expenses).");
            return;
        }
    
        if (type === "expenses" && !category) {
            Alert.alert("Error", "Please select a category for expenses.");
            return;
        }
    
        if (!description || amount <= 0) {
            Alert.alert("Error", "Please provide a valid description and amount.");
            return;
        }
    
        // Handle Income
        if (type === "income") {
            clonedDataSource[0].data[0].amount += amount; // Add the amount to total income
            Alert.alert("Success", "Income updated successfully!");
        }
    
        // Handle Expenses
        if (type === "expenses") {
            const newExpense = {
                key: Date.now().toString(),
                type: "expense",
                amount: amount,
                category: category,
                date: new Date().toISOString().split("T")[0],
                description: description,
            };
    
            clonedDataSource[0].data[0].amount -= amount; // Subtract the amount from total income
            clonedDataSource[1].data.push(newExpense); // Add the new expense
            Alert.alert("Success", "Expense added successfully!");
        }
    
        // Pass updated data back to the Home screen
        navigation.navigate("Home", { updatedDataSource: clonedDataSource });
    };
    
    return (
        <LinearGradient
        colors={["#000000", "#001740"]}
        style={styles.gradient}
    >
        <View style={styles.container}>
            <View style={styles.input}>
                <RNPickerSelect
                    onValueChange={(value) => setType(value)}
                    items={[
                        { label: 'Income', value: 'income' },
                        { label: 'Expenses', value: 'expenses' }
                    ]}
                    value={type}
                    placeholder={{ label: 'Select Type' }}
                    style={pickerSelectStyles}
                />
            </View>

            {type === "expenses" && (
                <View style={styles.input}>
                    <RNPickerSelect
                        onValueChange={(value) => setCategory(value)}
                        items={[
                            { label: 'Food & Drinks', value: 'Food & Drinks' },
                            { label: 'Transport', value: 'Transport' },
                            { label: 'Utilities', value: 'Utilities' },
                            { label: 'Services', value: 'Services' }
                        ]}
                        value={category}
                        placeholder={{ label: "Select a Category" }}
                        style={pickerSelectStyles}
                    />
                </View>
            )}


            <TextInput
                style={styles.input}
                onChangeText={(text) => setDescription(text)}
                placeholder="Description"
                placeholderTextColor="#A0A0A0"
            />

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(text) => {
                    const numericValue = parseFloat(text) || 0;
                    setAmount(numericValue);
                }}
                placeholder="Amount"
                placeholderTextColor="#A0A0A0"
            />


            {/* Buttons */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>

        </View>
        </LinearGradient>
    );
};

export default Add;

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    input: {
        width: "100%",
        backgroundColor: "#2C2C3E",
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        color: "#F5F5F5"
    },
    pickerText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#4A90E2",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});


const pickerSelectStyles = {
    inputIOS: {
        height: 40,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 16,
        color: '#F5F5F5',
        backgroundColor: '#2C2C3E', // Add a background color for better appearance
    },
    inputAndroid: {
        height: 40,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginBottom: 16,
        color: '#F5F5F5',
        backgroundColor: '#2C2C3E', // Add a background color for better appearance
        elevation: 0, // Removes shadow on Android
    },
};
