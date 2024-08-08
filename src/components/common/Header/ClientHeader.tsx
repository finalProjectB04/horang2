// ClientHeader.tsx
"use client";

import Header from "@/components/common/Header";
import { useState } from "react";

export default function ClientHeader() {
  const [searchTerm, setSearchTerm] = useState("");

  return <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
}
