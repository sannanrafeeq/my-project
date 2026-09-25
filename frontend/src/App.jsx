import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);

  // GET users
  const getUsers = () => {
    fetch("http://localhost:3000/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Page load hote hi users lao
  useEffect(() => {
    getUsers();
  }, []);

  // POST user
  const createUser = () => {
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        age: Number(age)
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("User created successfully!");

        // Naya user banne ke baad list refresh
        getUsers();

        setName("");
        setAge("");
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error.message);
      });
  };

  return (
    <div>
      <h1>Create User</h1>

      <input
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Enter age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <button onClick={createUser}>
        Create User
      </button>

      <hr />

      <h2>All Users</h2>

      {users.map((user) => (
        <div key={user._id}>
          <p>
            Name: {user.name} | Age: {user.age}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;