export function countPostsForCategory(category, posts, allCategories) {
  if (!category || !posts || !allCategories) {
    console.warn("Invalid data passed to countPostsForCategory");
    return 0;
  }

  const childCategories = allCategories.filter((cat) => cat.nestLeft > category.nestLeft && cat.nestRight < category.nestRight);

  const relevantCategoryIDs = [category.id, ...childCategories.map((cat) => cat.id)];

  return posts.filter((post) => relevantCategoryIDs.includes(post.categoryID)).length;
}
