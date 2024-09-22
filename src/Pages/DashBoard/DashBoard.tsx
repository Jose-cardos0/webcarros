import { useEffect, useState, useContext, useCallback } from "react";
import { Container } from "../../Components/Container/Container";

//router
import { Link } from "react-router-dom";

//components
import { PanelHeader } from "../../Components/PanelHeader/PanelHeader";

//icons
import { FiTrash2 } from "react-icons/fi";

//interfaces
import { CarsProps } from "../Home/Home";

//firebase
import { storage, db } from "../../services/services";
import { ref, deleteObject } from "firebase/storage";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

//context
import { ProtectContext } from "../../Context/ProtectContext";

export function DashBoard() {
  const { user } = useContext(ProtectContext);
  const [loadingImg, setLoadingImg] = useState<string[]>([]);
  const [cars, setCars] = useState<CarsProps[]>([]);

  useEffect(() => {
    async function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snpashot) => {
        let listCars = [] as CarsProps[];
        snpashot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            price: doc.data().price,
            city: doc.data().city,
            km: doc.data().km,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listCars);
      });
    }

    loadCars();
  }, [user]);

  function handleImageLoading(id: string) {
    setLoadingImg((prevImagesLoadings) => [...prevImagesLoadings, id]);
  }

  const deleteCar = useCallback(async (car: CarsProps) => {
    const refImgDelete = doc(db, "cars", car.id);
    await deleteDoc(refImgDelete);

    //deletar img do storage imgs
    car.images.map(async (image) => {
      const imgPath = `images/${image.uid}/${image.name}`;

      const imageDelete = ref(storage, imgPath);

      try {
        await deleteObject(imageDelete);
        setCars(cars.filter((cars) => cars.uid !== car.id));
      } catch (error) {
        console.error("error ao tentar excluir");
      }
    });
  }, []);

  // // async function deleteCar(id: string) {
  //   const refImgDelete = doc(db, "cars", id);
  //   await deleteDoc(refImgDelete);

  //   setCars(cars.filter((car) => car.uid !== id));
  // // }

  return (
    <Container>
      <PanelHeader />
      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section className="w-full m-auto gap-3 max-w-sm bg-white rounded-lg relative">
            <div
              className="w-full h-72 rounded-lg bg-slate-200"
              style={{
                display: loadingImg.includes(car.id) ? "none" : " block",
              }}
            ></div>
            <button
              onClick={() => deleteCar(car)}
              className="absolute bg-slate-200 rounded-full 
              p-2 right-2 top-2 hover:scale-105 transition-all drop-shadow-xl"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 
                max-h-72  
                object-contain "
              src={car.images[0].url}
              alt="Carro"
              onLoad={() => handleImageLoading(car.id)}
              style={{
                display: loadingImg.includes(car.id) ? "block" : "none",
              }}
            />
            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">
                {car.year} | {car.km} km
              </span>
              <strong className="text-black font-medium text-xl">
                {car.price}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-300 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-zinc-700">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
