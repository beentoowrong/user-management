import { fail } from "@sveltejs/kit";

/** @type {import('./$types').Actions;} */
export const actions = {
    create : async ({ request, cookies, fetch }) => {
        try {
            const token = cookies.get('token');

            const formData = await request.formData();

            const name = formData.get('name')
            const email = formData.get('email')
            const password = formData.get('password')

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                })
            })

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const result = isJson ? await response.json() : {};
            
            if(!response.ok) {
                return fail(response.status, {
                    succes: false,
                    message: result.message || 'Terjadi kesalahan dalam menyimpan data',
                    error: result.error || [],
                    values: { name, email }
                })
            }

            return { success: true }
        } catch (error) {
            if (error instanceof Response) {
                throw error
            }
            console.error('Error:', error)
            return fail(500, {
                success: false,
                message: 'Terjadi kesalahan saat menyimpan data'
            })
        }
    }
}