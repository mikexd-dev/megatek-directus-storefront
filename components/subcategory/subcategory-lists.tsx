import { Post } from "@/types/collection";
import SubcategoryCard from "./subcategory-card";

interface PostListProps {
  posts: Post[];
  layout?: "vertical" | "horizontal";
  locale: string;
}
const SubcategoryList = ({ subcategory, layout = "vertical", locale }: any) => {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr">
      {subcategory.map((subcategory) => (
        <SubcategoryCard
          locale={locale}
          layout={layout}
          subcategory={subcategory}
          key={subcategory.id}
        />
      ))}
    </div>
  );
};

export default SubcategoryList;
