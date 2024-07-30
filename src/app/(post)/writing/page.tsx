"use client";

import { insertCommunityData } from "@/components/posting/insert/InsertCommunityData";
import { fetchSessionData } from "@/utils/fetchSession";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface FormData {
  title: string;
  content: string;
  file: File | null;
}

const Writing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    file: null,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: sessionData,
    isPending,
    error,
  } = useQuery<Session | null, Error, Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!sessionData?.user?.id) {
        throw new Error("로그인 후 글을 작성할 수 있습니다.");
      }
      return insertCommunityData({ ...data, userId: sessionData.user.id });
    },
    onSuccess: () => {
      setFormData({ title: "", content: "", file: null });
      setPreviewUrl(null);
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = "제목을 작성해주세요";
    if (!formData.content.trim()) newErrors.content = "내용을 적어주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({ ...prev, file }));

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            File:
          </label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          />
        </div>
        {previewUrl && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Image Preview:</h4>
            <Swiper modules={[Pagination]} spaceBetween={5} slidesPerView={1} pagination={{}} className="mt-2">
              <SwiperSlide>
                <Image src={previewUrl} alt="Preview" width={300} height={300} className="rounded-lg" />
              </SwiperSlide>
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
