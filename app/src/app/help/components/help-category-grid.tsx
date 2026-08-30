import { type FC } from "react";
import { HelpCategoryCard } from "./help-category-card";
import type { HelpCategory } from "@/interfaces/help-center.interfaces";

interface HelpCategoryGridProps {
  categories: HelpCategory[];
}

export const HelpCategoryGrid: FC<HelpCategoryGridProps> = ({
  categories,
}) => {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
      {categories.map((category) => (
        <HelpCategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
};
