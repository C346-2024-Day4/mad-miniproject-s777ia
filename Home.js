import React from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import data from './Data.js';
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";

const Home = ({navigation}) => {
    const displayIcon = (category) => {
        if (category === "Food & Drinks") {
            return <Icon3 name={"food"} size={20} />
        } else if (category === "Transport") {
            return <Icon name={"car"} size={20} />
        } else if (category === "Utility") {
            return <Icon2 name={"tools"} size={20} />
        } else if (category === "Services") {
            return <Icon name={"masks-theater"} size={20} />
        }
    }

    const renderItem = ({ item, section }) => {
        if (section.title === "Income") {
            return (
                <View>
                    <Text>Income:</Text>
                    <Text>${item.amount}</Text>
                    <Text>SGD</Text>
                </View>
            );
        } else {
            return (
                <View>
                    {displayIcon(item.category)}
                    <Text>{item.category}</Text>
                    <Text>{item.description}</Text>
                    <Text>${item.amount}</Text>
                </View>
            );
        }
    };

    const renderSectionHeader = ({ section: { title } }) => {
        return (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
            </View>
        );
    };

    return (
        <View>
            <SectionList
                sections={data.dataSource}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
            />
            <TouchableOpacity
            onPress={() => {navigation.navigate("Add")}}
            >
                <Icon name={"circle-plus"} size={20} />
            </TouchableOpacity>
        </View>
    );
};

export default Home;
