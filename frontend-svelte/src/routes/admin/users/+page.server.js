/** @type {import('./$types').PageLoad} */

export async function load({ fetch, cookies }) {
    // ambil token dari cookie
    const token = cookies.get('token');

    // Mengirim permintaan dengan token (sesuai route backend: /api/admin/user)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
        headers: {
            'Authorization': `${token}`,
            'Content-type': 'application/json'
        }
    });

    if (!response.ok) {
        return { users: [] };
    }

    const result = await response.json();

    // assign response data to users
    const users = result.data

    // return props `users`
    return { users };
}