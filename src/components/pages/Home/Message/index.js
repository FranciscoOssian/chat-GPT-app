import { Message as Wrapper, Txt, Conteiner } from "./styles";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

const Message = ({ item, speaking, setSpeaking }) => {
  const yourMessage = item.role === "user";

  const speakOn = (message) => {
    Speech.speak(message.content, { onDone: () => speakOff() });
    setSpeaking({ id: message.id, speaking: true });
  };

  const speakOff = () => {
    Speech.stop();
    setSpeaking({ id: "", speaking: false });
  };

  return (
    <Conteiner my={yourMessage}>
      <Wrapper my={yourMessage}>
        <Txt>{item.content}</Txt>
        <TouchableOpacity
          onPress={() => (!speaking.speaking ? speakOn(item) : speakOff())}
        >
          {speaking.speaking && speaking.id === item.id ? (
            <MaterialCommunityIcons
              name="account-voice-off"
              size={24}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons
              name="account-voice"
              size={24}
              color="black"
            />
          )}
        </TouchableOpacity>
      </Wrapper>
    </Conteiner>
  );
};

export default Message;
