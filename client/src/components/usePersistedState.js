// Credits to Kristofer Giltvedt Selbekk
// https://dev.to/selbekk/persisting-your-react-state-in-9-lines-of-code-9go

import React, { useEffect } from "react";

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const persistedState = localStorage.getItem(key);

    // Deserialize the value of item to get the value
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });
  useEffect(() => {
    // Serialize the value of item to set the value
    window.localStorage.setItem(key, JSON.stringify(state));
    console.log(`local storage ${key} saved`);
  }, [state, key]);
  return [state, setState];
}
