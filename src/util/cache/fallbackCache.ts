const memoryStore = new Map();

const getFallback = (key : string) => {
  return memoryStore.get(key);
};

const setFallback = (key : string, value : any) => {
  memoryStore.set(key, value);
};

const deleteFallback = (key : string) => {
    memoryStore.set(key, null);
}

export {getFallback, setFallback, deleteFallback};
