"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setIsOpen(false)} // Closes the modal when clicked outside
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all'>
              <Dialog.Title className='text-lg font-medium text-gray-900 mb-4'>
                {title}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
