import Slider from "react-slick";
import { Box, Image, Center } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://picsum.photos/400/400?random=1",
  "https://picsum.photos/400/400?random=2",
  "https://picsum.photos/400/400?random=3",
  "https://picsum.photos/400/400?random=4",
  "https://picsum.photos/400/400?random=5",
];

export default function ProductCarousel() {
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

  return (
    <Box maxW="900px" mx="auto">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <Center key={idx} py={6}>
                <Image
                    src={src}
                    alt={`Produto ${idx + 1}`}
                    boxSize="180px"
                    objectFit="cover"
                    borderRadius="
                    100%" 
                    boxShadow="lg"
                />
          </Center>
        ))}
      </Slider>
    </Box>
  );
}