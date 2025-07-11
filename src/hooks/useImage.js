import { useState } from "react";

export default function useImages(initial = []) {
  const [files, setFiles]     = useState(initial); // File[]
  const [previews, setPrev]   = useState(
    initial.map((f) => (typeof f === "string" ? f : URL.createObjectURL(f)))
  );

  /* add new images from an <input type="file" multiple> */
  const add = (fileList) => {
    const list = Array.from(fileList);
    setFiles((prev) => [...prev, ...list]);
    setPrev((prev) => [
      ...prev,
      ...list.map((f) => URL.createObjectURL(f)),
    ]);
  };

  /* remove by index */
  const remove = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPrev((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  return { files, previews, add, remove };
}
