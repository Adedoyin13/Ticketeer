// import ReactQuill from "react-quill";

const EventDescriptionEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    // <ReactQuill
    //   onChange={onChange}
    //   value={value}
    //   modules={modules}
    //   theme="snow"
    //   className="w-full bg-orange-50 dark:bg-zinc-800 dark:text-zinc-300 border border-orange-300 dark:border-zinc-600 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
    // />
    <></>
  );
};

export default EventDescriptionEditor;
