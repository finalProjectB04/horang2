import { useUserStore } from "@/zustand/userStore";
import React, { ChangeEvent, useState } from "react";

const useFileChange = () => {
  const { profile_url } = useUserStore();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(profile_url || "");

  const handleImageClick = () => {
    document.getElementById("profileImageInput1")?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return { handleImageClick, handleFileChange, profileImageUrl };
};

export default useFileChange;
