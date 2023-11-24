import Link from "next/link";
import React from "react";

export default function Navigation() {
  return (
    <div className="absolute top-0 w-full mx-auto border text-center">
      <Link href="results" className="uppercase hover:text-pink-800 mr-10">
        Results
      </Link>
      <Link href="/" className="uppercase hover:text-pink-800">
        Vote
      </Link>
    </div>
  );
}
