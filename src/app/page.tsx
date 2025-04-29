"use client";

import { useState } from "react";
import FilesDragAndDrop from "./components/file-drag-and-drop";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const onUpload = (files: File[]) => {
    console.log(files);
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };


  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <FilesDragAndDrop
        onUpload={onUpload}
        count={1}
        formats={["jpg", "png", "gif", "webp"]}/>
      {imageUrl && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 z-50">
          <img 
            src={imageUrl} 
            alt="uploaded"
            className="p-[20px] border border-dashed border-gray-300 rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
