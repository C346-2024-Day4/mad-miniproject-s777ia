import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import dataFile from './Data.js';
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";


const Home = ({ navigation, route }) => {
    const [dataSource, setDataSource] = useState(dataFile.dataSource); // Use the data from Data.js
    const [expenseTotals, setExpenseTotals] = useState([]);
    const [showDeficitSurplus, setShowDeficitSurplus] = useState(false); // State for toggling card content

    // Calculate Deficit and Surplus
    const calculateDeficitSurplus = () => {
        const totalIncome = dataSource[0]?.data[0]?.amount || 0; // Total income from data
        const totalExpenses = dataSource[1]?.data.reduce((sum, item) => sum + item.amount, 0); // Sum of all expenses
        const surplus = Math.max(totalIncome - totalExpenses, 0); // Surplus is positive difference
        const deficit = Math.max(totalExpenses - totalIncome, 0); // Deficit is positive difference
        return { deficit, surplus };
    };

    const { deficit, surplus } = calculateDeficitSurplus(); // Calculate values

    useEffect(() => {
        if (route.params?.updatedDataSource) {
            setDataSource(route.params.updatedDataSource); // Update local state
        }
    }, [route.params?.updatedDataSource]);

    // Display icons based on category
    const displayIcon = (category) => {
        if (category === "Food & Drinks") {
            return <Icon3 name={"food"} size={30} color="#FFA500" />;
        } else if (category === "Transport") {
            return <Icon name={"car"} size={30} color="#ADFF2F" />;
        } else if (category === "Utilities") {
            return <Icon2 name={"tools"} size={30} color="#1E90FF" />;
        } else if (category === "Services") {
            return <Icon name={"masks-theater"} size={30} color="#FF6347" />;
        }
    };

    useEffect(() => {
        const calculateTotals = () => {
            const totals = [];
            dataSource[1].data.forEach((expense) => {
                const existingCategory = totals.find((item) => item.category === expense.category);
                if (existingCategory) {
                    existingCategory.total += expense.amount;
                } else {
                    totals.push({ category: expense.category, total: expense.amount });
                }
            });
            return totals;
        };

        setExpenseTotals(calculateTotals());
    }, [dataSource]);

    const renderItem = ({ item, section }) => {
        if (section.title === "Income") {
            return (
                <TouchableOpacity
                    onLongPress={() => setShowDeficitSurplus(!showDeficitSurplus)} // Toggle content on long press
                    activeOpacity={0.7}
                >
                    <View style={[styles.incomeCard, showDeficitSurplus && styles.deficitSurplusCard]}>
                        {showDeficitSurplus ? (
                            <View style={styles.deficitSurplusContainer}>
                                <View style={styles.deficitContainer}>
                                    <Text style={styles.deficitSurplusTitle}>DEFICIT:</Text>
                                    <Text style={styles.deficitSurplusAmount}>${deficit}</Text>
                                </View>
                                <View style={styles.surplusContainer}>
                                    <Text style={styles.deficitSurplusTitle}>SURPLUS:</Text>
                                    <Text style={styles.deficitSurplusAmount}>${surplus}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.income}>
                                <View>
                                    <Text style={styles.incomeTitle}>TOTAL INCOME:</Text>
                                    <Text style={styles.incomeAmount}>${item.amount}</Text>
                                </View>
                                <Text style={styles.incomeCurrency}>SGD</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Edit", {
                            item,
                            dataSource,
                            updateDataSource: setDataSource,
                        })
                    }
                >
                    <View style={styles.expenseCard}>
                        <View style={styles.iconContainer}>{displayIcon(item.category)}</View>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amount}>-${item.amount}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    const renderSectionHeader = ({ section: { title } }) => {
        if (title !== "Income") {
            return (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <LinearGradient
            colors={["#000000", "#001740"]}
            style={styles.gradient}
        >
            <View style={styles.container}>
                {/* SectionList for Income and Expenses */}
                <SectionList
                    sections={dataSource}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                />

                {/* Total Expenses by Category */}
                <View>
                    <Text style={styles.totalExpensesTitle}>Total Expenses: ${dataSource[1]?.data.reduce((sum, item) => sum + item.amount, 0)}</Text>
                    <View style={styles.expenseSummary}>
                        {expenseTotals.map((item) => (
                            <View key={item.category} style={styles.card}>
                                <View style={styles.cardIcon}>{displayIcon(item.category)}</View>
                                <Text style={styles.cardCategory}>{item.category.toUpperCase()}</Text>
                                <Text style={styles.cardTotal}>${item.total}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Add Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("Add", { dataSource })}
                >
                    <Icon name={"plus"} size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );

};

export default Home;


const styles = StyleSheet.create({
    gradient: {
        flex: 1, 
    },
    
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 80,
    },
    // Section Header
    sectionHeader: {
        marginBottom: 10,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    // Income Card

    income: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    incomeCard: {
        backgroundColor: "#4A90E2", // Original card color
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    deficitSurplusCard: {
        backgroundColor: "#8B0000", // Red for deficit/surplus view
    },
    deficitSurplusContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    deficitContainer: {
        alignItems: "center",
    },
    surplusContainer: {
        alignItems: "center",
    },
    deficitSurplusTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    deficitSurplusAmount: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "bold",
    },
    incomeTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    incomeAmount: {
        color: "#FFFFFF",
        fontSize: 36,
        fontWeight: "bold",
    },
    incomeCurrency: {
        color: "#F5F5F5",
        fontSize: 14,
        fontWeight: 600
    },

    // Expense Cards
    expenseCard: {
        flexDirection: "row",
        backgroundColor: "#1C1F35",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 15,
    },
    detailsContainer: {
        flex: 1,
    },
    category: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    description: {
        color: "#A0A0A0",
        fontSize: 12,
    },
    amountContainer: {
        alignItems: "flex-end",
    },
    amount: {
        color: "#E74C3C",
        fontSize: 16,
        fontWeight: "bold",
    },
    date: {
        color: "#A0A0A0",
        fontSize: 12,
    },
    // Total Expenses Summary
    totalExpensesTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    expenseSummary: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Align cards in a grid
        flexWrap: "wrap", // Allow cards to wrap to the next row
        marginBottom: 20,
    },
    card: {
        width: "47%", // 2 cards per row with spacing
        backgroundColor: "#1C1F35", // Match the dark card color
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    cardIcon: {
        marginBottom: 10,
    },
    cardCategory: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    cardTotal: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
    },

    // Add Button
    addButton: {
        backgroundColor: "#4A90E2",
        width: 60,
        height: 60,
        borderRadius: 30,
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
});
