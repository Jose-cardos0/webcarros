import { Link } from "react-router-dom";

//firebase
import { signOut } from "firebase/auth";
import { auth } from "../../services/services";

//context
import { useContext } from "react";
import { ProtectContext } from "../../Context/ProtectContext";

export function PanelHeader() {
  const { user } = useContext(ProtectContext);

  function logOut() {
    signOut(auth).then(() => {
      console.log(user?.name, "Deslogado com suceso");
    });
  }

  return (
    <div
      className="min-w-full flex items-center 
     gap-4 bg-red-500 rounded-md px-2 text-white mb-4 "
    >
      <Link className="hover:text-black" to={"/dashboard"}>
        DashBaord
      </Link>
      <Link className="hover:text-black" to={"/dashboard/newcar"}>
        Cadastrar carro
      </Link>

      <button className="hover:text-black ml-auto" onClick={logOut}>
        Sair da conta
      </button>
    </div>
  );
}
