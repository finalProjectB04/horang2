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
<<<<<<< HEAD
    <div className="w-[1440px] mx-auto my-[300px]">
      <form onSubmit={handleSubmit} className="space-y-8">
        {previewUrls.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700">미리보기:</h4>
            <Swiper
              modules={[Pagination]}
              spaceBetween={5}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="w-full h-[800px]"
            >
              {previewUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={1440}
                      height={800}
                      className="w-[1440px] h-[800px] object-contain rounded-t-[9.11px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 my-6">
=======
    <div className="w-[375px] lg:w-[1280px] mx-auto my-[200px]">
      <form onSubmit={handleSubmit} className="lg:space-y-28 space-y-14">
        <div className="grid grid-cols-3 lg:gap-6 ">
>>>>>>> 498f99fc16aef7af609ec3032d9fd5955b01095e
          <div className="col-span-2">
            <div className="flex items-center space-x-4">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
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

        <div className="flex flex-col gap-[28px]  ">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none">
              <path
                d="M12.0008 0C5.80878 0 0.800781 5.008 0.800781 11.2C0.800781 19.6 12.0008 32 12.0008 32C12.0008 32 23.2008 19.6 23.2008 11.2C23.2008 5.008 18.1928 0 12.0008 0ZM12.0008 15.2C9.79278 15.2 8.00078 13.408 8.00078 11.2C8.00078 8.992 9.79278 7.2 12.0008 7.2C14.2088 7.2 16.0008 8.992 16.0008 11.2C16.0008 13.408 14.2088 15.2 12.0008 15.2Z"
                fill="#FF5C00"
              />
            </svg>
            <label
              htmlFor="place"
              className="flex-shrink-0 text-grey-700 font-normal text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행장소
            </label>
            <input
              id="place"
              name="place"
              type="text"
              value={formData.place}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행장소를 입력해주세요"
            />
            {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none">
              <path
                d="M12.0008 0C5.80878 0 0.800781 5.008 0.800781 11.2C0.800781 19.6 12.0008 32 12.0008 32C12.0008 32 23.2008 19.6 23.2008 11.2C23.2008 5.008 18.1928 0 12.0008 0ZM12.0008 15.2C9.79278 15.2 8.00078 13.408 8.00078 11.2C8.00078 8.992 9.79278 7.2 12.0008 7.2C14.2088 7.2 16.0008 8.992 16.0008 11.2C16.0008 13.408 14.2088 15.2 12.0008 15.2Z"
                fill="#FF5C00"
              />
            </svg>
            <label
              htmlFor="departure"
              className="flex-shrink-0 text-grey-700 font-normal text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              출발장소
            </label>
            <input
              id="departure"
              name="departure"
              type="text"
              value={formData.departure}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="출발장소를 입력해주세요"
            />
            {errors.departure && <p className="text-red-500 text-sm mt-1">{errors.departure}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <g clip-path="url(#clip0_1572_19142)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.8277 12.3518C19.1037 11.0578 18.92 9.67577 18.2013 8.40898C16.4668 5.35184 12.2731 4.12362 8.83443 5.66566C5.39575 7.20771 4.01424 10.9361 5.74874 13.9932C6.81892 15.8795 8.82527 17.0695 11.0128 17.3421C10.5159 18.3593 10.2403 19.4818 10.2403 20.6616C10.2403 25.2671 14.4398 29.0007 19.6201 29.0007C24.8005 29.0007 29 25.2671 29 20.6616C29 16.056 24.8005 12.3225 19.6201 12.3225C19.3532 12.3225 19.089 12.3324 18.8277 12.3518ZM8.45033 10.1685L13.1851 8.0452L15.5734 12.2547L10.8386 14.3779L8.45033 10.1685ZM16.0877 17.5226H23.2207V23.8641H16.0877V17.5226Z"
                  fill="#FF5C00"
                />
              </g>
              <defs>
                <clipPath id="clip0_1572_19142">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <label
              htmlFor="cost"
              className="flex-shrink-0 text-grey-700 font-normal text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행비용
            </label>
            <input
              id="cost"
              name="cost"
              type="text"
              value={formData.cost}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행비용을 입력해주세요"
            />
            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path
                d="M16 2H15V0H13V2H5V0H3V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM16 18H2V8H16V18ZM6 12H4V10H6V12ZM10 12H8V10H10V12ZM14 12H12V10H14V12ZM6 16H4V14H6V16ZM10 16H8V14H10V16ZM14 16H12V14H14V16Z"
                fill="#FF5C00"
              />
            </svg>
            <label
              htmlFor="period"
              className="flex-shrink-0 text-grey-700 font-normal text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              여행기간
            </label>
            <input
              id="period"
              name="period"
              type="text"
              value={formData.period}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="여행기간을 입력해주세요"
            />
            {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period}</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect width="33.8824" height="33.8824" fill="white" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24.13 4.42493C23.5802 3.54521 22.299 3.5452 21.7491 4.42493L19.3579 8.25092C18.6926 8.17488 18.014 8.13541 17.3248 8.13541C16.6357 8.13541 15.9571 8.17488 15.2919 8.2509L12.9007 4.42493C12.3509 3.54521 11.0697 3.5452 10.5198 4.42493L4.86549 13.4719C4.27113 14.1407 3.75389 14.8538 3.3246 15.5998C4.63876 16.3603 6.17027 16.4278 7.3489 15.7811L8.92119 18.5411C6.74383 19.7358 4.24975 19.6075 2.1462 18.5382C1.97325 19.2695 1.88281 20.016 1.88281 20.7698C1.88281 20.98 1.88985 21.1882 1.90374 21.3943C3.37333 23.2148 5.70455 23.7027 7.3489 22.8004L8.92119 25.5605C7.23803 26.484 5.3656 26.617 3.63062 26.1358C6.20873 29.7407 11.3736 32.0003 17.3248 32.0003C23.2845 32.0003 28.4557 29.7342 31.0301 26.1203C29.2797 26.6197 27.3853 26.4938 25.6843 25.5605L27.2566 22.8004C28.9189 23.7126 31.2833 23.2039 32.7497 21.334C32.7611 21.1476 32.7668 20.9595 32.7668 20.7698C32.7668 20.0091 32.6747 19.2557 32.4986 18.5181C30.3869 19.6059 27.8752 19.7433 25.6843 18.5411L27.2566 15.7811C28.4451 16.4332 29.9924 16.3591 31.3139 15.5805C30.887 14.8418 30.3738 14.1356 29.7849 13.4728L24.13 4.42493ZM16.9408 22.2355C18.6951 22.2355 20.1173 21.2241 20.1173 20.7229C20.1173 20.2216 18.6951 20.1178 16.9408 20.1178C15.1865 20.1178 13.7644 20.2216 13.7644 20.7229C13.7644 21.2241 15.1865 22.2355 16.9408 22.2355Z"
                fill="#FF5C00"
              />
            </svg>
            <label
              htmlFor="content"
              className="block mb-1 text-black font-sans font-bold text-[14px] leading-6 lg:text-[28px] lg:leading-[42px] tracking-tight"
            >
              내용
            </label>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
            rows={12}
            placeholder="내용을 입력해주세요"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M40 8H8C5.79 8 4 9.79 4 12V36C4 38.21 5.79 40 8 40H40C42.21 40 44 38.21 44 36V12C44 9.79 42.21 8 40 8ZM10 34L17 25L22 31.02L29 22L38 34H10Z"
              fill="#FF5C00"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M36.7213 12H34.8013V16.8H30V18.72H34.8013V24H36.7213V18.72H42V16.8H36.7213V12Z"
              fill="white"
            />
          </svg>
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
            className="block w-full text-sm text-gray-500
file:mr-4 file:py-2 file:px-4
file:rounded-full file:border-0
file:text-sm file:font-semibold
file:bg-gray-100 file:text-gray-700
hover:file:bg-gray-200"
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
