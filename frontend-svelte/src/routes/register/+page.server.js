import { fail } from '@sveltejs/kit';
/** @type { import('./$types').Actions } */

export const actions = {
    register: async ({ request, fetch }) => {
        try {
            // get form data
            const formData = await request.formData();
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    name,
                    password,
                })
            })

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const result = isJson ? await response.json() : {};

            // Jika gagal maka akan memanggil fail dan memberikan beberapa object error validasi
            // yang di dapat dari backend
            if (!response.ok) {
                return fail(response.status, {
                    success: false,
                    message: result.message || "Terjadi kesalahan saat menyimpan data",
                    errors: result.errors || [],
                    values: {name, email, password}
                })
            }

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