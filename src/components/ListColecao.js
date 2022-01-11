import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { ItemColecao } from '../pages/Anotacoes/components';

const ListColecao = ({
  colecoes,
  setColecoes,

  novaColecao,

  tabSelecionada,
  openModal,
  mudarTab,
  openConfirm,
  handleError,

  updateColecao,
  activeDrag = false,
}) => {

  function handleOnDragEnd(result) {
    console.log(result);
    if (!result.destination) return;

    const destination = colecoes[result.destination.index];
    const source = colecoes[result.source.index];

    // const items = Array.from(colecoes);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);

    updateColecao(destination.name, destination.key, source.ordeBy);
    updateColecao(source.name, source.key, destination.ordeBy);

    // setColecoes(items);
  }

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


      {
        activeDrag === true ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="colecoes">
              {(provided) => (
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
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {colecoes.map((item, index) => {
                    return (
                      <Draggable key={item.key} draggableId={item.key} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
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
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
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
            {colecoes.map((item, index) => {
              return (
                <div
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
        )
      }


      {
        colecoes && colecoes.length <= 0 && (
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
        )
      }

    </div>
  )
}

export default ListColecao;