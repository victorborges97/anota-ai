import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useFirebase } from "../../context/firebase";

import Background from "../../components/background";
import Toggle from "../../components/themeToggle";

const Register = () => {
    const { replace } = useHistory()
    const { authenticated } = useFirebase();
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (email === "" || senha === "" || nome === "") {
            return toast.info("Alguns campos estão em branco!")
        }

        try {
            await authenticated?.registerEmail(nome, email, senha);

            replace("/");

        } catch (error) {
            toast.error("Error ao se registrar!");
            console.log("[ERROR_REGISTER]:", error.message);
        }
    }

    return (
        <Background>

            <div className="h-screen w-full flex justify-center items-center relative">

                <div className="absolute top-0 right-2">
                    <Toggle />
                </div>

                <div className="bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-gray-900">

                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-gray-900backdrop text-white">
                        <h1 className="text-3xl md:text-4xl font-extrabold  my-2 md:my-0">
                            AnotaAi
                        </h1>
                        <p className="mb-2 hidden md:block font-mono">
                            faças suas anotações
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4">

                        <h3 className="mb-4 font-bold text-3xl flex items-center text-gray-900">
                            REGISTER
                        </h3>

                        <form action="#" className="px-3 flex flex-col justify-center items-center w-full gap-3">

                            <input
                                type="text" placeholder="Seu nome.."
                                className="px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                            />

                            <input
                                type="email" placeholder="Seu email.."
                                className="px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <input
                                type="password" placeholder="Sua senha.."
                                className="px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                            />

                            <button
                                className="flex justify-center items-center bg-gray-900 hover:bg-gray-600 text-white focus:outline-none focus:ring rounded px-3 py-1"
                                onClick={async (e) => await handleRegister(e)}
                            >
                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                </svg>
                                <p className="ml-1 text-lg">
                                    Registrar
                                </p>
                            </button>

                        </form>

                        <p className="text-gray-700 text-sm mt-2">
                            já tem uma conta? {" "}
                            <Link to="/login" className="text-green-500 hover:text-green-600 mt-3 focus:outline-none font-bold underline">
                                login
                            </Link>
                        </p>
                    </div>

                </div>
            </div>

            <ToastContainer />

        </Background>
    );
}

export default Register;