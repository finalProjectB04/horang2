import { useModal } from "@/context/modal.context";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import { useState } from "react";

const supabase = createClient();

const useAuth = () => {
  const { id, user_email, setUser, profile_url, user_nickname } = useUserStore();
  const [nickname, setNickname] = useState(user_nickname);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile_url || "");
  const [profileImageUrl, setProfileImageUrl] = useState<string>(profile_url || "");

  const modal = useModal();

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
      let newProfileUrl = profileImageUrl;

      if (profileImage) {
        const { data: avatarData, error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(`public/${crypto.randomUUID()}.png`, profileImage);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("profiles").getPublicUrl(avatarData.path);
        newProfileUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
          .from("Users")
          .update({ user_nickname: nickname, profile_url: newProfileUrl })
          .eq("id", id as string);

        if (updateError) {
          console.error("Error updating user:", updateError);
        } else {
          setUser(id as string, user_email as string, nickname!, newProfileUrl, "provider_value", "provider_id_value");
        }
      } else {
        const { error: updateError } = await supabase
          .from("Users")
          .update({ user_nickname: nickname })
          .eq("id", id as string);

        if (updateError) {
          console.error("Error updating user:", updateError);
        } else {
          setUser(
            id as string,
            user_email as string,
            nickname!,
            profileImageUrl,
            "provider_value",
            "provider_id_value",
          );
        }
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleUpdatePassword = async () => {
    const { error: updateError } = await supabase.auth.updateUser({ password: confirmPassword });
    if (!updateError) {
      modal.open({ title: "", content: "변경이 완료되었습니다." });
      setPassword("");
      setConfirmPassword("");
    } else {
      modal.open({ title: "", content: `${updateError.message}` });
    }
  };

  return {
    handleImageClick,
    handleImageChange,
    handleUpdateUser,
    handleUpdatePassword,
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
