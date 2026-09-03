import { Prisma, type PrismaClient } from "@prisma/client";
import { prisma } from "./db";
import type { Product, SiteSettings } from "./types";
import type { SortKey } from "./constants";
import { SITE_NAME, SITE_TAGLINE } from "./constants";
import { PRODUCT_CATALOG, type CatalogProduct } from "./catalog";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "The database is not configured yet. Add your DATABASE_URL to .env and run `npm run db:push && npm run seed`."
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL) && Boolean(prisma);
}

export function requireDb(): PrismaClient {
  if (!isDbConfigured()) {
    throw new DatabaseNotConfiguredError();
  }
  return prisma as PrismaClient;
}

function mapProduct(p: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: Date;
}): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    imageUrl: p.imageUrl,
    stock: p.stock,
    createdAt: p.createdAt.toISOString(),
  };
}

function toProduct(c: CatalogProduct): Product {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    price: c.price,
    category: c.category,
    imageUrl: c.imageUrl,
    stock: c.stock,
    createdAt: c.createdAt,
  };
}

export type ListProductsParams = {
  search?: string;
  category?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type ListProductsResult = {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
};

/** In-memory implementation of listProducts over the built-in catalog. */
function listCatalog(params: ListProductsParams): ListProductsResult {
  const search = params.search?.trim().toLowerCase();
  const category = params.category;
  const sort = params.sort ?? "featured";
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.max(1, params.perPage ?? 8);

  let items = PRODUCT_CATALOG.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) {
      return false;
    }
    if (category && category !== "all" && p.category !== category) return false;
    return true;
  });

  switch (sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      items = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;

  return {
    items: items.slice(start, start + perPage).map(toProduct),
    total,
    totalPages,
    page,
    perPage,
  };
}

export async function listProducts(
  params: ListProductsParams = {}
): Promise<ListProductsResult> {
  if (!isDbConfigured()) return listCatalog(params);

  const db = requireDb();
  const { search, category, sort = "featured", page = 1, perPage = 8 } = params;

  const where: Prisma.ProductWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category && category !== "all" ? { category } : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
  switch (sort) {
    case "price-asc":
      orderBy = [{ price: "asc" }];
      break;
    case "price-desc":
      orderBy = [{ price: "desc" }];
      break;
    case "name-asc":
      orderBy = [{ name: "asc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    default:
      orderBy = [{ createdAt: "asc" }];
  }

  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
  ]);

  return {
    items: items.map(mapProduct),
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    page,
    perPage,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured()) {
    const found = PRODUCT_CATALOG.find((p) => p.slug === slug);
    return found ? toProduct(found) : null;
  }

  const db = requireDb();
  const p = await db.product.findUnique({ where: { slug } });
  return p ? mapProduct(p) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!isDbConfigured()) {
    return listCatalog({ perPage: limit }).items;
  }

  const db = requireDb();
  const items = await db.product.findMany({
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  return items.map(mapProduct);
}

export async function getCategories(): Promise<string[]> {
  if (!isDbConfigured()) {
    return [...new Set(PRODUCT_CATALOG.map((p) => p.category))].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  const db = requireDb();
  const rows = await db.product.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!isDbConfigured()) {
    return PRODUCT_CATALOG.filter((p) => ids.includes(p.id)).map(toProduct);
  }

  const db = requireDb();
  const items = await db.product.findMany({ where: { id: { in: ids } } });
  return items.map(mapProduct);
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: SITE_NAME,
  tagline: SITE_TAGLINE,
  logoUrl: "",
};

/** Read site settings from the DB, falling back to constants when unconfigured. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isDbConfigured()) return DEFAULT_SETTINGS;
  try {
    const rows = await (prisma as PrismaClient).setting.findMany();
    if (rows.length === 0) return DEFAULT_SETTINGS;
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      siteName: map.get("siteName") || DEFAULT_SETTINGS.siteName,
      tagline: map.get("tagline") || DEFAULT_SETTINGS.tagline,
      logoUrl: map.get("logoUrl") || "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Persist site settings. Returns the updated settings. */
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<SiteSettings> {
  const db = requireDb();
  const entries: [string, string][] = [
    ["siteName", settings.siteName ?? ""],
    ["tagline", settings.tagline ?? ""],
    ["logoUrl", settings.logoUrl ?? ""],
  ];
  await db.$transaction(
    entries.map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return getSiteSettings();
}
