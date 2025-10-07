
import React, { useEffect, useState } from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
export default function DescriptionComp({ descrb, onChageDescription }) {

    const [description, setdescription] = useState('')

    useEffect(() => {
        const descriptionHtml = descrb;
        const blocksFromHtml = convertFromHTML(descriptionHtml);
        const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setdescription(editorState);
    }, [descrb]);


    const handleDescriptionChange = (editorState) => {
        setdescription(editorState);
        const content = editorState.getCurrentContent();
        const contentHtml = stateToHTML(content);
        onChageDescription(contentHtml);
    };

    return (
        <Editor
            editorState={description}
            onEditorStateChange={handleDescriptionChange}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            toolbarClassName="toolbarClassName"
        />

    );
}
