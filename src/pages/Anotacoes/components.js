import React, { useEffect, useState } from "react";
import { FiEdit, FiDelete } from "react-icons/fi";
import { VscSave, VscSaveAs } from "react-icons/vsc";
import { IoMdCheckboxOutline } from "react-icons/io";
import Button from "../../components/button";
import { useDatabaseAnotacao } from "../../hooks/anotacaoHook";

export const Todo = ({ tabSelecionada, handleError }) => {

    const { anotacoes: dataAnotacoes, getColecoesId, addAnotacao, deleteAnotacao, updateAnotacao } = useDatabaseAnotacao()
    const [anotacoes, setAnotacoes] = useState([]);

    const [value, setValue] = useState("");
    const [anotacao, setAnotacao] = useState(null);

    useEffect(() => {
        let anotacoesInit = [];
        if (tabSelecionada?.key !== "") {
            anotacoesInit = getColecoesId(tabSelecionada?.key);
        } else {
            anotacoesInit = [];
        }
        setAnotacoes(anotacoesInit);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabSelecionada?.key, dataAnotacoes])

    const editarAnotacao = (item) => {
        setAnotacao(item);
        setValue(item.todo);
    }

    const addNewTodo = (event) => {
        event.preventDefault();
        if (!tabSelecionada?.key) {
            handleError(true, "Coleção não selecionada!");
            return;
        }

        if (value.length <= 0) {
            handleError(true, "Por favor preencha algum texto para adicionar!");
            return;
        }

        if (anotacao != null) {
            if (value !== anotacao.todo) {
                // updateTodo(value, anotacao.key);
                updateAnotacao(value, anotacao.key)
            }
        } else {
            // addTodo(value, tabSelecionada?.key)
            addAnotacao(value, tabSelecionada?.key)
        }

        setValue("");
        setAnotacao(null);
    }

    return (
        <div
            className="p-6 text-gray-900 dark:text-white"
        >
            <div className="flex justify-between items-center">
                <p className="text-base font-semibold">
                    Coleção:
                    <span className="font-normal">{" " + tabSelecionada?.name}</span>
                </p>
                <p className="text-base font-semibold">
                    Total:
                    <span className="font-normal">{" " + anotacoes.length}</span>
                </p>
            </div>

            <div className="flex justify-center items-center mt-4 mb-4">
                <textarea
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Anota ai ...."
                    className={`
                        px-3 py-3 placeholder-blueGray-300 
                        text-blueGray-600 relative 
                        bg-zinc-100 dark:bg-zinc-900
                        rounded 
                        text-sm border-0 shadow 
                        outline-none 
                        focus:outline-none focus:ring w-full
                    `}
                />

                {
                    anotacao != null ? (
                        <VscSaveAs
                            className="text-xl m-4 cursor-pointer"
                            onClick={addNewTodo}
                        />
                    ) : (
                        <VscSave
                            className="text-xl m-4 cursor-pointer"
                            onClick={addNewTodo}
                        />
                    )
                }
            </div>

            <div>
                {
                    anotacoes.length > 0 && anotacoes.map((item, index) => (
                        <div
                            key={item.key}
                            className={`
                                flex flex-col md:flex-row w-full 
                                justify-between
                                p-3

                                bg-slate-500 
                                dark:bg-[#21252b]
                                rounded-xl

                                cursor-pointer
                                text-white
                                hover:text-white
                                font-semibold
                                mt-2

                                ${anotacao?.key === item.key && "border-emerald-500 border-2"}
                            `}
                        >

                            <p className="text-left break-all text-sm md:text-base">
                                {item.todo}
                            </p>

                            <div className="flex justify-between mt-3 md:mt-0 md:ml-3">

                                {
                                    anotacao != null && anotacao.key === item.key ? (
                                        <IoMdCheckboxOutline
                                            className="text-emerald-500"
                                            onClick={(e) => {
                                                if (anotacao !== null) {
                                                    addNewTodo(e)
                                                } else {
                                                    editarAnotacao(item)
                                                }
                                            }}
                                        />
                                    ) : (
                                        <FiEdit
                                            className="text-emerald-500"
                                            onClick={(e) => {
                                                if (anotacao !== null) {
                                                    addNewTodo(e)
                                                } else {
                                                    editarAnotacao(item)
                                                }
                                            }}
                                        ></FiEdit>
                                    )
                                }

                                <div
                                    className="w-3"
                                ></div>

                                <FiDelete
                                    className="text-red-500"
                                    onClick={() => deleteAnotacao(item.key)}
                                ></FiDelete>
                            </div>
                        </div>


                    ))
                }
            </div>
        </div>
    )
}

