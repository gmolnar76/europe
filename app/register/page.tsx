import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Regisztráció – EUROPA.VOTE' };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-midnight mb-6">Regisztráció</h1>
      <form className="space-y-4 bg-white p-6 rounded-lg border border-black/5 shadow-sm">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-midnight/40" required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Jelszó</label>
          <input type="password" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-midnight/40" required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Jelszó újra</label>
          <input type="password" className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-midnight/40" required />
        </div>
        <button className="w-full rounded bg-midnight text-offwhite py-2 text-sm font-medium hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-midnight/50">Fiók létrehozása</button>
        <div className="text-xs text-slate-500 text-center">Van már fiók? <Link href="/login" className="text-midnight hover:underline">Belépés</Link></div>
      </form>
    </div>
  )
}
