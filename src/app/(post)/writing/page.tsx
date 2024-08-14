"use client";

import { insertCommunityData } from "@/components/posting/insert/route";
import { fetchSessionData } from "@/utils/auth";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface FormData {
  title: string;
  content: string;
  files: File[];
  category: string;
}

interface FormErrors extends Partial<FormData> {}

const categories = ["여행", "음식", "축제", "놀거리", "숙소"];

const Writing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    files: [],
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

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
      setFormData({ title: "", content: "", files: [], category: "" });
      setPreviewUrls([]);
      alert("글작성 성공!");
      router.push("/community");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("글작성 실패:", error);
      alert(`글작성 실패: ${error.message}`);
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
    if (!formData.category) newErrors.category = "카테고리를 선택해주세요";
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
    console.log(`Error occurred: ${error.message}`);
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  if (!sessionData?.user) {
    return <h1>로그인 후 글을 작성할 수 있습니다.</h1>;
  }

  return (
    <div className="w-[1440px] mx-auto mt-[300px]">
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
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block mb-1 text-black font-sans text-[28px] font-bold leading-[42px] tracking-tight"
            >
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block mb-1 text-black font-sans text-[28px] font-bold leading-[42px] tracking-tight"
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
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block mb-1 text-black font-sans text-[28px] font-bold leading-[42px] tracking-tight"
          >
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
            rows={12}
            placeholder="내용을 입력해주세요"
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block mb-1 text-black font-sans text-[28px] font-bold leading-[42px] tracking-tight"
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
        </div>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="py-3 px-8 border border-transparent rounded-full text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            글 작성하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default Writing;
