import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useState } from "react";

const supabase = createClient();

const useAuth = () => {
  const { id, user_email, setUser, profile_url } = useUserStore();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile_url || "");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(profile_url || "");

  const handleImageClick = () => {
    document.getElementById("profileImage")?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (fileObj) {
      setProfileImage(fileObj);
      const objectUrl = URL.createObjectURL(fileObj);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (profileImage) {
        const { data: avatarData, error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(`public/${crypto.randomUUID()}.png`, profileImage);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("profiles").getPublicUrl(avatarData.path);
        setProfileImageUrl(publicUrlData.publicUrl);

        const { error: updateError } = await supabase
          .from("Users")
          .update({ user_nickname: nickname, profile_url: publicUrlData.publicUrl })
          .eq("id", id as string);

        if (updateError) {
          console.error("Error updating user:", updateError);
        } else {
          console.log("User information updated successfully");
          setUser(id as string, user_email as string, nickname, publicUrlData.publicUrl);
        }
      } else {
        const { error: updateError } = await supabase
          .from("Users")
          .update({ user_nickname: nickname })
          .eq("id", id as string);

        if (updateError) {
          console.error("Error updating user:", updateError);
        } else {
          console.log("User information updated successfully");
          setUser(id as string, user_email as string, nickname, profileImageUrl);
        }
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleUpadatePassword = async () => {
    const { error: updateError } = await supabase.auth.updateUser({ password: confirmPassword });
    if (!updateError) {
      alert("변경이 완료되었습니다.");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert(updateError.message);
    }
  };

  return {
    handleImageClick,
    handleImageChange,
    handleUpdateUser,
    handleUpadatePassword,
    previewUrl,
    nickname,
    setNickname,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  };
};

export default useAuth;
