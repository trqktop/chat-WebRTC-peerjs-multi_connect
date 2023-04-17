import { useSelector } from "react-redux";
import { RootState } from "../../types/chat";
import "./UserList.css";
const UserList = () => {
  const users = useSelector((state: RootState) => state.chat.userList);

  return (
    <ul className="users">
      {users.map((user: any, index: number) => (
        <li className="users__item" key={index}>
          <span>{user.userName}</span>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
