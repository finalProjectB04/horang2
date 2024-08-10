import Image from "next/image";
import { ChangeEvent } from "react";

interface ProfileImageProps {
  profileImageUrl: string;
  onImageClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileImageUrl, onImageClick, onFileChange }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div onClick={onImageClick} className="relative w-24 h-24 sm:w-16 sm:h-16 mb-4 cursor-pointer">
        <Image
          src={profileImageUrl}
          alt="Profile Image"
          layout="intrinsic"
          width={96}
          height={96}
          objectFit="cover"
          className="rounded-full border-2 border-gray-300 sm:w-16 sm:h-16"
        />
        <input type="file" id="profileImageInput" className="hidden" accept="image/*" onChange={onFileChange} />
      </div>
    </div>
  );
};

export default ProfileImage;
