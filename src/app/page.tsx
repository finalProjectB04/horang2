"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import { Travel } from "@/components/main/Travel";
import { MainImage } from "@/components/main/MainSwiper";
import Control from "@/components/main/Control";
import { TravelCourse } from "@/components/main/TravelCourse";
import { MidImage } from "@/components/main/MidImage";

const Home = () => {
  // const { id, user_email, user_nickname, profile_url, user_address } = useUserStore((state) => ({
  //   id: state.id,
  //   user_email: state.user_email,
  //   user_nickname: state.user_nickname,
  //   profile_url: state.profile_url,
  //   user_address: state.user_address,
  // }));

  // useEffect(() => {
  //   console.log("User Info:");
  //   console.log("ID:", id);
  //   console.log("Email:", user_email);
  //   console.log("Nickname:", user_nickname);
  //   console.log("Profile URL:", profile_url);
  //   console.log("Address:", user_address);
  // }, [id, user_email, user_nickname, profile_url, user_address]);
  return (
    <div>
      <MainImage />
      <Control />
      <Travel></Travel>
      <MidImage />
      {/* <TravelCourse /> */}
    </div>
  );
};

export default Home;
