import { useFirebase } from "../../context/firebase";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState } from "recoil";
import { TabList, tabsListState } from "../../Atons/Todo";

export function useDatabaseColecao(idUser: string) {
  const { setDb, onDb, upDb, reDb } = useFirebase();

  const pathColecaoUser = `colecoes/${idUser}`;

  const [colecoes, setColecoes] = useRecoilState<TabList[]>(tabsListState);

  async function init() {
    if (idUser == undefined) {
      return;
    }
    onDb(pathColecaoUser, (snapshot) => {
      // console.log("Initi onDb useDatabaseColecao")
      if (snapshot.exists()) {
        let colecoesData = snapshot.val();
        var data = [];

        for (let key in colecoesData) {
          let item = colecoesData[key];
          data.push({
            createAt: item.createAt,
            key: item.key,
            name: item.name,
            updateAt: item.updateAt,
            ordeBy: item.ordeBy ? item.ordeBy : colecoesData.length + 1,
          });
        }

        // data = data.sort(function (a, b) {
        //     if (a.ordeBy > b.ordeBy) return 1;
        //     if (a.ordeBy < b.ordeBy) return -1;
        //     return 0;
        // });

        setColecoes(data);
      } else {
        console.log("No data available");
        setColecoes([]);
      }
    });
  }

  function addColecao(tabsInput: string) {
    const id = uuidv4();

    const timestamp = Date.now(); // This would be the timestamp you want to format

    // console.log(new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp));

    setDb(pathColecaoUser + "/" + id, {
      key: id,
      name: tabsInput,
      createAt: timestamp,
      updateAt: null,
      ordeBy: colecoes.length + 1,
    });
  }

  async function updateColecao(name: string, id: string, orderBy = null) {
    let data = {};
    if (orderBy !== null) {
      data = {
        updateAt: new Date().toString(),
        ordeBy: orderBy,
      };
    } else {
      data = {
        name,
        updateAt: new Date().toString(),
      };
    }
    console.log(pathColecaoUser + "/" + id + " - update: ", data);
    upDb(pathColecaoUser + "/" + id, data);
  }

  function deleteColecao(id: string) {
    // setColecoes((old) => old.filter((item) => item.key !== keytabs))

    reDb(pathColecaoUser + "/" + id);
  }

  function getColecao(keytabs: string) {
    return colecoes.filter((item) => item.key === keytabs);
  }

  return {
    colecoes,
    setColecoes,
    init,
    addColecao,
    getColecao,
    deleteColecao,
    updateColecao,
  };
}
