import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from './src/header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Hello World! :)</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: 'condensed',
    textAlign: 'center',
    marginTop: 50,
  }
});
