import { Container } from "../../Components/Container/Container";

//usestate
import { useState, useEffect } from "react";

//firebase
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/services";

//routerdom
import { Link } from "react-router-dom";

export interface CarsProps {
  id: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImaeProps[];
  uid: string;
  model?: string;
  description?: string;
  created?: string;
  whatsapp?: string;
  owner?: string;
}

interface CarImaeProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadingImg, setLoadingImg] = useState<string[]>([]);

  console.log(cars);

  useEffect(() => {
    async function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, orderBy("created", "desc"));

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
  }, []);

  function handleImageLoading(id: string) {
    setLoadingImg((prevImagesLoadings) => [...prevImagesLoadings, id]);
  }

  return (
    <Container>
      <section
        className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center
      items-center gap-2"
      >
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none "
          type="text"
          placeholder="Digite o nome do carro..."
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
          Buscar
        </button>
      </section>
      <article className="mb-4">
        <h1 className="font-bold text-center mt-6">
          {" "}
          Carros novos e usados em todo Sergipe
        </h1>
      </article>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full m-auto gap-3 max-w-sm bg-white rounded-lg">
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadingImg.includes(car.id) ? "none" : " block",
                }}
              ></div>
              <img
                className="w-full rounded-lg mb-2 
                max-h-72 hover:scale-105 transition-all 
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
          </Link>
        ))}
      </main>
    </Container>
  );
}
