import React from 'react';

import { MdOutlineClose } from "react-icons/md";
import IconButton from "./iconButton";

export default function Dialog(props) {
    const { open, onClose } = props;
    if (!open) {
        return <></>;
    }
    return (
        <>
            <div
                className="justify-center items-center fixed inset-0 z-50 flex"
            >

                <div className="p-8 bg-slate-200 dark:bg-[#282c34] text-gray-900 dark:text-white w-full max-w-md m-auto flex-col flex rounded-lg">

                    <div>{props.children}</div>

                    <span className="absolute top-0 right-0 p-4">
                        <IconButton onClick={() => onClose()}>
                            <MdOutlineClose />
                        </IconButton>
                    </span>

                </div>
            </div>

            <div
                onClick={() => onClose()}
                className="fixed inset-0 z-40 overflow-auto bg-black opacity-25 p-8 flex "
            >
            </div>
        </>

    );
}