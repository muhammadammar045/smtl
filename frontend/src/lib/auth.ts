import { redirect } from 'react-router-dom';

export function authLoader() {
    // Replace this with your actual auth check
    const isAuthenticated = localStorage.getItem('token');
    
    if (!isAuthenticated) {
        return redirect('/auth/login');
    }
    
    return null;
}