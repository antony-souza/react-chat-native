import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { io } from "socket.io-client";
import { environment } from "../environment/environment";
import { httpClient } from "../../utils/generic-request";
import Icon from "react-native-vector-icons/FontAwesome5";
import Header from "../../components/header";
import { useGlobalSearchParams, useRouter } from "expo-router";
import * as Security from 'expo-secure-store'
import LayoutPage from "../../layouts/dark-layout";
import { set } from "react-hook-form";
import TabsNavigation from "../../components/tabs";

interface IRoomsList {
  id: string;
  name: string;
  imgUrl: string;
}

const ChatsPrivate = () => {
  const [rooms, setRooms] = useState<IRoomsList[]>([]);
  const title: string = "Conversas";
  const router = useRouter();

  useEffect(() => {
    handleListRooms();
  }, []);

  const userJoinChat = async (groupId: string) => {
    const userId = await Security.getItemAsync('userId')
    const response = await httpClient.genericRequest(`${environment.joinChat}/${groupId}/${userId}`, "PUT");

    return response;
  }

  const handlePathChat = async (groupName: string, groupId: string) => {
    await userJoinChat(groupId);

    router.push({
      pathname: "/chat",
      params: { groupName, groupId: `${groupId}` },
    });
  };

  const handleListRooms = async (): Promise<IRoomsList[]> => {
    const userId = await Security.getItemAsync('userId')
    const response = await httpClient.genericRequest(`${environment.findAllChatsPrivateByUsers}/${userId}`, "GET") as IRoomsList[];
    setRooms(response);
    return response;
  };

  const renderRoom = ({ item }: { item: IRoomsList }) => (
    <TouchableOpacity onPress={() => handlePathChat(item.name, item.id)} style={styles.card}>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.roomName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LayoutPage headerTitle={title} tabs={true}>
      <>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={renderRoom}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.textArrayNull}>Nenhuma conversa encontrada</Text>
          </View>
        )}
      </>
    </LayoutPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  textArrayNull: {
    fontSize: 16,
    color: "#fff",
    marginTop: 30,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  roomName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatsPrivate;
