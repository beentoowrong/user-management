import { redirect } from '@sveltejs/kit'

export async function handle({ event, resolve }) {
    // ambil cookie 'token'
    const token = event.cookies.get('token');
    
    // ambil url
    const { pathname } = event.url;

    // url yang tidak memerlukan token (login dan register)
    const publicPaths = ['/login', '/register'];

    // pengecekan jika URL dimulai dengan /admin
    const isAdminPath = pathname.startsWith('/admin');
    
    // jika sudah login dan mencoba mengakses halaman login atau register, redirect ke dashboard
    if (token && publicPaths.includes(pathname)){
        throw redirect(302, '/admin/dashboard');
    }

    // jika belum login dan mencoba akses /admin, redirect ke login
    if (!token && isAdminPath) {
        throw redirect(302, '/login')
    }

    // lanjutkan ke permintaan selanjutnya
    return await resolve(event);
}