import React from 'react'
import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Sobre mí"}} />
            <Tabs.Screen name="projects" options={{ title: "Proyectos"}} />
        </Tabs>
    );
}