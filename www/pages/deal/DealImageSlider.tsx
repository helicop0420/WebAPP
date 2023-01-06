import React, { useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import Slider from "react-slick";
import { DealImage } from "types/views";

interface DealImageSliderProps {
  dealImages: DealImage[] | null;
}

const DealImageSlider = ({ dealImages }: DealImageSliderProps) => {
  const [nav1, setNav1] = useState(undefined);
  const [nav2, setNav2] = useState(undefined);
  const slider1 = useRef<any>(null);
  const slider2 = useRef<any>(null);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  return (
    <div>
      <div>
        <Slider slidesToScroll={1} useTransform={false} asNavFor={nav2} ref={slider1}>
          {dealImages &&
            dealImages.map((image) => (
              <div className="relative overflow-hidden" key={image.id}>
                <Image
                  src={image.image_url}
                  alt={"deal image"}
                  className="rounded-t-lg w-[830px] h-[512px] object-cover"
                  width={830}
                  height={512}
                />
              </div>
            ))}
        </Slider>

        <Slider
          asNavFor={nav1}
          ref={slider2}
          slidesToShow={dealImages ? Math.min(dealImages.length, 4) : 0}
          slidesToScroll={1}
          swipeToSlide={true}
          focusOnSelect={true}
          infinite={false}
          className="space-x-4 mt-[24px]"
        >
          {dealImages &&
            dealImages.map((image, index) => (
              <div
                className="relative w-[179px] relative flex-none cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-90 focus:outline-none"
                key={index}
              >
                <Image
                  src={image.image_url}
                  alt={"deal image"}
                  className="w-[179px] h-[134px] object-cover rounded-md"
                  width={179}
                  height={134}
                />
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default DealImageSlider;
