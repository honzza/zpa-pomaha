import React from "react";
import { View } from "react-native";
import { DataTable, Avatar } from "react-native-paper";

export default function App() {
  return (
    <View
      style={{
        marginTop: 40,
      }}
    >
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ justifyContent: "center" }}>
            BĚH
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            CYKLO
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            BĚŽKY
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            PLAVÁNÍ
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            2000 km
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            3000 km
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            700 km
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            50 km
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Pořadí
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Avatar
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Sportovec
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            Celkem
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            1
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            <Avatar.Image
              size={48}
              source={{
                uri: "https://lh3.googleusercontent.com/a-/AOh14GhFPD8xe0mSElwp4Bo9l9Or-DaOuMnAQIbwYiOPWw=s96-c",
              }}
            />
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            honzza dvorak
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            650 Kč
          </DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row></DataTable.Row>
      </DataTable>
    </View>
  );
}
