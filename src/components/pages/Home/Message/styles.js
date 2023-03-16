import styled from "styled-components";

//import { colors } from "../../../../Styles/theme";

export const Message = styled.View`
  background-color: ${(p) => (p.my ? "#0584FE" : "rgba(0, 0, 0, 0.06)")};
  border-radius: 18px;

  min-width: 50%;
  max-width: 90%;
  width: auto;

  height: auto;

  margin: 10px;
  padding: 10px;

  justify-content: center;
  align-items: flex-start;
`;

export const Txt = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 15px;

  flex-direction: row;

  color: ${(p) => (p.my ? "white" : "black")};
`;

export const Conteiner = styled.View`
  width: 100%;

  align-items: ${(p) => (p.my ? "flex-end" : "flex-start")};
`;
