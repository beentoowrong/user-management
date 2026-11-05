import { fail } from '@sveltejs/kit'

/** @type { import('./$types').Actions } */
export const actions = {
    login: async ({ request, cookies }) => {
        try {
            // Ambil data dari form
            const formData = await request.formData();
            const email = formData.get('email');
            const password = formData.get('password');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            })

            const result = await response.json()

            // Jika gagal maka akan memanggil fail dan memberikan beberapa object error validasi
            // yang di dapat dari backend
            if (!response.ok) {
                return fail(response.status, {
                    success: false,
                    message: result.message || "Terjadi kesalahan saat menyimpan data",
                    errors: result.errors || [],
                    values: {email, password}
                })
            }

            cookies.set('token', result.data.token, {
                httpOnly: true,
                path: '/',
                maxAge: 60*60 // 1 jam
            })

            cookies.set('user', JSON.stringify(result.data.user), {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 // 1 jam
            })

            return { success: true }

        } catch (error) {
            console.log('Error', error)
            return fail(500, {
                success: false,
                message: error?.message || "Gagal menghubungi server",
                errors: []
            });
        }
    }
}