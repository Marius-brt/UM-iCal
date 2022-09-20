import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";

export default function CarouselComponent(props: any) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  return (
    <Carousel
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current]}
      className="carousel"
      styles={{
        root: {
          width: "100%",
        },
        indicator: {
          width: 12,
          height: 4,
          transition: "width 250ms ease",
          "&[data-active]": {
            width: 40,
          },
        },
      }}
      withControls={false}
      withIndicators
      loop
    >
      {props.children}
    </Carousel>
  );
}
