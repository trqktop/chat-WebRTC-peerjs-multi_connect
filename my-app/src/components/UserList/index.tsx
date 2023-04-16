import { useSelector } from "react-redux";
import { RootState } from "../../types/chat";
import "./UserList.css";
const UserList = () => {
  const users = useSelector((state: RootState) => state.chat.userList)
  console.log(users)
  return (
    <ul className="users">
      {/* {users.map((name: string, index: number) => (
        <li className="users__item" key={index}>
          <span>{name}</span>
        </li>
      ))} */}
    </ul>
  );
};

export default UserList;
