export type GalleryMediaType = "image" | "video";

export type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  /** Poster / thumbnail for videos; unused for images. */
  posterUrl: string | null;
  altText: string;
  sortOrder: number;
};
