import Button from "./button";

type Props = {
  title: string;
  open: boolean;
  close: () => void;
  save: () => void;
  children: React.ReactNode;
  deleteTab: () => void;
};

export const Modal = ({
  title,
  open,
  close,
  save,
  children,
  deleteTab,
}: Props) => {
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
            `}
            >
              {/*content*/}
              <div
                className={`
                    border-0 rounded-lg shadow-lg relative 
                    flex flex-col w-full  outline-none 
                    focus:outline-none
                    bg-slate-200 dark:bg-[#282c34]
                `}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
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
                <div className="relative p-6 flex-auto">{children}</div>

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
  );
};
