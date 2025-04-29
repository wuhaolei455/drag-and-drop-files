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
        formats={["jpg", "png", "gif"]}
      >
        <div className="w-full h-full p-[50px] flex items-center justify-center flex-col text-2xl text-gray-600 border-2 border-dashed border-gray-300 rounded-xl">
          传下文件试试？
          <span role="img" aria-label="emoji" className="text-6xl mt-5">
            &#128526;
          </span>
        </div>
      </FilesDragAndDrop>
    </div>
  );
}
