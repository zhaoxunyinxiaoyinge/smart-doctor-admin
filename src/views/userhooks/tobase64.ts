import { onMounted } from "vue";
type getBase64 = (img: string) => Promise<{ baseUrl: string }>;

const getBase64 = (img: string): Promise<{ baseUrl: string }> => {
  const base64 = (el: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = el.width;
    canvas.height = el.height;
    ctx?.drawImage(el, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image.png");
  };

  return new Promise((resolve, reject) => {
    onMounted(() => {
      const imgObj: HTMLImageElement = document.querySelector(
        img
      ) as HTMLImageElement;
      imgObj.onload = () => {
        resolve({ baseUrl: base64(imgObj) });
      };
    });
  });
};

export default getBase64;
