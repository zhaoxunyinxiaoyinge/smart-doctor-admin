import * as PdfJs from 'pdfjs-dist/legacy/build/pdf.js';
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';
const cMapUrl = '../../../node_modules/pdfjs-dist/cmaps/'
PdfJs.GlobalWorkerOptions.workerSrc = workerSrc;

  const pages = ref(0);
  const pdfdoc = reactive({
    pdfdoc: <any>{}
  })

 export  const previewPdf = ( ) => {
  const renderFile = (num: number, pdf,canvas: HTMLCanvasElement) => {
    pdf.getPage(num).then((page) => {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = 1.3;
          const viewport = page.getViewport({ scale });
          viewport.scale = scale;
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = viewport.width
          canvas.style.height = viewport.height
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext).promise.then(function () {
            console.log("完成生成")
          })
        }
      }
    }),
      err => {
        console.log(err, 999)
      }
  }

  const loadFile = (url,canvas: HTMLCanvasElement) => {
    PdfJs.getDocument(
      {
        url,
        cMapUrl,
        cMapPacked: true
      }
    ).promise.then(pdf => {
      pdfdoc.pdfdoc = pdf;
      pages.value = pdf.numPages;
      nextTick(() => {
        renderFile(1, pdf,canvas)
      })

    }, err => {
      console.log(err)
    })
  }

  return {
    loadFile,
    renderFile
  }

}