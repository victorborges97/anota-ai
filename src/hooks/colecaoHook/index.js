import { auth, useFirebase } from "../../context/firebase";
import { v4 as uuidv4 } from 'uuid';
import { useRecoilState } from "recoil";
import { tabsListState } from "../../Atons/Todo";

export function useDatabaseColecao(idUser) {
    const { setDb, onDb, upDb, reDb } = useFirebase();

    const pathColecaoUser = `colecoes/${idUser}`;

    const [colecoes, setColecoes] = useRecoilState(tabsListState)

    async function init() {

        onDb(pathColecaoUser, (snapshot) => {
            if (snapshot.exists()) {
                let colecoesData = snapshot.val();
                var data = [];
                for (let key in colecoesData) {
                    let item = colecoesData[key];
                    console.log(item)
                    data.push({ createAt: item.createAt, key: item.key, name: item.name, updateAt: item.updateAt })
                }
                setColecoes(data);
            } else {
                console.log("No data available");
                setColecoes([]);
            }
        });

    }

    function addColecao(tabsInput) {
        const id = uuidv4();

        setDb(
            pathColecaoUser + "/" + id,
            {
                key: id,
                name: tabsInput,
                createAt: new Date().toString(),
                updateAt: new Date().toString(),
            }
        )
    }

    function updateColecao(name, id) {
        // let olds = [...colecoes];
        // olds = olds.map(item => {
        //     if (item.key === id) {
        //         return {
        //             ...item,
        //             name: name,
        //             update_at: new Date()
        //         }
        //     }
        //     return item;
        // });
        // setColecoes(olds);

        upDb(
            pathColecaoUser + "/" + id,
            {
                name,
                updateAt: new Date().toString(),
            }
        )
    }

    function deleteColecao(id) {
        // setColecoes((old) => old.filter((item) => item.key !== keytabs))

        reDb(pathColecaoUser + "/" + id);
    }

    function getColecao(keytabs) {
        return colecoes.filter((item) => item.key === keytabs)
    }

    return { colecoes, init, addColecao, getColecao, deleteColecao, updateColecao }

}