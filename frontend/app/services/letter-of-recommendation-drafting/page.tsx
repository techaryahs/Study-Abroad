"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

export default function LORDraftingPage() {
  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#f7f4ef] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black uppercase">
              Letter of Recommendation Drafting
            </h1>

            <p className="text-lg mb-6 leading-relaxed">
              Little known is the art of writing exactly what the admissions committee wants to see in an applicant. This can be more impacting than your SOP if done right.
            </p>

            <DiscussionSection serviceId="letter-of-recommendation-drafting" />
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <video
              src="/LOR.mp4"
              autoPlay
              muted
              loop
              controls
              className="rounded-xl w-full max-w-md shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-yellow-500 inline-block text-black">
              About Service
            </h2>

            <div className="space-y-5 text-gray-600 leading-relaxed mt-6">
              <p>
                Letters of Recommendation (LORs) are the documents that undeniably hold the most importance in your application. However, it is not that simple. These can either be the least influential documents or the only documents you need to secure that admit. If done right, they are the most important tool in your arsenal. Yes, even more critical than your SOP. Now, the reason that these are undermined is that most LORs I see are crafted to fall in the former category: the least influential documents in your application, which means you have wasted the only chance you had at winning the committee's support.
              </p>
              <p>
                Think about it. You are on the admissions committee. Would you put your faith in a random applicant or rather believe a professor or someone you know/follow from the same profession. It is that simple. Most LORs are general and are centered around the following statement: "Mr. X was the absolute best student in my class and he always completed his work in advance. He even asked me for more work and assignments while the other students struggled to complete their work. Moreover, he is an excellent all-rounded individual who also organized some of the most memorable events at our university."
              </p>
              <p>
                What a load of crap! No one cares. That cannot be the reason I would possibly give you an admit. You wouldn't give yourself an admit based on that either. Yet, most LORs I see are generic and based on the same idea.
              </p>
              <p>
                This service will also include recommendations on who you should take your letters from, given that you are only allowed to choose a limited number of recommenders. All of this will vary based on your profile, degree, and your network
              </p>
              <p className="font-semibold text-gray-800">
                Looking to really stand out? We have the secrets to creating STRONG LORs that cater to the international recommender standards. Book your drafts now!
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <div className="w-full">
              <AddToCart serviceId="lor-drafting" />
            </div>

            {/* <div className="border rounded-xl p-5 flex items-center gap-4 bg-gray-50/50">
              <Image
                src="/man_holding_phone.png"
                alt="chat"
                width={60}
                height={60}
                className="rounded-xl object-cover"
              />
              <div>
                <p className="font-bold text-black border-none p-0 !mb-0">Discuss Your Case</p>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Chat with a team member to see how we can help.
                </p>
                <button
                  onClick={() => window.open("https://wa.me/+918987654321", "_blank")}
                  className="mt-2 text-yellow-600 text-xs font-bold hover:underline"
                >
                 <Link href="/contact" >Message now →</Link>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}