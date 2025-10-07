
import React from "react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
];

const modules = { toolbar: toolbarOptions };

const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "script",
    "list", "bullet", "indent",
    "align",
    "blockquote", "code-block",
    "link",
];

export default function RichTextEditor({
    value,
    defaultValue,
    onChange,
    onChangeSelection,
    onFocus,
    onBlur,
    placeholder = "Start typing...",
    readOnly = false,
    bounds,
    scrollingContainer,
    tabIndex,
    id,
    className,
    style
}) {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onChangeSelection={onChangeSelection}
            onFocus={onFocus}
            onBlur={onBlur}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            readOnly={readOnly}
            bounds={bounds}
            scrollingContainer={scrollingContainer}
            tabIndex={tabIndex}
            id={id}
            className={className}
            style={style}
        />
    );
}
