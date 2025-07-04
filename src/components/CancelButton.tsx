"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export function CancelButton(){
    const router = useRouter();
    const searchParams = useSearchParams();
  
    function handleCancel() {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("time");
  
      const newParams = params.toString();
      const newUrl = newParams
        ? `${window.location.pathname}?${newParams}`
        : window.location.pathname;
  
      router.replace(newUrl);

    }

  return (
    <Button onClick={handleCancel} variant = "outline" type = "button">
      Cancel
    </Button>
  );
}
