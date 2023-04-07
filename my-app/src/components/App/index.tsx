import UserList from "../UserList";
import Form from "../Form";
import Window from "../Window";
import "./App.css";
const App = () => {
  return (
    <div className="page">
      <header className="header">
        <UserList />
      </header>
      <main className="content">
        <Window />
        <Form />
      </main>
    </div>
  );
};

export default App;
