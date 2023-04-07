import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./UserList.css";
const UserList = () => {
  const users = useSelector((state: RootState) => state.chat.users);

  return (
    <ul className="users">
      {users.map((name: string, index: number) => (
        <li className="users__item" key={index}>
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
