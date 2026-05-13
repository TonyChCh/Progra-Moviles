import {View, Text} from 'react-native';
import React from 'react'
import { Tabs } from "expo-router"

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Sobre mí"}} />
            <Tabs.Screen name="projects" options={{ title: "Proyectos"}} />
        </Tabs>
    );
}

export default TabsLayout;