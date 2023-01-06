import React, { useState } from "react";
import LoginComponent from "./LoginComponent";
import HomeHeader from "./HomeHeader";
import { HomeHeroHeader, HomeHeroFooter } from "./HomeHero";
import { NavBar } from "www/shared/components/layout/NavBar";
import styles from "./UserHome.module.css";

export default function UserHome({
  isUserLoggedIn,
}: {
  isUserLoggedIn: boolean;
}) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="w-screen min-w-screen min-h-screen flex flex-col relative  bg-white ">
      <LoginComponent show={showLogin} setShow={setShowLogin} />
      {/* <BackgroundExtras /> */}
      {isUserLoggedIn ? <NavBar /> : <HomeHeader setShow={setShowLogin} />}
      <div className="h-full z-10 xl:ml-24 lg:ml-20 md:ml-10  2xl:w-[652px] xl:w-[580px] lg:w-[550px] flex flex-col lg:justify-center lg:py-0 justify-between lg:items-start items-center py-10">
        <HomeHeroHeader />
        <HomeHeroFooter />
      </div>
      <HomeBackground />
    </div>
  );
}

function HomeBackground() {
  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.background} relative`}>
        <img src="/home-images/background.png" />

        <div className={`${styles["home-cards"]}`}>
          <img
            src="/home-images/Card1.png"
            className={`${styles["home-card"]} ${styles.card1}`}
          />
          <img
            src="/home-images/Card2.png"
            className={`${styles["home-card"]} ${styles.card2}`}
          />
          <img
            src="/home-images/Card3.png"
            className={`${styles["home-card"]} ${styles.card3}`}
          />
        </div>
      </div>
    </div>
  );
}
