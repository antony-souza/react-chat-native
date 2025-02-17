import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { environment } from "../environment/environment";
import { httpClient } from "../../utils/generic-request";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import * as Security from 'expo-secure-store'
import LayoutPage from "../../layouts/dark-layout";


interface IRoomsList {
  id: string;
  name: string;
  imgUrl: string;
}

const GroupList = () => {
  const [rooms, setRooms] = useState<IRoomsList[]>([]);
  const title: string = "Grupos";
  const group = true
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
      params: { groupName, groupId, group: group.toString() },
    });
  };

  const handleListRooms = async (): Promise<IRoomsList[]> => {
    const userId = await Security.getItemAsync('userId')
    const response = await httpClient.genericRequest(`${environment.findAllGroupsByUsers}/${userId}`, "GET") as IRoomsList[];
    setRooms(response);
    return response;
  };

  const handlePathNewRoom = () => {
    router.push("/new_room");
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
      <View style={styles.container}>
        <TouchableOpacity style={styles.newRoomButton} onPress={handlePathNewRoom}>
          <Icon name="users" size={20} color="#fff" />
          <Text style={styles.newRoomText}>Novo Grupo</Text>
        </TouchableOpacity>
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </LayoutPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  newRoomButton: {
    backgroundColor: "#6200EE",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  newRoomText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  badge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 10,
    top: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default GroupList;
