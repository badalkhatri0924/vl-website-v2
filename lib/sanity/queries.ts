import { groq } from 'next-sanity'

export const blogPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug {
      current
    },
    excerpt,
    "author": author->{
      name,
      title,
      "avatar": image.asset->url
    },
    publishedAt,
    category,
    readTime,
    "imageUrl": coalesce(mainImage.asset->url, "https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post"),
    "imageAsset": mainImage.asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    "content": body,
    tags
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug {
      current
    },
    excerpt,
    "author": author->{
      name,
      title,
      "avatar": image.asset->url
    },
    publishedAt,
    category,
    readTime,
    "imageUrl": coalesce(mainImage.asset->url, "https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post"),
    "imageAsset": mainImage.asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    "content": body,
    tags
  }
`

export const blogPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`

