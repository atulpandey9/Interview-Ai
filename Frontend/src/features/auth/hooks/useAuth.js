import { useContext ,useEffect} from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout,getMe } from "../services/auth.api";



export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

 const handleLogin = async ({ email, password }) => {
  setLoading(true);

  try {
    const data = await login({ email, password });

    if (!data || !data.user) {
      throw new Error("Invalid response from server");
    }

    setUser(data.user);
  } catch (err) {
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    const data = await register({ username, email, password });
    setUser(data.user);
    setLoading(false);
  };

  const handleLogout = async () => {
  setLoading(true);

  try {
    await logout();
    setUser(null);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  useEffect(()=>{
const getAndSetUser=async()=>{
  const data=await getMe()
  setLoading(data.user)
  setLoading(false)

} 
getAndSetUser()
 },[])

  return { user, loading, handleLogin, handleRegister, handleLogout };
};