import { useSelector } from 'react-redux';
import { User } from '@/types/user';
interface RootState {
   auth: {
      user: User; 
   };
}

export default function useAuth() {
   const user = useSelector((state: RootState) => state.auth.user);

   if (user) {
      return true;
   }
   else {
      return false;
   }
}