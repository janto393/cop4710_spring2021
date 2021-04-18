import { createContext, useState, useContext } from "react";

const LoadingContext = createContext(false);
const LoadingUpdateContext = createContext<Function>(() => null);

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const useLoadingUpdate = () => {
  return useContext(LoadingUpdateContext);
};

export const LoadingProvider: React.FC<any> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setIsLoadingHelper = (newState: any) => {
    setIsLoading(newState);
  };

  return (
    <>
      <LoadingContext.Provider value={isLoading}>
        <LoadingUpdateContext.Provider value={setIsLoadingHelper}>
          {children}
        </LoadingUpdateContext.Provider>
      </LoadingContext.Provider>
    </>
  );
};
