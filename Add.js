import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Add = ({ navigation }) => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <RNPickerSelect
                    onValueChange={(value) => setType(value)}
                    items={[
                        { label: 'Income', value: 'income' },
                        { label: 'Expenses', value: 'expenses' }
                    ]}
                    placeholder={{ label: "Select type", value: null }}
                    style={styles.pickerText}
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
                        placeholder={{ label: "Category", value: null }}
                        style={styles.pickerText}
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

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>
        </View>
    );
};

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

export default Add;
