'use client';

import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <main className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-[#1a2b3b] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <p className="text-[#1E2B3A] text-3xl font-semibold sm:text-4xl">
            Taylor Avakian
          </p>
          <img 
            src="https://ca-times.brightspotcdn.com/dims4/default/2d65279/2147483647/strip/true/crop/840x840+0+0/resize/840x840!/format/webp/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fe6%2Fb6%2F67a77bb642e0b232b4c7bded2eea%2Ftaylor-avakian-crop.jpg"
            alt="Taylor Avakian"
            className="mx-auto rounded-full border-4 border-[#1E2B3A] w-48 h-48 object-cover"
          />
          <div className="mt-12">
              <p className=" mb-4">
                  Taylor Avakian is a premier client advisor for the acquisition and disposition of multifamily assets nationwide. His primary focus is on advancing his client’s positions by observing market trends and capitalizing on opportunities. Taylor has worked on over 100 transactions, both as an advisor and a principal and sold over $175M in real estate.
              </p>
              <p >
                  He is adept at managing the process from beginning to end, including due diligence, financing, marketing, and sales. Taylor’s extensive knowledge of the market and his ability to identify opportunities are what make him stand out from other agents. He has been recognized as one of his region’s top commercial real estate agents, serving clients from all over the United States. His clients include some of the most notable companies in the world, and he prides himself on providing them with exceptional service.
              </p>
          </div>
        </div>
        <div className="mt-8 max-w-lg mx-auto flex justify-between gap-x-4">
          <Link
            href="/"
            className="group w-1/2 px-4 py-2 font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#1E2B3A] rounded-lg no-underline active:scale-95 scale-100 duration-75"
            style={{
              boxShadow: '0 1px 1px #0c192714, 0 1px 3px #0c192724'
            }}
          >
            Back to home
          </Link>

          <Link
            href="https://www.matthews.com/agents/taylor-avakian/"
            className="group w-1/2 px-4 py-2 font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#1E2B3A] rounded-lg no-underline active:scale-95 scale-100 duration-75"
            style={{
              boxShadow: '0 1px 1px #0c192714, 0 1px 3px #0c192724'
            }}
          >
            Read More
          </Link>
        </div>
      </div>
    </main>
  );
}
