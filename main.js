//TODO add imports if needed
//TODO doc
/**
 * The main function which calls the application. 
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */

export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

//Const 
const gender = ["male", "female"]
const maleNames = [
  "Jan", "Petr", "Jakub", "Tomáš", "Martin",
  "Adam", "Matěj", "Vojtěch", "David", "Filip",
  "Daniel", "Ondřej", "Štěpán", "Lukáš", "Antonín",
  "Václav", "Josef", "Michal", "Marek", "Samuel",
  "Jiří", "František", "Karel", "Richard", "Vít"
];
const femaleNames = [
  "Eliška", "Viktorie", "Anna", "Sofie", "Natálie",
  "Tereza", "Ema", "Adéla", "Julie", "Laura",
  "Nela", "Karolína", "Rozálie", "Barbora", "Anežka",
  "Veronika", "Marie", "Kristýna", "Stella", "Emma",
  "Sára", "Amálie", "Mia", "Klára", "Štěpánka"
];
const maleSurnames = [
  "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
  "Procházka", "Kučera", "Veselý", "Horák", "Němec",
  "Pokorný", "Hruška", "Král", "Růžička", "Fiala",
  "Beneš", "Sýkora", "Krejčí", "Kolář", "Jelínek",
  "Čech", "Sedláček", "Vacek", "Bartoš", "Šimek"
];
const femaleSurnames = [
  "Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá",
  "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová",
  "Pokorná", "Hrušková", "Králová", "Růžičková", "Fialová",
  "Benešová", "Sýkorová", "Krejčíová", "Kolářová", "Jelínková",
  "Čechová", "Sedláčková", "Vacková", "Bartošová", "Šimková"
];
const workloads = [10, 20, 30, 40]
var _youngestPossibleEmployeeBirthday;
var _oldestPosibleEmployeeBirthday;

