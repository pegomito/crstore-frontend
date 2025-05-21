import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Image, Center, Spinner, Text } from "@chakra-ui/react";
import api from "../utils/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
  .then(res => {
    const produtos = Array.isArray(res.data) ? res.data : res.data.data || [];
    const imgs = produtos.map(prod => prod.image);
    console.log(imgs);
    setImages(imgs);
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return <Center py={10}><Spinner size="xl" /></Center>;
  }

  if (!images.length) {
    return <Center py={10}><Text>Nenhuma imagem encontrada.</Text></Center>;
  }

  return (
    <Box maxW="900px" mx="auto">
      <Slider {...settings}>
        {images.map((src, idx) => (
  <Center key={idx} py={6}>
    {src && (
      <Image
        src={src.startsWith("/") ? `http://localhost:3333${src}` : src}
        boxSize="180px"
        objectFit="cover"
        borderRadius="100%"
        boxShadow="lg"
        alt={`Produto ${idx + 1}`}
      />
    )}
  </Center>
))}
      </Slider>
    </Box>
  );
}