import OSS from 'ali-oss';

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: process.env.VUE_APP_ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.VUE_APP_ALIYUN_ACCESS_KEY_SECRET,
  bucket: process.env.VUE_APP_ALIYUN_BUCKET,
});

export default {

  randomString(len) {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  async put(buffer, name) {
    try {
      const randomFileName = this.randomString(20);
      // object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
      return await client.put(name ? `${randomFileName}_${name}` : `${randomFileName}.png`, buffer);
    } catch (e) {
      console.log(e);
    }
  },

  async putDataUrl(dataUrl, name) {
    return await this.put(this.dataURLtoBlob(dataUrl), name);
  },

  dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  async list(max) {
    return await client.list({ 'max-key': max });
  },

  async delete(object) {
    return await client.delete(object);
  },
};
