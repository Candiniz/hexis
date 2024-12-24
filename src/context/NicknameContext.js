// context/NicknameContext.js
import React, { createContext, useContext, useState } from "react";

const NicknameContext = createContext();

export const useNickname = () => useContext(NicknameContext);

export const NicknameProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");

  return (
    <NicknameContext.Provider value={{ nickname, setNickname }}>
      {children}
    </NicknameContext.Provider>
  );
};
