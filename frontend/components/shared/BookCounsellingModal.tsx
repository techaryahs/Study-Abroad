"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCounsellingModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      router.push("/book-counselling");
      onClose(); // to reset state in parent
    }
  }, [isOpen, router, onClose]);

  return null;
}
