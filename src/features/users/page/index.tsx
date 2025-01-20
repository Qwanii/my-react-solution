import { memo } from "react"
import { useInit, useSolution } from "react-solution";
import { USERS_STORE } from "../store/token";
import Users from "../containers/users";
import LayoutAdmin from "@src/ui/layout-admin";
import UsersTable from "@src/ui/users-table";

function UsersPage() {

    const users = useSolution(USERS_STORE);
    


    useInit(
        async () => {
          // Инициализация параметров каталога
          await users.initParams({});
        },
        [],
        { ssr: 'users.init' },
      );
    console.log(users)
    
    return(
        <LayoutAdmin>
          <UsersTable/>
        </LayoutAdmin>
    )
}

export default memo(UsersPage)