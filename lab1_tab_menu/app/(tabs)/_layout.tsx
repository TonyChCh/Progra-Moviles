import React from 'react'
import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs initialRouteName="about">
            <Tabs.Screen name="about" options={{ title: "Sobre mí"}} />
            <Tabs.Screen name="projects" options={{ title: "Proyectos"}} />
        </Tabs>
    );
}