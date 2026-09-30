export const getPublicUrl = (mangaId?: string, chapterId?: string) => {
  const sharedBaseUrl = 'https://ais-pre-lbzpho3pt5xjdbh7t4bbi2-814520408801.asia-southeast1.run.app';
  
  try {
    const url = new URL(sharedBaseUrl);
    if (mangaId) {
      url.searchParams.set('manga', mangaId);
    }
    if (chapterId) {
      url.searchParams.set('chapter', chapterId);
    }
    return url.toString();
  } catch (e) {
    return sharedBaseUrl;
  }
};
