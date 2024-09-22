import { ReactNode, createContext, useState, useEffect } from "react";

//firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/services";

type AuthContextData = {
  signed: boolean;
  loading: boolean;
  attUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
};

type AuthProviderData = {
  children: ReactNode;
};

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const ProtectContext = createContext({} as AuthContextData);

function ProtectProvider({ children }: AuthProviderData) {
  const [signed, setSigned] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkedLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        //tem usuario logado
        setSigned({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });
        setLoading(false);
      } else {
        //não tem usuario logado
        setSigned(null);
        setLoading(false);
      }
    });

    return () => {
      //desmontar olheiro onAuth
      checkedLogin();
    };
  }, []);

  function attUser({ name, email, uid }: UserProps) {
    setSigned({ name, email, uid });
  }

  return (
    <ProtectContext.Provider
      value={{ signed: !!signed, loading, attUser, user: signed }}
    >
      {children}
    </ProtectContext.Provider>
  );
}

export default ProtectProvider;
