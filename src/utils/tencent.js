import url from 'url';

const TENCENT_VIDEO_HOSTNAME = 'v.qq.com';

export const getTencentVideoVid = function (videoUrl) {
  if (!videoUrl) return;

  const parsedUrl = url.parse(videoUrl);

  if (parsedUrl.hostname !== TENCENT_VIDEO_HOSTNAME) return;

  try {
    const pathEnd = parsedUrl.path && parsedUrl.path.split('/').pop();
    return pathEnd.split('.')[0];
  } catch (e) {

  }
};
