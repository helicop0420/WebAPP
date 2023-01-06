import Image from "next/image";
import React from "react";

export default function EndorsementCard() {
  return (
    <li key={"comment.id"}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            className="h-10 w-10 rounded-full"
            src={`https://images.unsplash.com/photo-1661961112134-fbce0fdf3d99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80`}
            alt="Endorsement"
          />
        </div>
        <div>
          <div className="text-sm">
            <a href="#" className="font-medium text-gray-900">
              Leslie Alexander
            </a>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <p className="font-inter text-xs font-medium leading-5">
              July 16, 2021, co-sponsor in 339-Acre Single Family Lots
              Development in Leader, TX
            </p>
            <p>
              Ducimus quas delectus ad maxime totam doloribus reiciendis ex.
              Tempore dolorem maiores. Similique voluptatibus tempore non ut.
            </p>
          </div>
          <fieldset className="space-y-5">
            <legend className="sr-only">Notifications</legend>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="comments" className="font-medium text-gray-700">
                  Show publicly on profile
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </li>
  );
}
