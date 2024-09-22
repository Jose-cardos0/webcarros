import logo from "../../assets/logoSeCar.png";
import { useEffect } from "react";

//components
import { Container } from "../../Components/Container/Container";
import { Input } from "../../Components/Input/Input";

//routes
import { Link, useNavigate } from "react-router-dom";

//zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//firebase
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/services";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido.")
    .min(1, "O campo email é obrigatório."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogaut() {
      await signOut(auth);
    }
    handleLogaut();
  }, []);

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log("Login realizado com sucesso");
        console.log(user);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("error ao logar");
        console.log(error.message);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link className="mb-6 max-w-sm w-full" to={"/"}>
          <img className="w-full" src={logo} alt="logo sergipe car" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>
        <Link to={"/register"}>
          <p>
            Se não possui uma conta,{" "}
            <span className="text-blue-400 hover:text-black">cadastre-se!</span>
          </p>
        </Link>
      </div>
    </Container>
  );
}
