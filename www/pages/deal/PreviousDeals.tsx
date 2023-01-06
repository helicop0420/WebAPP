import Image from "next/future/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Deals } from "types/views";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/pro-light-svg-icons";
import { isNaN } from "lodash";
interface PreviousDealsProps {
  deals: Deals[] | null;
}
export default function PreviousDeals({ deals = [] }: PreviousDealsProps) {
  const slider = useRef<any>(null);
  const [pointers, setPointers] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(0);
  const [sliderActiveIndex, setSliderActiveIndex] = useState(0);
  useEffect(() => {
    let pointers = Math.ceil(
      (deals?.length ?? 0) / slider.current.props.slidesToShow
    );
    setPointers(isNaN(pointers) ? 0 : pointers);
    setSlidesToShow(slider.current.props.slidesToShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const next = () => {
    slider.current?.slickNext();
  };
  const previous = () => {
    slider.current?.slickPrev();
  };
  const goTo = (slide: number) => {
    slider.current?.slickGoTo(slide * slidesToShow);
  };
  const settings = {
    centerPadding: "60px",
    adaptiveHeight: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: deals ? Math.min(deals.length, 2) : 0,
    slidesToScroll: deals ? Math.min(deals.length, 2) : 0,
    className: " w-full flex grid-cols-2 gap-2",
    beforeChange: (_oldIndex: number, newIndex: number) => {
      setSliderActiveIndex(newIndex / pointers);
    },
  };

  return (
    <div>
      <p className=" pb-2 text-sm leading-5 font-semibold text-gray-800 px-4">
        Previous Deals:
      </p>

      <div className="relative w-full h-full flex  px-2">
        <Slider {...settings} ref={slider}>
          {deals &&
            deals?.map((deal) => (
              <div
                className="w-full max-w-[160px] px-2 grid grid-cols-2 gap-9 h-auto mb-4 box-content"
                key={deal.id}
              >
                <div className="h-full">
                  <Link href={`/deal/${deal.handle}`}>
                    <div className="rounded shadow-lg align-top  flex-none snap-center group h-full  flex flex-col justify-between">
                      <div className="relative w-50 h-25 overflow-hidden group-hover:cursor-pointer">
                        <Image
                          className="w-[160px] h-[100px] object-cover"
                          src={
                            deal.deal_image
                              ? deal.deal_image
                              : "/images/placeholder.png"
                          }
                          alt={deal.title + " image"}
                          width={200}
                          height={100}
                        />
                      </div>
                      <div className="p-2 group-hover:cursor-pointer  flex-1 flex flex-col">
                        <div className="mb-2 whitespace-normal text-sm leading-5 font-bold flex-1">
                          {deal.title}
                        </div>
                        <p className="text-gray-500  align-bottom text-sm leading-5 font-normal">
                          <b className="text-green-700">
                            {deal.interest_count} people
                          </b>{" "}
                          have expressed interest.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </Slider>
      </div>
      {deals && deals?.length > 0 && (
        <div className="flex gap-4 justify-center items-center w-full">
          <button
            className="w-[30px] h-[30px] bg-green-700 text-white rounded-full"
            onClick={previous}
          >
            <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
          </button>
          <div className="bg-white flex space-x-2 justify-center">
            {new Array(Math.max(0, pointers)).fill(0).map((_item, index) => (
              <div
                className={` h-2 w-2  rounded-full ${
                  index === sliderActiveIndex ? "bg-green-700" : "bg-gray-500"
                }`}
                key={index}
                onClick={() => {
                  goTo(index);
                }}
              ></div>
            ))}
          </div>
          <button
            className="w-[30px] h-[30px] bg-green-700 text-white rounded-full"
            onClick={next}
          >
            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
          </button>
        </div>
      )}
    </div>
  );
}
