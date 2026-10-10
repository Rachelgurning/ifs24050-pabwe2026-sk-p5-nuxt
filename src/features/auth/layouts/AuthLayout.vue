<template>
  <main class="min-h-screen grid lg:grid-cols-2 bg-white">
    <section class="hidden lg:flex flex-col justify-between bg-indigo-700 p-12 text-white">
      <div class="text-xl font-extrabold tracking-tight">delcom<span class="text-indigo-200">.</span></div>
      <div><p class="mb-4 text-sm font-bold uppercase tracking-[.2em] text-indigo-200">Personal finance</p><p class="max-w-lg text-5xl font-extrabold leading-tight">Atur arus kas, capai tujuan finansial.</p><p class="mt-5 max-w-md text-indigo-100">Semua pemasukan dan pengeluaran dalam satu tempat.</p></div>
      <p class="text-sm text-indigo-200">© 2026 Delcom Cash Flow</p>
    </section>
    <section class="flex items-center justify-center p-6 sm:p-12"><div class="w-full max-w-md"><div class="mb-8 text-2xl font-extrabold text-indigo-700 lg:hidden">delcom.</div><RouterView /></div></section>
  </main>
</template>
