import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./UserList.css";
const UserList = () => {

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
