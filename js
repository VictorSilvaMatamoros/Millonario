const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

// Vector para almacenar los usuarios
let userList = getSavedUsers() || []; // Cargar usuarios guardados al iniciar la app
let totalWealth = getSavedTotalWealth() || 0; // Cargar el total de riqueza guardado al iniciar la app

// Función que obtiene de la API un nombre aleatorio,
// genera una cantidad de dinero aleatoria cuyo máximo es 1.000.000
// y añade al usuario con ambos datos
async function getRandomUser() {
  let res = await fetch('https://randomuser.me/api');
  let data = await res.json();
  let user = data.results[0];

  const newUser = {
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000)
  };

  addData(newUser);
}

// Función que añade un nuevo usuario (objeto) al listado de usuarios (array) y guarda en localStorage
function addData(obj) {
  userList.push(obj);
  updateDOM();
  saveData();
}

// Función que dobla el dinero de todos los usuarios existentes y guarda en localStorage
function doubleMoney() {
  userList = userList.map(user => {
    return { ...user, money: user.money * 2 };
  });
  updateDOM();
  saveData();
}

// Función que ordena a los usuarios por la cantidad de dinero que tienen y guarda en localStorage
function sortByRichest() {
  userList.sort((a, b) => b.money - a.money);
  updateDOM();
  saveData();
}

// Función que muestra únicamente a los usuarios millonarios (tienen más de 1.000.000) y guarda en localStorage
function showMillionaires() {
  userList = userList.filter(user => user.money >= 1000000);
  updateDOM();
  saveData();
}

// Función que calcula y muestra el dinero total de todos los usuarios
function calculateWealth() {
  totalWealth = userList.reduce((acc, user) => (acc += user.money), 0);
  const wealthElement = document.createElement('div');
  wealthElement.innerHTML = `<h3>Total de riqueza: <strong>${formatMoney(totalWealth)}</strong></h3>`;
  main.appendChild(wealthElement);
  saveTotalWealth();
}

// Función que actualiza el DOM
function updateDOM() {
  main.innerHTML = '<h2><strong>Usuario</strong> Riqueza</h2>';
  userList.forEach(user => {
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.innerHTML = `<strong>${user.name}</strong> ${formatMoney(user.money)}`;
    main.appendChild(userElement);
  });
}

// Función que formatea un número a dinero
function formatMoney(number) {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '€';
}

// Función que guarda los usuarios y el total de riqueza en localStorage
function saveData() {
  localStorage.setItem('users', JSON.stringify(userList));
}

// Función que carga los usuarios desde localStorage al iniciar la app
function getSavedUsers() {
  return JSON.parse(localStorage.getItem('users'));
}

// Función que guarda el total de riqueza en localStorage
function saveTotalWealth() {
  localStorage.setItem('totalWealth', JSON.stringify(totalWealth));
}

// Función que carga el total de riqueza desde localStorage al iniciar la app
function getSavedTotalWealth() {
  return JSON.parse(localStorage.getItem('totalWealth'));
}

// Obtenemos un usuario al iniciar la app si no hay usuarios guardados
if (!userList.length) {
  getRandomUser();
}

// Event listeners
addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionairesBtn.addEventListener('click', showMillionaires);
calculateWealthBtn.addEventListener('click', calculateWealth);
