'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-[#1a2b3b] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <p className="text-[#1E2B3A] text-3xl font-semibold sm:text-4xl">
            Get in touch
          </p>
          <p>We’d love to hear from you! Please fill out the form below.</p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
              <div>
                <label className="font-medium">First name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-2 px-3 py-2 text-[#1a2b3b] bg-transparent outline-none border focus:border-[#407BBF] shadow-sm rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium">Last name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-2 px-3 py-2 text-[#1a2b3b] bg-transparent outline-none border focus:border-[#407BBF] shadow-sm rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                required
                className="w-full mt-2 px-3 py-2 text-[#1a2b3b] bg-transparent outline-none border focus:border-[#407BBF] shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium">Phone number</label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                  <select className="text-sm bg-transparent outline-none rounded-lg h-full">
                    <option>US</option>
                    <option>ES</option>
                    <option>MR</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="+1 (555) 000-000"
                  required
                  className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-[#407BBF] shadow-sm rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="font-medium">Message</label>
              <textarea
                required
                className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-[#407BBF] shadow-sm rounded-lg"
              ></textarea>
            </div>
            <div></div>
            <div className="flex justify-between gap-x-4">
              <Link
                href="/"
                className="group w-1/2 px-4 py-2 font-semibold transition-all flex items-center justify-center  bg-[#1E2B3A] text-white hover:bg-[#1E2B3A] rounded-lg no-underline active:scale-95 scale-100 duration-75"
                style={{
                  boxShadow: '0 1px 1px #0c192714, 0 1px 3px #0c192724'
                }}
              >
                Back to home
              </Link>

              <button className="w-1/2 px-4 py-2 font-medium bg-[#1E2B3A] text-white hover:bg-[#1E2B3A] active:bg-[#407BBF] rounded-lg duration-150">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
