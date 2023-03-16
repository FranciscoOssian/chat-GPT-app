import React, { useEffect, useState, useMemo } from "react";
import { View, TextInput, Text } from "react-native";
import { Configuration, OpenAIApi } from "openai";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import styled from "styled-components";
import Input from "./src/components/pages/Home/Input";
import SafeArea from "./src/components/commons/SafeArea";

import { ChatList } from "./src/components/pages/Home/ChatList";
import Message from "./src/components/pages/Home/Message";

import "react-native-url-polyfill/auto";
import Spinner from "./src/components/commons/Spinner";

const Gear = (p) => (
  <>
    <FontAwesome
      name="gear"
      size={60}
      color="black"
      onPress={p.onPress}
      style={{
        position: "absolute",
        top: "2.5%",
        left: "5%",
      }}
    />
  </>
);

const App = ({ setting, openAIToken }) => {
  const [messages, setMessages] = useState([]);
  const [reRenderList, setReRenderList] = useState(false);
  const [speaking, setSpeaking] = useState({ id: "", speaking: false });
  const [isLoading, setIsLoading] = useState(false);

  const openai = useMemo(() => {
    const configuration = new Configuration({
      apiKey: openAIToken,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
  }, [openAIToken]);

  const handleSendInput = async (text) => {
    const myMessage = {
      role: "user",
      content: text,
      created: Math.floor(Date.now() / 1000),
      id: `${Math.floor(Date.now() / 1000)}`,
    };
    setMessages((p) => [...p, myMessage]);
    try {
      setIsLoading(true);
      const messagesToSend = [...messages, myMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messagesToSend,
      });
      setMessages([
        ...messages,
        myMessage,
        {
          role: "system",
          content: completion.data.choices[0].message.content,
          created: completion.data.created,
          id: completion.data.id,
        },
      ]);
      setIsLoading(false);
      setReRenderList((p) => !p);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <Main>
      <ChatList
        data={messages.slice().sort((a, b) => b.created - a.created)}
        renderItem={({ item }) => (
          <Message item={item} speaking={speaking} setSpeaking={setSpeaking} />
        )}
        keyExtractor={(item) => item.id}
        inverted
        extraData={reRenderList}
      />

      {!setting.value &&
        (openAIToken === "" ? (
          <Spinner
            style={{
              position: "absolute",
              top: "2.5%",
              left: "5%",
            }}
            size={[60, 60]}
          >
            <Gear onPress={() => setting.press()} />
          </Spinner>
        ) : (
          <Gear onPress={() => setting.press()} />
        ))}

      <Input
        placeholder="Digite aqui"
        isLoading={isLoading}
        onSend={(txt) => {
          handleSendInput(txt);
        }}
      />
    </Main>
  );
};

export default function () {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [openAIToken, setOpenAIToken] = useState("");
  const [tempToken, setTempToken] = useState("");

  const handleSettingsPress = () => {
    setSettingsVisible((p) => !p);
  };

  useEffect(() => {
    AsyncStorage.getItem("@open_ai_key").then(
      (str) => str && setOpenAIToken(str)
    );
  }, []);

  const onHandleSaveSetting = () => {
    AsyncStorage.setItem("@open_ai_key", tempToken);
    setOpenAIToken(tempToken);
    handleSettingsPress();
  };

  return (
    <SafeArea>
      <App
        setting={{ value: settingsVisible, press: handleSettingsPress }}
        openAIToken={openAIToken}
      />
      {settingsVisible ? (
        <SettingsMenu
          style={{
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowOpacity: 1,
            shadowRadius: 20,
            elevation: 20, // adiciona uma sombra em dispositivos Android
          }}
        >
          <DoneConfig onPress={() => onHandleSaveSetting()}>
            <Ionicons name="checkmark-done-circle" size={50} color="black" />
          </DoneConfig>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: "black",
              borderStyle: "solid",
              paddingHorizontal: "20%",
            }}
          >
            <Text>OpenAI API key: </Text>
            <TextInput
              value={tempToken}
              onChangeText={(txt) => setTempToken(txt)}
              placeholder="Insert your OpenAI API key"
              style={{
                width: "auto",
                height: 60,
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
              multiline={true}
            />
          </View>
        </SettingsMenu>
      ) : null}
    </SafeArea>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SettingsMenu = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  padding: 20px;
  align-items: center;
  justify-content: space-around;
  background-color: #f5f5f5;
  border: 1px solid black;
`;

const DoneConfig = styled.TouchableOpacity`
  position: absolute;
  top: -25px;
  background-color: gold;
  width: auto;
  height: auto;
  border-radius: 100000px;
`;
