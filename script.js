'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//TODO:--------------- creating function to create template literal ------------
//todo -------------------------------------------------------------------------
const dispalayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    let type = mov > 0 ? 'deposit' : 'withdrawal'; //!type of movement happend

    const html = ` 
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// dispalayMovements(account1.movements);

//! --------------------CLACULATING GLOBAL BALANCE------------------
//!----------------------------------------------------------------
const calculateBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calculateBalance(account1.movements);

//!-----------------COMPUTING USERNAMES-----------------
//!-----------------------------------------------------
const computeUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

computeUsernames(accounts);

//todo: -------creating a function that can find the maximum movement in an array-----
//!-----------------------------------------------------------------------------------
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//todo: creating a function of total desposits
const totalDespositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * 1.1)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDespositsUSD);

//! DISPLATING A SUMMARY ----------------------------
//---------------------------------------------------
const calcDisplaySummary = function (acc) {
  //todo: income summary
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  //todo: outcomes summary
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  //todo: interest field
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(movements);

//! UPDATING THE UI----------------------------------
const updateUi = function (acc) {
  //todo: calculate balance
  calculateBalance(acc);
  //todo: calculate summary
  calcDisplaySummary(acc);
  //todo: display movements
  dispalayMovements(acc.movements);
};

//! --------EVENT HANDLERES --------------------------

//*IMPLEMENTING LOGIN -------------------------------
//---------------------------------------------------
let currenAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //preventing form to submit

  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currenAccount);

  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    //todo: displaying welcome message and UI
    labelWelcome.textContent = `Welcome Back, ${
      currenAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;
    //clearing input fields
    inputLoginPin.value = inputLoginUsername.value = '';

    updateUi(currenAccount);
  }
});

//* IMPLEMENTING TRANSFERS ------------------------
//-------------------------------------------------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';

  //todo: adding negeative and positive movement
  if (
    amount > 0 &&
    recieverAcc &&
    currenAccount.balance >= amount &&
    recieverAcc?.username !== currenAccount.username
  ) {
    // currenAccount.movements.push(-amount);
    currenAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUi(currenAccount);
  }
});

//* DELETING AN ACCOUNT -------------------------
//-----------------------------------------------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currenAccount.username === inputCloseUsername.value &&
    currenAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currenAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

//* IMPLEMENTING LOAN FUNCTIONALITY --------------------------
//------------------------------------------------------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currenAccount.movements.some(mov => mov >= amount * 0.1)) {
    currenAccount.movements.push(amount);
    updateUi(currenAccount);
  }

  inputLoanAmount.value = '';
});

//* SORTING METH0D -------------------------------
//* ---------------------------------------------
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  dispalayMovements(currenAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
//!CODING CHALLENGE #1
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const juliaArr = [3, 5, 2, 12, 7];
// const kateArr = [4, 1, 15, 8, 3];

// const newJuliaArr = [...juliaArr].splice(0, 3);
// const newKateArr = [...kateArr].splice(0, 3);

// console.log(newJuliaArr, newKateArr);

// const checkDogs = (juliaArray, kateArray) => {
//   juliaArr.forEach((dogAge, i) => {
//     console.log(
//       dogAge > 3
//         ? `Dog number ${i} is an adult, and is ${dogAge} years old`
//         : `Dog number ${i} is still a puppy 🐶`
//     );
//   });

//   kateArray.forEach((dogAge, i) => {
//     console.log(
//       dogAge > 3
//         ? `Dog number ${i} is an adult, and is ${dogAge} years old`
//         : `Dog number ${i} is still a puppy 🐶`
//     );
//   });
// };

// checkDogs(newJuliaArr, newKateArr);

//TODO: seprating the deposits from the movements
const deposits = movements.filter(mov => mov > 0);

const widthrawals = movements.filter(mov => mov < 0);

// * ///////////console.log(deposits, widthrawals);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
//!CODING CHALLENGE #2
// const calcAverageHUmanAge = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   const adults = humanAge.filter(age => age >= 18);
//   const averagAge = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   console.log(humanAge);
//   console.log(adults);
//   return averagAge;
// };

// console.log(calcAverageHUmanAge([5, 2, 4, 1, 15, 8, 3]));

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(adult => adult >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   console.log(humanAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

//!Creating a date
const now = new Date();
console.log(now);
