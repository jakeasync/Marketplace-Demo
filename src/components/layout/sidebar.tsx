"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CarIcon,
  PropertyRentalsIcon,
  ApparelIcon,
  ClassifiedsIcon,
  PhoneIcon,
  VideoCameraIcon,
  HeartIcon,
  ShovelIcon,
  PenIcon,
  HomeGoodsIcon,
  WrenchIcon,
  HomeSalesIcon,
  MusicIcon,
  BriefcaseIcon,
  PetIcon,
  SportsIcon,
  GamepadIcon,
  GroupsIcon,
} from "@/components/ui/facebook-icons";
import { ListOrdered, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const CATEGORIES_WITH_ICONS = [
  { name: "Vehicles", icon: CarIcon },
  { name: "Property Rentals", icon: PropertyRentalsIcon },
  { name: "Apparel", icon: ApparelIcon },
  { name: "Classifieds", icon: ClassifiedsIcon },
  { name: "Electronics", icon: PhoneIcon },
  { name: "Entertainment", icon: VideoCameraIcon },
  { name: "Family", icon: HeartIcon },
  { name: "Free Stuff", icon: ClassifiedsIcon },
  { name: "Garden & Outdoor", icon: ShovelIcon },
  { name: "Hobbies", icon: PenIcon },
  { name: "Home Goods", icon: HomeGoodsIcon },
  { name: "Home Improvement Supplies", icon: WrenchIcon },
  { name: "Home Sales", icon: HomeSalesIcon },
  { name: "Musical Instruments", icon: MusicIcon },
  { name: "Office Supplies", icon: BriefcaseIcon },
  { name: "Pet Supplies", icon: PetIcon },
  { name: "Sporting Goods", icon: SportsIcon },
  { name: "Toys & Games", icon: GamepadIcon },
  { name: "Buy and sell groups", icon: GroupsIcon },
];

export function MobileCategoryPills() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const isCategoryActive = (name: string) => {
    const slug = name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
    if (pathname.startsWith(`/category/${slug}`)) return true;
    if (currentCategory.toLowerCase() === name.toLowerCase()) return true;
    return false;
  };

  return (
    <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES_WITH_ICONS.map((cat) => {
        const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
        const active = isCategoryActive(cat.name);
        const Icon = cat.icon;

        return (
          <Link
            key={cat.name}
            href={`/category/${slug}`}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shrink-0 transition-all border",
              active
                ? "bg-[#E7F3FF] text-[#1877F2] border-[#C3DDFD] font-semibold"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E4E6EB] text-[#050505]">
              <Icon className="h-3 w-3" />
            </div>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const isCategoryActive = (name: string) => {
    const slug = name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
    if (pathname.startsWith(`/category/${slug}`)) return true;
    if (currentCategory.toLowerCase() === name.toLowerCase()) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Clean White Sidebar with all solid Facebook filled circle icons */}
      <aside
        className={cn(
          "w-72 flex-col shrink-0 bg-white p-4 overflow-y-auto z-50 border-r border-[#E4E6EB]",
          "lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:flex",
          mobileOpen
            ? "fixed inset-y-0 left-0 flex shadow-2xl"
            : "hidden lg:flex"
        )}
      >
        {/* Mobile close button */}
        {mobileOpen && (
          <div className="flex items-center justify-between pb-3 lg:hidden">
            <span className="font-bold text-base text-gray-900">Menu</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Section 1: Create new listing */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 px-2">
            Create new listing
          </h2>

          <div className="space-y-0.5">
            <Link
              href="/create"
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[#050505] hover:bg-[#F2F2F2] transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4E6EB] text-[#050505] shrink-0">
                <ClassifiedsIcon className="h-4 w-4" />
              </div>
              <span>Choose listing type</span>
            </Link>

            <Link
              href="/saved"
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[#050505] hover:bg-[#F2F2F2] transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4E6EB] text-[#050505] shrink-0">
                <ListOrdered className="h-4 w-4" />
              </div>
              <span>Your listings</span>
            </Link>

            <Link
              href="/saved"
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[#050505] hover:bg-[#F2F2F2] transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4E6EB] text-[#050505] shrink-0">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span>Seller help</span>
            </Link>
          </div>
        </div>

        {/* Section 2: Categories matching user screenshot */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2 px-2">
            Categories
          </h2>

          <div className="space-y-0.5">
            {CATEGORIES_WITH_ICONS.map((cat) => {
              const slug = cat.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
              const active = isCategoryActive(cat.name);
              const Icon = cat.icon;

              return (
                <Link
                  key={cat.name}
                  href={`/category/${slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#E7F3FF] text-[#1877F2] font-semibold"
                      : "text-[#050505] hover:bg-[#F2F2F2]"
                  )}
                >
                  {/* Exact Facebook gray circle (#E4E6EB) and solid dark icon (#050505) */}
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full shrink-0 transition-colors",
                      active
                        ? "bg-[#1877F2] text-white"
                        : "bg-[#E4E6EB] text-[#050505]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="truncate">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
