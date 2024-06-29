import dynamic from "next/dynamic";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
const AdminApp = dynamic(()=> import("./app"), {ssr: false} )
const AdminPage = () => {
    if(!isAdmin()){
        redirect("/learn")
    }
    return ( 
            <AdminApp/>
     );
}
 
export default AdminPage;