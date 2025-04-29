import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';

enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  LOADING = 'loading',
  NONE = ''
}

interface Message {
  text: string;
  type: MessageType;
}

interface FilesDragAndDropProps {
  onUpload: (files: File[]) => void;
  children?: React.ReactNode;
  count?: number;
  formats?: string[];
}

const FilesDragAndDrop: React.FC<FilesDragAndDropProps> = ({ 
  onUpload, 
  children,
  count,
  formats
}) => {
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<Message>({ 
    text: '请上传文件', 
    type: MessageType.NONE 
  });

  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emoji = (messageType: MessageType): string => {
    switch (messageType) {
      case MessageType.ERROR:
        return '😢';
      case MessageType.SUCCESS:
        return '😊';
      case MessageType.LOADING:
        return 'ℹ️';
      default:
        return '😎';
    }
  }

  useEffect(() => {
    if (!dropRef.current) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      if (!e.dataTransfer) return;

      const files = Array.from(e.dataTransfer.files);

      if (count && count < files.length) {
        showMessage(`抱歉，每次最多只能上传${count}个文件。`, MessageType.ERROR);
        return;
      }

      if (formats && files.some(file =>
        !formats.some(format =>
          file.name.toLowerCase().endsWith(format.toLowerCase())
        )
      )) {
        showMessage(`只允许上传 ${formats.join(', ')}格式的文件`, MessageType.ERROR);
        return;
      }

      if (files.length) {
        showMessage('成功上传！', MessageType.SUCCESS);
        onUpload(files);
      }
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
      setMessage({ text: '请上传文件', type: MessageType.NONE });
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    };

    const handleFileSelect = (e: MouseEvent) => {
      inputRef.current?.click();
      setDragging(false);
      setMessage({ text: '请上传文件', type: MessageType.NONE });
    }

    const element = dropRef.current;

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.onclick = handleFileSelect;

    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.onclick = null;
    };
  }, [count, formats, onUpload]);

  const showMessage = (text: string, type: MessageType) => {
    setMessage({ text, type });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (count && count < files.length) {
      showMessage(`抱歉，每次最多只能上传${count}个文件。`, MessageType.ERROR);
      return;
    }

    if (formats && files.some(file =>
      !formats.some(format =>
        file.name.toLowerCase().endsWith(format.toLowerCase())
      )
    )) {
      showMessage(`只允许上传 ${formats.join(', ')}格式的文件`, MessageType.ERROR);
      return;
    }

    if (files.length) {
      showMessage('成功上传！', MessageType.SUCCESS);
      e.target.value = "";
      onUpload(files);
    }
  }

  return (
    <div 
      ref={dropRef}
      className="relative w-full h-full p-[50px] flex items-center justify-center flex-col border-2 border-dashed border-gray-300 rounded-xl text-2xl text-gray-600"
    >
      {(
        <div className={`
          absolute inset-0 w-full h-full z-[9999] flex items-center justify-center flex-col
          rounded-xl text-2xl text-center leading-normal
          ${message.type === MessageType.ERROR 
            ? 'bg-red-50 text-red-400' 
            : 'bg-green-50 text-green-400'}
        `}>
          {message.text}
          <span 
            role="img" 
            aria-label="emoji"
            className="text-6xl mt-5"
          >
            {emoji(message.type)}
          </span>
        </div>
      )}

      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

FilesDragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
  children: PropTypes.node,
  count: PropTypes.number,
  formats: PropTypes.arrayOf(PropTypes.string)
};

export default FilesDragAndDrop;
