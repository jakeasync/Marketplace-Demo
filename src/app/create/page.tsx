import Link from "next/link";
import {
  FBTagIcon,
  FBCarOutlineIcon,
  FBHomeOutlineIcon,
} from "@/components/ui/facebook-icons";
import { Layers, ChevronRight } from "lucide-react";

export default function CreateListingPage() {
  const listingTypes = [
    {
      title: "Item for sale",
      description: "Create a single listing for one or more items to sell.",
      icon: FBTagIcon,
      href: "/create/item",
    },
    {
      title: "Create multiple listings",
      description: "Sell several items together in one batch.",
      icon: Layers,
      href: "/create/item",
    },
    {
      title: "Vehicle for sale",
      description: "Sell a car, truck, motorcycle or other vehicle.",
      icon: FBCarOutlineIcon,
      href: "/create/item?category=Vehicles",
    },
    {
      title: "Home for sale or rent",
      description: "List a house or apartment for sale or rent.",
      icon: FBHomeOutlineIcon,
      href: "/create/item?category=Property%20Rentals",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#050505] tracking-tight">
          Choose listing type
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select what kind of item you want to post to Facebook Marketplace.
        </p>
      </div>

      <div className="space-y-3.5">
        {listingTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link
              key={type.title}
              href={type.href}
              className="flex items-center justify-between rounded-2xl bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all group border border-transparent hover:border-[#1877F2]/20"
            >
              <div className="flex items-center gap-4">
                {/* Facebook light blue rounded square container */}
                <div className="flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#E7F3FF] text-[#1877F2] shrink-0">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#050505]">
                    {type.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
