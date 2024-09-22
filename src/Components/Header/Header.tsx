//router
import { Link } from "react-router-dom";

//icons
import { FiUser, FiLogIn } from "react-icons/fi";

//img
import logo from "../../assets/logoSeCar.png";

//context
import { useContext } from "react";
import { ProtectContext } from "../../Context/ProtectContext";

export function Header() {
  const { loading, signed } = useContext(ProtectContext);

  return (
    <div
      className="w-full flex items-center justify-center 
    h-16 bg-white drop-shadow mb-4 "
    >
      <header className="flex justify-between w-11/12 ">
        <Link to={"/"} className="flex items-center">
          <img className="max-w-32" src={logo} alt="logo sergipe car" />
        </Link>

        {!loading && signed && (
          <Link
            to={"/dashboard"}
            className="border-b border-2 rounded-full p-1"
          >
            <FiUser size={24} color="#000" />
          </Link>
        )}

        {!loading && !signed && (
          <Link to={"/login"} className="border-b border-2 rounded-full p-1">
            <FiLogIn size={24} color="#000" />
          </Link>
        )}
      </header>
    </div>
  );
}
