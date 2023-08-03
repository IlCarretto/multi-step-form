import { useState, createContext, useContext } from "react";

type ErrorContextType = {
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
};

const ErrorsContext = createContext<ErrorContextType>({
  errors: {},
  setErrors: () => {},
});

type IProps = {
  children: React.ReactNode;
};

export const useErrorsContext = () => useContext(ErrorsContext);

export const ErrorsProvider = ({ children }: IProps) => {
  const [errors, setErrors] = useState({});

  return (
    <ErrorsContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorsContext.Provider>
  );
};
