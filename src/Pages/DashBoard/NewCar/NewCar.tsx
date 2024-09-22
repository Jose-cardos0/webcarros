import { Container } from "../../../Components/Container/Container";
import { PanelHeader } from "../../../Components/PanelHeader/PanelHeader";

//input
import { Input } from "../../../Components/Input/Input";

//reacticons
import { FiUpload } from "react-icons/fi";

//hocks-forms
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//envio img
import { ChangeEvent, useContext, useState } from "react";

//context
import { ProtectContext } from "../../../Context/ProtectContext";

//gerar id aleatório para cada uid
import { v4 as uuidV4 } from "uuid";

//icons
import { GoTrash } from "react-icons/go";

//firebase
import { storage, db } from "../../../services/services";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { addDoc, collection } from "firebase/firestore";

//schema
const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório!"),
  model: z.string().min(1, "O modelo é obrigatório!"),
  year: z.string().min(1, "O ano é obrigatório!"),
  km: z.string().min(1, "O KM do carro é obrigatório!"),
  price: z.string().min(1, "O preço é obrigatório!"),
  city: z.string().min(1, "A cidade é obrigatório!"),
  whatsapp: z
    .string()
    .min(8, "O Telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "O telefone deve ser no formato 79000000000",
    }),
  description: z.string().min(1, "A descrição é obrigatório!"),
});

type FormData = z.infer<typeof schema>;
interface imageItensProps {
  uid: string;
  name: string;
  preViwerImg: string;
  url: string;
}

export function RegCar() {
  const { user } = useContext(ProtectContext);
  const [carImages, setCarImages] = useState<imageItensProps[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  //envio de imagem
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        console.log(image);
        await handleImageStorage(image);
      } else {
        alert("Apenas imagens .jpg ou .png");
        return;
      }
    }
  }

  //registrar img no storage
  function handleImageStorage(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImageV4 = uuidV4();

    //ref para salvar no storage
    const linkUploadRef = ref(storage, `images/${currentUid}/${uidImageV4}`);

    //enviando img para banco
    uploadBytes(linkUploadRef, image).then((snapShot) => {
      //resgatando img do banco para aparecer na tela do usuário
      getDownloadURL(snapShot.ref).then((downloadURL) => {
        const imageItem = {
          name: uidImageV4,
          uid: currentUid,
          preViwerImg: URL.createObjectURL(image), //cria um URL para previwer da img e visualização na tela
          url: downloadURL,
        };
        console.log(downloadURL);
        console.log(imageItem);
        console.log(currentUid);

        setCarImages((contein: imageItensProps[]) => [...contein, imageItem]);
      });
    });
  }

  async function handleDeleteImg(item: imageItensProps) {
    const imagePath = `images/${item.uid}/${item.name}`;

    const imgRef = ref(storage, imagePath);
    console.log(item.url);

    try {
      await deleteObject(imgRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch (error) {
      console.error(`Error deleting image: ${error}`);
    }
  }

  function onSubmit(data: FormData) {
    console.log(data);

    if (carImages.length === 0) {
      alert("Precisa enviar uma imagem");
      return;
    }

    const carListImg = carImages.map((cars) => {
      return {
        url: cars.url,
        name: cars.name,
        uid: cars.uid,
      };
    });

    addDoc(collection(db, "cars"), {
      name: data.name,
      model: data.model,
      year: data.year,
      km: data.km,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImg,
    })
      .then(() => {
        reset();
        setCarImages([]);
        console.log("CADASTRO COM SUCESSO");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Container>
      <PanelHeader />
      <div
        className="w-full bg-white p-3 rounded-lg sm:flex-row items-center
       gap-2"
      >
        <button
          className="border-2 w-48 rounded-lg flex 
          items-center justify-center cursor-pointer
        border-gray-600 h-20 "
        >
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              className="opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>
        {carImages.map((item: imageItensProps) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button onClick={() => handleDeleteImg(item)} className="absolute">
              <GoTrash
                size={30}
                className=" cursor-pointer rounded-xl p-2 hover:bg-neutral-400 "
              />
            </button>

            <img
              className="rounded-lg w-full h-32 object-cover"
              src={item.preViwerImg}
              alt={"foto do carro"}
            />
          </div>
        ))}
      </div>
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix..."
            ></Input>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex PLUS MANUAL..."
            ></Input>
          </div>
          <div className="w-full flex flex-row mb-3  items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano do carro</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2023/2023..."
              ></Input>
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">KM's rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 25000..."
              ></Input>
            </div>
          </div>

          <div className="w-full flex flex-row mb-3  items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Endereço</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Aracaju - SE..."
              ></Input>
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 079xxxxxxxxx..."
              ></Input>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 10000..."
            ></Input>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            >
              {errors.description && <p>{errors.description?.message}</p>}
            </textarea>
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white font-medium w-full h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
}
