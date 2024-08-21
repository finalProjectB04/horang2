"use client";

import { insertCommunityData } from "@/components/posting/insert/route";
import useCustomConfirm from "@/hooks/useCustomConfirm";
import { fetchSessionData } from "@/utils/auth";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

interface FormData {
  title: string;
  content: string;
  files: File[];
  category: string;
  cost: string;
  departure: string;
  period: string;
  place: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  files?: string;
  category?: string;
  cost?: string;
  departure?: string;
  period?: string;
  place?: string;
}

const categories = ["여행", "음식", "축제", "놀거리", "숙소"];

const Writing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    files: [],
    category: "",
    cost: "",
    departure: "",
    period: "",
    place: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const confirm = useCustomConfirm();
  const {
    data: sessionData,
    isPending,
    error,
  } = useQuery<Session | null, Error>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!sessionData?.user?.id) {
        throw new Error("로그인 후 글을 작성할 수 있습니다.");
      }
      return insertCommunityData({
        ...data,
        userId: sessionData.user.id,
        files: data.files,
      });
    },
    onSuccess: () => {
      setFormData({ title: "", content: "", files: [], category: "", cost: "", departure: "", period: "", place: "" });
      setPreviewUrls([]);
      confirm(`글작성 성공`);
      router.push("/community");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("글작성 실패:", error);
      confirm(`글작성 실패: ${error.message}`);
    },
  });

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "제목을 작성해주세요";
    if (!formData.content.trim()) newErrors.content = "내용을 적어주세요";
    if (!formData.category) newErrors.category = "분류를 선택해주세요";
    if (!formData.cost.trim()) newErrors.cost = "여행비용을 입력해주세요";
    if (!formData.departure.trim()) newErrors.departure = "출발장소를 입력해주세요";
    if (!formData.period.trim()) newErrors.period = "여행기간을 입력해주세요";
    if (!formData.place.trim()) newErrors.place = "여행장소를 입력해주세요";
    if (formData.files.length === 0) newErrors.files = "사진을 최소 1장 이상 첨부해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));

      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  if (!sessionData?.user) {
    return <h1>로그인 후 글을 작성할 수 있습니다.</h1>;
  }

  return (
    <div className="w-[375px] lg:w-[1280px] md:w-[1280px] mx-auto my-[200px]">
      <form onSubmit={handleSubmit} className="lg:space-y-28 space-y-14">
        <div className="col-span-2">
          <div className="flex items-center space-x-4 mb-8">
            <label
              htmlFor="title"
              className="flex-shrink-0 text-black font-sans text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] font-bold  tracking-tight"
            >
              제목
            </label>
            <div className="flex-grow">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
                placeholder="제목을 입력해주세요"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="category"
              className="flex-shrink-0 text-black text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] font-bold tracking-tight"
            >
              분류
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
            >
              <option value="">분류 선택</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-[28px]">
          <div className="flex items-center space-x-4">
            <Image src={"/assets/images/community/travel_spot.svg"} width={32} height={32} alt="여행장소" />
            <label
              htmlFor="place"
              className="flex-shrink-0 text-black font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행장소
            </label>
            <input
              id="place"
              name="place"
              type="text"
              value={formData.place}
              onChange={handleChange}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행장소를 입력해주세요"
            />
            {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <Image src={"/assets/images/community/travel_start.svg"} width={32} height={32} alt="출발장소" />
            <label
              htmlFor="departure"
              className="flex-shrink-0 text-black font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              출발장소
            </label>
            <input
              id="departure"
              name="departure"
              type="text"
              value={formData.departure}
              onChange={handleChange}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="출발장소를 입력해주세요"
            />
            {errors.departure && <p className="text-red-500 text-sm mt-1">{errors.departure}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <Image src={"/assets/images/community/travel_budget.svg"} width={32} height={32} alt="여행비용" />
            <label
              htmlFor="cost"
              className="flex-shrink-0 text-black font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행비용
            </label>
            <input
              id="cost"
              name="cost"
              type="text"
              value={formData.cost}
              onChange={handleChange}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행비용을 입력해주세요"
            />
            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <Image src={"/assets/images/community/travel_date.svg"} width={32} height={32} alt="여행기간" />
            <label
              htmlFor="period"
              className="flex-shrink-0 text-black font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행기간
            </label>
            <input
              id="period"
              name="period"
              type="text"
              value={formData.period}
              onChange={handleChange}
              className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행기간을 입력해주세요"
            />
            {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period}</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-4">
            <Image src={"/assets/images/community/travel_story.svg"} width={30} height={30} alt="내용" />
            <label
              htmlFor="content"
              className="block text-black font-sans font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              내용
            </label>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="block w-full rounded-md border-grey-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
            rows={12}
            placeholder="내용을 입력해주세요"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
        <div className="flex items-center space-x-4">
          <Image src={"/assets/images/community/travel_image.svg"} width={40} height={40} alt="사진" />
          <label
            htmlFor="files"
            className="flex-shrink-0 text-black font-sans text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] font-bold tracking-tight"
          >
            사진
          </label>
          <input
            id="files"
            name="files"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="block w-full text-sm text-grey-500
file:mr-4 file:py-2 file:px-4
file:rounded-full file:border-0
file:text-sm file:font-semibold
file:bg-grey-100 file:text-grey-700
hover:file:bg-grey-200"
          />
          {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
        </div>
        {previewUrls.length > 0 && (
          <div className="mx-auto">
            <Swiper
              spaceBetween={10}
              slidesPerView={5}
              pagination={{ clickable: true }}
              className="w-full max-w-screen-xl"
            >
              {previewUrls.map((url, index) => (
                <SwiperSlide key={index} className=" w-[200px] h-[200px]">
                  <div className="relative group">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-[10px] w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      X
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-shrink-0 flex items-center justify-center w-[327px] h-10 px-[11px] py-[16px] gap-[5px] lg:w-[171px] lg:h-[80px] lg:py-6 lg:px-8 rounded-[10px]  border border-transparent lg:rounded-[20px] lg:text-sm font-medium text-white bg-orange-600 hover:bg-orange-400 focus:outline-none disabled:opacity-50 "
          >
            글 작성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default Writing;
