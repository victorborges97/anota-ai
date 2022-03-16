export function compare(a: string, b: string) {
  let nameA = a.toUpperCase();
  let nameB = b.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

export function arrayString(arr: Array<String>, separador: string) {
  arr = arr.filter((space) => space !== "");
  return arr
    .map((s, i) => {
      if (i >= arr.length - 1) {
        return `${s}`;
      } else {
        return `${s}${separador}`;
      }
    })
    .join("");
}

export function stringArray(string: string, separador: string) {
  return string.split(separador);
}

export const LoginLocalStorage = (token: any) => {
  const Detail = {
    uid: token.uid,
    photoURL: token.photoURL,
    phoneNumber: token.phoneNumber,
    email: token.email,
    displayName: token.displayName,
    refreshToken: token.refreshToken,
  };

  localStorage.setItem("@USER", JSON.stringify(Detail));
  localStorage.setItem("@TOKEN", token.refreshToken);
};

export function remover_acentos_lowercase(str: string) {
  return str
    .normalize("NFD")
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, "")
    .toLowerCase();
}

export function delay(delay?: number | undefined) {
  return new Promise((res) => setTimeout(res, delay));
}

export function toTimestamp(strDate: string) {
  var datum = Date.parse(strDate);
  return datum / 1000;
}

export function getMessageFromErrorCode(errorCode: string, error?: string) {
  console.log("errorCode: " + errorCode);
  switch (errorCode) {
    case "ERROR_EMAIL_ALREADY_IN_USE":
    case "account-exists-with-different-credential":
    case "email-already-in-use":
      return "E-mail já utilizado. Vá para a página de login.";
    case "auth/email-already-in-use":
      return "E-mail já utilizado. Vá para a página de login.";
    case "ERROR_WRONG_PASSWORD":
    case "wrong-password":
      return "Combinação de e-mail ou senha errada.";
    case "auth/wrong-password":
      return "Combinação de e-mail ou senha errada.";
    case "ERROR_USER_NOT_FOUND":
    case "user-not-found":
      return "Nenhum usuário encontrado com este e-mail.";
    case "ERROR_USER_DISABLED":
    case "user-disabled":
      return "Usuário desativado.";
    case "ERROR_TOO_MANY_REQUESTS":
    case "operation-not-allowed":
      return "Muitos pedidos para entrar nesta conta.";
    case "ERROR_OPERATION_NOT_ALLOWED":
    case "operation-not-allowed":
      return "Erro do servidor, tente novamente mais tarde.";
    case "ERROR_INVALID_EMAIL":
    case "invalid-email":
      return "Endereço de email inválido.";
    default:
      if (error) {
        return error;
      }
      return "NOT";
  }
}
