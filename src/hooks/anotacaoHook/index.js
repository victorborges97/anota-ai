import { useFirebase } from "../../context/firebase";
import { v4 as uuidv4 } from 'uuid';
import { useRecoilState } from "recoil";
import { todosListState } from "../../Atons/Todo";

export function useDatabaseAnotacao(idUser) {
    const { setDb, onDb, upDb, reDb } = useFirebase();

    const pathAnotacoesUser = `anotacoes/${idUser}`;

    const [anotacoes, setAnotacoes] = useRecoilState(todosListState)

    async function init() {

        onDb(pathAnotacoesUser, (snapshot) => {
            // console.log("Initi onDb useDatabaseAnotacao")
            if (snapshot.exists()) {
                let anotacoesData = snapshot.val();
                var data = [];
                for (let key in anotacoesData) {
                    let item = anotacoesData[key];
                    data.push({
                        createAt: item.createAt,
                        key: item.key,
                        tabId: item.tabId,
                        todo: item.todo,
                        updateAt: item.updateAt ? null : item.updateAt,
                    })
                }
                setAnotacoes(data);
            } else {
                console.log("No data available");
                setAnotacoes([]);
            }
        });

    }

    function addAnotacao(input, colecaoId) {
        const id = uuidv4();
        setDb(
            pathAnotacoesUser + "/" + id,
            {
                createAt: new Date().toString(),
                key: id,
                tabId: colecaoId,
                todo: input,
                updateAt: null,
            }
        )
    }

    async function updateAnotacao(input, id, orderBy = null) {
        let data = {};
        if (orderBy !== null) {
            data = {
                updateAt: new Date().toString(),
                ordeBy: orderBy,
            }
        } else {
            data = {
                todo: input,
                updateAt: new Date().toString(),
            }
        }
        console.log(pathAnotacoesUser + "/" + id + " - update: ", data)
        await upDb(
            pathAnotacoesUser + "/" + id,
            data,
        )
    }

    function deleteAnotacao(id) {
        // setAnotacoes((old) => old.filter((item) => item.key !== keytabs))

        reDb(pathAnotacoesUser + "/" + id);
    }

    function getAnotacao(keytabs) {
        return anotacoes.filter((item) => item.key === keytabs)
    }

    function getColecoesId(id) {
        return anotacoes.filter((item) => item.tabId === id)
    }

    async function deleteAnotacaoColecoesId(keyTab) {
        let data = anotacoes.filter((item) => item.tabId === keyTab);
        if (data.length > 0) {
            for (var index in data) {
                await deleteAnotacao(data[index].key)
            }
        }
    }

    return { anotacoes, init, addAnotacao, getAnotacao, deleteAnotacao, updateAnotacao, getColecoesId, deleteAnotacaoColecoesId }
}