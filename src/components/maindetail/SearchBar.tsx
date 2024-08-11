import Image from "next/image";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="hidden lg:block">
        <div className="flex flex-col justify-center items-center">
          <div className="relative w-[1920px] h-[900px]">
            <Image
              src="/assets/images/newdetail.png"
              alt="background"
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
            <div className="absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">
              <div className="max-w-6xl mx-auto my-36">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full p-3 md:p-4 text-base md:text-lg bg-black bg-opacity-70 text-white placeholder-gray-400 border-2 border-gray-600 rounded-full shadow-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="  relative w-[375px] h-[295px]">
          <Image
            src="/assets/images/newdetail.png"
            alt="background"
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
};
