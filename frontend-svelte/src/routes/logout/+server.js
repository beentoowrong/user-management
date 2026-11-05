import { redirect } from "@sveltejs/kit";

export async function GET({ cookies }) {
    // hapus cookie token
    cookies.delete('token', { path: '/' })

    // hapus cookie user
    cookies.delete('user', { path: '/' })

    throw redirect(302, '/login')
}