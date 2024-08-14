"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import FloatingButton from "@/components/detailpage/FloatingButton";
import { ScrollToTopButton } from "@/components/maindetail/ScrollToTopButton";

export default function ClientHeader() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FloatingButton />
      <ScrollToTopButton />
    </>
  );
}
