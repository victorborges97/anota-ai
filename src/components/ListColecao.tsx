import React from "react";
import { TabList } from "../Atons/Todo";
import { ItemColecao } from "./components";

type Props = {
  colecoes: TabList[];
  novaColecao: () => void;
  tabSelecionada: TabList | null;
  openModal: (item: TabList | null) => void;
  mudarTab: (item: TabList) => void;
  handleError: (error: boolean, message: string) => void;
  openConfirm: (item: TabList) => void;
};

const ListColecao = ({
  colecoes,
  novaColecao,
  tabSelecionada,
  openModal,
  mudarTab,
  openConfirm,
  handleError,
}: Props) => {
  return (
    <div className="p-2">
      <div
        className={`
      flex-1 md:w-full p-3
      hidden md:block
      
      hover:border-dashed 
      hover:border-slate-500
      dark:hover:border-[#21252b]
      hover:border-2
      hover:rounded-xl

      cursor-pointer

      text-center
      text-gray-900 dark:text-white
      font-bold
    `}
        onClick={novaColecao}
      >
        NOVA COLEÇÃO
      </div>

      <ul
        className={`
                    colecoes
                    text-center 
                    flex flex-row md:flex-col w-full 
                    md:overflow-hidden overflow-auto
                    md:items-center
                    transition-all
                    mb-4
                  `}
      >
        {colecoes.map((item, index: number) => {
          return (
            <div
              key={index}
              className={`
                flex flex-col md:flex-row
                md:w-full
              `}
            >
              <ItemColecao
                item={item}
                tabSelecionada={tabSelecionada}
                openModal={openModal}
                mudarTab={mudarTab}
                deleteTab={openConfirm}
                handleError={handleError}
              />
            </div>
          );
        })}
      </ul>

      {colecoes && colecoes.length <= 0 && (
        <div
          className={`
                flex-1 md:w-full p-3

                hidden md:block
                
                hover:border-slate-500
                dark:hover:border-[#21252b]

                text-center
                text-gray-900 dark:text-white
            `}
        >
          Sua lista de coleções está vazia {"\n"} adicione uma nova
        </div>
      )}
    </div>
  );
};

export default ListColecao;
