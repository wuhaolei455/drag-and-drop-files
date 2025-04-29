"use client";

import FilesDragAndDrop from "./components/file-drag-and-drop";

export default function Home() {
  const onUpload = (files: File[]) => {
    console.log(files);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <FilesDragAndDrop
        onUpload={onUpload}
        count={1}
        formats={["jpg", "png", "gif"]}/>
    </div>
  );
}
