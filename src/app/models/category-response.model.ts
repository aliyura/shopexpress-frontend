import { List } from "../types/list.type";
import { Category } from "./category.model";
import { SubCategory } from "./sub-category.model";

export class CategoryResponse {
    public category: Category;
    public subCategories: List<SubCategory>;
}
