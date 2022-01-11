import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFirebase } from "../../context/firebase";

import Background from "../../components/background";
import Toggle from "../../components/themeToggle";
import { delay } from '../../Utils';

const Login = () => {
    const { replace } = useHistory()
    const { authenticated } = useFirebase();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email === "" || senha === "") {
            return toast.info("Alguns campos estão em branco!")
        }

        setIsLoading(true);

        try {
            await authenticated?.loginEmail(email, senha);

            await delay(100);
            setIsLoading(false);

            await delay(200);
            replace("/");

        } catch (error) {
            setIsLoading(false);
            toast.error("Error ao fazer login!");
            console.log("ERROR_LOGIN]:", error.message);
        }

        if (isLoading === true) { setIsLoading(false); }
    }

    return (
        <Background>

            <div className="h-screen w-full flex justify-center items-center relative">

                <div className="absolute top-0 right-2">
                    <Toggle />
                </div>

                <div className="
                bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 
                lg:mx-0 flex flex-col md:flex-row items-center 
                rounded z-10 overflow-hidden bg-center bg-cover
                shadow-lg
                bg-slate-200 dark:bg-[#282c34]
                text-gray-900 dark:text-white
                ">

                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center backdrop">
                        <h1 className="text-3xl md:text-4xl font-extrabold  my-2 md:my-0">
                            AnotaAi
                        </h1>
                        <p className="mb-2 hidden md:block font-mono">
                            faças suas anotações
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col items-center bg-white text-gray-900 py-5 md:py-8 px-4">
                        <h3 className="mb-4 font-bold text-3xl flex items-center text-gray-900">
                            LOGIN
                        </h3>
                        <form action="#" className="px-3 flex flex-col justify-center items-center w-full gap-3">

                            <input
                                type="email" placeholder="email.."
                                className="px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type="password" placeholder="senha.."
                                className="px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                            />

                            {
                                isLoading ? (
                                    <button
                                        className="flex transition-all ease-in-out justify-center items-center bg-gray-900 hover:bg-gray-600 text-white focus:outline-none focus:ring rounded px-3 py-1"
                                    >
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>

                                        <p className="ml-1 text-lg">
                                            Entrando...
                                        </p>
                                    </button>
                                ) : (
                                    <button
                                        className="flex justify-center items-center bg-gray-900 hover:bg-gray-600 text-white focus:outline-none focus:ring rounded px-3 py-1"
                                        onClick={async (e) => await handleLogin(e)}
                                    >
                                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                        </svg>
                                        <p className="ml-1 text-lg">
                                            Entrar
                                        </p>
                                    </button>
                                )
                            }


                        </form>

                        <p className="text-gray-700 text-sm mt-2">
                            não tem uma conta? {" "}
                            <Link to="/register" className="text-green-500 hover:text-green-600 mt-3 focus:outline-none font-bold underline">
                                cadastre-se
                            </Link>
                        </p>
                    </div>

                </div>
            </div>

            <ToastContainer />

        </Background>
    );
}

export default Login;