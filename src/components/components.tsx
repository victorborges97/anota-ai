import React from "react";
import { FiEdit, FiDelete } from "react-icons/fi";
import { TabList } from "../Atons/Todo";
import IconButton from "./iconButton";

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
          <span className="inline-block align-middle mr-8">{message}</span>
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

export const ItemColecao = ({
  item,
  tabSelecionada,
  openModal,
  mudarTab,
  deleteTab,
  handleError,
  ...rest
}: {
  item: TabList;
  tabSelecionada: TabList | null;
  openModal: (item: TabList | null) => void;
  mudarTab: (item: TabList) => void;
  deleteTab: (item: TabList) => void;
  handleError: (error: boolean, message: string) => void;
}) => {
  return (
    <li
      className={`
                flex flex-col md:flex-row 
                justify-between
                md:w-full 
                p-3

                hover:bg-zinc-100 
                dark:hover:bg-[#21252b]
                hover:rounded-xl

                cursor-pointer
                text-gray-900 dark:text-white
                font-semibold

                m-2

                ${
                  tabSelecionada?.key === item.key
                    ? "bg-zinc-100 dark:bg-[#21252b] rounded-xl text-white"
                    : "bg-transparent rounded-none"
                }
            `}
      onClick={() => mudarTab(item)}
      {...rest}
    >
      <div className="flex items-center justify-center">
        <p className="text-left truncate">{item.name}</p>
      </div>

      <div className="flex justify-between mt-2 md:mt-0">
        <IconButton
          onClick={() => {
            if (item != null) {
              openModal(item);
            } else {
              handleError(false, "Seleciona uma Tab, para editar!");
            }
          }}
          className="flex items-center justify-center"
        >
          <FiEdit className="text-emerald-500"></FiEdit>
        </IconButton>

        <div className="w-3"></div>

        <IconButton
          onClick={() => {
            if (item != null) {
              deleteTab(item);
            } else {
              handleError(false, "Seleciona uma Tab, para editar!");
            }
          }}
          className="flex items-center justify-center"
        >
          <FiDelete className="text-red-500"></FiDelete>
        </IconButton>
      </div>
    </li>
  );
};
