import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Edit = ({ route, navigation }) => {
    const { item, dataSource, updateDataSource } = route.params;

    const [amount, setAmount] = useState(item.amount);
    const [description, setDescription] = useState(item.description);
    const [category, setCategory] = useState(item.category);

    // Handle Save/Edit
    const handleEdit = () => {
        if (!description || amount <= 0) {
            Alert.alert("Error", "Please provide a valid description and amount.");
            return;
        }

        // Clone dataSource for mutability
        const clonedDataSource = JSON.parse(JSON.stringify(dataSource));
        const originalAmount = item.amount;

        // Find the expense item and update it
        const expenseIndex = clonedDataSource[1].data.findIndex((expense) => expense.key === item.key);
        if (expenseIndex !== -1) {
            const difference = originalAmount - amount;
            clonedDataSource[0].data[0].amount += difference; // Adjust total income
            clonedDataSource[1].data[expenseIndex] = {
                ...clonedDataSource[1].data[expenseIndex],
                amount,
                category,
                description,
            };
        }

        updateDataSource(clonedDataSource);
        Alert.alert("Success", "Data updated successfully!");
        navigation.goBack();
    };

    // Handle Delete
    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const clonedDataSource = JSON.parse(JSON.stringify(dataSource));

                        // Find and remove the expense item
                        const expenseIndex = clonedDataSource[1].data.findIndex((expense) => expense.key === item.key);
                        if (expenseIndex !== -1) {
                            const expenseItem = clonedDataSource[1].data[expenseIndex];
                            clonedDataSource[0].data[0].amount += expenseItem.amount; // Adjust total income
                            clonedDataSource[1].data.splice(expenseIndex, 1); // Remove the item
                        }

                        updateDataSource(clonedDataSource);
                        Alert.alert("Success", "Expense deleted successfully!");
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <RNPickerSelect
                    onValueChange={(value) => setCategory(value)}
                    items={[
                        { label: 'Food & Drinks', value: 'Food & Drinks' },
                        { label: 'Transport', value: 'Transport' },
                        { label: 'Utilities', value: 'Utilities' },
                        { label: 'Services', value: 'Services' },
                    ]}
                    value={category}
                    placeholder={{ label: "Select a Category" }}
                    style={pickerSelectStyles}
                />
            </View>

            <TextInput
                style={styles.input}
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder="Description"
                placeholderTextColor="#A0A0A0"
            />

            <TextInput
                style={styles.input}
                value={amount.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                    const numericValue = parseFloat(text) || 0;
                    setAmount(numericValue);
                }}
                placeholder="Amount"
                placeholderTextColor="#A0A0A0"
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>DELETE</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Edit;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E2A",
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
    button: {
        backgroundColor: "#4A90E2",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#E74C3C", 
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

