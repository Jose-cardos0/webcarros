import { useState, useEffect } from "react";

//firebase
import { db } from "../../services/services";
import { doc, getDoc } from "firebase/firestore";

//router
import { useParams } from "react-router-dom";

//interface
import { CarsProps } from "../Home/Home";

//css
import { Container } from "../../Components/Container/Container";

//icons
import { FaWhatsapp } from "react-icons/fa";

//slider swiper/react
import { Swiper, SwiperSlide } from "swiper/react";

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarsProps>();
  const [sliderPreView, setSliderPewVier] = useState<number>(2);

  useEffect(() => {
    if (!id) {
      return;
    }

    const conectDb = doc(db, "cars", id);
    getDoc(conectDb).then((snapshot) => {
      setCar({
        id: snapshot.id,
        name: snapshot.data()?.name,
        year: snapshot.data()?.year,
        city: snapshot.data()?.city,
        model: snapshot.data()?.model,
        uid: snapshot.data()?.uid,
        description: snapshot.data()?.description,
        created: snapshot.data()?.created,
        whatsapp: snapshot.data()?.whasapp,
        price: snapshot.data()?.price,
        km: snapshot.data()?.km,
        owner: snapshot.data()?.owner,
        images: snapshot.data()?.images,
      });
    });
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 720) {
        setSliderPewVier(1);
      } else {
        setSliderPewVier(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    //desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      <Swiper
        slidesPerView={sliderPreView}
        pagination={{ clickable: true }}
        navigation
      >
        {car?.images.map((image) => (
          <SwiperSlide key={image.name}>
            <img
              className="w-full h-96 object-cover"
              src={image.url}
              alt="Car Image"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between ">
            <h1 className="font-bold text-4xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-4xl text-black">R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>
          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-4 text-justify">{car?.description}</p>
          </div>
          <strong>
            <p>{car?.whatsapp}</p>
          </strong>
          <a
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6
            h-11 text-xl rounded-lg font-medium"
            href="#"
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </a>
        </main>
      )}
    </Container>
  );
}
