import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import Spinner from "../../../commons/Spinner";

import { Input, Wrapper, Row } from "./styles";

export default (props) => {
  const [textMessage, setTxtMessage] = useState("");
  const onHandleTextSend = async () => {
    props.onSend(textMessage);
    setTxtMessage("");
  };
  return (
    <Row>
      <Wrapper>
        <Input
          multiline
          {...props}
          value={textMessage}
          onChangeText={setTxtMessage}
        />
        {props.isLoading ? (
          <Spinner>
            <AntDesign name="loading1" size={24} color="black" />
          </Spinner>
        ) : (
          <Feather
            name="send"
            size={24}
            color="black"
            onPress={() =>
              !props.isLoading ? onHandleTextSend(textMessage) : null
            }
          />
        )}
      </Wrapper>
    </Row>
  );
};