/**
 * Please, add specific description here 
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  if (typeof dtoIn.count !== "number" || !dtoIn.count || dtoIn.count <= 0) throw new Error("Count must be a positive number");
  if (!dtoIn.age || typeof dtoIn.age.min !== "number" || typeof dtoIn.age.max !== "number") throw new Error("Age min/max must be numbers");
  if (dtoIn.age.min > dtoIn.age.max) throw new Error("Age min cannot be greater than max");

  DefineEdgeBirthdayDates(dtoIn.age.min, dtoIn.age.max);
  let employees = [];
  for(let i = 0; i< dtoIn.count; i++){
    var employee =  new Employee();
    employees.push(employee);
  }
  let dtoOut = employees;
  return dtoOut;
}

/**
 * Please, add specific description here 
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  let dtoOut = {
      total: employees.length,
      workload10: 0,
      workload20: 0,
      workload30: 0,
      workload40: 0,
      averageAge: 0,
      minAge: null,
      maxAge: null,
      medianAge: null,
      medianWorkload: null,
      numberOfFemaleEmployees: 0,
      averageWomenWorkload: 0,
      sortedByWorkload: []
  };

  if(dtoOut.total == 0) {return dtoOut;}

  let defaultAge = employees[0].age;
  dtoOut.minAge = defaultAge;
  dtoOut.maxAge = defaultAge;
  dtoOut.medianAge = defaultAge;

  let sortedByAge = [];
  let sortedByWorkload = [];
  employees.forEach(employee => {
    switch(employee.workload){
      case 10:
        dtoOut.workload10++;
        break;
      case 20:
        dtoOut.workload20++;
        break;
      case 30:
        dtoOut.workload30++;
        break;
      case 40:
        dtoOut.workload40++;
        break; 
    }

    dtoOut.averageAge += (new Date() - new Date(employee.birthdate)) / (1000*60*60*24*365.25);

    if(employee.age < dtoOut.minAge) {dtoOut.minAge = employee.age;}
    if(employee.age > dtoOut.maxAge) {dtoOut.maxAge = employee.age;}
    if(employee.gender == "female") {
      dtoOut.numberOfFemaleEmployees++;
      dtoOut.averageWomenWorkload += employee.workload;
    }

    //SortByWorkload
    let j = 0;
    while (j < sortedByWorkload.length && sortedByWorkload[j].workload < employee.workload) {
      j++;
    }
    sortedByWorkload.splice(j, 0, employee);

    //SortByAge
    const exactAge = (new Date() - new Date(employee.birthdate)) / (1000*60*60*24*365.25);
  
    let i = 0;
    while (i < sortedByAge.length && sortedByAge[i].exactAge < exactAge) {
      i++;
    }
    sortedByAge.splice(i, 0, { ...employee, exactAge });
  });

  dtoOut.averageAge = dtoOut.averageAge / dtoOut.total; 
  dtoOut.averageWomenWorkload = dtoOut.averageWomenWorkload / dtoOut.numberOfFemaleEmployees;



  let mid = Math.floor(sortedByAge.length / 2);
  if (sortedByAge.length % 2 === 0) {
      dtoOut.medianAge = (sortedByAge[mid - 1].exactAge + sortedByAge[mid].exactAge) / 2;
  } else {
      dtoOut.medianAge = sortedByAge[mid].exactAge;
  }

  dtoOut.sortedByWorkload = sortedByWorkload;
  const midWorkload = Math.floor(sortedByWorkload.length / 2);
  if (sortedByWorkload.length % 2 === 0) {
      dtoOut.medianWorkload = (sortedByWorkload[midWorkload - 1].workload + sortedByWorkload[midWorkload].workload) / 2;
  } else {
      dtoOut.medianWorkload = sortedByWorkload[midWorkload].workload;
  }

  dtoOut.total = Math.round(dtoOut.total);
  dtoOut.workload10 = Math.round(dtoOut.workload10);
  dtoOut.workload20 = Math.round(dtoOut.workload20);
  dtoOut.workload30 = Math.round(dtoOut.workload30);
  dtoOut.workload40 = Math.round(dtoOut.workload40);
  dtoOut.medianWorkload = Math.round(dtoOut.medianWorkload);
  dtoOut.minAge = +dtoOut.minAge.toFixed(0);
  dtoOut.maxAge = +dtoOut.maxAge.toFixed(0);
  dtoOut.medianAge = dtoOut.medianAge | 0;


  // Průměr věku a workload – 1 desetinné místo
  dtoOut.averageAge = +dtoOut.averageAge.toFixed(1);
  dtoOut.averageWomenWorkload = dtoOut.numberOfFemaleEmployees > 0
    ? +dtoOut.averageWomenWorkload.toFixed(1)
    : 0;

  return dtoOut;
}

//Object constructor
function Employee(){
  this.gender = GetGender();
  this.birthdate = GetBirthdate();
  this.name = GetName(this.gender);
  this.surname = GetSurname(this.gender);
  this.workload = GetWorkload();
  this.age = getEmployeeAge(this.birthdate);
}

function getEmployeeAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

//Helper function
function GetRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GetGender(){
  return gender[GetRandomInt(0,1)]
}

function GetBirthdate() {
  const min = _oldestPosibleEmployeeBirthday;
  const max = _youngestPossibleEmployeeBirthday;
  const randomTimestamp = GetRandomInt(min, max);
  return new Date(randomTimestamp).toISOString();
}

function SubtractYearsFromTimestamp(timestamp, years) {
    const d = new Date(timestamp);
    d.setFullYear(d.getFullYear() - years);
    return d.getTime();
}

function DefineEdgeBirthdayDates(minAge, maxAge){
  const now = Date.now();

  //Nejmladší se narodil teď přesně v tento moment před [minAge]
  _youngestPossibleEmployeeBirthday = SubtractYearsFromTimestamp(now, minAge);

  //Nejstajší se narodil za 1ms narodil přesně před [maxAge]
  _oldestPosibleEmployeeBirthday = SubtractYearsFromTimestamp(now, maxAge);
}

function GetName(gender){
  return gender === "male" 
    ? maleNames[GetRandomInt(0, maleNames.length-1)] 
    : femaleNames[GetRandomInt(0, femaleNames.length-1)]
}

function GetSurname(gender){
  return gender === "male" 
    ? maleSurnames[GetRandomInt(0, maleSurnames.length-1)] 
    : femaleSurnames[GetRandomInt(0, femaleSurnames.length-1)]
}

function GetWorkload(){
  return workloads[GetRandomInt(0, workloads.length-1)];
}
