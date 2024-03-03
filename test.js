const createPerson = (name, age) => {
  let person = {
    name,
    age,
  };
  const changeName = (newName) => (person.name = newName);
  const getName = () => person.name;
  const increaseAge = () => age++;
  const getAge = () => age;
  return { person, changeName, getName, increaseAge, getAge };
};

const createPlayer = () => {
  const person = createPerson("John", 25);
  let score = 0;
  const increaseScore = () => score++;
  const getScore = () => score;
  return {
    person,
    increaseScore,
    getScore,
    changeName: person.changeName,
    getName: person.getName,
    increaseAge: person.increaseAge,
    getAge: person.getAge,
  };
};

const player = createPlayer();

console.log(player.getAge()); // 25
player.increaseAge();
console.log(player.getAge()); // 26
player.changeName("Jane");
console.log(player.getName()); // Jane
