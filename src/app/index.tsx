import LayoutPage from "../../layouts/dark-layout";
import AuthPage from "./auth";
import ChatPage from "./chat";

export default function App() {
  return (
      <LayoutPage>
          <ChatPage />
      </LayoutPage>
  );
}
