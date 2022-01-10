export function compare(a, b) {
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

export function arrayString(arr, separador) {
  arr = arr.filter(space => space !== "")
  return arr
    .map((s, i) => {
      if (i >= arr.length - 1) {
        return `${s}`
      } else {
        return `${s}${separador}`
      }
    }).join("")
}

export function stringArray(string, separador) {
  return string.split(separador)
}

export const LoginLocalStorage = token => {
  const Detail = {
    "uid": token.uid,
    "photoURL": token.photoURL,
    "phoneNumber": token.phoneNumber,
    "email": token.email,
    "displayName": token.displayName,
    "refreshToken": token.refreshToken,
  }

  localStorage.setItem("@USER", JSON.stringify(Detail));
  localStorage.setItem("@TOKEN", token.refreshToken);
};

export function remover_acentos_lowercase(str) {
  return str.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '').toLowerCase();
}