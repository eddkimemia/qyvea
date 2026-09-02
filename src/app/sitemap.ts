import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qyvea.co.ke";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", "/about", "/estates", "/blog", "/checkout", "/login", "/admin/login"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));

  const services = ["cctv","biometrics","electric-fence","automatic-gates","fire-alarm-systems","networking","smart-home-automation","solar-installation","solar-solutions","electrical-installation","bms","cybersecurity","system-integration","it-support","maintenance"].map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    const dbProducts = await prisma.product.findMany({ select: { slug: true, updatedAt: true }, take: 100 });
    products = dbProducts;
  } catch {}
  if (!products.length) {
    products = ([...MOCK_PRODUCTS] as any[]).map((p) => ({ slug: p.slug, updatedAt: new Date() }));
  }
  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    const dbPosts = await prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, take: 50 });
    posts = dbPosts;
  } catch {}
  if (!posts.length) {
    posts = [
      { slug: "cctv-installation-cost-kenya-2026", updatedAt: new Date() },
      { slug: "solar-backup-cctv-electric-fence-blackouts", updatedAt: new Date() },
    ];
  }
  const postRoutes = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...services, ...productRoutes, ...postRoutes];
}
