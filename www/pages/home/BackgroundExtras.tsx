import React from "react";
import UserCard from "./UserCard";
import DealCard from "./DealCard";
import RoundPointer from "./RoundPointer";
import AnimatedTopArc from "./AnimatedTopArc";
import AnimatedBottomLeftArc from "www/pages/home/AnimatedBottomLeftArc";
import AnimatedBottomRightArc from "./AnimatedBottomRightArc";
import MiniCard from "./MiniCard";
import UserCardStroked from "./UserCardStroked";
export default function BackgroundExtras() {
  return (
    <>
      {/* <div className=""> */}
      {/* Top arc */}
      <div className="absolute right-[14.74%] top-[28%] h-[126px] w-[433px]">
        <AnimatedTopArc />
      </div>
      {/* bottom left arc */}
      <div className="absolute right-[28.456%] top-[38.6%] h-[222px] w-[221px]">
        <AnimatedBottomLeftArc />
      </div>
      {/* bottom right arc */}
      <div className="absolute right-[14.875%] top-[40.6%] h-[209px] w-[211px]">
        <AnimatedBottomRightArc />
      </div>
      {/* translate-x-[20.97%] */}
      <div className="absolute top-[50%] right-[21.97%] transform  translate-y-[-50%]">
        <DealCard />
      </div>
      {/* top left */}
      <div className="absolute top-[12.88%] right-[35%] transition transform  -translate-x-[35%] translate-y-[12.8%]">
        <UserCardStroked
          name="Eleanor Pena"
          imgSrc="/home-images/sicard1.png"
          type="Sponsor"
          status="Connected"
          animate
        />
      </div>
      <div className="absolute top-[33.33%] right-[39%] transform -translate-x-[39%] translate-y-[33.33%]">
        <RoundPointer />
      </div>
      {/* top right */}
      <div className="absolute top-[15.11%] right-[10%] transform -translate-x-[10%] translate-y-[15.11%]">
        <UserCard name="Jacob Jones" imgSrc="/home-images/sicard2.png" type="Investor" status="Connected" />
      </div>
      <div className="absolute top-[35.33%] right-[12.5%] transform -translate-x-[12.5%] translate-y-[33.33%]">
        <RoundPointer />
      </div>
      {/* bottom center */}
      <div className="absolute bottom-[28%] right-[26.5%] transform translate-x-[26.5%] translate-y-[28%]">
        <RoundPointer />
      </div>
      <div className="absolute bottom-[10.5%] right-[24.5%] transform translate-x-[24.5%] translate-y-[10.5%]">
        <UserCard name="Floyd Miles" imgSrc="/home-images/sicard3.png" type="Sponsor" status="Connected" />
      </div>
      {/* top left */}
      <div className="absolute bottom-[38.2%] right-[37.2%] transform translate-x-[37.2%] translate-y-[38.2%]">
        <MiniCard imgSrc="/home-images/minicardimg1.png" />
      </div>
      {/* middle minicard right  */}
      <div className="absolute bottom-[41%] right-[4.62%] transform -translate-x-[4.62%] translate-y-[41%]">
        <MiniCard imgSrc="/home-images/minicardimg2.png" />
      </div>
      {/* </div> */}
    </>
  );
}
