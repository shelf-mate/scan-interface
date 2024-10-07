import { getUnits, Unit } from "@shelf-mate/api-client-ts";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface UnitContextProps {
  units: Unit[];
}

const UnitContext = createContext<UnitContextProps | undefined>(undefined);

const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    getUnits().then((res) => {
      //@ts-ignore
      setUnits(res.data);
    });
  }, []);
  return (
    <UnitContext.Provider value={{ units }}>{children}</UnitContext.Provider>
  );
};

export { UnitProvider, UnitContext };
