import React from "react";
import Background from "../../components/background";
import Toggle from "../../components/themeToggle";
import Button from "../../components/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <Background>
      <main
        className={`
            bg-white dark:bg-[#19191f] transition-all 
            items-center justify-center
            flex h-full w-full overflow-hidden
            relative
            `}
      >
        <div className="absolute top-0 right-2">
          <Toggle />
        </div>

        <div>
          <div className="flex flex-row mb-8">
            <p
              className={`
                            text-gray-900 dark:text-white text-3xl 
                            sm:text-5xl lg:text-6xl leading-none 
                            font-extrabold tracking-tight
                        `}
            >
              404
            </p>

            <div className="m-3 w-px bg-[#9994]"></div>

            <div className="flex flex-col justify-start items-start">
              <p
                className={`
                            text-gray-900 dark:text-white text-2xl 
                            sm:text-3xl lg:text-5xl leading-none 
                            font-extrabold tracking-tight
                            `}
              >
                Página não encontrada
              </p>
              <p className="text-gray-500 font-medium mt-2 dark:text-white text-md">
                Verifique o URL na barra de endereço e tente novamente.
              </p>
            </div>
          </div>

          <div className="flex flex-row mt-6 justify-end">
            <div className="p-1">
              <Link href="/" passHref>
                <Button
                  className={`
                                    bg-gray-900 hover:bg-gray-900 dark:bg-white
                                    text-white dark:text-gray-900
                                    `}
                >
                  Voltar para página inicial
                </Button>
              </Link>
            </div>

            <div className="p-1">
              <Button
                className={`
                                        bg-gray-500 hover:bg-gray-500 dark:bg-white
                                        text-white dark:text-gray-500
                                        `}
              >
                Contate o suporte
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Background>
  );
};

export default NotFound;
