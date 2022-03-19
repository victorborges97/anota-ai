/* eslint-disable @next/next/no-img-element */
import React, {
  EventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDatabaseColecao } from "../hooks/colecaoHook";
import { useDatabaseAnotacao } from "../hooks/anotacaoHook";

import Toggle from "../components/themeToggle";
import Background from "../components/background";
import Confirm from "../components/confirm";
import { useFirebase, USER } from "../context/firebase";
import IconButton from "../components/iconButton";
import ListColecao from "../components/ListColecao";
import { TabList } from "../Atons/Todo";
import { useRouter } from "next/router";
import { SectionTodo } from "../components/sectionTodo";
import { Modal } from "../components/Modal";
import withAuth from "../services/auth";

const TodoScreen = () => {
  const ISSERVER = typeof window === "undefined";
  const userJson = !ISSERVER
    ? localStorage.getItem(USER)
      ? JSON.parse(localStorage.getItem(USER) || "")
      : {}
    : {};
  const router = useRouter();
  const { authenticated } = useFirebase();
  const {
    colecoes,
    init: initColecao,
    addColecao,
    deleteColecao,
    updateColecao,
  } = useDatabaseColecao(userJson?.uid);

  const { init: initAnotacao, deleteAnotacaoColecoesId } = useDatabaseAnotacao(
    userJson?.uid
  );

  // Colecao Selecionada
  const [tabSelecionada, setTabSelecionada] = useState(
    colecoes.length <= 0 ? null : colecoes[0]
  );

  // MODAL
  const [open, setOpen] = React.useState(false);
  const [inputModal, setInputModal] = useState("");
  const [itemModal, setItemModal] = useState<TabList | null>(null);

  // CONFIRM
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemConfirm, setItemConfirm] = useState<TabList | null>(null);

  useEffect(() => {
    if (userJson.uid !== null) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJson?.uid]);

  async function init() {
    await initColecao();
    await initAnotacao();
  }

  const handleOpenModal = () => setOpen(true);

  const handleCloseModal = () => setOpen(false);

  const onKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleAddColecao();
    }
  };

  const handleAddColecao = () => {
    if (inputModal.length <= 0) {
      return handleError(true, "Por favor preencha o nome da coleção!");
    }

    if (itemModal != null) {
      updateColecao(inputModal, itemModal.key);
    } else {
      addColecao(inputModal);
    }

    closeModal();
  };

  const mudarTab = (item: TabList) => {
    setTabSelecionada(item);
  };

  const openModal = (item: TabList | null) => {
    if (item != null) {
      setInputModal(item.name);
      setItemModal(item);
    }

    handleOpenModal();
  };

  const closeModal = () => {
    setItemModal(null);
    setInputModal("");
    handleCloseModal();
  };

  const handleError = (error: boolean, message: string) => {
    if (error === true) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleDeleteColecao = async (tab?: TabList | null) => {
    if (tab === null) {
      return;
    }

    await deleteColecao(tab!.key);
    await deleteAnotacaoColecoesId(tab!.key);

    setTabSelecionada(
      colecoes.indexOf(tab!) === null
        ? null
        : colecoes[colecoes.indexOf(tab!) - 1]
    );

    closeModal();
    closeConfirm();
  };

  const openConfirm = (item: TabList) => {
    if (item != null) {
      setItemConfirm(item);
    }

    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setItemConfirm(null);
    setConfirmOpen(false);
  };

  let name = userJson ? `, ${userJson?.displayName}` : "";

  console.log(tabSelecionada);

  return (
    <Background className="p-4">
      <div className="flex flex-col gap-4 min-w-full min-h-full">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-between w-full min-w-0 p-2 text-gray-900 dark:text-white bg-white dark:bg-[#282c34] rounded-xl">
          <p>
            Seja bem-vindo<span className="font-bold">{name}</span>
          </p>

          <IconButton
            onClick={async () => {
              await authenticated.logoutEmail().then(() => {
                router.replace("/login");
              });
            }}
            className="flex items-center justify-center"
          >
            Sair<p className="w-2"></p>
            <FiLogOut />
          </IconButton>
        </div>

        <main className="flex flex-1 transition-all flex-col md:flex-row min-h-0 min-w-0 gap-4">
          <aside className="h-full md:w-1/5 bg-white dark:bg-[#282c34] rounded-xl">
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
                  NOVA COLEÇÃO
                </div>

                <div className="p-2">
                  <Toggle />
                </div>
              </li>
            </ul>

            <ListColecao
              colecoes={colecoes}
              novaColecao={() => openModal(null)}
              tabSelecionada={tabSelecionada}
              openModal={openModal}
              mudarTab={mudarTab}
              openConfirm={openConfirm}
              handleError={handleError}
            />
          </aside>

          {tabSelecionada != null && (
            <div className="h-full w-full flex flex-col">
              <div className="flex flex-col lg:flex-row h-full w-full bg-white dark:bg-[#282c34] rounded-xl ">
                <div className="w-full min-w-0 mb-4">
                  {tabSelecionada != null && (
                    <SectionTodo
                      tabSelecionada={tabSelecionada}
                      handleError={handleError}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        open={open}
        close={closeModal}
        save={handleAddColecao}
        title={itemModal == null ? "Nova Coleção" : "Editar Coleção"}
        deleteTab={handleDeleteColecao}
      >
        <div className="mb-3 pt-0">
          <input
            type="text"
            value={inputModal}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setInputModal(e.target.value)}
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
      </Modal>

      <Confirm
        title="Deletar Coleção"
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={() => handleDeleteColecao(itemConfirm)}
      >
        Tem certeza que deseja deletar esta coleção?
      </Confirm>

      <ToastContainer />
    </Background>
  );
};

export default withAuth(TodoScreen);
