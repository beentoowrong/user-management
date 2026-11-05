export async function load({ cookies }) {
    // ambil cookie 'user'
    const userData = cookies.get('user')
    
    return {
        user : JSON.parse(userData)
    }
}