"use client";

import { useState, useEffect } from "react";

import { Regions, regions } from "./Area";

interface RegionSelectorProps {
  onSelect: (region: string, sigungu: string) => void;
  onClose: () => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelect, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSigungu, setSelectedSigungu] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSigungu, setFilteredSigungu] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRegion) {
      const sigunguList = (regions as Regions).시군구[selectedRegion] || [];
      setFilteredSigungu(sigunguList.filter((sigungu) => sigungu.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  }, [selectedRegion, searchTerm]);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedSigungu("");
    setSearchTerm("");
  };

  const handleSigunguSelect = (sigungu: string) => {
    setSelectedSigungu(sigungu);
  };

  const handleConfirm = () => {
    onSelect(selectedRegion, selectedSigungu);
    onClose();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">지역 선택</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-2">
            <h3 className="font-semibold mb-2">광역시/도</h3>
            <div className="flex flex-wrap gap-2">
              {regions.광역시도.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`p-2 rounded ${selectedRegion === region ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <h3 className="font-semibold mb-2">시/군/구</h3>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {filteredSigungu.map((sigungu) => (
                <button
                  key={sigungu}
                  onClick={() => handleSigunguSelect(sigungu)}
                  className={`p-2 rounded ${selectedSigungu === sigungu ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                >
                  {sigungu}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleConfirm} className="px-4 py-2 bg-orange-500 text-white mr-2 rounded">
            확인
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded ">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
