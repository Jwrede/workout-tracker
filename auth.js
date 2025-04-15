function checkAuth() {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authenticated='));
    
    if (!authCookie || authCookie.split('=')[1] !== 'true') {
        window.location.href = 'login.html';
    }
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 