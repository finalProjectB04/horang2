"use client";

import { insertCommunityData } from "@/components/posting/insert/route";
import { fetchSessionData } from "@/utils/fetchSession";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface FormData {
  title: string;
  content: string;
  files: File[];
  category: string;
}

const categories = ["여행", "음식", "축제", "레포츠", "숙소"];

const Writing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    files: [],
    category: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await fetchSessionData();
        setSessionData(session);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!sessionData?.user?.id) {
        throw new Error("로그인 후 글을 작성할 수 있습니다.");
      }
      return insertCommunityData({
        ...data,
        userId: sessionData.user.id,
        files: data.files.length > 0 ? data.files[0] : null,
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
      alert(`글작성 실패: ${error.message}`);
    },
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
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

  if (isLoading) {
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span role="alert" className="text-red-600 text-sm">
              {errors.category}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={!!errors.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.title && (
            <span role="alert" className="text-red-600 text-sm">
              {errors.title}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            aria-invalid={!!errors.content}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
          {errors.content && (
            <span role="alert" className="text-red-600 text-sm">
              {errors.content}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="files" className="block text-sm font-medium text-gray-700">
            Files:
          </label>
          <input
            id="files"
            name="files"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          />
        </div>
        {previewUrls.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Image Previews:</h4>
            <Swiper modules={[Pagination]} spaceBetween={5} slidesPerView={1} pagination={{}} className="mt-2">
              {previewUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <Image src={url} alt={`Preview ${index + 1}`} width={300} height={300} className="rounded-lg" />
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
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
      {mutation.isError && (
        <div role="alert" className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {mutation.error.message}
        </div>
      )}
    </div>
  );
};

export default Writing;
