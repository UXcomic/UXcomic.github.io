import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../public/data");
const imgsDir = path.join(__dirname, "../public/imgs");

const notion = new Client({ auth: process.env["NOTION_API_KEY"] });
const rootDatabaseId = process.env["NOTION_ROOT_DATABASE_ID"];

let blogsData = [];
let blogDatabaseIds = [];
let postsData = [];
let blogRoutes = [];
let postRoutes = [];

fetchAll().catch((err) => {
  console.error("❌ Error fetching Notion data:", err);
});

async function fetchAll() {
  if (!rootDatabaseId) throw new Error("Missing NOTION_ROOT_DATABASE_ID");

  createDirectory();
  await fetchCategories();
  await fetchTags();
  await fetchPosts();
  generateRoutes();
  createJsonFiles();
}

function createDirectory() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }
}

async function fetchCategories() {
  const response = await notion.databases.query({
    database_id: rootDatabaseId,
  });

  blogsData = response.results.map((cate) => ({
    id: cate.id,
    name: cate.properties.Name?.title?.[0]?.plain_text || "Unknown",
    slug: toSlug(cate.properties.Name?.title?.[0]?.plain_text) || null,
    icon: cate.icon.emoji,
    order: parseInt(cate.properties.Number?.number || "-1"),
    tags: [],
  }));
}

async function fetchTags() {
  for (let i = 0; i < blogsData.length; i++) {
    const categoryData = blogsData[i];
    const block = await notion.blocks.children.list({
      block_id: categoryData.id,
    });
    const childDatabase = block.results.filter(
      (item) => item.type == "child_database"
    )[0];
    const databaseInfo = await notion.databases.retrieve({
      database_id: childDatabase.id,
    });
    categoryData.tags = databaseInfo.properties.Tag.select.options.map(
      (item) => ({
        id: item.id,
        name: item.name.split("-")[1],
        slug: toSlug(item.name.split("-")[1]),
        order: parseInt(item.name.split("-")[0] || "-1"),
      })
    );
    blogDatabaseIds.push(childDatabase.id);
  }
}

async function fetchPosts() {
  for (let i = 0; i < blogDatabaseIds.length; i++) {
    const databaseId = blogDatabaseIds[i];
    const data = await notion.databases.query({ database_id: databaseId });
    const publishedPostsData = data.results.filter(
      (post) => post.properties.Publish.checkbox
    );
    await fetchContents(publishedPostsData);
    postsData.push(...publishedPostsData);
  }
}

async function fetchContents(postsData) {
  for (let i = 0; i < postsData.length; i++) {
    const postData = postsData[i];
    let contents = await notion.blocks.children.list({
      block_id: postData.id,
    });
    await handleImageBlocks(postData, contents.results);
    postData.content = contents.results;
  }
}

async function handleImageBlocks(postInfo, contentArray) {
  const usedImageIdsPerArticle = {};

  const articleTitle =
    postInfo.properties?.Name?.title[0]?.text?.content || "Unknown";
  const sanitizedTitle = articleTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

  const slug = toSlug(sanitizedTitle);
  postRoutes.push({ slug });

  for (const obj of contentArray) {
    if (obj.type === "image" && obj.image?.file?.url) {
      const imageUrl = obj.image.file.url;

      const articleDir = path.join(imgsDir, sanitizedTitle);

      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
        console.log(`Created folder for article: ${sanitizedTitle}`);
      }

      const extMatch = new URL(imageUrl).pathname.match(
        /\.(jpg|jpeg|png|webp|gif)$/i
      );
      const ext = extMatch ? extMatch[0] : ".jpg";

      const currentImageId = obj.id;
      const imageFileName = `${currentImageId}${ext}`;
      const savePath = path.join(articleDir, imageFileName);
      const relativePath = `/imgs/${sanitizedTitle}/${imageFileName}`;

      if (!usedImageIdsPerArticle[sanitizedTitle]) {
        usedImageIdsPerArticle[sanitizedTitle] = new Set();
      }
      usedImageIdsPerArticle[sanitizedTitle].add(currentImageId);

      if (fs.existsSync(savePath)) {
        console.log(
          `Image already exists: ${relativePath}, skipping download.`
        );
        obj.image.file.url = relativePath;
        continue;
      }

      try {
        console.log(`Downloading image: ${imageFileName} -> ${relativePath}`);
        await downloadImage(imageUrl, savePath);
        obj.image.file.url = relativePath;
      } catch (err) {
        console.error(`Failed to download image: ${imageUrl}`, err.message);
      }
    }
  }

  for (const [articleTitle, usedIds] of Object.entries(
    usedImageIdsPerArticle
  )) {
    const articleDir = path.join(imgsDir, articleTitle);
    const files = fs.readdirSync(articleDir);

    for (const file of files) {
      const idFromFile = file.split(".")[0]; // lấy phần trước dấu chấm
      if (!usedIds.has(idFromFile)) {
        const filePath = path.join(articleDir, file);
        fs.unlinkSync(filePath);
        console.log(
          `Removed unused image: ${path.join("/imgs", articleTitle, file)}`
        );
      }
    }
  }
}

async function downloadImage(imageUrl, savePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);
    https
      .get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to get '${imageUrl}' (${response.statusCode})`)
          );
        }

        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(savePath, () => reject(err));
      });
  });
}

function generateRoutes() {
  processGeneratePostRoutes();
  processGenerateBlogRoutes();
}

function processGeneratePostRoutes() {
  postsData.forEach((post) => {
    const slug = toSlug(
      post.properties?.Name?.title[0]?.text?.content || "Unknown"
    );
    postRoutes.push({ slug });
  });
}

function processGenerateBlogRoutes() {
  blogsData.forEach((cate) => {
    cate.tags.forEach((tagItem) => {
      blogRoutes.push({ category: cate.slug, tag: tagItem.slug });
    });
  });
}

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD") // Remove accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens
}

function createJsonFiles() {
  processCreateCategoriesAndTagsFile();
  processPostsFile();
  processBlogRoutesFile();
  processPostRoutesFile();
}

function processCreateCategoriesAndTagsFile() {
  if (!blogsData.length) return;

  const outputFile = path.join(outputDir, "categoriesAndTags.json");
  fs.writeFileSync(outputFile, JSON.stringify(blogsData, null, 2), "utf-8");
  console.log(`✅ Saved Notion categories and tags data to ${outputFile}`);
}

function processPostsFile() {
  if (!postsData.length) return;

  const outputFile = path.join(outputDir, "posts.json");
  fs.writeFileSync(outputFile, JSON.stringify(postsData, null, 2), "utf-8");
  console.log(`✅ Saved Notion posts data to ${outputFile}`);
}

function processBlogRoutesFile() {
  const outputPath = path.join(outputDir, "blogRoutes.json");
  fs.writeFileSync(outputPath, JSON.stringify(blogRoutes, null, 2));
  console.log(`✅ Saved ${blogRoutes.length} routes to ${outputPath}`);
}

function processPostRoutesFile() {
  const outputPath = path.join(outputDir, "postRoutes.json");
  fs.writeFileSync(outputPath, JSON.stringify(postRoutes, null, 2));
  console.log(`✅ Saved ${postRoutes.length} routes to ${outputPath}`);
}
