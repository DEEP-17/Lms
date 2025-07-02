import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

interface User {
   role?: string;
}

interface RootState {
   auth: {
      user?: User;
   };
}

interface ProtectedProps {
   children: React.ReactNode;
}
export default function AdminProtected({ children }: ProtectedProps) {
   const { user } = useSelector((state: RootState) => state.auth);
   if(user) {
      const isAdmin = user?.role === "admin";
   return isAdmin ? children : redirect("/");
   }
}