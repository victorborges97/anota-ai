import { useEffect, useState } from "react";
import { FiDelete, FiEdit } from "react-icons/fi";
import { IoMdCheckboxOutline } from "react-icons/io";
import { VscSave, VscSaveAs } from "react-icons/vsc";
import { TabList, TodoList } from "../Atons/Todo";
import { useFirebase } from "../context/firebase";
import { useDatabaseAnotacao } from "../hooks/anotacaoHook";

export const SectionTodo = ({
  tabSelecionada,
  handleError,
}: {
  tabSelecionada: TabList;
  handleError: (error: boolean, message: string) => void;
}) => {
  const { user } = useFirebase();

  const {
    anotacoes: dataAnotacoes,
    getColecoesId,
    addAnotacao,
    deleteAnotacao,
    updateAnotacao,
  } = useDatabaseAnotacao(user?.uid || undefined);

  const [anotacoes, setAnotacoes] = useState<TodoList[]>([]);

  const [value, setValue] = useState("");
  const [anotacao, setAnotacao] = useState<TodoList | null>(null);

  useEffect(() => {
    let anotacoesInit: TodoList[] = [];
    if (tabSelecionada?.key !== "") {
      anotacoesInit = getColecoesId(tabSelecionada?.key);
    } else {
      anotacoesInit = [];
    }
    setAnotacoes(anotacoesInit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabSelecionada?.key, dataAnotacoes]);

  // useEffect(() => {
  //   document.addEventListener("keydown", keydownHandler);
  // }, []);

  const keydownHandler = (e: any) => {
    if (e.keyCode === 13 && e.ctrlKey) addNewTodo();
  };

  const editarAnotacao = (item: TodoList) => {
    setAnotacao(item);
    setValue(item.todo);
  };

  const addNewTodo = () => {
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
        updateAnotacao(value, anotacao.key);
      }
    } else {
      // addTodo(value, tabSelecionada?.key)
      addAnotacao(value, tabSelecionada?.key);
    }

    setValue("");
    setAnotacao(null);
  };
  return (
    <div className="p-6 text-gray-900 dark:text-white">
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
          value={value}
          onChange={(e) => {
            console.log(e);
            setValue(e.target.value);
          }}
          placeholder="Anota ai ...."
          className={`
              px-3 py-3 placeholder-blueGray-300 
              text-gray-700 relative 
              bg-zinc-100 dark:bg-zinc-900
              rounded 
              text-sm border-0 shadow 
              outline-none 
              focus:outline-none focus:ring w-full
          `}
          onKeyDown={keydownHandler}
        />

        {anotacao != null ? (
          <VscSaveAs
            className="text-xl m-4 cursor-pointer"
            onClick={(e) => addNewTodo()}
          />
        ) : (
          <VscSave
            className="text-xl m-4 cursor-pointer"
            onClick={(e) => addNewTodo()}
          />
        )}
      </div>

      <div>
        {anotacoes.length > 0 &&
          anotacoes.map((item, index) => (
            <Item
              item={item}
              anotacao={anotacao}
              key={index}
              addNewTodo={addNewTodo}
              editarAnotacao={editarAnotacao}
              deleteAnotacao={deleteAnotacao}
            />
          ))}
      </div>
    </div>
  );
};

const Item = ({
  item,
  anotacao,
  key,
  addNewTodo,
  editarAnotacao,
  deleteAnotacao,
}: {
  item: TodoList;
  key: number;
  anotacao: TodoList | null;
  addNewTodo: (preventDefault: () => void) => void;
  editarAnotacao: (item: TodoList) => void;
  deleteAnotacao: (item: string) => void;
}) => {
  return (
    <div
      key={key}
      className={`
        flex flex-col md:flex-row w-full 
        justify-between
        p-3

        bg-zinc-100
        dark:bg-[#21252b]
        rounded-xl

        cursor-pointer
        text-gray-700 dark:text-white
        hover:text-gray-700
        font-semibold
        mt-2

        ${anotacao?.key === item.key && "border-emerald-500 border-2"}
    `}
    >
      <p
        className="text-left text-sm md:text-base"
        style={{
          whiteSpace: "pre-line",
        }}
      >
        {item.todo}
      </p>

      <div className="flex justify-between mt-3 md:mt-0 md:ml-3">
        {anotacao != null && anotacao.key === item.key ? (
          <IoMdCheckboxOutline
            className="text-emerald-500"
            onClick={(e) => {
              if (anotacao !== null) {
                addNewTodo(e.preventDefault);
              } else {
                editarAnotacao(item);
              }
            }}
          />
        ) : (
          <FiEdit
            className="text-emerald-500"
            onClick={(e) => {
              if (anotacao !== null) {
                addNewTodo(e.preventDefault);
              } else {
                editarAnotacao(item);
              }
            }}
          ></FiEdit>
        )}

        <div className="w-3"></div>

        <FiDelete
          className="text-red-500"
          onClick={() => deleteAnotacao(item.key)}
        ></FiDelete>
      </div>
    </div>
  );
};
