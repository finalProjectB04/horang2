import Image from "next/image";

interface ListTitleProps {
  TitleName: string;
  onClick?: () => void;
}

export const MainListTitle: React.FC<ListTitleProps> = ({ TitleName, onClick }) => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center">
        <Image src="/assets/images/star.png" alt="별" width={25} height={25} className="mr-2" />
        <h2 className="text-2xl font-bold">{TitleName}</h2>
      </div>
      {onClick && (
        <button onClick={onClick}>
          더보기 <span>&gt;</span>
        </button>
      )}
    </div>
  );
};