export const Alert = ({ color, message, showAlert, setShowAlert }) => {
    return (
        <>
            {showAlert ? (
                <div
                    className={`
                        text-white px-6 py-4 mr-6 mt-4 
                        border-0 rounded 
                        absolute right-0 top-0 
                        hover:pointer 
                        mb-4 max-h-16 bg-${color}-500
                        
                    `}
                    onClick={() => setShowAlert(false)}
                >
                    <span className="text-xl inline-block mr-5 align-middle">
                        <i className="fas fa-bell" />
                    </span>
                    <span className="inline-block align-middle mr-8">
                        {message}
                    </span>
                    <button
                        className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                        onClick={() => setShowAlert(false)}
                    >
                        <span>×</span>
                    </button>
                </div>
            ) : null}
        </>
    );
};

export const Modal = ({ open, close, save, itemModal, value, onChange, onKeyDown, deleteTab }) => {

    return (
        <>
            {open ? (
                <>
                    <div
                        className={`
                        justify-center items-center flex 
                        overflow-x-hidden overflow-y-auto 
                        fixed inset-0 z-50 outline-none 
                        focus:outline-none
                        text-gray-900 dark:text-white
                        `}
                    >
                        <div
                            className={`
                                relative w-auto my-6 mx-auto max-w-3xl
                            `}>

                            {/*content*/}
                            <div
                                className={`
                                border-0 rounded-lg shadow-lg relative 
                                flex flex-col w-full  outline-none 
                                focus:outline-none
                                bg-slate-200 dark:bg-[#282c34]
                            `}>


                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        {itemModal == null ? "Nova Coleção" : "Editar Coleção"}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0  float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={close}
                                    >
                                        <span className="bg-transparent   h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>

                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className="mb-3 pt-0">
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={onChange}
                                            onKeyDown={onKeyDown}
                                            placeholder="Qual nome da nova tab ...."
                                            className={`
                                        px-3 py-3 placeholder-blueGray-300 
                                        text-blueGray-600 relative 
                                        bg-zinc-100 dark:bg-zinc-900
                                        rounded 
                                        text-sm border-0 shadow 
                                        outline-none 
                                        focus:outline-none focus:ring w-full
                                        `}
                                        />
                                    </div>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                                    <div className="p-1">
                                        <Button
                                            onClick={close}
                                            className="bg-red-600 hover:bg-red-400"
                                        >
                                            Fechar
                                        </Button>
                                    </div>

                                    <div className="p-1">
                                        <Button
                                            onClick={save}
                                            className="bg-emerald-600 hover:bg-emerald-400"
                                        >
                                            Salvar
                                        </Button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                    <div
                        className="opacity-25 fixed inset-0 z-40 bg-black"
                        onClick={close}
                    ></div>
                </>
            ) : null}
        </>
    )
}

export const ItemColecao = ({
    item,
    tabSelecionada,
    openModal,
    mudarTab,
    deleteTab,
    handleError,
}) => {

    return (
        <li
            key={item.key}
            className={`
                flex flex-col md:flex-row 
                justify-between
                md:w-full 
                p-3

                hover:bg-slate-500 
                dark:hover:bg-[#21252b]
                hover:rounded-xl

                cursor-pointer
                text-gray-900 dark:text-white
                hover:text-white
                font-semibold

                m-2

                ${tabSelecionada?.key === item.key
                    ? "bg-slate-500 dark:bg-[#21252b] rounded-xl text-white"
                    : "bg-transparent rounded-none"
                }
            `}
            onClick={() => mudarTab(item)}
        >

            <p
                className={`
                    text-left truncate
                `}
            >
                {item.name}
            </p>

            <div
                className="flex justify-between mt-2 md:mt-0"
            >
                <FiEdit
                    className="text-emerald-500"
                    onClick={() => {
                        if (item != null) {
                            openModal(item)
                        } else {
                            handleError(false, "Seleciona uma Tab, para editar!")
                        }
                    }}
                ></FiEdit>

                <div
                    className="w-3"
                ></div>

                <FiDelete
                    className="text-red-500"
                    onClick={() => {
                        if (item != null) {
                            deleteTab(item)
                        } else {
                            handleError(false, "Seleciona uma Tab, para editar!")
                        }
                    }}
                ></FiDelete>
            </div>

        </li>
    )
}