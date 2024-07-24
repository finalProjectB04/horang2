import Image from "next/image";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Image
          src="/assets/images/newdetail.png"
          alt="background"
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
        <div className="absolute bottom-10 left-0 w-full px-5 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto my-36">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 md:p-4 text-base md:text-lg bg-black bg-opacity-70 text-white placeholder-gray-400 border-2 border-gray-600 rounded-full shadow-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
