import {Navigate} from 'react-router-dom';
import {useAuthContext} from '../hooks/useAuthContext';

function ProtectedRoute({children}){
    const {user,loading} = useAuthContext();

    if(loading) return null;
    if(!user) return <Navigate to="/login" />

    return children;
}

export default ProtectedRoute;