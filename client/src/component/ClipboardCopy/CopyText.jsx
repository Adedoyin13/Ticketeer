import React, { useState } from "react";
import { toast } from "react-toastify";

const CopyText = () => {
  const [text, setText] = useState("Hello, copy me!");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <button onClick={copyToClipboard}>Copy Text</button>
    </div>
  );
};

export default CopyText;
