export const authGuard = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/signin';
    }
}