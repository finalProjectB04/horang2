"use client";

import { useState } from "react";
import Header from "@/components/common/Header";

export default function ClientHeader() {
  const [searchTerm, setSearchTerm] = useState("");

  return <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
}
