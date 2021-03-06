import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDatabaseColecao } from '../../hooks/colecaoHook';
import { useDatabaseAnotacao } from '../../hooks/anotacaoHook';


import Toggle from '../../components/themeToggle';
import Background from '../../components/background';
import { Modal, Todo } from './components';
import Confirm from '../../components/confirm';
import { useFirebase, USER } from '../../context/firebase';
import IconButton from '../../components/iconButton';
import ListColecao from '../../components/ListColecao';

const TodoScreen = () => {
    const userJson = JSON.parse(localStorage.getItem(USER));

    const { replace } = useHistory();
    const { authenticated } = useFirebase();
    const { colecoes, setColecoes, init: initColecao, addColecao, deleteColecao, updateColecao } = useDatabaseColecao(userJson?.uid);
    const { init: initAnotacao, deleteAnotacaoColecoesId } = useDatabaseAnotacao(userJson?.uid);

    // Colecao Selecionada
    const [tabSelecionada, setTabSelecionada] = useState(colecoes.lenght <= 0 ? null : colecoes[0]);

    // MODAL
    const [open, setOpen] = React.useState(false);
    const [inputModal, setInputModal] = useState("");
    const [itemModal, setItemModal] = useState(null);

    // CONFIRM
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [itemConfirm, setItemConfirm] = useState(null);

    useEffect(() => {
        if (userJson.uid !== null) {
            init();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userJson?.uid])

    async function init() {
        await initColecao();
        await initAnotacao();
    }

    const handleOpenModal = () => setOpen(true);

    const handleCloseModal = () => setOpen(false);

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            handleAddColecao(event);
        }
    }

    const handleAddColecao = (event) => {
        event.preventDefault();
        if (inputModal.length <= 0) {
            return handleError(true, "Por favor preencha o nome da cole????o!");
        }

        if (itemModal != null) {
            updateColecao(inputModal, itemModal.key);
        } else {
            addColecao(inputModal);
        }

        closeModal();
    }

    const mudarTab = (item) => {
        setTabSelecionada(item)
    }

    const openModal = (item) => {

        if (item != null) {
            setInputModal(item.name);
            setItemModal(item);
        }

        handleOpenModal();
    }

    const closeModal = () => {
        setItemModal(null);
        setInputModal("");
        handleCloseModal();
    }

    const handleError = (error, message) => {

        if (error === true) {

            toast.error(message);

        } else {
            toast.success(message);
        }

    }

    const handleDeleteColecao = async (tab) => {

        await deleteColecao(tab.key);
        await deleteAnotacaoColecoesId(tab.key);

        setTabSelecionada(colecoes.indexOf(tab) === null ? null : colecoes[colecoes.indexOf(tab) - 1]);

        closeModal();
        closeConfirm();
    }

    const openConfirm = (item) => {

        if (item != null) {
            setItemConfirm(item);
        }

        setConfirmOpen(true);
    }

    const closeConfirm = () => {
        setItemConfirm(null);
        setConfirmOpen(false);
    }


    let name = userJson ? ", " + userJson?.displayName : "";

    return (
        <Background>
            <div className="flex flex-col ml-8 mr-8">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-between w-full min-w-0 mt-8 p-6 mb-5 text-gray-900 dark:text-white bg-slate-200 dark:bg-[#282c34] rounded-xl">

                    <p>
                        Seja bem-vindo<span className="font-bold">{name}</span>
                    </p>

                    <IconButton
                        onClick={() => {
                            authenticated.logoutEmail();
                            replace("/login")
                        }}
                        className="flex items-center justify-center"
                    >
                        Sair<p className="w-2"></p><FiLogOut />
                    </IconButton>

                </div>
            </div>

            <main className="bg-white dark:bg-[#19191f] transition-all flex flex-col md:flex-row min-h-0 min-w-0 overflow-hidden p-0 ml-8 mr-8">

                <aside className="h-full md:w-1/5 bg-slate-200 dark:bg-[#282c34] rounded-xl">

                    <ul className="pb-4 mt-4">
                        <li className="flex flex-row justify-between items-center h-14">


                            <img
                                className="object-contain h-full p-2"
                                src="https://avatars1.githubusercontent.com/u/6157842?v=4"
                                alt="open-source"
                            />

                            <div
                                className="md:hidden flex-1 sm:w-full block p-3 hover:border-dashed hover:border-slate-500 dark:hover:border-[#21252b] hover:border-2 hover:rounded-xl cursor-pointer text-center text-gray-900 dark:text-white font-bold"
                                onClick={() => openModal(null)}
                            >

                                NOVA COLE????O

                            </div>

                            <div className="p-2">
                                <Toggle />
                            </div>

                        </li>
                    </ul>

                    <ListColecao
                        colecoes={colecoes}
                        setColecoes={setColecoes}
                        novaColecao={() => openModal(null)}

                        tabSelecionada={tabSelecionada}
                        openModal={openModal}
                        mudarTab={mudarTab}
                        openConfirm={openConfirm}
                        handleError={handleError}

                        updateColecao={updateColecao}
                        activeDrag={false}
                    />

                </aside>


                {
                    tabSelecionada != null && (
                        <div className="md:h-full flex-1 flex flex-col min-h-0 min-w-0 md:ml-4 mt-4 md:mt-0">

                            <div className="flex flex-col lg:flex-row h-full w-full bg-slate-200 dark:bg-[#282c34] rounded-xl ">
                                <div className="w-full min-w-0 mb-4">

                                    {
                                        tabSelecionada != null && <Todo
                                            tabSelecionada={tabSelecionada}
                                            handleError={handleError}
                                        />
                                    }

                                </div>
                            </div>

                        </div>
                    )
                }


                <Modal
                    open={open}
                    close={closeModal}
                    save={handleAddColecao}
                    value={inputModal}
                    onChange={e => setInputModal(e.target.value)}
                    onKeyDown={onKeyDown}
                    itemModal={itemModal}
                    deleteTab={handleDeleteColecao}
                />

                <Confirm
                    title="Deletar Cole????o"
                    open={confirmOpen}
                    onClose={closeConfirm}
                    onConfirm={() => handleDeleteColecao(itemConfirm)}
                >
                    Tem certeza que deseja deletar esta cole????o?
                </Confirm>

                <ToastContainer />

            </main>
        </Background>
    );
}

export default TodoScreen;