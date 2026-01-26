export * from './categories.service';
import { CategoriesService } from './categories.service';
export * from './platform-content.service';
import { PlatformContentService } from './platform-content.service';
export * from './products.service';
import { ProductsService } from './products.service';
export const APIS = [CategoriesService, PlatformContentService, ProductsService];
