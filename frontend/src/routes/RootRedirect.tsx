import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RootRedirect = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) return;
        
        if (auth.token && auth.user) {
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [auth, navigate]);

    return null;
};

export default RootRedirect;