import React from 'react';

function Card(props) {
  return (
    <div class="flex bg-white focus-within:outline-2 focus-within:outline-indigo-600 p-4 rounded-lg shadow-md md:gap-8 m-4 p-4">
      <div class="w-14 flex-none text-center font-bold ">

        <figure class="max-w-lg">
          <img class="h-auto max-w-full rounded-lg" src="../../logo.jpeg" alt="Product 1" />
          <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Product</figcaption>
        </figure>

      </div>
      <div class="w-64 flex-auto px-2 text-sm text-gray-500">{props.product?.name || 'Product Name'}</div>
      <div class="w-32 flex-auto px-2 text-sm text-gray-500 focus-within:outline-2 focus-within:outline-indigo-600">
        <p class="pe-6">.</p>
        <div
          class="inline-block h-[50px] min-h-[1em] w-0.5 self-stretch bg-neutral-50 dark:bg-black/5"></div>
        <p class="ps-6">.</p></div>
    </div>
  );
}

export default Card;
